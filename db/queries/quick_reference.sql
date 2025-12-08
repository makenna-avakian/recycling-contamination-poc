-- ============================================================================
-- Quick Reference Queries
-- ============================================================================
-- Common queries for quick lookups and basic analysis
-- For comprehensive analysis queries, see contamination_analysis.sql

-- ============================================================================
-- BASIC LOOKUPS
-- ============================================================================

-- Get all contamination events for a specific route
SELECT 
    ce.*,
    cc.code AS category_code,
    cc.description AS category_description,
    p.pickup_time,
    cust.name AS customer_name
FROM contamination_events ce
INNER JOIN contamination_categories cc ON ce.category_id = cc.category_id
INNER JOIN pickups p ON ce.pickup_id = p.pickup_id
INNER JOIN containers c ON p.container_id = c.container_id
INNER JOIN customers cust ON c.customer_id = cust.customer_id
WHERE p.route_id = 1  -- Replace with desired route_id
ORDER BY p.pickup_time DESC;

-- Get all contamination events for a specific customer
SELECT 
    ce.*,
    cc.code AS category_code,
    p.pickup_time,
    c.label AS container_label
FROM contamination_events ce
INNER JOIN contamination_categories cc ON ce.category_id = cc.category_id
INNER JOIN pickups p ON ce.pickup_id = p.pickup_id
INNER JOIN containers c ON p.container_id = c.container_id
WHERE c.customer_id = 1  -- Replace with desired customer_id
ORDER BY p.pickup_time DESC;

-- Get all pickups for a route with contamination summary
SELECT 
    p.*,
    COUNT(ce.contamination_id) AS contamination_count,
    MAX(ce.severity) AS max_severity,
    AVG(ce.severity) AS avg_severity
FROM pickups p
LEFT JOIN contamination_events ce ON p.pickup_id = ce.pickup_id
WHERE p.route_id = 1  -- Replace with desired route_id
GROUP BY p.pickup_id
ORDER BY p.pickup_time DESC;

-- ============================================================================
-- SIMPLE STATISTICS
-- ============================================================================

-- Overall contamination rate
SELECT 
    COUNT(DISTINCT p.pickup_id) AS total_pickups,
    COUNT(DISTINCT ce.pickup_id) AS pickups_with_contamination,
    ROUND(
        COUNT(DISTINCT ce.pickup_id)::NUMERIC / NULLIF(COUNT(DISTINCT p.pickup_id), 0) * 100, 
        2
    ) AS contamination_rate_pct,
    COUNT(ce.contamination_id) AS total_contamination_events,
    AVG(ce.severity) AS avg_severity
FROM pickups p
LEFT JOIN contamination_events ce ON p.pickup_id = ce.pickup_id;

-- Contamination by category (simple)
SELECT 
    cc.code,
    cc.description,
    COUNT(*) AS event_count,
    AVG(ce.severity) AS avg_severity
FROM contamination_events ce
INNER JOIN contamination_categories cc ON ce.category_id = cc.category_id
GROUP BY cc.category_id, cc.code, cc.description
ORDER BY event_count DESC;

-- Top 10 worst customers by contamination count
SELECT 
    cust.name,
    cust.customer_type,
    r.route_code,
    COUNT(ce.contamination_id) AS contamination_count
FROM customers cust
INNER JOIN routes r ON cust.route_id = r.route_id
INNER JOIN containers c ON cust.customer_id = c.customer_id
INNER JOIN pickups p ON c.container_id = p.container_id
INNER JOIN contamination_events ce ON p.pickup_id = ce.pickup_id
GROUP BY cust.customer_id, cust.name, cust.customer_type, r.route_code
ORDER BY contamination_count DESC
LIMIT 10;

-- ============================================================================
-- TIME-BASED QUERIES
-- ============================================================================

-- Contamination events in the last 30 days
SELECT 
    DATE(p.pickup_time) AS date,
    COUNT(*) AS contamination_events,
    AVG(ce.severity) AS avg_severity
FROM contamination_events ce
INNER JOIN pickups p ON ce.pickup_id = p.pickup_id
WHERE p.pickup_time >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(p.pickup_time)
ORDER BY date DESC;

-- Contamination events by month
SELECT 
    DATE_TRUNC('month', p.pickup_time) AS month,
    COUNT(*) AS contamination_events,
    COUNT(DISTINCT ce.pickup_id) AS affected_pickups,
    AVG(ce.severity) AS avg_severity
FROM contamination_events ce
INNER JOIN pickups p ON ce.pickup_id = p.pickup_id
GROUP BY DATE_TRUNC('month', p.pickup_time)
ORDER BY month DESC;

-- ============================================================================
-- CUSTOMER & ROUTE QUERIES
-- ============================================================================

-- All customers on a route with their contamination status
SELECT 
    cust.customer_id,
    cust.name,
    cust.customer_type,
    COUNT(DISTINCT p.pickup_id) AS total_pickups,
    COUNT(ce.contamination_id) AS contamination_events
FROM customers cust
INNER JOIN containers c ON cust.customer_id = c.customer_id
INNER JOIN pickups p ON c.container_id = p.container_id
LEFT JOIN contamination_events ce ON p.pickup_id = ce.pickup_id
WHERE cust.route_id = 1  -- Replace with desired route_id
GROUP BY cust.customer_id, cust.name, cust.customer_type
ORDER BY contamination_events DESC;

-- Routes ranked by contamination rate
SELECT 
    r.route_code,
    r.description,
    COUNT(DISTINCT p.pickup_id) AS total_pickups,
    COUNT(DISTINCT ce.pickup_id) AS contaminated_pickups,
    ROUND(
        COUNT(DISTINCT ce.pickup_id)::NUMERIC / NULLIF(COUNT(DISTINCT p.pickup_id), 0) * 100, 
        2
    ) AS contamination_rate_pct
FROM routes r
LEFT JOIN pickups p ON r.route_id = p.route_id
LEFT JOIN contamination_events ce ON p.pickup_id = ce.pickup_id
WHERE r.active = TRUE
GROUP BY r.route_id, r.route_code, r.description
ORDER BY contamination_rate_pct DESC NULLS LAST;

-- ============================================================================
-- EDUCATION ACTION QUERIES
-- ============================================================================

-- Customers with education actions
SELECT 
    cust.name,
    cust.customer_type,
    COUNT(ea.action_id) AS action_count,
    STRING_AGG(DISTINCT ea.channel, ', ') AS channels_used,
    MIN(ea.action_date) AS first_action,
    MAX(ea.action_date) AS last_action
FROM customers cust
INNER JOIN education_actions ea ON cust.customer_id = ea.customer_id
GROUP BY cust.customer_id, cust.name, cust.customer_type
ORDER BY action_count DESC;

-- Education actions by channel
SELECT 
    ea.channel,
    COUNT(*) AS action_count,
    COUNT(DISTINCT ea.customer_id) AS unique_customers
FROM education_actions ea
GROUP BY ea.channel
ORDER BY action_count DESC;

