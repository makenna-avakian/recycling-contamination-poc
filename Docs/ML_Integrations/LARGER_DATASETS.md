
## Year-over-Year Seasonal Forecasting

### Use Case: Predicting This Year's Trends Based on Last Year's Patterns

If you have **multiple years of data** and want to use **last year's trends to predict this year**, you need models that explicitly handle **seasonal/cyclical patterns**. This is different from general time series forecasting because you're leveraging yearly cycles.

### Best Models for Year-over-Year Prediction

| Model | Why It's Good | Best For |
|-------|---------------|----------|
| **SARIMA (Seasonal ARIMA)** | Explicitly models seasonal patterns | Strong statistical foundation, interpretable |
| **Prophet** | Automatic seasonality detection | Quick setup, handles holidays, robust |
| **LSTM/GRU with Seasonal Features** | Learns complex seasonal patterns | When you have deep learning infrastructure |
| **XGBoost with Yearly Features** | Fast, interpretable | When you need feature importance |
| **Time Series Decomposition** | Separates trend/seasonality/residuals | Understanding underlying patterns |

### 1. SARIMA (Seasonal ARIMA) - **RECOMMENDED**

**Best choice** for year-over-year prediction because:
- ✅ Explicitly models seasonal components
- ✅ Handles yearly, monthly, weekly seasonality
- ✅ Statistically rigorous
- ✅ Interpretable coefficients
- ✅ Works well with 2+ years of data

#### Implementation

```python
import pandas as pd
import numpy as np
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.tsa.seasonal import seasonal_decompose
import warnings
warnings.filterwarnings('ignore')

def fit_sarima_for_yearly_prediction(data, route_id, forecast_months=12):
    """
    Fit SARIMA model using last year's patterns to predict this year
    
    Args:
        data: DataFrame with date and contamination metrics
        route_id: Specific route
        forecast_months: How many months ahead to predict
    
    Returns:
        Fitted model and predictions
    """
    route_data = data[data['route_id'] == route_id].copy()
    route_data = route_data.set_index('date').sort_index()
    
    # Use contamination count as target
    ts = route_data['contamination_count']
    
    # SARIMA parameters: (p, d, q) x (P, D, Q, s)
    # s = 12 for monthly data (yearly seasonality)
    # s = 52 for weekly data (yearly seasonality)
    # s = 365 for daily data (yearly seasonality)
    
    # For monthly data with yearly seasonality:
    # (p, d, q) = non-seasonal ARIMA order
    # (P, D, Q, 12) = seasonal order (12 months = 1 year)
    
    # Auto-select best parameters using AIC
    best_aic = np.inf
    best_order = None
    best_seasonal_order = None
    
    # Grid search for best parameters
    for p in range(0, 3):
        for d in range(0, 2):
            for q in range(0, 3):
                for P in range(0, 2):
                    for D in range(0, 2):
                        for Q in range(0, 2):
                            try:
                                model = SARIMAX(
                                    ts,
                                    order=(p, d, q),
                                    seasonal_order=(P, D, Q, 12),  # 12 = yearly seasonality
                                    enforce_stationarity=False,
                                    enforce_invertibility=False
                                )
                                fitted_model = model.fit(disp=False)
                                
                                if fitted_model.aic < best_aic:
                                    best_aic = fitted_model.aic
                                    best_order = (p, d, q)
                                    best_seasonal_order = (P, D, Q, 12)
                            except:
                                continue
    
    # Fit final model with best parameters
    final_model = SARIMAX(
        ts,
        order=best_order,
        seasonal_order=best_seasonal_order,
        enforce_stationarity=False,
        enforce_invertibility=False
    )
    
    fitted_model = final_model.fit(disp=False)
    
    # Forecast next year
    forecast = fitted_model.forecast(steps=forecast_months)
    forecast_ci = fitted_model.get_forecast(steps=forecast_months).conf_int()
    
    return fitted_model, forecast, forecast_ci

# Usage
model, predictions, confidence_intervals = fit_sarima_for_yearly_prediction(
    data, 
    route_id=1, 
    forecast_months=12
)

print(f"Predicted contamination for next 12 months:")
print(predictions)
```

#### For Daily Data (365-day seasonality)

```python
# For daily data, use s=365 for yearly seasonality
model = SARIMAX(
    ts,
    order=(1, 1, 1),
    seasonal_order=(1, 1, 1, 365),  # Yearly seasonality for daily data
    enforce_stationarity=False
)
```

