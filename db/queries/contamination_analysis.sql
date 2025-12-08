-- ============================================================================
-- Contamination Analysis Queries with Joins
-- ============================================================================
-- This file contains comprehensive queries for analyzing contamination data
-- with proper joins across all related tables and optimized indexes.

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Index for contamination events by category (for category-based analysis)
CREATE INDEX IF NOT EXISTS idx_contamination_events_category 
    ON contamination_events (category_id);

-- Index for contamination events by severity (for filtering high-severity events)
CREATE INDEX IF NOT EXISTS idx_contamination_events_severity 
    ON contamination_events (severity);

-- Composite index for contamination events by pickup and category
CREATE INDEX IF NOT EXISTS idx_contamination_events_pickup_category 
    ON contamination_events (pickup_id, category_id);

-- Index for pickups by time (for time-based queries)
CREATE INDEX IF NOT EXISTS idx_pickups_time 
    ON pickups (pickup_time);

-- Index for containers by customer (for customer-level analysis)
CREATE INDEX IF NOT EXISTS idx_containers_customer 
    ON containers (customer_id);

-- Index for containers by stream_type (for stream-based analysis)
CREATE INDEX IF NOT EXISTS idx_containers_stream_type 
    ON containers (stream_type);

-- Index for customers by type (for residential vs commercial analysis)
CREATE INDEX IF NOT EXISTS idx_customers_type 
    ON customers (customer_type);

-- Index for routes by facility (for facility-level aggregation)
CREATE INDEX IF NOT EXISTS idx_routes_facility 
    ON routes (facility_id);

-- Index for contamination events by created_at (for time-based analysis)
CREATE INDEX IF NOT EXISTS idx_contamination_events_created_at 
    ON contamination_events (created_at);

-- ============================================================================
-- QUERY 1: Full Contamination Details with All Related Data
-- ============================================================================
-- Returns complete contamination event information with joins to all related tables
-- Useful for detailed reporting and analysis

SELECT 
    ce.contamination_id,
    ce.severity,
    ce.estimated_contamination_pct,
    ce.notes AS contamination_notes,
    ce.created_at AS contamination_date,
    
    -- Contamination Category
    cc.code AS category_code,
    cc.description AS category_description,
    
    -- Pickup Details
    p.pickup_id,
    p.pickup_time,
    p.weight_kg,
    p.driver_name,
    p.notes AS pickup_notes,
    
    -- Container Details
    c.container_id,
    c.label AS container_label,
    c.size_gallons,
    c.stream_type,
    
    -- Customer Details
    cust.customer_id,
    cust.external_ref,
    cust.name AS customer_name,
    cust.customer_type,
    cust.address_line1,
    cust.city AS customer_city,
    cust.state AS customer_state,
    cust.postal_code,
    
    -- Route Details
    r.route_id,
    r.route_code,
    r.description AS route_description,
    
    -- Facility Details
    f.facility_id,
    f.name AS facility_name,
    f.city AS facility_city,
    f.state AS facility_state
    
FROM contamination_events ce
INNER JOIN contamination_categories cc ON ce.category_id = cc.category_id
INNER JOIN pickups p ON ce.pickup_id = p.pickup_id
INNER JOIN containers c ON p.container_id = c.container_id
INNER JOIN customers cust ON c.customer_id = cust.customer_id
INNER JOIN routes r ON p.route_id = r.route_id
INNER JOIN facilities f ON r.facility_id = f.facility_id
ORDER BY p.pickup_time DESC, ce.severity DESC;

-- ============================================================================
-- QUERY 2: Route-Level Contamination Statistics
-- ============================================================================
-- Aggregates contamination data by route with key metrics

SELECT 
    r.route_id,
    r.route_code,
    r.description AS route_description,
    f.name AS facility_name,
    COUNT(DISTINCT p.pickup_id) AS total_pickups,
    COUNT(ce.contamination_id) AS total_contamination_events,
    COUNT(DISTINCT ce.pickup_id) AS pickups_with_contamination,
    ROUND(
        COUNT(DISTINCT ce.pickup_id)::NUMERIC / NULLIF(COUNT(DISTINCT p.pickup_id), 0) * 100, 
        2
    ) AS contamination_rate_pct,
    AVG(ce.severity) AS avg_severity,
    MAX(ce.severity) AS max_severity,
    AVG(ce.estimated_contamination_pct) AS avg_contamination_pct,
    SUM(ce.estimated_contamination_pct) AS total_contamination_pct,
    COUNT(DISTINCT cust.customer_id) AS affected_customers,
    COUNT(DISTINCT ce.category_id) AS unique_contamination_types
