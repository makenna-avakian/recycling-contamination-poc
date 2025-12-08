#!/usr/bin/env python3
"""
SARIMA-based Predictive Trends Service
Uses Seasonal ARIMA models to predict contamination trends
"""

import sys
import json
import os
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

# Database connection
import psycopg2
from psycopg2.extras import RealDictCursor

# Time series analysis
import pandas as pd
import numpy as np
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.tsa.seasonal import seasonal_decompose

# Configuration
DB_CONFIG = {
    'dbname': os.getenv('DB_NAME', 'recycling_contamination'),
    'user': os.getenv('DB_USER', 'mavakian'),
    'password': os.getenv('DB_PASSWORD', ''),
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432')
}

def get_db_connection():
    """Get database connection"""
    return psycopg2.connect(**DB_CONFIG)

def fetch_time_series_data(route_id=None, days=365):
    """
    Fetch contamination time series data from database
    
    Args:
        route_id: Optional route ID to filter by
        days: Number of days of historical data to fetch
    
    Returns:
        DataFrame with date and contamination_count columns
    """
    conn = get_db_connection()
    try:
        query = """
            SELECT 
                DATE_TRUNC('day', p.pickup_time) as date,
                COUNT(ce.contamination_id) as contamination_count,
                AVG(ce.severity) as avg_severity,
                AVG(ce.estimated_contamination_pct) as avg_contamination_pct
            FROM pickups p
            LEFT JOIN contamination_events ce ON p.pickup_id = ce.pickup_id
            WHERE p.pickup_time >= CURRENT_DATE - INTERVAL '%s days'
        """ % days
        
        if route_id:
            query += " AND p.route_id = %s" % route_id
        
        query += """
            GROUP BY DATE_TRUNC('day', p.pickup_time)
            ORDER BY date
        """
        
        df = pd.read_sql(query, conn, parse_dates=['date'])
        return df
    finally:
        conn.close()

def fit_sarima_model(ts, seasonal_period=7):
    """
    Fit SARIMA model to time series data
    
    Args:
        ts: Time series data (pandas Series)
        seasonal_period: Seasonal period (7 for weekly, 365 for yearly)
    
    Returns:
        Fitted SARIMAX model
    """
    # Auto-select best parameters using AIC
    best_aic = np.inf
    best_order = None
    best_seasonal_order = None
    
    # Grid search for best parameters (simplified for speed)
    # For production, use auto_arima or more sophisticated selection
    param_grid = [
        ((1, 1, 1), (1, 1, 1, seasonal_period)),
        ((1, 1, 0), (1, 1, 0, seasonal_period)),
        ((0, 1, 1), (0, 1, 1, seasonal_period)),
        ((1, 0, 1), (1, 0, 1, seasonal_period)),
    ]
    
    for order, seasonal_order in param_grid:
        try:
            model = SARIMAX(
                ts,
                order=order,
                seasonal_order=seasonal_order,
                enforce_stationarity=False,
                enforce_invertibility=False
            )
            fitted_model = model.fit(disp=False, maxiter=50)
            
            if fitted_model.aic < best_aic:
                best_aic = fitted_model.aic
                best_order = order
                best_seasonal_order = seasonal_order
        except:
            continue
    
    # Fit final model with best parameters
    if best_order is None:
        # Fallback to simple ARIMA
        best_order = (1, 1, 1)
        best_seasonal_order = (0, 0, 0, seasonal_period)
    
    final_model = SARIMAX(
        ts,
        order=best_order,
        seasonal_order=best_seasonal_order,
        enforce_stationarity=False,
        enforce_invertibility=False
    )
    
    return final_model.fit(disp=False)