#### For Weekly Data (52-week seasonality)

```python
# For weekly data, use s=52 for yearly seasonality
model = SARIMAX(
    ts,
    order=(1, 1, 1),
    seasonal_order=(1, 1, 1, 52),  # Yearly seasonality for weekly data
    enforce_stationarity=False
)
```

### 2. Prophet - **EASIEST TO USE**

**Best for** quick implementation and automatic seasonality detection:

```python
from prophet import Prophet
import pandas as pd

def predict_with_prophet(data, route_id, forecast_periods=365):
    """
    Use Prophet to predict based on yearly patterns
    Prophet automatically detects yearly seasonality
    """
    route_data = data[data['route_id'] == route_id].copy()
    
    # Prophet requires columns: ds (date) and y (target)
    prophet_data = pd.DataFrame({
        'ds': route_data['date'],
        'y': route_data['contamination_count']
    })
    
    # Initialize Prophet with yearly seasonality
    model = Prophet(
        yearly_seasonality=True,      # Enable yearly patterns
        weekly_seasonality=True,       # Enable weekly patterns
        daily_seasonality=False,       # Disable if daily data
        seasonality_mode='multiplicative',  # or 'additive'
        changepoint_prior_scale=0.05   # Flexibility for trend changes
    )
    
    # Add custom seasonalities if needed
    model.add_seasonality(
        name='monthly',
        period=30.5,
        fourier_order=5
    )
    
    # Fit model
    model.fit(prophet_data)
    
    # Create future dataframe (next year)
    future = model.make_future_dataframe(periods=forecast_periods)
    
    # Predict
    forecast = model.predict(future)
    
    # Extract predictions for future period only
    future_forecast = forecast[forecast['ds'] > prophet_data['ds'].max()]
    
    return model, forecast, future_forecast

# Usage
model, full_forecast, next_year = predict_with_prophet(
    data, 
    route_id=1, 
    forecast_periods=365  # Predict next 365 days
)

# Visualize
fig = model.plot(forecast)
fig2 = model.plot_components(forecast)  # Shows trend, yearly seasonality, etc.
```

**Prophet Advantages**:
- ✅ Automatically handles yearly seasonality
- ✅ Handles holidays and special events
- ✅ Provides uncertainty intervals
- ✅ Easy to use, minimal tuning
- ✅ Works with missing data

### 3. LSTM/GRU with Yearly Features

**Best for** when you already have deep learning infrastructure:

```python
def prepare_yearly_sequences(data, route_id, lookback_days=365, forecast_days=365):
    """
    Prepare sequences that capture yearly patterns
    """
    route_data = data[data['route_id'] == route_id].sort_values('date')
    
    # Create features that capture yearly patterns
    route_data['day_of_year'] = route_data['date'].dt.dayofyear
    route_data['month'] = route_data['date'].dt.month
    route_data['is_same_day_last_year'] = 0  # Will be set below
    
    # Add lag features from same time last year
    route_data['contamination_last_year'] = route_data['contamination_count'].shift(365)
    route_data['contamination_last_year_same_month'] = route_data.groupby('month')['contamination_count'].shift(12)
    
    # Create sequences
    X, y = [], []
    for i in range(lookback_days, len(route_data) - forecast_days + 1):
        # Look back 365 days (full year)
        X.append(route_data.iloc[i-lookback_days:i][
            ['contamination_count', 'day_of_year', 'month', 
             'contamination_last_year', 'contamination_last_year_same_month']
        ].values)
        
        # Predict next 365 days
        y.append(route_data.iloc[i:i+forecast_days]['contamination_count'].values)
    
    return np.array(X), np.array(y)

# Build GRU model for yearly prediction
def build_yearly_gru_model(input_shape, forecast_days=365):
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import GRU, Dense, Dropout
    
    model = Sequential([
        GRU(units=256, return_sequences=True, input_shape=input_shape),
        Dropout(0.3),
        GRU(units=128, return_sequences=True),
        Dropout(0.3),
        GRU(units=64, return_sequences=False),
        Dropout(0.2),
        Dense(units=128, activation='relu'),
        Dense(units=forecast_days, activation='linear')  # Predict full year
    ])
    
    model.compile(
        optimizer='adam',
        loss='mse',
        metrics=['mae']
    )
    
    return model
```

### 4. XGBoost with Yearly Features