FROM routes r
INNER JOIN facilities f ON r.facility_id = f.facility_id
LEFT JOIN pickups p ON r.route_id = p.route_id
LEFT JOIN contamination_events ce ON p.pickup_id = ce.pickup_id
LEFT JOIN containers c ON p.container_id = c.container_id
LEFT JOIN customers cust ON c.customer_id = cust.customer_id
WHERE r.active = TRUE
GROUP BY r.route_id, r.route_code, r.description, f.name
ORDER BY contamination_rate_pct DESC NULLS LAST, total_contamination_events DESC;

-- ============================================================================
-- QUERY 3: Customer-Level Contamination Statistics
-- ============================================================================
-- Aggregates contamination data by customer to identify worst offenders

SELECT 
    cust.customer_id,
    cust.external_ref,
    cust.name AS customer_name,
    cust.customer_type,
    cust.address_line1,
    cust.city,
    cust.state,
    r.route_code,
    f.name AS facility_name,
    COUNT(DISTINCT p.pickup_id) AS total_pickups,
    COUNT(ce.contamination_id) AS total_contamination_events,
    COUNT(DISTINCT ce.pickup_id) AS pickups_with_contamination,
    ROUND(
        COUNT(DISTINCT ce.pickup_id)::NUMERIC / NULLIF(COUNT(DISTINCT p.pickup_id), 0) * 100, 
        2
    ) AS contamination_rate_pct,
    AVG(ce.severity) AS avg_severity,
    MAX(ce.severity) AS max_severity,
    AVG(ce.estimated_contamination_pct) AS avg_contamination_pct,
    SUM(ce.estimated_contamination_pct) AS total_contamination_pct,
    MAX(p.pickup_time) AS last_contamination_date,
    COUNT(DISTINCT ce.category_id) AS unique_contamination_types,
    STRING_AGG(DISTINCT cc.code, ', ' ORDER BY cc.code) AS contamination_categories
FROM customers cust
INNER JOIN routes r ON cust.route_id = r.route_id
INNER JOIN facilities f ON r.facility_id = f.facility_id
LEFT JOIN containers c ON cust.customer_id = c.customer_id
LEFT JOIN pickups p ON c.container_id = p.container_id
LEFT JOIN contamination_events ce ON p.pickup_id = ce.pickup_id
LEFT JOIN contamination_categories cc ON ce.category_id = cc.category_id
WHERE cust.active = TRUE
GROUP BY 
    cust.customer_id, cust.external_ref, cust.name, cust.customer_type,
    cust.address_line1, cust.city, cust.state, r.route_code, f.name
HAVING COUNT(ce.contamination_id) > 0
ORDER BY total_contamination_events DESC, avg_severity DESC
LIMIT 50;

-- ============================================================================
-- QUERY 4: Contamination by Category Analysis
-- ============================================================================
-- Analyzes contamination patterns by category type

SELECT 
    cc.category_id,
    cc.code AS category_code,
    cc.description AS category_description,
    COUNT(ce.contamination_id) AS total_events,
    COUNT(DISTINCT ce.pickup_id) AS affected_pickups,
    COUNT(DISTINCT p.container_id) AS affected_containers,
    COUNT(DISTINCT c.customer_id) AS affected_customers,
    AVG(ce.severity) AS avg_severity,
    MAX(ce.severity) AS max_severity,
    AVG(ce.estimated_contamination_pct) AS avg_contamination_pct,
    SUM(ce.estimated_contamination_pct) AS total_contamination_pct,
    MIN(ce.created_at) AS first_occurrence,
    MAX(ce.created_at) AS last_occurrence
FROM contamination_categories cc
LEFT JOIN contamination_events ce ON cc.category_id = ce.category_id
LEFT JOIN pickups p ON ce.pickup_id = p.pickup_id
LEFT JOIN containers c ON p.container_id = c.container_id
GROUP BY cc.category_id, cc.code, cc.description
ORDER BY total_events DESC;

