# Advanced ML Models for Large-Scale Time Series Data

This guide covers advanced machine learning models suitable for handling massive datasets with years of historical route information.

## Table of Contents

1. [Overview](#overview)
2. [Model Comparison](#model-comparison)
3. [GRU (Gated Recurrent Unit)](#gru-gated-recurrent-unit)
4. [Alternative Models](#alternative-models)
5. [Implementation Guide](#implementation-guide)
6. [Performance Considerations](#performance-considerations)
7. [Recommendations](#recommendations)

## Overview

For production systems with **massive datasets spanning years**, you need models that can:
- Handle long-term dependencies (weeks, months, years)
- Scale to millions of data points
- Capture complex temporal patterns
- Provide interpretable predictions
- Train efficiently on large datasets

## Model Comparison

| Model | Best For | Pros | Cons | Training Time |
|-------|----------|------|------|---------------|
| **GRU** | Sequential patterns, medium-term dependencies | Fast training, less parameters than LSTM, good for sequences | May struggle with very long sequences (>1000 steps) | Medium |
| **LSTM** | Long-term dependencies, complex patterns | Excellent memory, handles long sequences | More parameters, slower training | Slow |
| **Transformer** | Long sequences, parallel processing | Attention mechanism, state-of-the-art | Requires large datasets, complex | Very Slow |
| **XGBoost/LightGBM** | Tabular time series, feature engineering | Fast, interpretable, handles missing data | Requires manual feature engineering | Fast |
| **Prophet** | Business time series, seasonality | Handles holidays, automatic seasonality | Less flexible, Facebook-specific | Medium |
| **ARIMA/SARIMA** | Traditional forecasting, interpretability | Statistical rigor, interpretable | Assumes linear relationships | Fast |

## GRU (Gated Recurrent Unit)

### Why GRU for Route Data?

**GRU is an excellent choice** for your use case because:

1. **Sequential Nature**: Route contamination data is inherently sequential (daily/weekly patterns)
2. **Medium-term Memory**: GRU can capture patterns over weeks/months (perfect for route cycles)
3. **Efficiency**: Faster training than LSTM with similar performance
4. **Scalability**: Can handle large datasets efficiently with batching
5. **Multi-variate Support**: Can incorporate multiple features (route, category, severity, weather, etc.)

### Architecture

```
Input (t) ──┐
            ├──> [Reset Gate] ──> [Update Gate] ──> Hidden State (t)
Hidden(t-1) ┘                                    └──> Output (t)
```

**Key Components**:
- **Reset Gate**: Controls how much past information to forget
- **Update Gate**: Controls how much new information to incorporate
- **Hidden State**: Maintains memory across time steps

### When to Use GRU

✅ **Use GRU when**:
- You have sequential data (time series)
- You need to capture patterns over weeks/months
- Training speed matters
- You have sufficient data (thousands+ sequences)
- You want to predict future contamination events

❌ **Consider alternatives when**:
- Sequences are very long (>1000 time steps) → Use Transformer
- You need interpretability → Use XGBoost or ARIMA
- Data is sparse or irregular → Use Prophet or XGBoost
- You need real-time predictions → Use simpler models

## Alternative Models

### 1. LSTM (Long Short-Term Memory)

**Better than GRU for**:
- Very long sequences (years of daily data)
- Complex long-term dependencies
- When you have abundant compute resources

**Architecture**: Similar to GRU but with additional "forget gate" and "cell state"

```python
# LSTM has more parameters
LSTM: ~4x parameters per unit
GRU: ~3x parameters per unit
```

### 2. Transformer Models

**Best for**:
- Extremely long sequences
- Parallel processing
- State-of-the-art accuracy
- When you have massive datasets (millions+ samples)

**Architecture**: Self-attention mechanism allows looking at all time steps simultaneously

**Examples**:
- **Time Series Transformer**: Specialized for time series
- **Informer**: Efficient transformer for long sequences
- **Autoformer**: Automatic decomposition + transformer

### 3. XGBoost/LightGBM with Time Features

**Best for**:
- Tabular time series data
- When interpretability matters
- Fast training and inference
- Handling categorical features (route codes, categories)

**Key Features**:
- Feature engineering: lag features, rolling statistics, time-based features
- Handles missing data well
- Feature importance scores

### 4. Prophet (Facebook)

**Best for**:
- Business time series with seasonality
- Automatic holiday detection
- When you need quick, reliable forecasts
- Handling irregular patterns

**Limitations**:
- Less flexible than neural networks
- Assumes additive seasonality
- May struggle with complex patterns

## Implementation Guide

### GRU Implementation for Route Contamination

#### Step 1: Data Preparation

```python
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import GRU, Dense, Dropout
from tensorflow.keras.optimizers import Adam

def prepare_sequences(data, route_id, sequence_length=30, forecast_horizon=7):
    """
    Prepare sequences for GRU training
    
    Args:
        data: DataFrame with columns [date, route_id, contamination_count, severity_avg, ...]
        route_id: Specific route to model
        sequence_length: Number of days to look back (e.g., 30 days)
        forecast_horizon: Number of days to predict (e.g., 7 days ahead)
    
    Returns:
        X: Input sequences (samples, sequence_length, features)
        y: Target values (samples, forecast_horizon)
    """
    route_data = data[data['route_id'] == route_id].sort_values('date')
    
    # Select features
    features = ['contamination_count', 'severity_avg', 'contamination_pct', 
                'day_of_week', 'month', 'is_weekend']
    
    # Scale features
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(route_data[features])
    
    X, y = [], []
    for i in range(len(scaled_data) - sequence_length - forecast_horizon + 1):
        X.append(scaled_data[i:i+sequence_length])
        y.append(scaled_data[i+sequence_length:i+sequence_length+forecast_horizon, 0])  # Predict contamination_count
    
    return np.array(X), np.array(y), scaler
```

#### Step 2: Build GRU Model

```python
def build_gru_model(input_shape, forecast_horizon=7):
    """
    Build GRU model for time series forecasting
    
    Args:
        input_shape: (sequence_length, num_features)
        forecast_horizon: Number of days to predict
    
    Returns:
        Compiled Keras model
    """
    model = Sequential([
        # First GRU layer with return sequences
        GRU(units=128, return_sequences=True, input_shape=input_shape),
        Dropout(0.2),
        
        # Second GRU layer
        GRU(units=64, return_sequences=False),
        Dropout(0.2),
        
        # Dense layers for prediction
        Dense(units=32, activation='relu'),
        Dense(units=forecast_horizon, activation='linear')  # Predict multiple days ahead
    ])
    
    model.compile(
        optimizer=Adam(learning_rate=0.001),
        loss='mse',
        metrics=['mae', 'mape']
    )
    
    return model

# Usage
sequence_length = 30  # Look back 30 days
num_features = 6      # Number of features
forecast_horizon = 7  # Predict 7 days ahead

model = build_gru_model(
    input_shape=(sequence_length, num_features),
    forecast_horizon=forecast_horizon
)

model.summary()
```

#### Step 3: Training

```python
def train_gru_model(model, X_train, y_train, X_val, y_val, epochs=100, batch_size=32):
    """
    Train GRU model with early stopping
    """
    from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
    
    callbacks = [
        EarlyStopping(
            monitor='val_loss',
            patience=15,
            restore_best_weights=True,
            verbose=1
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=5,
            min_lr=1e-7,
            verbose=1
        ),
        ModelCheckpoint(
            'best_gru_model.h5',
            monitor='val_loss',
            save_best_only=True,
            verbose=1
        )
    ]
    
    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=epochs,
        batch_size=batch_size,
        callbacks=callbacks,
        verbose=1
    )
    
    return history, model
```

#### Step 4: Multi-Route Training

```python
def train_multi_route_model(data, route_ids, sequence_length=30, forecast_horizon=7):
    """
    Train a single GRU model on multiple routes
    Uses route_id as an additional feature
    """
    all_X, all_y = [], []
    
    for route_id in route_ids:
        X, y, _ = prepare_sequences(data, route_id, sequence_length, forecast_horizon)
        
        # Add route_id as one-hot encoded feature
        route_onehot = np.full((X.shape[0], X.shape[1], 1), route_id)
        X_with_route = np.concatenate([X, route_onehot], axis=2)
        
        all_X.append(X_with_route)
        all_y.append(y)
    
    X_combined = np.concatenate(all_X, axis=0)
    y_combined = np.concatenate(all_y, axis=0)
    
    # Shuffle
    indices = np.random.permutation(len(X_combined))
    X_combined = X_combined[indices]
    y_combined = y_combined[indices]
    
    # Split train/val
    split_idx = int(0.8 * len(X_combined))
    X_train, X_val = X_combined[:split_idx], X_combined[split_idx:]
    y_train, y_val = y_combined[:split_idx], y_combined[split_idx:]
    
    # Build and train model
    model = build_gru_model(
        input_shape=(sequence_length, X_combined.shape[2]),
        forecast_horizon=forecast_horizon
    )
    
    history, model = train_gru_model(model, X_train, y_train, X_val, y_val)
    
    return model, history
```

### LSTM Alternative

If you need longer memory, use LSTM instead:

```python
from tensorflow.keras.layers import LSTM

def build_lstm_model(input_shape, forecast_horizon=7):
    model = Sequential([
        LSTM(units=128, return_sequences=True, input_shape=input_shape),
        Dropout(0.2),
        LSTM(units=64, return_sequences=False),
        Dropout(0.2),
        Dense(units=32, activation='relu'),
        Dense(units=forecast_horizon, activation='linear')
    ])
    
    model.compile(
        optimizer=Adam(learning_rate=0.001),
        loss='mse',
        metrics=['mae']
    )
    
    return model
```

### Transformer Implementation

For very long sequences, consider a Time Series Transformer:

```python
from transformers import TimeSeriesTransformerConfig, TimeSeriesTransformerModel
import torch
import torch.nn as nn

class ContaminationTransformer(nn.Module):
    def __init__(self, d_model=128, nhead=8, num_layers=4, sequence_length=365):
        super().__init__()
        
        config = TimeSeriesTransformerConfig(
            prediction_length=7,
            context_length=sequence_length,
            d_model=d_model,
            nhead=nhead,
            num_encoder_layers=num_layers,
            num_decoder_layers=num_layers,
        )
        
        self.transformer = TimeSeriesTransformerModel(config)
        self.linear = nn.Linear(d_model, 1)
    
    def forward(self, x):
        # x shape: (batch, sequence_length, features)
        outputs = self.transformer(x)
        predictions = self.linear(outputs.last_hidden_state)
        return predictions
```

### XGBoost with Time Features

For interpretability and speed:

```python
import xgboost as xgb
from sklearn.model_selection import TimeSeriesSplit

def create_time_features(df):
    """Create time-based features"""
    df = df.copy()
    df['year'] = df['date'].dt.year
    df['month'] = df['date'].dt.month
    df['day_of_week'] = df['date'].dt.dayofweek
    df['day_of_year'] = df['date'].dt.dayofyear
    df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)
    df['quarter'] = df['date'].dt.quarter
    
    # Lag features
    for lag in [1, 7, 14, 30]:
        df[f'contamination_lag_{lag}'] = df.groupby('route_id')['contamination_count'].shift(lag)
    
    # Rolling statistics
    for window in [7, 14, 30]:
        df[f'contamination_rolling_mean_{window}'] = df.groupby('route_id')['contamination_count'].transform(
            lambda x: x.rolling(window=window, min_periods=1).mean()
        )
    
    return df

def train_xgboost_model(train_data, val_data):
    """Train XGBoost model with time features"""
    
    features = ['route_id', 'month', 'day_of_week', 'is_weekend',
                'contamination_lag_1', 'contamination_lag_7',
                'contamination_rolling_mean_7', 'contamination_rolling_mean_30']
    
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
    
    return model
```

## Performance Considerations

### Scaling to Massive Datasets

#### 1. Data Loading

```python
# Use generators for large datasets
def data_generator(data_path, batch_size=1000, sequence_length=30):
    """Generator for loading data in batches"""
    chunk_size = batch_size * 10
    
    for chunk in pd.read_csv(data_path, chunksize=chunk_size):
        # Process chunk
        X, y = prepare_sequences(chunk, ...)
        
        for i in range(0, len(X), batch_size):
            yield X[i:i+batch_size], y[i:i+batch_size]
```

#### 2. Distributed Training

```python
# Use TensorFlow Distributed Strategy
import tensorflow as tf

strategy = tf.distribute.MirroredStrategy()

with strategy.scope():
    model = build_gru_model(input_shape, forecast_horizon)
    model.compile(...)

# Training will automatically use multiple GPUs
model.fit(train_dataset, ...)
```

#### 3. Model Optimization

```python
# Use mixed precision training
from tensorflow.keras.mixed_precision import set_global_policy

set_global_policy('mixed_float16')  # Faster training, less memory

# Quantize model for inference
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()
```

### Memory Optimization

```python
# Use tf.data for efficient data pipeline
def create_dataset(X, y, batch_size=32, shuffle=True):
    dataset = tf.data.Dataset.from_tensor_slices((X, y))
    
    if shuffle:
        dataset = dataset.shuffle(buffer_size=10000)
    
    dataset = dataset.batch(batch_size)
    dataset = dataset.prefetch(tf.data.AUTOTUNE)  # Prefetch for performance
    
    return dataset
```

## Recommendations

### For Your Use Case (Years of Route Data)

**Recommended Approach: Hybrid Model**

1. **Primary Model: GRU**
   - Use for route-specific predictions
   - Sequence length: 30-90 days (captures monthly patterns)
   - Forecast horizon: 7-14 days
   - Train separate models per route OR use route_id as feature

2. **Secondary Model: XGBoost**
   - Use for interpretability and feature importance
   - Good for understanding which factors matter most
   - Fast inference for real-time predictions

3. **Ensemble Approach**
   ```python
   def ensemble_predict(gru_pred, xgb_pred, weights=[0.7, 0.3]):
       return weights[0] * gru_pred + weights[1] * xgb_pred
   ```

### Model Selection Decision Tree

```
Do you have >1M samples?
├─ Yes → Consider Transformer or Distributed GRU
└─ No → Continue

Do you need interpretability?
├─ Yes → Use XGBoost + GRU ensemble
└─ No → Continue

Are sequences >1000 steps?
├─ Yes → Use Transformer or LSTM
└─ No → Use GRU

Do you need real-time predictions?
├─ Yes → Use XGBoost or smaller GRU
└─ No → Use larger GRU/LSTM
```

### Implementation Priority

1. **Phase 1**: Start with GRU (single route)
   - Validate approach
   - Tune hyperparameters
   - Measure performance

2. **Phase 2**: Scale to multiple routes
   - Multi-route GRU model
   - Route-specific fine-tuning
   - Feature engineering

3. **Phase 3**: Add XGBoost ensemble
   - Interpretability
   - Feature importance analysis
   - Hybrid predictions

4. **Phase 4**: Consider Transformer (if needed)
   - Very long sequences
   - Complex patterns
   - State-of-the-art accuracy

## Example: Production GRU Pipeline

```python
class RouteContaminationPredictor:
    def __init__(self, model_path=None):
        self.model = None
        self.scaler = None
        self.route_models = {}  # Cache route-specific models
        
        if model_path:
            self.load_model(model_path)
    
    def train(self, data, route_ids=None, sequence_length=30, forecast_horizon=7):
        """Train model(s) on historical data"""
        if route_ids is None:
            route_ids = data['route_id'].unique()
        
        # Option 1: Single model for all routes
        if len(route_ids) < 50:
            self.model, self.scaler = train_multi_route_model(
                data, route_ids, sequence_length, forecast_horizon
            )
        else:
            # Option 2: Route-specific models (better accuracy)
            for route_id in route_ids:
                X, y, scaler = prepare_sequences(data, route_id, sequence_length, forecast_horizon)
                model = build_gru_model(
                    input_shape=(sequence_length, X.shape[2]),
                    forecast_horizon=forecast_horizon
                )
                # Train model...
                self.route_models[route_id] = (model, scaler)
    
    def predict(self, route_id, recent_data, days_ahead=7):
        """Predict contamination for next N days"""
        if route_id in self.route_models:
            model, scaler = self.route_models[route_id]
        else:
            model, scaler = self.model, self.scaler
        
        # Prepare input sequence
        X = prepare_sequence_for_prediction(recent_data, scaler)
        
        # Predict
        predictions = model.predict(X)
        predictions = scaler.inverse_transform(predictions)
        
        return predictions
    
    def save_model(self, path):
        """Save model for production"""
        self.model.save(path)
    
    def load_model(self, path):
        """Load model for inference"""
        self.model = tf.keras.models.load_model(path)
```

## Conclusion

**For your massive production dataset with years of route data:**

1. **Start with GRU** - Best balance of performance and efficiency
2. **Consider LSTM** - If you need longer memory (>90 days)
3. **Add XGBoost** - For interpretability and ensemble
4. **Scale with Transformers** - If you need state-of-the-art on very long sequences

**Key Success Factors**:
- Proper data preprocessing and feature engineering
- Appropriate sequence length (30-90 days for routes)
- Efficient data loading and batching
- Model ensembling for robustness
- Continuous retraining as new data arrives

The GRU approach will give you excellent results for route contamination prediction while being computationally efficient enough to scale to your massive dataset.

