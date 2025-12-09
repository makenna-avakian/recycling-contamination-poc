INSERT INTO pickups (container_id, route_id, pickup_time, weight_kg, driver_name, notes) VALUES
-- Day 1 (7 days ago) - Lower contamination baseline
(1, 1, NOW() - INTERVAL '7 days' + INTERVAL '8 hours', 12.5, 'John Smith', 'Regular pickup'),
(2, 1, NOW() - INTERVAL '7 days' + INTERVAL '9 hours', 8.3, 'John Smith', NULL),
(4, 2, NOW() - INTERVAL '7 days' + INTERVAL '10 hours', 15.2, 'Mike Johnson', NULL),
(7, 3, NOW() - INTERVAL '7 days' + INTERVAL '11 hours', 9.8, 'Sarah Williams', NULL),
(10, 4, NOW() - INTERVAL '7 days' + INTERVAL '12 hours', 11.4, 'Tom Brown', NULL),
(13, 5, NOW() - INTERVAL '7 days' + INTERVAL '13 hours', 14.6, 'Lisa Davis', NULL),
(16, 6, NOW() - INTERVAL '7 days' + INTERVAL '14 hours', 10.2, 'David Wilson', NULL),

-- Day 2 (6 days ago) - Slight increase
(1, 1, NOW() - INTERVAL '6 days' + INTERVAL '8 hours', 13.1, 'John Smith', NULL),
(3, 1, NOW() - INTERVAL '6 days' + INTERVAL '9 hours', 9.5, 'John Smith', NULL),
(5, 2, NOW() - INTERVAL '6 days' + INTERVAL '10 hours', 16.8, 'Mike Johnson', NULL),
(8, 3, NOW() - INTERVAL '6 days' + INTERVAL '11 hours', 10.3, 'Sarah Williams', NULL),
(11, 4, NOW() - INTERVAL '6 days' + INTERVAL '12 hours', 12.1, 'Tom Brown', NULL),
(14, 5, NOW() - INTERVAL '6 days' + INTERVAL '13 hours', 15.9, 'Lisa Davis', NULL),
(17, 6, NOW() - INTERVAL '6 days' + INTERVAL '14 hours', 11.7, 'David Wilson', NULL),

-- Day 3 (5 days ago) - Continued increase
(2, 1, NOW() - INTERVAL '5 days' + INTERVAL '8 hours', 8.9, 'John Smith', NULL),
(4, 2, NOW() - INTERVAL '5 days' + INTERVAL '9 hours', 15.6, 'Mike Johnson', NULL),
(6, 2, NOW() - INTERVAL '5 days' + INTERVAL '10 hours', 7.2, 'Mike Johnson', NULL),
(9, 3, NOW() - INTERVAL '5 days' + INTERVAL '11 hours', 11.4, 'Sarah Williams', NULL),
(12, 4, NOW() - INTERVAL '5 days' + INTERVAL '12 hours', 13.8, 'Tom Brown', NULL),
(15, 5, NOW() - INTERVAL '5 days' + INTERVAL '13 hours', 16.2, 'Lisa Davis', NULL),
(18, 6, NOW() - INTERVAL '5 days' + INTERVAL '14 hours', 9.5, 'David Wilson', NULL),
(19, 6, NOW() - INTERVAL '5 days' + INTERVAL '15 hours', 12.3, 'David Wilson', NULL),

-- Day 4 (4 days ago) - Moderate increase
(1, 1, NOW() - INTERVAL '4 days' + INTERVAL '8 hours', 13.8, 'John Smith', NULL),
(3, 1, NOW() - INTERVAL '4 days' + INTERVAL '9 hours', 10.2, 'John Smith', NULL),
(5, 2, NOW() - INTERVAL '4 days' + INTERVAL '10 hours', 17.5, 'Mike Johnson', NULL),
(7, 3, NOW() - INTERVAL '4 days' + INTERVAL '11 hours', 10.9, 'Sarah Williams', NULL),
(10, 4, NOW() - INTERVAL '4 days' + INTERVAL '12 hours', 12.7, 'Tom Brown', NULL),
(13, 5, NOW() - INTERVAL '4 days' + INTERVAL '13 hours', 16.8, 'Lisa Davis', NULL),
(16, 6, NOW() - INTERVAL '4 days' + INTERVAL '14 hours', 11.2, 'David Wilson', NULL),
(20, 1, NOW() - INTERVAL '4 days' + INTERVAL '15 hours', 14.1, 'John Smith', NULL),