-- ============================================================================
-- QUERY 5: Time-Based Contamination Trends (Daily)
-- ============================================================================
-- Daily aggregation of contamination events for trend analysis

SELECT 
    DATE(p.pickup_time) AS pickup_date,
    COUNT(DISTINCT p.pickup_id) AS total_pickups,
    COUNT(ce.contamination_id) AS total_contamination_events,
    COUNT(DISTINCT ce.pickup_id) AS pickups_with_contamination,
    ROUND(
        COUNT(DISTINCT ce.pickup_id)::NUMERIC / NULLIF(COUNT(DISTINCT p.pickup_id), 0) * 100, 
        2
    ) AS contamination_rate_pct,
    AVG(ce.severity) AS avg_severity,
    AVG(ce.estimated_contamination_pct) AS avg_contamination_pct,
    COUNT(DISTINCT r.route_id) AS routes_affected,
    COUNT(DISTINCT cust.customer_id) AS customers_affected
FROM pickups p
LEFT JOIN contamination_events ce ON p.pickup_id = ce.pickup_id
LEFT JOIN routes r ON p.route_id = r.route_id
LEFT JOIN containers c ON p.container_id = c.container_id
LEFT JOIN customers cust ON c.customer_id = cust.customer_id
GROUP BY DATE(p.pickup_time)
ORDER BY pickup_date DESC;

-- ============================================================================
-- QUERY 6: Time-Based Contamination Trends (Weekly)
-- ============================================================================
-- Weekly aggregation of contamination events for trend analysis

SELECT 
    DATE_TRUNC('week', p.pickup_time) AS week_start,
    COUNT(DISTINCT p.pickup_id) AS total_pickups,
    COUNT(ce.contamination_id) AS total_contamination_events,
    COUNT(DISTINCT ce.pickup_id) AS pickups_with_contamination,
    ROUND(
        COUNT(DISTINCT ce.pickup_id)::NUMERIC / NULLIF(COUNT(DISTINCT p.pickup_id), 0) * 100, 
        2
    ) AS contamination_rate_pct,
    AVG(ce.severity) AS avg_severity,
    AVG(ce.estimated_contamination_pct) AS avg_contamination_pct,
    COUNT(DISTINCT r.route_id) AS routes_affected,
    COUNT(DISTINCT cust.customer_id) AS customers_affected
FROM pickups p
LEFT JOIN contamination_events ce ON p.pickup_id = ce.pickup_id
LEFT JOIN routes r ON p.route_id = r.route_id
LEFT JOIN containers c ON p.container_id = c.container_id
LEFT JOIN customers cust ON c.customer_id = cust.customer_id
GROUP BY DATE_TRUNC('week', p.pickup_time)
ORDER BY week_start DESC;

-- ============================================================================
-- QUERY 7: Education Action Effectiveness Analysis
-- ============================================================================
-- Correlates education actions with contamination trends for customers

WITH customer_education_dates AS (
    SELECT 
        customer_id,
        MIN(action_date) AS first_education_date,
        MAX(action_date) AS last_education_date
    FROM education_actions
    GROUP BY customer_id
)
SELECT 
    cust.customer_id,
    cust.name AS customer_name,
    cust.customer_type,
    r.route_code,
    COUNT(DISTINCT ea.action_id) AS total_education_actions,
    ced.first_education_date,
    ced.last_education_date,
    STRING_AGG(DISTINCT ea.channel, ', ' ORDER BY ea.channel) AS channels_used,
    
    -- Contamination before education (30 days before first action)
    COUNT(DISTINCT CASE 
        WHEN p.pickup_time < ced.first_education_date 
        AND p.pickup_time >= ced.first_education_date - INTERVAL '30 days'
        THEN ce.contamination_id 
    END) AS contamination_before_30d,
    
    -- Contamination after education (30 days after last action)
    COUNT(DISTINCT CASE 
        WHEN p.pickup_time > ced.last_education_date 
        AND p.pickup_time <= ced.last_education_date + INTERVAL '30 days'
        THEN ce.contamination_id 
    END) AS contamination_after_30d,
    
    -- Average severity before
    AVG(CASE 
        WHEN p.pickup_time < ced.first_education_date 
        AND p.pickup_time >= ced.first_education_date - INTERVAL '30 days'
        THEN ce.severity 
    END) AS avg_severity_before,
    
    -- Average severity after
    AVG(CASE 
        WHEN p.pickup_time > ced.last_education_date 
        AND p.pickup_time <= ced.last_education_date + INTERVAL '30 days'
        THEN ce.severity 
    END) AS avg_severity_after
    
