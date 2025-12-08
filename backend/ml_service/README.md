# ML Service - SARIMA Predictive Trends

This directory contains the Python-based ML service that uses SARIMA models for predictive trend analysis.

## Overview

The `sarima_predictor.py` script uses **SARIMA (Seasonal ARIMA)** models to predict contamination trends based on historical patterns. This replaces the statistical analysis approach with actual machine learning models.

## ML Models Used

- **SARIMA (Seasonal ARIMA)**: Time series forecasting with seasonal patterns
- **Auto-parameter selection**: Grid search for optimal (p,d,q)(P,D,Q,s) parameters
- **Seasonal decomposition**: For understanding underlying patterns

## Setup

### Install Python Dependencies

```bash
cd backend/ml_service
pip3 install -r requirements.txt
```

Or use a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Environment Variables

The script uses these environment variables (set in `.env` or system):

- `DB_NAME`: Database name (default: `recycling_contamination`)
- `DB_USER`: Database user (default: `mavakian`)
- `DB_PASSWORD`: Database password (default: empty)
- `DB_HOST`: Database host (default: `localhost`)
- `DB_PORT`: Database port (default: `5432`)

## Usage

### Standalone Testing

```bash
python3 sarima_predictor.py
```

Outputs JSON array of predictive searches.

### From TypeScript Backend

The `MLTrendAnalysisService` automatically calls this script when generating predictive searches. No manual invocation needed.

## How It Works

1. **Data Fetching**: Queries database for historical contamination data (up to 365 days)
2. **Time Series Creation**: Aggregates data by day into time series
3. **SARIMA Fitting**: Fits SARIMA model with weekly seasonality (s=7)
4. **Forecasting**: Predicts next 30 days of contamination events
5. **Trend Analysis**: Identifies increasing/decreasing trends
6. **Search Generation**: Creates actionable insights based on predictions

## Model Parameters

- **Seasonal Period**: 7 days (weekly patterns)
- **Forecast Horizon**: 30 days ahead
- **Grid Search**: Tests multiple (p,d,q)(P,D,Q,s) combinations
- **Fallback**: Simple trend analysis if SARIMA fails

## Performance

- **Training Time**: ~1-5 seconds per route (depends on data volume)
- **Prediction Time**: <1 second per route
- **Memory**: ~100-500MB depending on data size

## Troubleshooting

### Python Not Found
```bash
# Make sure python3 is in PATH
which python3
```

### Missing Dependencies
```bash
pip3 install -r requirements.txt
```

### Database Connection Errors
- Check `.env` file has correct DB credentials
- Ensure PostgreSQL is running
- Verify database exists: `psql -l`

### Model Fitting Errors
- Need at least 14 days of data for SARIMA
- Falls back to simple trend analysis if insufficient data
- Check logs for specific error messages

## Future Enhancements

- [ ] Support yearly seasonality (s=365) for long-term predictions
- [ ] Add Prophet model as alternative
- [ ] Cache model fits for faster predictions
- [ ] Add confidence interval visualization
- [ ] Support multi-route ensemble predictions