-- Day 5 (3 days ago) - Continued moderate increase
(2, 1, NOW() - INTERVAL '3 days' + INTERVAL '8 hours', 9.6, 'John Smith', NULL),
(4, 2, NOW() - INTERVAL '3 days' + INTERVAL '9 hours', 16.3, 'Mike Johnson', NULL),
(6, 2, NOW() - INTERVAL '3 days' + INTERVAL '10 hours', 8.1, 'Mike Johnson', NULL),
(8, 3, NOW() - INTERVAL '3 days' + INTERVAL '11 hours', 11.8, 'Sarah Williams', NULL),
(11, 4, NOW() - INTERVAL '3 days' + INTERVAL '12 hours', 13.4, 'Tom Brown', NULL),
(14, 5, NOW() - INTERVAL '3 days' + INTERVAL '13 hours', 17.2, 'Lisa Davis', NULL),
(17, 6, NOW() - INTERVAL '3 days' + INTERVAL '14 hours', 12.5, 'David Wilson', NULL),
(19, 6, NOW() - INTERVAL '3 days' + INTERVAL '15 hours', 13.1, 'David Wilson', NULL),
(21, 2, NOW() - INTERVAL '3 days' + INTERVAL '16 hours', 15.7, 'Mike Johnson', NULL),

-- Day 6 (2 days ago) - Higher contamination
(1, 1, NOW() - INTERVAL '2 days' + INTERVAL '8 hours', 14.5, 'John Smith', NULL),
(3, 1, NOW() - INTERVAL '2 days' + INTERVAL '9 hours', 10.8, 'John Smith', NULL),
(5, 2, NOW() - INTERVAL '2 days' + INTERVAL '10 hours', 18.2, 'Mike Johnson', NULL),
(7, 3, NOW() - INTERVAL '2 days' + INTERVAL '11 hours', 11.6, 'Sarah Williams', NULL),
(9, 3, NOW() - INTERVAL '2 days' + INTERVAL '12 hours', 12.3, 'Sarah Williams', NULL),
(12, 4, NOW() - INTERVAL '2 days' + INTERVAL '13 hours', 14.1, 'Tom Brown', NULL),
(15, 5, NOW() - INTERVAL '2 days' + INTERVAL '14 hours', 18.5, 'Lisa Davis', NULL),
(18, 6, NOW() - INTERVAL '2 days' + INTERVAL '15 hours', 10.4, 'David Wilson', NULL),
(20, 1, NOW() - INTERVAL '2 days' + INTERVAL '16 hours', 15.2, 'John Smith', NULL),
(22, 3, NOW() - INTERVAL '2 days' + INTERVAL '17 hours', 13.8, 'Sarah Williams', NULL),

-- Day 7 (today/yesterday) - Highest contamination
(2, 1, NOW() - INTERVAL '1 day' + INTERVAL '8 hours', 10.2, 'John Smith', NULL),
(4, 2, NOW() - INTERVAL '1 day' + INTERVAL '9 hours', 17.1, 'Mike Johnson', NULL),
(6, 2, NOW() - INTERVAL '1 day' + INTERVAL '10 hours', 8.9, 'Mike Johnson', NULL),
(8, 3, NOW() - INTERVAL '1 day' + INTERVAL '11 hours', 12.5, 'Sarah Williams', NULL),
(10, 4, NOW() - INTERVAL '1 day' + INTERVAL '12 hours', 13.9, 'Tom Brown', NULL),
(11, 4, NOW() - INTERVAL '1 day' + INTERVAL '13 hours', 14.6, 'Tom Brown', NULL),
(13, 5, NOW() - INTERVAL '1 day' + INTERVAL '14 hours', 19.1, 'Lisa Davis', NULL),
(16, 6, NOW() - INTERVAL '1 day' + INTERVAL '15 hours', 12.8, 'David Wilson', NULL),
(17, 6, NOW() - INTERVAL '1 day' + INTERVAL '16 hours', 13.7, 'David Wilson', NULL),
(19, 6, NOW() - INTERVAL '1 day' + INTERVAL '17 hours', 14.2, 'David Wilson', NULL),
(21, 2, NOW() - INTERVAL '1 day' + INTERVAL '18 hours', 16.8, 'Mike Johnson', NULL),
(23, 4, NOW() - INTERVAL '1 day' + INTERVAL '19 hours', 15.3, 'Tom Brown', NULL);