FROM customers cust
INNER JOIN routes r ON cust.route_id = r.route_id
INNER JOIN customer_education_dates ced ON cust.customer_id = ced.customer_id
INNER JOIN education_actions ea ON cust.customer_id = ea.customer_id
LEFT JOIN containers c ON cust.customer_id = c.customer_id
LEFT JOIN pickups p ON c.container_id = p.container_id
LEFT JOIN contamination_events ce ON p.pickup_id = ce.pickup_id
WHERE cust.active = TRUE
GROUP BY 
    cust.customer_id, cust.name, cust.customer_type, r.route_code,
    ced.first_education_date, ced.last_education_date
ORDER BY total_education_actions DESC, customer_name;

-- ============================================================================
-- QUERY 8: Facility-Level Contamination Summary
-- ============================================================================
-- Aggregates contamination data by facility

SELECT 
    f.facility_id,
    f.name AS facility_name,
    f.city,
    f.state,
    COUNT(DISTINCT r.route_id) AS total_routes,
    COUNT(DISTINCT p.pickup_id) AS total_pickups,
    COUNT(ce.contamination_id) AS total_contamination_events,
    COUNT(DISTINCT ce.pickup_id) AS pickups_with_contamination,
    ROUND(
        COUNT(DISTINCT ce.pickup_id)::NUMERIC / NULLIF(COUNT(DISTINCT p.pickup_id), 0) * 100, 
        2
    ) AS contamination_rate_pct,
    AVG(ce.severity) AS avg_severity,
    AVG(ce.estimated_contamination_pct) AS avg_contamination_pct,
    COUNT(DISTINCT cust.customer_id) AS affected_customers,
    COUNT(DISTINCT ce.category_id) AS unique_contamination_types
FROM facilities f
LEFT JOIN routes r ON f.facility_id = r.facility_id AND r.active = TRUE
LEFT JOIN pickups p ON r.route_id = p.route_id
LEFT JOIN contamination_events ce ON p.pickup_id = ce.pickup_id
LEFT JOIN containers c ON p.container_id = c.container_id
LEFT JOIN customers cust ON c.customer_id = cust.customer_id
WHERE f.active = TRUE
GROUP BY f.facility_id, f.name, f.city, f.state
ORDER BY contamination_rate_pct DESC NULLS LAST;

-- ============================================================================
-- QUERY 9: Container-Level Contamination Analysis
-- ============================================================================
-- Analyzes contamination by container (useful for identifying problematic bins)

SELECT 
    c.container_id,
    c.label AS container_label,
    c.size_gallons,
    c.stream_type,
    cust.customer_id,
    cust.name AS customer_name,
    cust.customer_type,
    r.route_code,
    COUNT(DISTINCT p.pickup_id) AS total_pickups,
    COUNT(ce.contamination_id) AS total_contamination_events,
    COUNT(DISTINCT ce.pickup_id) AS pickups_with_contamination,
    ROUND(
        COUNT(DISTINCT ce.pickup_id)::NUMERIC / NULLIF(COUNT(DISTINCT p.pickup_id), 0) * 100, 
        2
    ) AS contamination_rate_pct,
    AVG(ce.severity) AS avg_severity,
    MAX(ce.severity) AS max_severity,
    AVG(ce.estimated_contamination_pct) AS avg_contamination_pct,
    MAX(p.pickup_time) AS last_contamination_date
FROM containers c
INNER JOIN customers cust ON c.customer_id = cust.customer_id
INNER JOIN routes r ON cust.route_id = r.route_id
LEFT JOIN pickups p ON c.container_id = p.container_id
LEFT JOIN contamination_events ce ON p.pickup_id = ce.pickup_id
WHERE c.active = TRUE
GROUP BY 
    c.container_id, c.label, c.size_gallons, c.stream_type,
    cust.customer_id, cust.name, cust.customer_type, r.route_code
