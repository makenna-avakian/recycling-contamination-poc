# Prediction Configuration Guide

This document explains where to configure prediction settings in the SARIMA-based ML prediction system.

## Main Configuration File

**File:** `backend/ml_service/sarima_predictor.py`

## Key Configuration Points

### 1. Forecast Horizon (How far ahead to predict)

**Location:** Line 133, 212, 324

```python
# Default: 30 days ahead
forecast_days=30

# Change to predict different timeframes:
forecast_days=7   # 1 week ahead
forecast_days=14  # 2 weeks ahead
forecast_days=60  # 2 months ahead
```

**Where it's used:**
- `predict_future_trends()` function (line 133)
- Route trend analysis (line 212)
- Overall trend prediction (line 324)

### 2. Historical Data Window (How much past data to use)

**Location:** Line 37, 202, 320

```python
# Default: 365 days (1 year)
days=365

# Change to use different time windows:
days=90   # 3 months
days=180  # 6 months
days=730  # 2 years
```

**Where it's used:**
- `fetch_time_series_data()` function (line 37)
- Route analysis (line 202)
- Overall trend analysis (line 320)

### 3. SARIMA Model Parameters

**Location:** Lines 74-131 (`fit_sarima_model()` function)

#### Seasonal Period
```python
# Line 74: Default is 7 (weekly seasonality)
seasonal_period=7

# Options:
seasonal_period=7   # Weekly patterns
seasonal_period=30  # Monthly patterns
seasonal_period=365 # Yearly patterns
```

#### Parameter Grid (Lines 92-97)
```python
# Grid search parameters - add more combinations for better accuracy
param_grid = [
    ((1, 1, 1), (1, 1, 1, seasonal_period)),  # Standard SARIMA
    ((1, 1, 0), (1, 1, 0, seasonal_period)),  # No MA component
    ((0, 1, 1), (0, 1, 1, seasonal_period)),  # No AR component
    ((1, 0, 1), (1, 0, 1, seasonal_period)),  # No differencing
    # Add more combinations here for better model selection
]
```

#### Model Fitting Parameters (Line 108)
```python
fitted_model = model.fit(disp=False, maxiter=50)

# Increase maxiter for better convergence (slower but more accurate)
maxiter=100  # or 200
```

### 4. Prediction Thresholds & Filters

**Location:** Lines 233-344 (`generate_predictive_searches()` function)

#### Minimum Data Requirements (Line 204)
```python
# Minimum days of data needed for predictions
if len(df) < 14:  # Need at least 2 weeks
    continue

# Change threshold:
if len(df) < 30:  # Require 1 month minimum
```

#### Route Trend Filtering (Line 244)
```python
# Only show routes with increasing trends
increasing_routes = [r for r in route_predictions if r['trend'] == 'increasing']

# Change to include all trends:
all_routes = route_predictions  # Show all routes regardless of trend
```

#### Number of Predictions Returned (Line 248, 344)
```python
# Top 3 increasing routes
for route in increasing_routes[:3]:

# Top 5 overall predictions
return searches[:5]

# Change to return more/fewer:
return searches[:10]  # Top 10 predictions
```

### 5. Confidence Score Calculation

**Location:** Multiple places in `generate_predictive_searches()`

#### Route Confidence (Line 254)
```python
confidence = min(0.95, 0.6 + abs(route['expected_change_pct']) / 100)

# Adjust formula:
confidence = min(0.99, 0.5 + abs(route['expected_change_pct']) / 50)  # More sensitive
confidence = min(0.90, 0.7 + abs(route['expected_change_pct']) / 200)  # Less sensitive
```

#### Category Confidence (Line 287)
```python
confidence: 0.85  # Fixed confidence for category predictions

# Make it dynamic:
confidence: min(0.95, 0.7 + (top_category['count'] / 100))
```

#### Overall Trend Confidence (Line 335)
```python
confidence = min(0.9, 0.7 + abs(overall_forecast['expected_change']) / 200)

# Adjust sensitivity:
confidence = min(0.95, 0.6 + abs(overall_forecast['expected_change']) / 100)
```

### 6. Severity Thresholds

**Location:** Line 303

```python
# Minimum severity to trigger high-severity alert
HAVING AVG(ce.severity) >= 4.0

# Change threshold:
HAVING AVG(ce.severity) >= 3.5  # More sensitive
HAVING AVG(ce.severity) >= 4.5  # Less sensitive
```

### 7. Time Windows for Analysis

**Location:** Lines 274, 301

```python
# Last 30 days for category analysis
WHERE p.pickup_time >= CURRENT_DATE - INTERVAL '30 days'

# Change to different windows:
WHERE p.pickup_time >= CURRENT_DATE - INTERVAL '14 days'  # 2 weeks
WHERE p.pickup_time >= CURRENT_DATE - INTERVAL '60 days'  # 2 months
```

### 8. Trend Detection Thresholds

**Location:** Lines 162, 172

```python
# Line 162: Trend detection in predictions
'trend': 'increasing' if forecast.iloc[-1] > ts.iloc[-7:].mean() else 'decreasing'

# Line 172: Fallback trend detection
trend = 'increasing' if change_pct > 10 else 'decreasing' if change_pct < -10 else 'stable'

# Adjust thresholds:
trend = 'increasing' if change_pct > 5 else 'decreasing' if change_pct < -5 else 'stable'  # More sensitive
trend = 'increasing' if change_pct > 20 else 'decreasing' if change_pct < -20 else 'stable'  # Less sensitive
```

## Quick Configuration Examples

### Example 1: Predict 1 Week Ahead with 3 Months of Data

```python
# Line 133
def predict_future_trends(ts, forecast_days=7):  # Changed from 30 to 7

# Line 202
df = fetch_time_series_data(route_id=route_id, days=90)  # Changed from 365 to 90
```

### Example 2: More Aggressive Predictions (Show More Routes)

```python
# Line 248
for route in increasing_routes[:5]:  # Changed from 3 to 5

# Line 344
return searches[:10]  # Changed from 5 to 10
```

### Example 3: More Sensitive Trend Detection

```python
# Line 172
trend = 'increasing' if change_pct > 5 else 'decreasing' if change_pct < -5 else 'stable'
```

### Example 4: Higher Confidence Thresholds

```python
# Line 254
confidence = min(0.99, 0.7 + abs(route['expected_change_pct']) / 50)
```

## Testing Your Changes

After modifying prediction settings:

1. **Test the Python script directly:**
   ```bash
   cd backend/ml_service
   python3 sarima_predictor.py
   ```

2. **Check the JSON output** - should be valid JSON array of predictions

3. **Test via API:**
   ```bash
   curl http://localhost:5000/api/contamination/predictive-searches
   ```

## Environment Variables

Database connection settings (lines 25-31) can be overridden via environment variables:

```bash
export DB_NAME=recycling_contamination
export DB_USER=your_username
export DB_PASSWORD=your_password
export DB_HOST=localhost
export DB_PORT=5432
```

## Fallback Behavior

If ML predictions fail, the system falls back to default searches defined in:
- **TypeScript:** `backend/src/application/services/MLTrendAnalysisService.ts` (lines 80-98)
- These are simple, non-ML predictions used when Python script fails