-- Now add contamination events for these pickups
-- Pattern: Fewer events in early days, more events in recent days
-- Day 1 (7 days ago) - Baseline: 7 pickups, 3 contamination events
INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes)
SELECT p.pickup_id, 
       CASE ROW_NUMBER() OVER (ORDER BY p.pickup_id)
         WHEN 1 THEN 1 -- PLASTIC_BAG
         WHEN 2 THEN 2 -- FOOD_WASTE
         WHEN 3 THEN 3 -- FOAM
         ELSE 1
       END,
       CASE ROW_NUMBER() OVER (ORDER BY p.pickup_id)
         WHEN 1 THEN 2
         WHEN 2 THEN 3
         WHEN 3 THEN 2
         ELSE 2
       END,
       CASE ROW_NUMBER() OVER (ORDER BY p.pickup_id)
         WHEN 1 THEN 18.5
         WHEN 2 THEN 22.0
         WHEN 3 THEN 20.0
         ELSE 19.0
       END,
       'Baseline contamination'
FROM pickups p
WHERE p.pickup_time >= NOW() - INTERVAL '7 days' 
  AND p.pickup_time < NOW() - INTERVAL '6 days'
ORDER BY p.pickup_id
LIMIT 3;

-- Day 2 (6 days ago) - Slight increase: 7 pickups, 4 contamination events
INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes)
SELECT p.pickup_id, 
       CASE (ROW_NUMBER() OVER (ORDER BY p.pickup_id) - 1) % 8 + 1
         WHEN 1 THEN 1 WHEN 2 THEN 2 WHEN 3 THEN 3 WHEN 4 THEN 4
         WHEN 5 THEN 5 WHEN 6 THEN 6 WHEN 7 THEN 7 ELSE 8
       END,
       CASE ROW_NUMBER() OVER (ORDER BY p.pickup_id)
         WHEN 1 THEN 2 WHEN 2 THEN 3 WHEN 3 THEN 2 WHEN 4 THEN 3
         ELSE 2
       END,
       CASE ROW_NUMBER() OVER (ORDER BY p.pickup_id)
         WHEN 1 THEN 20.0 WHEN 2 THEN 24.5 WHEN 3 THEN 22.0 WHEN 4 THEN 26.0
         ELSE 23.0
       END,
       'Slight increase'
FROM pickups p
WHERE p.pickup_time >= NOW() - INTERVAL '6 days' 
  AND p.pickup_time < NOW() - INTERVAL '5 days'
ORDER BY p.pickup_id
LIMIT 4;

-- Day 3 (5 days ago) - Continued increase: 8 pickups, 5 contamination events
INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes)
SELECT p.pickup_id, 
       CASE (ROW_NUMBER() OVER (ORDER BY p.pickup_id) - 1) % 8 + 1
         WHEN 1 THEN 1 WHEN 2 THEN 2 WHEN 3 THEN 3 WHEN 4 THEN 4
         WHEN 5 THEN 5 WHEN 6 THEN 6 WHEN 7 THEN 7 ELSE 8
       END,
       CASE ROW_NUMBER() OVER (ORDER BY p.pickup_id)
         WHEN 1 THEN 3 WHEN 2 THEN 2 WHEN 3 THEN 4 WHEN 4 THEN 3 WHEN 5 THEN 2
         ELSE 3
       END,
       CASE ROW_NUMBER() OVER (ORDER BY p.pickup_id)
         WHEN 1 THEN 25.0 WHEN 2 THEN 22.5 WHEN 3 THEN 28.0 WHEN 4 THEN 24.0 WHEN 5 THEN 26.5
         ELSE 25.0
       END,
       'Increasing trend'
FROM pickups p
WHERE p.pickup_time >= NOW() - INTERVAL '5 days' 
  AND p.pickup_time < NOW() - INTERVAL '4 days'
ORDER BY p.pickup_id
LIMIT 5;

