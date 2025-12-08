# Database Queries

This directory contains SQL queries for analyzing the recycling contamination database.

## Files

### `contamination_analysis.sql`
Comprehensive analysis queries with joins across all tables. Includes:
- **Indexes**: Performance optimization indexes for common query patterns
- **15 Analysis Queries**: Detailed queries covering:
  - Full contamination details with all related data
  - Route-level statistics
  - Customer-level statistics
  - Contamination by category
  - Time-based trends (daily and weekly)
  - Education action effectiveness
  - Facility-level summaries
  - Container-level analysis
  - Residential vs commercial comparison
  - High-severity events
  - Stream type analysis
  - Driver performance
  - Recent events monitoring
  - Contamination with education history

### `quick_reference.sql`
Common queries for quick lookups and basic analysis:
- Basic lookups (by route, customer, etc.)
- Simple statistics
- Time-based queries
- Customer & route queries
- Education action queries

## Indexes

The following indexes are created in `contamination_analysis.sql` to optimize query performance:

### Primary Indexes (from schema.sql)
- `idx_pickups_route_time` - Fast lookups by route + time
- `idx_pickups_container` - Fast lookup of pickups by container
- `idx_contamination_events_pickup` - Fast lookup of contamination events by pickup
- `idx_customers_route` - Fast lookup of customers by route
- `idx_education_actions_customer_date` - Fast lookup of education actions by customer and date

### Additional Indexes (in contamination_analysis.sql)
- `idx_contamination_events_category` - Category-based analysis
- `idx_contamination_events_severity` - Filtering high-severity events
- `idx_contamination_events_pickup_category` - Composite for pickup + category queries
- `idx_pickups_time` - Time-based queries
- `idx_containers_customer` - Customer-level analysis
- `idx_containers_stream_type` - Stream-based analysis
- `idx_customers_type` - Residential vs commercial analysis
- `idx_routes_facility` - Facility-level aggregation
- `idx_contamination_events_created_at` - Time-based analysis

## Usage

### Running Individual Queries

You can run individual queries from these files in your PostgreSQL client:

```bash
psql -d recycling_contamination -f db/queries/contamination_analysis.sql
```

Or copy specific queries and run them directly.

### Query Patterns

Most queries follow these patterns:

1. **Joins**: Queries typically join across the full hierarchy:
   ```
   contamination_events → pickups → containers → customers → routes → facilities
   ```

2. **Aggregations**: Many queries use `GROUP BY` with `COUNT`, `AVG`, `MAX`, `MIN` for statistics

3. **Filtering**: Use `WHERE` clauses to filter by:
   - Date ranges (`pickup_time >= ...`)
   - Active records (`active = TRUE`)
   - Specific IDs (`route_id = ...`)

4. **Ordering**: Results are typically ordered by:
   - Contamination rate (DESC)
   - Total events (DESC)
   - Date (DESC for recent first)

## Example Use Cases

### Find Worst Offending Routes
```sql
-- Use Query 2 from contamination_analysis.sql
-- Shows routes ranked by contamination rate
```

### Analyze Education Effectiveness
```sql
-- Use Query 7 from contamination_analysis.sql
-- Compares contamination before/after education actions
```

### Monitor Recent Contamination
```sql
-- Use Query 14 from contamination_analysis.sql
-- Shows contamination events from last 7 days
```

### Customer-Level Analysis
```sql
-- Use Query 3 from contamination_analysis.sql
-- Identifies worst offending customers with full details
```

## Performance Notes

- All queries use appropriate indexes for optimal performance
- For large datasets, consider adding date range filters
- Complex aggregations may benefit from materialized views for frequently-run queries
- Use `EXPLAIN ANALYZE` to check query plans if performance issues arise

## Modifying Queries

When modifying queries:
1. Ensure joins maintain referential integrity
2. Use `LEFT JOIN` when you want to include records without matches
3. Use `INNER JOIN` when you only want records with matches
4. Consider adding indexes if you add new filter conditions
5. Test with `EXPLAIN ANALYZE` to verify performance