**Best for** interpretability and feature importance:

```python
def create_yearly_features(df):
    """Create features that capture yearly patterns"""
    df = df.copy()
    
    # Time-based features
    df['day_of_year'] = df['date'].dt.dayofyear
    df['month'] = df['date'].dt.month
    df['quarter'] = df['date'].dt.quarter
    df['week_of_year'] = df['date'].dt.isocalendar().week
    
    # Yearly lags (same time last year)
    df['contamination_lag_365'] = df.groupby('route_id')['contamination_count'].shift(365)
    df['contamination_lag_364'] = df.groupby('route_id')['contamination_count'].shift(364)
    df['contamination_lag_366'] = df.groupby('route_id')['contamination_count'].shift(366)
    
    # Rolling averages from same time last year
    df['contamination_rolling_365_mean'] = df.groupby('route_id')['contamination_count'].transform(
        lambda x: x.shift(365).rolling(window=7, min_periods=1).mean()
    )
    
    # Month-based averages (captures monthly seasonality)
    df['monthly_avg'] = df.groupby(['route_id', 'month'])['contamination_count'].transform('mean')
    
    # Year-over-year change
    df['yoy_change'] = (df['contamination_count'] - df['contamination_lag_365']) / df['contamination_lag_365']
    
    return df

def train_yearly_xgboost(train_data, val_data):
    """Train XGBoost with yearly features"""
    import xgboost as xgb
    
    features = [
        'day_of_year', 'month', 'quarter', 'week_of_year',
        'contamination_lag_365', 'contamination_lag_364', 'contamination_lag_366',
        'contamination_rolling_365_mean', 'monthly_avg', 'yoy_change'
    ]
    
    X_train = train_data[features]
    y_train = train_data['contamination_count']
    X_val = val_data[features]
    y_val = val_data['contamination_count']
    
    model = xgb.XGBRegressor(
        n_estimators=1000,
        max_depth=6,
        learning_rate=0.01,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        early_stopping_rounds=50
    )
    
    model.fit(
        X_train, y_train,
        eval_set=[(X_val, y_val)],
        verbose=100
    )
    
    # Feature importance shows which yearly patterns matter most
    feature_importance = pd.DataFrame({
        'feature': features,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("Most important features for yearly prediction:")
    print(feature_importance)
    
    return model
```

### 5. Time Series Decomposition + Forecasting

**Best for** understanding underlying patterns:

```python
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.holtwinters import ExponentialSmoothing

def decompose_and_forecast(data, route_id):
    """
    Decompose time series into trend, seasonality, and residuals
    Then forecast each component separately
    """
    route_data = data[data['route_id'] == route_id].set_index('date').sort_index()
    ts = route_data['contamination_count']
    
    # Decompose (assumes yearly seasonality for daily data)
    decomposition = seasonal_decompose(
        ts, 
        model='multiplicative',  # or 'additive'
        period=365  # Yearly seasonality
    )
    
    trend = decomposition.trend
    seasonal = decomposition.seasonal
    residual = decomposition.resid
    
    # Forecast trend component
    trend_forecast = ExponentialSmoothing(
        trend.dropna(),
        trend='add',
        seasonal=None
    ).fit().forecast(steps=365)
    
    # Use last year's seasonal pattern for this year
    seasonal_forecast = seasonal[-365:].values
    
    # Forecast residuals (usually small)
    residual_forecast = ExponentialSmoothing(
        residual.dropna(),
        trend=None,
        seasonal=None
    ).fit().forecast(steps=365)
    
    # Combine forecasts
    if decomposition.model == 'multiplicative':
        final_forecast = trend_forecast * seasonal_forecast * residual_forecast
    else:
        final_forecast = trend_forecast + seasonal_forecast + residual_forecast
    
    return {
        'trend': trend,
        'seasonal': seasonal,
        'residual': residual,
        'forecast': final_forecast,
        'trend_forecast': trend_forecast,
        'seasonal_forecast': seasonal_forecast
    }
```

## Recommendation for Year-over-Year Prediction

### **Primary Recommendation: SARIMA**

**Why SARIMA is best**:
1. ✅ **Explicitly models yearly seasonality** - Designed for this exact use case
2. ✅ **Statistically rigorous** - Well-established methodology
3. ✅ **Interpretable** - You can see seasonal coefficients
4. ✅ **Works with 2+ years** - Minimum data requirement
5. ✅ **Handles multiple seasonalities** - Can model yearly + monthly + weekly