-- Day 4 (4 days ago) - Moderate increase: 8 pickups, 6 contamination events
INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes)
SELECT p.pickup_id, 
       CASE (ROW_NUMBER() OVER (ORDER BY p.pickup_id) - 1) % 8 + 1
         WHEN 1 THEN 1 WHEN 2 THEN 2 WHEN 3 THEN 3 WHEN 4 THEN 4
         WHEN 5 THEN 5 WHEN 6 THEN 6 WHEN 7 THEN 7 ELSE 8
       END,
       CASE ROW_NUMBER() OVER (ORDER BY p.pickup_id)
         WHEN 1 THEN 3 WHEN 2 THEN 4 WHEN 3 THEN 3 WHEN 4 THEN 4 WHEN 5 THEN 3 WHEN 6 THEN 4
         ELSE 3
       END,
       CASE ROW_NUMBER() OVER (ORDER BY p.pickup_id)
         WHEN 1 THEN 28.0 WHEN 2 THEN 30.5 WHEN 3 THEN 27.0 WHEN 4 THEN 32.0 WHEN 5 THEN 29.5 WHEN 6 THEN 31.0
         ELSE 29.0
       END,
       'Moderate contamination'
FROM pickups p
WHERE p.pickup_time >= NOW() - INTERVAL '4 days' 
  AND p.pickup_time < NOW() - INTERVAL '3 days'
ORDER BY p.pickup_id
LIMIT 6;

-- Day 5 (3 days ago) - Continued moderate increase: 9 pickups, 7 contamination events
INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes)
SELECT p.pickup_id, 
       CASE (ROW_NUMBER() OVER (ORDER BY p.pickup_id) - 1) % 8 + 1
         WHEN 1 THEN 1 WHEN 2 THEN 2 WHEN 3 THEN 3 WHEN 4 THEN 4
         WHEN 5 THEN 5 WHEN 6 THEN 6 WHEN 7 THEN 7 ELSE 8
       END,
       CASE ROW_NUMBER() OVER (ORDER BY p.pickup_id)
         WHEN 1 THEN 3 WHEN 2 THEN 4 WHEN 3 THEN 3 WHEN 4 THEN 4 WHEN 5 THEN 3 WHEN 6 THEN 4 WHEN 7 THEN 3
         ELSE 3
       END,
       CASE ROW_NUMBER() OVER (ORDER BY p.pickup_id)
         WHEN 1 THEN 32.0 WHEN 2 THEN 35.0 WHEN 3 THEN 30.5 WHEN 4 THEN 37.5 WHEN 5 THEN 33.0 WHEN 6 THEN 36.0 WHEN 7 THEN 34.5
         ELSE 33.0
       END,
       'Elevated contamination'
FROM pickups p
WHERE p.pickup_time >= NOW() - INTERVAL '3 days' 
  AND p.pickup_time < NOW() - INTERVAL '2 days'
ORDER BY p.pickup_id
LIMIT 7;

-- Day 6 (2 days ago) - Higher contamination: 10 pickups, 8 contamination events
INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes)
SELECT p.pickup_id, 
       CASE (ROW_NUMBER() OVER (ORDER BY p.pickup_id) - 1) % 8 + 1
         WHEN 1 THEN 1 WHEN 2 THEN 2 WHEN 3 THEN 3 WHEN 4 THEN 4
         WHEN 5 THEN 5 WHEN 6 THEN 6 WHEN 7 THEN 7 ELSE 8
       END,
       CASE ROW_NUMBER() OVER (ORDER BY p.pickup_id)
         WHEN 1 THEN 4 WHEN 2 THEN 3 WHEN 3 THEN 4 WHEN 4 THEN 4 WHEN 5 THEN 3 WHEN 6 THEN 4 WHEN 7 THEN 4 WHEN 8 THEN 3
         ELSE 4
       END,
       CASE ROW_NUMBER() OVER (ORDER BY p.pickup_id)
         WHEN 1 THEN 38.0 WHEN 2 THEN 35.5 WHEN 3 THEN 40.0 WHEN 4 THEN 37.0 WHEN 5 THEN 39.5 WHEN 6 THEN 41.0 WHEN 7 THEN 38.5 WHEN 8 THEN 36.5
         ELSE 38.0
       END,
       'High contamination level'
FROM pickups p
WHERE p.pickup_time >= NOW() - INTERVAL '2 days' 
  AND p.pickup_time < NOW() - INTERVAL '1 day'
ORDER BY p.pickup_id
LIMIT 8;

