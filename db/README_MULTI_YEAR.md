# Multi-Year Seed Data for SARIMA Model

This directory contains scripts and data for generating multi-year historical data suitable for training SARIMA models.

## Overview

The `generate_multi_year_seed.py` script generates realistic contamination data spanning **3+ years** (from 2022-01-01 to present) with:

- **Yearly seasonality patterns**: Higher contamination in summer months (June-August) and holidays (November-December)
- **Weekly patterns**: Slightly higher contamination on weekends
- **Long-term trends**: Gradual improvement over time (2% reduction per year)
- **Route-specific baselines**: Different contamination rates per route

## Generated Data

- **~9,000+ pickups** across all routes
- **~2,000+ contamination events** with realistic patterns
- **Date range**: January 2022 to present (3+ years)
- **Seasonal patterns**: Captures yearly cycles needed for SARIMA

## Usage

### Generate the Data

```bash
python3 db/generate_multi_year_seed.py
```

This creates `db/multi_year_seed.sql` with INSERT statements.

### Load into Database

**Option 1: Fresh Database (Recommended)**
```bash
# Reset database with schema
psql recycling_contamination -f db/schema.sql

# Load base seed data (recent dates for dashboard)
psql recycling_contamination -f db/seed.sql

# Load multi-year historical data (for SARIMA)
psql recycling_contamination -f db/multi_year_seed.sql
```

**Option 2: Add to Existing Database**
```bash
# Just add the multi-year data
psql recycling_contamination -f db/multi_year_seed.sql
```

### Verify Data

```sql
-- Check date range
SELECT MIN(pickup_time), MAX(pickup_time), COUNT(*) 
FROM pickups;

-- Check contamination events
SELECT COUNT(*) FROM contamination_events;

-- Check yearly patterns (should show seasonality)
SELECT 
    EXTRACT(YEAR FROM pickup_time) as year,
    EXTRACT(MONTH FROM pickup_time) as month,
    COUNT(ce.contamination_id) as contamination_count
FROM pickups p
LEFT JOIN contamination_events ce ON p.pickup_id = ce.pickup_id
GROUP BY year, month
ORDER BY year, month;
```

## Data Characteristics

### Seasonal Patterns

The generated data includes realistic seasonal patterns:

- **December**: Peak contamination (1.3x multiplier) - holiday season
- **July**: High contamination (1.2x multiplier) - summer peak
- **June-August**: Elevated contamination (1.15-1.2x)
- **February**: Lowest contamination (0.9x multiplier)

### Route Differences

- **Route 1**: Baseline 17% contamination rate
- **Route 6**: Baseline 27% contamination rate (worst)
- Each route has different baseline rates

### Trends

- **Long-term improvement**: 2% reduction per year
- **Weekend effect**: 10% higher contamination on weekends
- **Yearly cycles**: Repeating patterns each year

## Using with SARIMA

This data is specifically designed for SARIMA model training:

1. **Minimum 2 years**: Required for yearly seasonality detection
2. **3+ years**: Better seasonal estimates
3. **Daily granularity**: Can aggregate to weekly/monthly as needed
4. **Realistic patterns**: Includes trends, seasonality, and noise

### Example SARIMA Query

```python
import pandas as pd
from statsmodels.tsa.statespace.sarimax import SARIMAX

# Load data
query = """
SELECT 
    DATE_TRUNC('day', pickup_time) as date,
    COUNT(ce.contamination_id) as contamination_count
FROM pickups p
LEFT JOIN contamination_events ce ON p.pickup_id = ce.pickup_id
WHERE route_id = 1
GROUP BY DATE_TRUNC('day', pickup_time)
ORDER BY date
"""

df = pd.read_sql(query, connection)
ts = df.set_index('date')['contamination_count']

# Fit SARIMA with yearly seasonality (s=365 for daily data)
model = SARIMAX(ts, order=(1, 1, 1), seasonal_order=(1, 1, 1, 365))
fitted = model.fit()

# Forecast next year
forecast = fitted.forecast(steps=365)
```

## Customization

Edit `generate_multi_year_seed.py` to customize:

- **Date range**: Change `START_DATE` and `END_DATE`
- **Seasonal patterns**: Modify `SEASONAL_PATTERNS` dictionary
- **Contamination rates**: Adjust `route_base_rate` calculation
- **Trends**: Change `trend_mult` calculation
- **Pickup frequency**: Modify the pickup probability (currently 15% per day)

## Performance Notes

- **File size**: ~800KB SQL file
- **Load time**: ~10-30 seconds depending on hardware
- **Database size**: Adds ~50-100MB to database
- **Query performance**: Indexes on `pickup_time` help with time series queries

## Troubleshooting

**Issue**: Foreign key violations
- **Solution**: Make sure `db/seed.sql` runs first to create containers

**Issue**: Duplicate pickup_ids
- **Solution**: The script uses auto-incrementing IDs. If you have existing data, you may need to adjust the starting pickup_id

**Issue**: Too much/little data
- **Solution**: Adjust the pickup probability in the script (currently 0.15 = 15% chance per day)

## Next Steps

1. Load the multi-year data
2. Test SARIMA model with the data (see `ADVANCED_ML_MODELS.md`)
3. Compare predictions to actual patterns
4. Fine-tune seasonal patterns if needed