HAVING COUNT(ce.contamination_id) > 0
ORDER BY contamination_rate_pct DESC, total_contamination_events DESC;

-- ============================================================================
-- QUERY 10: Residential vs Commercial Contamination Comparison
-- ============================================================================
-- Compares contamination patterns between residential and commercial customers

SELECT 
    cust.customer_type,
    COUNT(DISTINCT cust.customer_id) AS total_customers,
    COUNT(DISTINCT p.pickup_id) AS total_pickups,
    COUNT(ce.contamination_id) AS total_contamination_events,
    COUNT(DISTINCT ce.pickup_id) AS pickups_with_contamination,
    ROUND(
        COUNT(DISTINCT ce.pickup_id)::NUMERIC / NULLIF(COUNT(DISTINCT p.pickup_id), 0) * 100, 
        2
    ) AS contamination_rate_pct,
    AVG(ce.severity) AS avg_severity,
    AVG(ce.estimated_contamination_pct) AS avg_contamination_pct,
    COUNT(DISTINCT ce.category_id) AS unique_contamination_types,
    -- Most common contamination category
    MODE() WITHIN GROUP (ORDER BY cc.code) AS most_common_category
FROM customers cust
LEFT JOIN containers c ON cust.customer_id = c.customer_id
LEFT JOIN pickups p ON c.container_id = p.container_id
LEFT JOIN contamination_events ce ON p.pickup_id = ce.pickup_id
LEFT JOIN contamination_categories cc ON ce.category_id = cc.category_id
WHERE cust.active = TRUE
GROUP BY cust.customer_type
ORDER BY contamination_rate_pct DESC;

-- ============================================================================
-- QUERY 11: High-Severity Contamination Events (Severity >= 4)
-- ============================================================================
-- Identifies the most severe contamination incidents

SELECT 
    ce.contamination_id,
    ce.severity,
    ce.estimated_contamination_pct,
    ce.notes AS contamination_notes,
    cc.code AS category_code,
    cc.description AS category_description,
    p.pickup_time,
    p.weight_kg,
    p.driver_name,
    c.label AS container_label,
    c.stream_type,
    cust.name AS customer_name,
    cust.customer_type,
    cust.address_line1,
    cust.city,
    r.route_code,
    f.name AS facility_name
FROM contamination_events ce
INNER JOIN contamination_categories cc ON ce.category_id = cc.category_id
INNER JOIN pickups p ON ce.pickup_id = p.pickup_id
INNER JOIN containers c ON p.container_id = c.container_id
INNER JOIN customers cust ON c.customer_id = cust.customer_id
INNER JOIN routes r ON p.route_id = r.route_id
INNER JOIN facilities f ON r.facility_id = f.facility_id
WHERE ce.severity >= 4
ORDER BY ce.severity DESC, ce.estimated_contamination_pct DESC, p.pickup_time DESC;

-- ============================================================================
-- QUERY 12: Contamination by Stream Type
-- ============================================================================
-- Analyzes contamination patterns by recycling stream type

SELECT 
    c.stream_type,
    COUNT(DISTINCT c.container_id) AS total_containers,
    COUNT(DISTINCT p.pickup_id) AS total_pickups,
    COUNT(ce.contamination_id) AS total_contamination_events,
    COUNT(DISTINCT ce.pickup_id) AS pickups_with_contamination,
    ROUND(
        COUNT(DISTINCT ce.pickup_id)::NUMERIC / NULLIF(COUNT(DISTINCT p.pickup_id), 0) * 100, 
        2
    ) AS contamination_rate_pct,
    AVG(ce.severity) AS avg_severity,
    AVG(ce.estimated_contamination_pct) AS avg_contamination_pct,
    COUNT(DISTINCT ce.category_id) AS unique_contamination_types
FROM containers c
LEFT JOIN pickups p ON c.container_id = p.container_id
LEFT JOIN contamination_events ce ON p.pickup_id = ce.pickup_id
WHERE c.active = TRUE
GROUP BY c.stream_type
ORDER BY contamination_rate_pct DESC NULLS LAST;