-- Day 7 (today/yesterday) - Highest contamination: 12 pickups, 10 contamination events
INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes)
SELECT p.pickup_id, 
       CASE (ROW_NUMBER() OVER (ORDER BY p.pickup_id) - 1) % 8 + 1
         WHEN 1 THEN 1 WHEN 2 THEN 2 WHEN 3 THEN 3 WHEN 4 THEN 4
         WHEN 5 THEN 5 WHEN 6 THEN 6 WHEN 7 THEN 7 ELSE 8
       END,
       CASE ROW_NUMBER() OVER (ORDER BY p.pickup_id)
         WHEN 1 THEN 4 WHEN 2 THEN 5 WHEN 3 THEN 4 WHEN 4 THEN 5 WHEN 5 THEN 4 WHEN 6 THEN 5 WHEN 7 THEN 4 WHEN 8 THEN 5 WHEN 9 THEN 4 WHEN 10 THEN 5
         ELSE 4
       END,
       CASE ROW_NUMBER() OVER (ORDER BY p.pickup_id)
         WHEN 1 THEN 42.0 WHEN 2 THEN 45.5 WHEN 3 THEN 40.0 WHEN 4 THEN 48.0 WHEN 5 THEN 43.5 WHEN 6 THEN 46.0 WHEN 7 THEN 41.5 WHEN 8 THEN 47.0 WHEN 9 THEN 44.0 WHEN 10 THEN 49.0
         ELSE 45.0
       END,
       'Peak contamination - requires attention'
FROM pickups p
WHERE p.pickup_time >= NOW() - INTERVAL '1 day'
ORDER BY p.pickup_id
LIMIT 10;

-- Summary:
-- Day 1: 7 pickups, 3 contamination events (~0.43 events/pickup)
-- Day 2: 7 pickups, 4 contamination events (~0.57 events/pickup)
-- Day 3: 8 pickups, 5 contamination events (~0.63 events/pickup)
-- Day 4: 8 pickups, 6 contamination events (~0.75 events/pickup)
-- Day 5: 9 pickups, 7 contamination events (~0.78 events/pickup)
-- Day 6: 10 pickups, 8 contamination events (~0.80 events/pickup)
-- Day 7: 12 pickups, 10 contamination events (~0.83 events/pickup)
--
-- This creates a clear increasing trend: from ~3 events/day to ~10 events/day
-- Average events per day increases from ~3.5 (first 3 days) to ~8.3 (last 3 days)
-- That's approximately a 137% increase, which should show up clearly in the dashboard

-- ============================================================================
-- ADDITIONAL DATA TO TRIGGER SPECIFIC ALERTS
-- ============================================================================

-- 1. Add more plastic bag contamination events to trigger "Focus on Plastic bags and film"
-- We need PLASTIC_BAG (category_id = 1) to be the top category in the last 30 days
-- Adding more plastic bag events across multiple days

-- Add plastic bag contamination events for the past 30 days
INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes)
SELECT p.pickup_id, 
       1, -- PLASTIC_BAG category
       3 + (ROW_NUMBER() OVER (ORDER BY p.pickup_time) % 3), -- Severity 3-5
       25.0 + ((ROW_NUMBER() OVER (ORDER BY p.pickup_time) % 20) * 1.5), -- 25-55%
       'Plastic bags and film contamination'
FROM pickups p
WHERE p.pickup_time >= NOW() - INTERVAL '30 days'
  AND p.pickup_time < NOW() - INTERVAL '7 days'
  AND NOT EXISTS (
    SELECT 1 FROM contamination_events ce 
    WHERE ce.pickup_id = p.pickup_id 
    AND ce.category_id = 1
  )
ORDER BY p.pickup_time
LIMIT 50; -- Add 50 plastic bag events to ensure it's the top category

-- 2. Add more historical data (14+ days) to ensure SARIMA model can detect trend
-- Add pickups and contamination events going back 30-90 days to build a strong trend pattern
-- This ensures the "Overall Contamination Trend Alert" is triggered