def predict_future_trends(ts, forecast_days=30):
    """
    Predict future contamination trends using SARIMA
    
    Args:
        ts: Time series data
        forecast_days: Number of days to forecast ahead
    
    Returns:
        Dictionary with predictions and confidence intervals
    """
    if len(ts) < 14:  # Need at least 2 weeks of data
        return None
    
    # Fill missing dates with 0
    ts = ts.fillna(0)
    
    # Fit model
    try:
        model = fit_sarima_model(ts, seasonal_period=7)  # Weekly seasonality
        
        # Forecast
        forecast = model.forecast(steps=forecast_days)
        forecast_ci = model.get_forecast(steps=forecast_days).conf_int()
        
        return {
            'forecast': forecast.tolist(),
            'lower_bound': forecast_ci.iloc[:, 0].tolist(),
            'upper_bound': forecast_ci.iloc[:, 1].tolist(),
            'trend': 'increasing' if forecast.iloc[-1] > ts.iloc[-7:].mean() else 'decreasing',
            'expected_change': float((forecast.iloc[-1] - ts.iloc[-7:].mean()) / max(ts.iloc[-7:].mean(), 1) * 100)
        }
    except Exception as e:
        # Fallback to simple trend analysis
        recent_avg = ts.iloc[-7:].mean()
        older_avg = ts.iloc[-14:-7].mean() if len(ts) >= 14 else recent_avg
        
        if older_avg > 0:
            change_pct = (recent_avg - older_avg) / older_avg * 100
            trend = 'increasing' if change_pct > 10 else 'decreasing' if change_pct < -10 else 'stable'
        else:
            change_pct = 0
            trend = 'stable'
        
        return {
            'forecast': [recent_avg] * forecast_days,
            'lower_bound': [recent_avg * 0.8] * forecast_days,
            'upper_bound': [recent_avg * 1.2] * forecast_days,
            'trend': trend,
            'expected_change': change_pct
        }

def analyze_route_trends():
    """Analyze trends for all routes and generate predictions"""
    conn = get_db_connection()
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get all routes
        cursor.execute("SELECT route_id, route_code FROM routes WHERE active = TRUE")
        routes = cursor.fetchall()
        
        predictions = []
        
        for route in routes:
            route_id = route['route_id']
            route_code = route['route_code']
            
            # Fetch time series data
            df = fetch_time_series_data(route_id=route_id, days=365)
            
            if len(df) < 14:
                continue
            
            # Create time series
            df = df.set_index('date')
            ts = df['contamination_count']
            
            # Predict future trends
            forecast = predict_future_trends(ts, forecast_days=30)
            
            if forecast:
                # Calculate current stats
                recent_events = int(ts.iloc[-7:].sum())
                avg_severity = float(df.iloc[-7:]['avg_severity'].mean()) if 'avg_severity' in df.columns else 0
                
                predictions.append({
                    'route_id': route_id,
                    'route_code': route_code,
                    'trend': forecast['trend'],
                    'expected_change_pct': forecast['expected_change'],
                    'recent_events': recent_events,
                    'avg_severity': avg_severity,
                    'forecast_next_week': int(forecast['forecast'][7]) if len(forecast['forecast']) > 7 else recent_events
                })
        
        return predictions
    finally:
        conn.close()