-- ============================================================================
-- QUERY 13: Driver Performance Analysis
-- ============================================================================
-- Analyzes contamination rates by driver

SELECT 
    p.driver_name,
    COUNT(DISTINCT p.pickup_id) AS total_pickups,
    COUNT(ce.contamination_id) AS total_contamination_events,
    COUNT(DISTINCT ce.pickup_id) AS pickups_with_contamination,
    ROUND(
        COUNT(DISTINCT ce.pickup_id)::NUMERIC / NULLIF(COUNT(DISTINCT p.pickup_id), 0) * 100, 
        2
    ) AS contamination_rate_pct,
    AVG(ce.severity) AS avg_severity,
    COUNT(DISTINCT r.route_id) AS routes_worked,
    COUNT(DISTINCT cust.customer_id) AS customers_served,
    MIN(p.pickup_time) AS first_pickup,
    MAX(p.pickup_time) AS last_pickup
FROM pickups p
LEFT JOIN contamination_events ce ON p.pickup_id = ce.pickup_id
LEFT JOIN routes r ON p.route_id = r.route_id
LEFT JOIN containers c ON p.container_id = c.container_id
LEFT JOIN customers cust ON c.customer_id = cust.customer_id
WHERE p.driver_name IS NOT NULL
GROUP BY p.driver_name
HAVING COUNT(DISTINCT p.pickup_id) > 0
ORDER BY contamination_rate_pct DESC NULLS LAST;

-- ============================================================================
-- QUERY 14: Recent Contamination Events (Last 7 Days)
-- ============================================================================
-- Quick view of recent contamination for operational monitoring

SELECT 
    ce.contamination_id,
    ce.severity,
    ce.estimated_contamination_pct,
    cc.code AS category_code,
    cc.description AS category_description,
    p.pickup_time,
    cust.name AS customer_name,
    cust.customer_type,
    r.route_code,
    f.name AS facility_name
FROM contamination_events ce
INNER JOIN contamination_categories cc ON ce.category_id = cc.category_id
INNER JOIN pickups p ON ce.pickup_id = p.pickup_id
INNER JOIN containers c ON p.container_id = c.container_id
INNER JOIN customers cust ON c.customer_id = cust.customer_id
INNER JOIN routes r ON p.route_id = r.route_id
INNER JOIN facilities f ON r.facility_id = f.facility_id
WHERE p.pickup_time >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY p.pickup_time DESC, ce.severity DESC;

-- ============================================================================
-- QUERY 15: Contamination Events with Education History
-- ============================================================================
-- Shows contamination events alongside education actions for the customer

SELECT 
    ce.contamination_id,
    ce.severity,
    ce.estimated_contamination_pct,
    cc.code AS category_code,
    p.pickup_time AS contamination_date,
    cust.customer_id,
    cust.name AS customer_name,
    cust.customer_type,
    r.route_code,
    -- Education actions before this contamination
    COUNT(DISTINCT CASE 
        WHEN ea.action_date < p.pickup_time 
        THEN ea.action_id 
    END) AS education_actions_before,
    -- Education actions after this contamination
    COUNT(DISTINCT CASE 
        WHEN ea.action_date > p.pickup_time 
        THEN ea.action_id 
    END) AS education_actions_after,
    -- Most recent education action before contamination
    MAX(CASE 
        WHEN ea.action_date < p.pickup_time 
        THEN ea.action_date 
    END) AS last_education_before,
    -- First education action after contamination
    MIN(CASE 
        WHEN ea.action_date > p.pickup_time 
        THEN ea.action_date 
    END) AS first_education_after
FROM contamination_events ce
INNER JOIN contamination_categories cc ON ce.category_id = cc.category_id
INNER JOIN pickups p ON ce.pickup_id = p.pickup_id
INNER JOIN containers c ON p.container_id = c.container_id
INNER JOIN customers cust ON c.customer_id = cust.customer_id
INNER JOIN routes r ON p.route_id = r.route_id
LEFT JOIN education_actions ea ON cust.customer_id = ea.customer_id
GROUP BY 
    ce.contamination_id, ce.severity, ce.estimated_contamination_pct,
    cc.code, p.pickup_time, cust.customer_id, cust.name, 
    cust.customer_type, r.route_code
ORDER BY p.pickup_time DESC;