### **Secondary Recommendation: Prophet**

**Why Prophet is great**:
1. ✅ **Automatic seasonality detection** - No manual tuning
2. ✅ **Handles holidays** - Important for route data
3. ✅ **Robust to missing data** - Real-world data is messy
4. ✅ **Quick to implement** - Get results fast
5. ✅ **Uncertainty quantification** - Provides confidence intervals

### Implementation Strategy

```python
class YearlyContaminationPredictor:
    """
    Predicts this year's contamination based on last year's patterns
    """
    def __init__(self):
        self.sarima_models = {}
        self.prophet_models = {}
    
    def fit_models(self, data, route_ids):
        """Fit both SARIMA and Prophet for ensemble"""
        for route_id in route_ids:
            # SARIMA model
            sarima_model, _, _ = fit_sarima_for_yearly_prediction(data, route_id)
            self.sarima_models[route_id] = sarima_model
            
            # Prophet model
            prophet_model, _, _ = predict_with_prophet(data, route_id)
            self.prophet_models[route_id] = prophet_model
    
    def predict_next_year(self, route_id, ensemble=True):
        """Predict next year using ensemble of models"""
        # SARIMA prediction
        sarima_pred = self.sarima_models[route_id].forecast(steps=365)
        
        # Prophet prediction
        future = self.prophet_models[route_id].make_future_dataframe(periods=365)
        prophet_pred = self.prophet_models[route_id].predict(future)
        prophet_pred = prophet_pred['yhat'].tail(365).values
        
        if ensemble:
            # Weighted ensemble (SARIMA gets more weight for yearly patterns)
            prediction = 0.6 * sarima_pred + 0.4 * prophet_pred
        else:
            prediction = sarima_pred
        
        return prediction
    
    def compare_to_last_year(self, route_id, predictions):
        """Compare predictions to actual last year for validation"""
        # Get last year's actual data
        last_year_actual = self.get_last_year_data(route_id)
        
        # Calculate year-over-year change
        yoy_change = (predictions - last_year_actual) / last_year_actual * 100
        
        return {
            'predictions': predictions,
            'last_year_actual': last_year_actual,
            'yoy_change_pct': yoy_change,
            'expected_improvement': yoy_change.mean() < 0  # Negative = improvement
        }
```

## Key Considerations

### Data Requirements

- **Minimum**: 2 full years of data (to establish yearly pattern)
- **Recommended**: 3+ years (better seasonal estimates)
- **Ideal**: 5+ years (captures long-term trends + seasonality)

### Feature Engineering Tips

1. **Day-of-year encoding**: `sin(2π * day_of_year / 365)` and `cos(2π * day_of_year / 365)`
2. **Last year's values**: Direct lag features from 365 days ago
3. **Rolling averages**: 7-day, 30-day averages from same time last year
4. **Month-based patterns**: Average contamination by month across all years

### Validation Strategy

```python
def validate_yearly_model(data, route_id, years_of_data=3):
    """
    Use time series cross-validation
    Train on years 1-2, predict year 3
    Then train on years 1-3, predict year 4, etc.
    """
    results = []
    
    for test_year in range(2, years_of_data):
        # Split data
        train_data = data[data['year'] < test_year]
        test_data = data[data['year'] == test_year]
        
        # Train model
        model = fit_sarima_for_yearly_prediction(train_data, route_id)
        
        # Predict
        predictions = model.forecast(steps=len(test_data))
        
        # Evaluate
        mae = np.mean(np.abs(predictions - test_data['contamination_count']))
        mape = np.mean(np.abs((predictions - test_data['contamination_count']) / test_data['contamination_count'])) * 100
        
        results.append({
            'test_year': test_year,
            'mae': mae,
            'mape': mape
        })
    
    return results
```

## Summary

**For predicting this year based on last year's trends:**

1. **Start with SARIMA** - Best statistical foundation for yearly seasonality
2. **Add Prophet** - For robustness and automatic seasonality detection  
3. **Ensemble both** - Combine predictions for best accuracy
4. **Use XGBoost** - If you need interpretability and feature importance
5. **Consider LSTM/GRU** - Only if you have deep learning infrastructure and want to capture complex non-linear yearly patterns

**SARIMA is your best bet** because it's specifically designed for seasonal forecasting and will give you interpretable, statistically sound predictions based on yearly patterns.