-- Add pickups for days 8-30 (to build historical trend)
WITH day_series AS (
    SELECT generate_series(8, 30) as day_offset
),
container_cycle AS (
    SELECT (ROW_NUMBER() OVER (ORDER BY ds.day_offset, c.container_id) % 32) + 1 as container_id,
           ds.day_offset
    FROM day_series ds
    CROSS JOIN (SELECT container_id FROM containers LIMIT 32) c
    ORDER BY ds.day_offset, c.container_id
    LIMIT 150
)
INSERT INTO pickups (container_id, route_id, pickup_time, weight_kg, driver_name, notes)
SELECT 
    cc.container_id,
    CASE (cc.container_id % 6)
        WHEN 0 THEN 1 WHEN 1 THEN 2 WHEN 2 THEN 3 
        WHEN 3 THEN 4 WHEN 4 THEN 5 ELSE 6
    END as route_id,
    NOW() - INTERVAL '30 days' + (cc.day_offset * INTERVAL '1 day') + ((cc.container_id % 12) * INTERVAL '1 hour'),
    10.0 + (cc.container_id % 10) * 0.5,
    CASE (cc.container_id % 5)
        WHEN 0 THEN 'John Smith'
        WHEN 1 THEN 'Mike Johnson'
        WHEN 2 THEN 'Sarah Williams'
        WHEN 3 THEN 'Tom Brown'
        ELSE 'Lisa Davis'
    END,
    NULL
FROM container_cycle cc
WHERE NOT EXISTS (
    SELECT 1 FROM pickups p2 
    WHERE p2.container_id = cc.container_id
    AND p2.pickup_time::date = (NOW() - INTERVAL '30 days' + (cc.day_offset * INTERVAL '1 day'))::date
);

-- Add contamination events for these historical pickups with increasing trend
-- Fewer events in older days, more in recent days (but still less than the last 7 days)
WITH pickup_ranked AS (
    SELECT p.pickup_id,
           p.pickup_time,
           ROW_NUMBER() OVER (PARTITION BY DATE(p.pickup_time) ORDER BY p.pickup_id) as day_rank,
           CASE 
             WHEN p.pickup_time >= NOW() - INTERVAL '14 days' THEN 4 -- 4 events/day for days 8-14
             WHEN p.pickup_time >= NOW() - INTERVAL '21 days' THEN 3 -- 3 events/day for days 15-21
             ELSE 2 -- 2 events/day for days 22-30
           END as max_events_per_day
    FROM pickups p
    WHERE p.pickup_time >= NOW() - INTERVAL '30 days'
      AND p.pickup_time < NOW() - INTERVAL '7 days'
      AND NOT EXISTS (
        SELECT 1 FROM contamination_events ce WHERE ce.pickup_id = p.pickup_id
      )
)
INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes)
SELECT pr.pickup_id,
       CASE (pr.day_rank % 8) + 1
           WHEN 1 THEN 1 -- PLASTIC_BAG (most common)
           WHEN 2 THEN 2 -- FOOD_WASTE
           WHEN 3 THEN 3 -- FOAM
           WHEN 4 THEN 4 -- ELECTRONICS
           WHEN 5 THEN 5 -- HAZARDOUS
           WHEN 6 THEN 6 -- TEXTILES
           WHEN 7 THEN 7 -- GLASS_BROKEN
           ELSE 8 -- DIRTY_CONTAINERS
       END,
       2 + (pr.day_rank % 3),
       15.0 + (pr.day_rank % 15),
       'Historical contamination data'
FROM pickup_ranked pr
WHERE pr.day_rank <= pr.max_events_per_day
ORDER BY pr.pickup_time, pr.pickup_id;

-- 3. Ensure we have enough plastic bag events specifically in recent days
-- Add more plastic bag events to the recent 7 days to make it clearly the top category
INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes)
SELECT p.pickup_id,
       1, -- PLASTIC_BAG
       3 + (ROW_NUMBER() OVER (ORDER BY p.pickup_time) % 2), -- Severity 3-4
       30.0 + (ROW_NUMBER() OVER (ORDER BY p.pickup_time) % 20), -- 30-50%
       'Plastic bags and film - recent increase'
FROM pickups p
WHERE p.pickup_time >= NOW() - INTERVAL '7 days'
  AND NOT EXISTS (
    SELECT 1 FROM contamination_events ce 
    WHERE ce.pickup_id = p.pickup_id 
    AND ce.category_id = 1
  )
ORDER BY p.pickup_time
LIMIT 15; -- Add 15 more plastic bag events to recent days

-- Summary of additional data:
-- - 50+ plastic bag events over last 30 days (ensures "Focus on Plastic bags and film" alert)
-- - 150+ historical pickups (days 8-30) to build trend pattern
-- - 80+ historical contamination events with increasing pattern
-- - 15+ additional plastic bag events in recent 7 days
-- This should trigger both:
--   1. "Overall Contamination Trend Alert" (SARIMA detects increasing trend)
--   2. "Focus on Plastic bags and film" (PLASTIC_BAG is top category)