def generate_predictive_searches():
    """
    Generate predictive search suggestions using SARIMA models
    Returns JSON compatible with TypeScript PredictiveSearch interface
    """
    searches = []
    
    # Analyze route trends
    route_predictions = analyze_route_trends()
    
    # Sort by expected increase
    increasing_routes = [r for r in route_predictions if r['trend'] == 'increasing']
    increasing_routes.sort(key=lambda x: x['expected_change_pct'], reverse=True)
    
    # Add route trend predictions
    for route in increasing_routes[:3]:
        searches.append({
            'title': f"Route {route['route_code']} - Rising Contamination",
            'description': f"Analysis predicts {route['expected_change_pct']:.1f}% increase. Expected {route['forecast_next_week']} events next week.",
            'queryType': 'route',
            'queryParams': {'routeId': route['route_id']},
            'confidence': min(0.95, 0.6 + abs(route['expected_change_pct']) / 100),
            'insight': f"Model forecasts increasing contamination for Route {route['route_code']}. Current 7-day average: {route['recent_events']} events. Consider proactive education campaigns."
        })
    
    # Analyze category trends
    conn = get_db_connection()
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        # Get top contamination categories
        cursor.execute("""
            SELECT 
                cc.category_id,
                cc.code,
                cc.description,
                COUNT(ce.contamination_id) as count,
                AVG(ce.severity) as avg_severity
            FROM contamination_events ce
            INNER JOIN contamination_categories cc ON ce.category_id = cc.category_id
            INNER JOIN pickups p ON ce.pickup_id = p.pickup_id
            WHERE p.pickup_time >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY cc.category_id, cc.code, cc.description
            ORDER BY count DESC
            LIMIT 1
        """)
        
        top_category = cursor.fetchone()
        if top_category:
            searches.append({
                'title': f"Focus on {top_category['description']}",
                'description': f"{top_category['count']} events in the last 30 days",
                'queryType': 'category',
                'queryParams': {'categoryId': top_category['category_id']},
                'confidence': 0.85,
                'insight': f"{top_category['description']} is the most common contamination type. Analysis suggests this pattern will continue. Consider targeted public education campaigns."
            })
        
        # Find high severity routes
        cursor.execute("""
            SELECT 
                r.route_id,
                r.route_code,
                COUNT(ce.contamination_id) as event_count,
                AVG(ce.severity) as avg_severity
            FROM contamination_events ce
            INNER JOIN pickups p ON ce.pickup_id = p.pickup_id
            INNER JOIN routes r ON p.route_id = r.route_id
            WHERE p.pickup_time >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY r.route_id, r.route_code
            HAVING AVG(ce.severity) >= 4.0
            ORDER BY avg_severity DESC
            LIMIT 1
        """)
        
        high_severity = cursor.fetchone()
        if high_severity:
            searches.append({
                'title': f"High Severity Alert - Route {high_severity['route_code']}",
                'description': f"Average severity: {high_severity['avg_severity']:.1f}/5",
                'queryType': 'severity',
                'queryParams': {'routeId': high_severity['route_id'], 'minSeverity': 4},
                'confidence': 0.9,
                'insight': f"Route {high_severity['route_code']} has consistently high severity contamination (avg {high_severity['avg_severity']:.1f}/5). Analysis suggests immediate action is needed."
            })
        
        # Overall trend prediction
        overall_df = fetch_time_series_data(days=90)
        if len(overall_df) >= 14:
            overall_df = overall_df.set_index('date')
            overall_ts = overall_df['contamination_count']
            overall_forecast = predict_future_trends(overall_ts, forecast_days=14)
            
            if overall_forecast and overall_forecast['trend'] == 'increasing':
                searches.append({
                    'title': 'Overall Contamination Trend Alert',
                    'description': f"Analysis predicts {overall_forecast['expected_change']:.1f}% increase in next 2 weeks",
                    'queryType': 'trend',
                    'queryParams': {
                        'startDate': datetime.now().isoformat(),
                        'endDate': (datetime.now() + timedelta(days=14)).isoformat()
                    },
                    'confidence': min(0.9, 0.7 + abs(overall_forecast['expected_change']) / 200),
                    'insight': f"Analysis forecasts increasing contamination system-wide. Expected {int(overall_forecast['forecast'][13])} events in 2 weeks (current: {int(overall_ts.iloc[-7:].mean())} per day). Consider system-wide education campaign."
                })
    
    finally:
        conn.close()
    
    # Sort by confidence and return top 5
    searches.sort(key=lambda x: x['confidence'], reverse=True)
    return searches[:5]

if __name__ == '__main__':
    """CLI interface - outputs JSON for TypeScript backend"""
    try:
        searches = generate_predictive_searches()
        print(json.dumps(searches, indent=2))
    except Exception as e:
        print(json.dumps({
            'error': str(e),
            'searches': []
        }), file=sys.stderr)
        sys.exit(1)



