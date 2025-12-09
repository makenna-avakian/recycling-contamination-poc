-- Additional seed data showing increasing trend in plastic bags and film contamination over time
-- This data spans 12 weeks, showing a clear upward trend in plastic bag contamination
--
-- To run this file:
--   psql recycling_contamination -f db/add_plastic_bag_trend.sql
--
-- This script adds:
--   - Pickups spanning 12 weeks (going back 84 days from current date)
--   - Contamination events for plastic bags and film (category_id = 1) showing:
--     * Week 12: 2 events, severity 2, ~8.5% contamination
--     * Week 11: 3 events, severity 2, ~10% contamination  
--     * Week 10: 4 events, severity 2, ~11.5% contamination
--     * Week 9: 6 events, severity 3, ~15% contamination
--     * Week 8: 8 events, severity 3, ~16.5% contamination
--     * Week 7: 10 events, severity 3, ~18% contamination
--     * Week 6: 12 events, severity 3, ~19.5% contamination
--     * Week 5: 14 events, severity 4, ~22% contamination
--     * Week 4: 18 events, severity 4, ~24.5% contamination
--     * Week 3: 5 events, severity 5, ~28% contamination
--     * Week 2: 8 events, severity 5, ~32% contamination
--     * Week 1: 10 events, severity 5, ~35% contamination
--   This creates a clear upward trend in both frequency and severity over time

-- Add pickups over the past 12 weeks (going back further than the original seed data)
INSERT INTO pickups (container_id, route_id, pickup_time, weight_kg, driver_name, notes) VALUES
    -- Week 12 (12 weeks ago) - Start of trend
    (1, 1, (CURRENT_DATE - INTERVAL '84 days')::date + TIME '08:30:00', 12.5, 'Mike Rodriguez', NULL),
    (3, 1, (CURRENT_DATE - INTERVAL '84 days')::date + TIME '09:15:00', 13.2, 'Mike Rodriguez', NULL),
    (6, 2, (CURRENT_DATE - INTERVAL '83 days')::date + TIME '07:45:00', 14.1, 'Sarah Johnson', NULL),
    (9, 3, (CURRENT_DATE - INTERVAL '82 days')::date + TIME '08:30:00', 15.3, 'Carlos Mendez', NULL),
    (12, 5, (CURRENT_DATE - INTERVAL '81 days')::date + TIME '09:15:00', 11.8, 'David Kim', NULL),
    (20, 4, (CURRENT_DATE - INTERVAL '80 days')::date + TIME '08:00:00', 17.2, 'James Lee', NULL),
    (28, 6, (CURRENT_DATE - INTERVAL '79 days')::date + TIME '07:30:00', 14.5, 'Lisa Wang', NULL),
    
    -- Week 11 (11 weeks ago)
    (1, 1, (CURRENT_DATE - INTERVAL '77 days')::date + TIME '08:30:00', 12.8, 'Mike Rodriguez', NULL),
    (4, 1, (CURRENT_DATE - INTERVAL '77 days')::date + TIME '09:20:00', 16.5, 'Mike Rodriguez', NULL),
    (6, 2, (CURRENT_DATE - INTERVAL '76 days')::date + TIME '07:45:00', 14.3, 'Sarah Johnson', NULL),
    (8, 2, (CURRENT_DATE - INTERVAL '76 days')::date + TIME '08:10:00', 11.8, 'Sarah Johnson', NULL),
    (10, 3, (CURRENT_DATE - INTERVAL '75 days')::date + TIME '08:45:00', 8.5, 'Carlos Mendez', NULL),
    (21, 4, (CURRENT_DATE - INTERVAL '74 days')::date + TIME '08:15:00', 20.1, 'James Lee', NULL),
    (26, 5, (CURRENT_DATE - INTERVAL '73 days')::date + TIME '09:00:00', 12.9, 'David Kim', NULL),
    (30, 6, (CURRENT_DATE - INTERVAL '72 days')::date + TIME '07:45:00', 11.8, 'Lisa Wang', NULL),
    
    -- Week 10 (10 weeks ago)
    (1, 1, (CURRENT_DATE - INTERVAL '70 days')::date + TIME '08:30:00', 13.1, 'Mike Rodriguez', NULL),
    (2, 1, (CURRENT_DATE - INTERVAL '70 days')::date + TIME '08:35:00', 8.5, 'Mike Rodriguez', NULL),
    (3, 1, (CURRENT_DATE - INTERVAL '70 days')::date + TIME '09:15:00', 14.2, 'Mike Rodriguez', NULL),
    (6, 2, (CURRENT_DATE - INTERVAL '69 days')::date + TIME '07:45:00', 14.8, 'Sarah Johnson', NULL),
    (7, 2, (CURRENT_DATE - INTERVAL '69 days')::date + TIME '08:00:00', 9.8, 'Sarah Johnson', NULL),
    (9, 3, (CURRENT_DATE - INTERVAL '68 days')::date + TIME '08:30:00', 15.1, 'Carlos Mendez', NULL),
    (11, 3, (CURRENT_DATE - INTERVAL '68 days')::date + TIME '09:00:00', 12.8, 'Carlos Mendez', NULL),
    (20, 4, (CURRENT_DATE - INTERVAL '67 days')::date + TIME '08:00:00', 17.8, 'James Lee', NULL),
    (22, 4, (CURRENT_DATE - INTERVAL '67 days')::date + TIME '08:30:00', 11.2, 'James Lee', NULL),
    (12, 5, (CURRENT_DATE - INTERVAL '66 days')::date + TIME '09:15:00', 12.1, 'David Kim', NULL),
    (25, 5, (CURRENT_DATE - INTERVAL '66 days')::date + TIME '09:45:00', 14.8, 'David Kim', NULL),
    (28, 6, (CURRENT_DATE - INTERVAL '65 days')::date + TIME '07:30:00', 14.2, 'Lisa Wang', NULL),
    (29, 6, (CURRENT_DATE - INTERVAL '65 days')::date + TIME '07:45:00', 12.1, 'Lisa Wang', NULL),
    
    -- Week 9 (9 weeks ago)
    (1, 1, (CURRENT_DATE - INTERVAL '63 days')::date + TIME '08:30:00', 13.5, 'Mike Rodriguez', NULL),
    (4, 1, (CURRENT_DATE - INTERVAL '63 days')::date + TIME '09:20:00', 17.1, 'Mike Rodriguez', NULL),
    (5, 1, (CURRENT_DATE - INTERVAL '63 days')::date + TIME '09:25:00', 9.8, 'Mike Rodriguez', NULL),
    (6, 2, (CURRENT_DATE - INTERVAL '62 days')::date + TIME '07:45:00', 15.2, 'Sarah Johnson', NULL),
    (8, 2, (CURRENT_DATE - INTERVAL '62 days')::date + TIME '08:10:00', 12.1, 'Sarah Johnson', NULL),
    (14, 2, (CURRENT_DATE - INTERVAL '62 days')::date + TIME '08:20:00', 16.8, 'Sarah Johnson', NULL),
    (9, 3, (CURRENT_DATE - INTERVAL '61 days')::date + TIME '08:30:00', 15.5, 'Carlos Mendez', NULL),
    (17, 3, (CURRENT_DATE - INTERVAL '61 days')::date + TIME '09:15:00', 18.5, 'Carlos Mendez', NULL),
    (18, 3, (CURRENT_DATE - INTERVAL '61 days')::date + TIME '09:30:00', 14.2, 'Carlos Mendez', NULL),
    (21, 4, (CURRENT_DATE - INTERVAL '60 days')::date + TIME '08:15:00', 21.2, 'James Lee', NULL),
    (23, 4, (CURRENT_DATE - INTERVAL '60 days')::date + TIME '08:45:00', 13.5, 'James Lee', NULL),
    (12, 5, (CURRENT_DATE - INTERVAL '59 days')::date + TIME '09:15:00', 12.5, 'David Kim', NULL),
    (13, 5, (CURRENT_DATE - INTERVAL '59 days')::date + TIME '09:30:00', 18.8, 'David Kim', NULL),
    (26, 5, (CURRENT_DATE - INTERVAL '59 days')::date + TIME '10:00:00', 11.2, 'David Kim', NULL),
    (28, 6, (CURRENT_DATE - INTERVAL '58 days')::date + TIME '07:30:00', 14.8, 'Lisa Wang', NULL),
    (30, 6, (CURRENT_DATE - INTERVAL '58 days')::date + TIME '08:00:00', 12.5, 'Lisa Wang', NULL),
    (31, 6, (CURRENT_DATE - INTERVAL '58 days')::date + TIME '08:15:00', 16.5, 'Lisa Wang', NULL),
    
    -- Week 8 (8 weeks ago)
    (1, 1, (CURRENT_DATE - INTERVAL '56 days')::date + TIME '08:30:00', 13.8, 'Mike Rodriguez', NULL),
    (2, 1, (CURRENT_DATE - INTERVAL '56 days')::date + TIME '08:35:00', 8.8, 'Mike Rodriguez', NULL),
    (3, 1, (CURRENT_DATE - INTERVAL '56 days')::date + TIME '09:15:00', 14.5, 'Mike Rodriguez', NULL),
    (4, 1, (CURRENT_DATE - INTERVAL '56 days')::date + TIME '09:20:00', 17.5, 'Mike Rodriguez', NULL),
    (11, 1, (CURRENT_DATE - INTERVAL '56 days')::date + TIME '09:30:00', 15.8, 'Mike Rodriguez', NULL),
    (6, 2, (CURRENT_DATE - INTERVAL '55 days')::date + TIME '07:45:00', 15.5, 'Sarah Johnson', NULL),
    (7, 2, (CURRENT_DATE - INTERVAL '55 days')::date + TIME '08:00:00', 10.1, 'Sarah Johnson', NULL),
    (15, 2, (CURRENT_DATE - INTERVAL '55 days')::date + TIME '08:30:00', 13.2, 'Sarah Johnson', NULL),
    (16, 2, (CURRENT_DATE - INTERVAL '55 days')::date + TIME '08:35:00', 11.5, 'Sarah Johnson', NULL),
    (9, 3, (CURRENT_DATE - INTERVAL '54 days')::date + TIME '08:30:00', 15.8, 'Carlos Mendez', NULL),
    (10, 3, (CURRENT_DATE - INTERVAL '54 days')::date + TIME '08:45:00', 8.2, 'Carlos Mendez', NULL),
    (19, 3, (CURRENT_DATE - INTERVAL '54 days')::date + TIME '09:45:00', 12.8, 'Carlos Mendez', NULL),
    (20, 4, (CURRENT_DATE - INTERVAL '53 days')::date + TIME '08:00:00', 18.2, 'James Lee', NULL),
    (21, 4, (CURRENT_DATE - INTERVAL '53 days')::date + TIME '08:15:00', 21.8, 'James Lee', NULL),
    (22, 4, (CURRENT_DATE - INTERVAL '53 days')::date + TIME '08:30:00', 11.5, 'James Lee', NULL),
    (24, 4, (CURRENT_DATE - INTERVAL '53 days')::date + TIME '08:45:00', 10.8, 'James Lee', NULL),
    (12, 5, (CURRENT_DATE - INTERVAL '52 days')::date + TIME '09:15:00', 12.8, 'David Kim', NULL),
    (25, 5, (CURRENT_DATE - INTERVAL '52 days')::date + TIME '09:45:00', 15.1, 'David Kim', NULL),
    (27, 5, (CURRENT_DATE - INTERVAL '52 days')::date + TIME '10:15:00', 13.5, 'David Kim', NULL),
    (28, 6, (CURRENT_DATE - INTERVAL '51 days')::date + TIME '07:30:00', 15.1, 'Lisa Wang', NULL),
    (29, 6, (CURRENT_DATE - INTERVAL '51 days')::date + TIME '07:45:00', 12.5, 'Lisa Wang', NULL),
    (32, 6, (CURRENT_DATE - INTERVAL '51 days')::date + TIME '08:30:00', 16.8, 'Lisa Wang', NULL),
    
    -- Week 7 (7 weeks ago)
    (1, 1, (CURRENT_DATE - INTERVAL '49 days')::date + TIME '08:30:00', 14.1, 'Mike Rodriguez', NULL),
    (3, 1, (CURRENT_DATE - INTERVAL '49 days')::date + TIME '09:15:00', 14.8, 'Mike Rodriguez', NULL),
    (5, 1, (CURRENT_DATE - INTERVAL '49 days')::date + TIME '09:25:00', 10.2, 'Mike Rodriguez', NULL),
    (13, 1, (CURRENT_DATE - INTERVAL '49 days')::date + TIME '09:35:00', 17.5, 'Mike Rodriguez', NULL),
    (6, 2, (CURRENT_DATE - INTERVAL '48 days')::date + TIME '07:45:00', 15.8, 'Sarah Johnson', NULL),
    (8, 2, (CURRENT_DATE - INTERVAL '48 days')::date + TIME '08:10:00', 12.5, 'Sarah Johnson', NULL),
    (14, 2, (CURRENT_DATE - INTERVAL '48 days')::date + TIME '08:20:00', 17.1, 'Sarah Johnson', NULL),
    (15, 2, (CURRENT_DATE - INTERVAL '48 days')::date + TIME '08:30:00', 13.5, 'Sarah Johnson', NULL),
    (9, 3, (CURRENT_DATE - INTERVAL '47 days')::date + TIME '08:30:00', 16.1, 'Carlos Mendez', NULL),
    (11, 3, (CURRENT_DATE - INTERVAL '47 days')::date + TIME '09:00:00', 13.1, 'Carlos Mendez', NULL),
    (17, 3, (CURRENT_DATE - INTERVAL '47 days')::date + TIME '09:15:00', 19.2, 'Carlos Mendez', NULL),
    (18, 3, (CURRENT_DATE - INTERVAL '47 days')::date + TIME '09:30:00', 14.5, 'Carlos Mendez', NULL),
    (20, 4, (CURRENT_DATE - INTERVAL '46 days')::date + TIME '08:00:00', 18.5, 'James Lee', NULL),
    (21, 4, (CURRENT_DATE - INTERVAL '46 days')::date + TIME '08:15:00', 22.1, 'James Lee', NULL),
    (23, 4, (CURRENT_DATE - INTERVAL '46 days')::date + TIME '08:45:00', 13.8, 'James Lee', NULL),
    (12, 5, (CURRENT_DATE - INTERVAL '45 days')::date + TIME '09:15:00', 13.1, 'David Kim', NULL),
    (13, 5, (CURRENT_DATE - INTERVAL '45 days')::date + TIME '09:30:00', 19.1, 'David Kim', NULL),
    (26, 5, (CURRENT_DATE - INTERVAL '45 days')::date + TIME '10:00:00', 11.5, 'David Kim', NULL),
    (28, 6, (CURRENT_DATE - INTERVAL '44 days')::date + TIME '07:30:00', 15.5, 'Lisa Wang', NULL),
    (30, 6, (CURRENT_DATE - INTERVAL '44 days')::date + TIME '08:00:00', 12.8, 'Lisa Wang', NULL),
    (31, 6, (CURRENT_DATE - INTERVAL '44 days')::date + TIME '08:15:00', 17.2, 'Lisa Wang', NULL),
    
    -- Week 6 (6 weeks ago)
    (1, 1, (CURRENT_DATE - INTERVAL '42 days')::date + TIME '08:30:00', 14.5, 'Mike Rodriguez', NULL),
    (2, 1, (CURRENT_DATE - INTERVAL '42 days')::date + TIME '08:35:00', 9.1, 'Mike Rodriguez', NULL),
    (4, 1, (CURRENT_DATE - INTERVAL '42 days')::date + TIME '09:20:00', 18.1, 'Mike Rodriguez', NULL),
    (11, 1, (CURRENT_DATE - INTERVAL '42 days')::date + TIME '09:30:00', 16.1, 'Mike Rodriguez', NULL),
    (6, 2, (CURRENT_DATE - INTERVAL '41 days')::date + TIME '07:45:00', 16.2, 'Sarah Johnson', NULL),
    (7, 2, (CURRENT_DATE - INTERVAL '41 days')::date + TIME '08:00:00', 10.3, 'Sarah Johnson', NULL),
    (8, 2, (CURRENT_DATE - INTERVAL '41 days')::date + TIME '08:10:00', 12.8, 'Sarah Johnson', NULL),
    (14, 2, (CURRENT_DATE - INTERVAL '41 days')::date + TIME '08:20:00', 17.5, 'Sarah Johnson', NULL),
    (16, 2, (CURRENT_DATE - INTERVAL '41 days')::date + TIME '08:35:00', 11.8, 'Sarah Johnson', NULL),
    (9, 3, (CURRENT_DATE - INTERVAL '40 days')::date + TIME '08:30:00', 16.5, 'Carlos Mendez', NULL),
    (10, 3, (CURRENT_DATE - INTERVAL '40 days')::date + TIME '08:45:00', 8.5, 'Carlos Mendez', NULL),
    (17, 3, (CURRENT_DATE - INTERVAL '40 days')::date + TIME '09:15:00', 19.5, 'Carlos Mendez', NULL),
    (19, 3, (CURRENT_DATE - INTERVAL '40 days')::date + TIME '09:45:00', 13.1, 'Carlos Mendez', NULL),
    (20, 4, (CURRENT_DATE - INTERVAL '39 days')::date + TIME '08:00:00', 18.8, 'James Lee', NULL),
    (21, 4, (CURRENT_DATE - INTERVAL '39 days')::date + TIME '08:15:00', 22.5, 'James Lee', NULL),
    (22, 4, (CURRENT_DATE - INTERVAL '39 days')::date + TIME '08:30:00', 11.8, 'James Lee', NULL),
    (24, 4, (CURRENT_DATE - INTERVAL '39 days')::date + TIME '08:45:00', 11.1, 'James Lee', NULL),
    (12, 5, (CURRENT_DATE - INTERVAL '38 days')::date + TIME '09:15:00', 13.5, 'David Kim', NULL),
    (25, 5, (CURRENT_DATE - INTERVAL '38 days')::date + TIME '09:45:00', 15.5, 'David Kim', NULL),
    (27, 5, (CURRENT_DATE - INTERVAL '38 days')::date + TIME '10:15:00', 13.8, 'David Kim', NULL),
    (28, 6, (CURRENT_DATE - INTERVAL '37 days')::date + TIME '07:30:00', 15.8, 'Lisa Wang', NULL),
    (29, 6, (CURRENT_DATE - INTERVAL '37 days')::date + TIME '07:45:00', 12.8, 'Lisa Wang', NULL),
    (32, 6, (CURRENT_DATE - INTERVAL '37 days')::date + TIME '08:30:00', 17.1, 'Lisa Wang', NULL),
    
    -- Week 5 (5 weeks ago)
    (1, 1, (CURRENT_DATE - INTERVAL '35 days')::date + TIME '08:30:00', 14.8, 'Mike Rodriguez', NULL),
    (3, 1, (CURRENT_DATE - INTERVAL '35 days')::date + TIME '09:15:00', 15.1, 'Mike Rodriguez', NULL),
    (4, 1, (CURRENT_DATE - INTERVAL '35 days')::date + TIME '09:20:00', 18.5, 'Mike Rodriguez', NULL),
    (13, 1, (CURRENT_DATE - INTERVAL '35 days')::date + TIME '09:35:00', 17.8, 'Mike Rodriguez', NULL),
    (6, 2, (CURRENT_DATE - INTERVAL '34 days')::date + TIME '07:45:00', 16.5, 'Sarah Johnson', NULL),
    (8, 2, (CURRENT_DATE - INTERVAL '34 days')::date + TIME '08:10:00', 13.1, 'Sarah Johnson', NULL),
    (14, 2, (CURRENT_DATE - INTERVAL '34 days')::date + TIME '08:20:00', 17.8, 'Sarah Johnson', NULL),
    (15, 2, (CURRENT_DATE - INTERVAL '34 days')::date + TIME '08:30:00', 13.8, 'Sarah Johnson', NULL),
    (9, 3, (CURRENT_DATE - INTERVAL '33 days')::date + TIME '08:30:00', 16.8, 'Carlos Mendez', NULL),
    (11, 3, (CURRENT_DATE - INTERVAL '33 days')::date + TIME '09:00:00', 13.5, 'Carlos Mendez', NULL),
    (17, 3, (CURRENT_DATE - INTERVAL '33 days')::date + TIME '09:15:00', 19.8, 'Carlos Mendez', NULL),
    (18, 3, (CURRENT_DATE - INTERVAL '33 days')::date + TIME '09:30:00', 14.8, 'Carlos Mendez', NULL),
    (20, 4, (CURRENT_DATE - INTERVAL '32 days')::date + TIME '08:00:00', 19.1, 'James Lee', NULL),
    (21, 4, (CURRENT_DATE - INTERVAL '32 days')::date + TIME '08:15:00', 23.1, 'James Lee', NULL),
    (22, 4, (CURRENT_DATE - INTERVAL '32 days')::date + TIME '08:30:00', 12.1, 'James Lee', NULL),
    (12, 5, (CURRENT_DATE - INTERVAL '31 days')::date + TIME '09:15:00', 13.8, 'David Kim', NULL),
    (13, 5, (CURRENT_DATE - INTERVAL '31 days')::date + TIME '09:30:00', 19.5, 'David Kim', NULL),
    (26, 5, (CURRENT_DATE - INTERVAL '31 days')::date + TIME '10:00:00', 11.8, 'David Kim', NULL),
    (28, 6, (CURRENT_DATE - INTERVAL '30 days')::date + TIME '07:30:00', 16.1, 'Lisa Wang', NULL),
    (30, 6, (CURRENT_DATE - INTERVAL '30 days')::date + TIME '08:00:00', 13.1, 'Lisa Wang', NULL),
    (31, 6, (CURRENT_DATE - INTERVAL '30 days')::date + TIME '08:15:00', 17.5, 'Lisa Wang', NULL),
    
    -- Week 4 (4 weeks ago) - Trend continues upward
    (1, 1, (CURRENT_DATE - INTERVAL '28 days')::date + TIME '08:30:00', 15.1, 'Mike Rodriguez', NULL),
    (2, 1, (CURRENT_DATE - INTERVAL '28 days')::date + TIME '08:35:00', 9.5, 'Mike Rodriguez', NULL),
    (3, 1, (CURRENT_DATE - INTERVAL '28 days')::date + TIME '09:15:00', 15.5, 'Mike Rodriguez', NULL),
    (5, 1, (CURRENT_DATE - INTERVAL '28 days')::date + TIME '09:25:00', 10.5, 'Mike Rodriguez', NULL),
    (11, 1, (CURRENT_DATE - INTERVAL '28 days')::date + TIME '09:30:00', 16.5, 'Mike Rodriguez', NULL),
    (6, 2, (CURRENT_DATE - INTERVAL '27 days')::date + TIME '07:45:00', 16.8, 'Sarah Johnson', NULL),
    (7, 2, (CURRENT_DATE - INTERVAL '27 days')::date + TIME '08:00:00', 10.5, 'Sarah Johnson', NULL),
    (8, 2, (CURRENT_DATE - INTERVAL '27 days')::date + TIME '08:10:00', 13.5, 'Sarah Johnson', NULL),
    (14, 2, (CURRENT_DATE - INTERVAL '27 days')::date + TIME '08:20:00', 18.1, 'Sarah Johnson', NULL),
    (15, 2, (CURRENT_DATE - INTERVAL '27 days')::date + TIME '08:30:00', 14.1, 'Sarah Johnson', NULL),
    (16, 2, (CURRENT_DATE - INTERVAL '27 days')::date + TIME '08:35:00', 12.1, 'Sarah Johnson', NULL),
    (9, 3, (CURRENT_DATE - INTERVAL '26 days')::date + TIME '08:30:00', 17.1, 'Carlos Mendez', NULL),
    (10, 3, (CURRENT_DATE - INTERVAL '26 days')::date + TIME '08:45:00', 8.8, 'Carlos Mendez', NULL),
    (17, 3, (CURRENT_DATE - INTERVAL '26 days')::date + TIME '09:15:00', 20.1, 'Carlos Mendez', NULL),
    (18, 3, (CURRENT_DATE - INTERVAL '26 days')::date + TIME '09:30:00', 15.1, 'Carlos Mendez', NULL),
    (19, 3, (CURRENT_DATE - INTERVAL '26 days')::date + TIME '09:45:00', 13.5, 'Carlos Mendez', NULL),
    (20, 4, (CURRENT_DATE - INTERVAL '25 days')::date + TIME '08:00:00', 19.5, 'James Lee', NULL),
    (21, 4, (CURRENT_DATE - INTERVAL '25 days')::date + TIME '08:15:00', 23.5, 'James Lee', NULL),
    (22, 4, (CURRENT_DATE - INTERVAL '25 days')::date + TIME '08:30:00', 12.5, 'James Lee', NULL),
    (23, 4, (CURRENT_DATE - INTERVAL '25 days')::date + TIME '08:45:00', 14.1, 'James Lee', NULL),
    (24, 4, (CURRENT_DATE - INTERVAL '25 days')::date + TIME '09:00:00', 11.5, 'James Lee', NULL),
    (12, 5, (CURRENT_DATE - INTERVAL '24 days')::date + TIME '09:15:00', 14.1, 'David Kim', NULL),
    (13, 5, (CURRENT_DATE - INTERVAL '24 days')::date + TIME '09:30:00', 20.1, 'David Kim', NULL),
    (25, 5, (CURRENT_DATE - INTERVAL '24 days')::date + TIME '09:45:00', 15.8, 'David Kim', NULL),
    (26, 5, (CURRENT_DATE - INTERVAL '24 days')::date + TIME '10:00:00', 12.1, 'David Kim', NULL),
    (27, 5, (CURRENT_DATE - INTERVAL '24 days')::date + TIME '10:15:00', 14.1, 'David Kim', NULL),
    (28, 6, (CURRENT_DATE - INTERVAL '23 days')::date + TIME '07:30:00', 16.5, 'Lisa Wang', NULL),
    (29, 6, (CURRENT_DATE - INTERVAL '23 days')::date + TIME '07:45:00', 13.1, 'Lisa Wang', NULL),
    (30, 6, (CURRENT_DATE - INTERVAL '23 days')::date + TIME '08:00:00', 13.5, 'Lisa Wang', NULL),
    (31, 6, (CURRENT_DATE - INTERVAL '23 days')::date + TIME '08:15:00', 17.8, 'Lisa Wang', NULL),
    (32, 6, (CURRENT_DATE - INTERVAL '23 days')::date + TIME '08:30:00', 17.5, 'Lisa Wang', NULL);

-- Add contamination events showing increasing trend in plastic bags and film (category_id = 1)
-- Week 12 (12 weeks ago) - Low frequency, low severity
INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes)
SELECT pickup_id, 1, 2, 8.5, 'Minor plastic bag contamination'
FROM pickups 
WHERE pickup_time >= (CURRENT_DATE - INTERVAL '84 days')::date 
  AND pickup_time < (CURRENT_DATE - INTERVAL '77 days')::date
  AND container_id IN (1, 6, 9, 12, 20, 28)
LIMIT 2;

-- Week 11 (11 weeks ago) - Slight increase
INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes)
SELECT pickup_id, 1, 2, 10.0, 'Some plastic bags present'
FROM pickups 
WHERE pickup_time >= (CURRENT_DATE - INTERVAL '77 days')::date 
  AND pickup_time < (CURRENT_DATE - INTERVAL '70 days')::date
  AND container_id IN (1, 4, 6, 8, 10, 21, 26, 30)
LIMIT 3;

-- Week 10 (10 weeks ago) - Continuing increase
INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes)
SELECT pickup_id, 1, 2, 11.5, 'Plastic bags mixed in'
FROM pickups 
WHERE pickup_time >= (CURRENT_DATE - INTERVAL '70 days')::date 
  AND pickup_time < (CURRENT_DATE - INTERVAL '63 days')::date
  AND container_id IN (1, 2, 3, 6, 7, 9, 11, 20, 22, 12, 25, 28, 29)
LIMIT 4;

-- Week 9 (9 weeks ago) - More frequent, higher severity
INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes)
SELECT pickup_id, 1, 3, 15.0, 'Plastic bags contamination'
FROM pickups 
WHERE pickup_time >= (CURRENT_DATE - INTERVAL '63 days')::date 
  AND pickup_time < (CURRENT_DATE - INTERVAL '56 days')::date
  AND container_id IN (1, 4, 5, 6, 8, 14, 9, 17, 18, 21, 23, 12, 13, 26, 28, 30, 31)
LIMIT 6;

-- Week 8 (8 weeks ago) - Increasing frequency
INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes)
SELECT pickup_id, 1, 3, 16.5, 'Plastic bags present'
FROM pickups 
WHERE pickup_time >= (CURRENT_DATE - INTERVAL '56 days')::date 
  AND pickup_time < (CURRENT_DATE - INTERVAL '49 days')::date
  AND container_id IN (1, 2, 3, 4, 11, 6, 7, 8, 15, 16, 9, 10, 19, 20, 21, 22, 24, 12, 25, 27, 28, 29, 32)
LIMIT 8;

-- Week 7 (7 weeks ago) - More events, higher severity
INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes)
SELECT pickup_id, 1, 3, 18.0, 'Plastic bags mixed in'
FROM pickups 
WHERE pickup_time >= (CURRENT_DATE - INTERVAL '49 days')::date 
  AND pickup_time < (CURRENT_DATE - INTERVAL '42 days')::date
  AND container_id IN (1, 3, 5, 13, 6, 8, 14, 15, 9, 11, 17, 18, 20, 21, 23, 12, 13, 26, 28, 30, 31)
LIMIT 10;

-- Week 6 (6 weeks ago) - Significant increase
INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes)
SELECT pickup_id, 1, 3, 19.5, 'Many plastic bags'
FROM pickups 
WHERE pickup_time >= (CURRENT_DATE - INTERVAL '42 days')::date 
  AND pickup_time < (CURRENT_DATE - INTERVAL '35 days')::date
  AND container_id IN (1, 2, 4, 11, 6, 7, 8, 14, 16, 9, 10, 17, 19, 20, 21, 22, 24, 12, 25, 27, 28, 29, 32)
LIMIT 12;

-- Week 5 (5 weeks ago) - High frequency, higher severity
INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes)
SELECT pickup_id, 1, 4, 22.0, 'Heavy plastic bag contamination'
FROM pickups 
WHERE pickup_time >= (CURRENT_DATE - INTERVAL '35 days')::date 
  AND pickup_time < (CURRENT_DATE - INTERVAL '28 days')::date
  AND container_id IN (1, 3, 4, 13, 6, 8, 14, 15, 9, 11, 17, 18, 20, 21, 22, 12, 13, 26, 28, 30, 31)
LIMIT 14;

-- Week 4 (4 weeks ago) - Peak frequency and severity
INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes)
SELECT pickup_id, 1, 4, 24.5, 'Severe plastic bag contamination'
FROM pickups 
WHERE pickup_time >= (CURRENT_DATE - INTERVAL '28 days')::date 
  AND pickup_time < (CURRENT_DATE - INTERVAL '21 days')::date
  AND container_id IN (1, 2, 3, 5, 11, 6, 7, 8, 14, 15, 16, 9, 10, 17, 18, 19, 20, 21, 22, 23, 24, 12, 13, 25, 26, 27, 28, 29, 30, 31, 32)
LIMIT 18;

-- Add a few more high-severity events in recent weeks to show the trend continues
INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes)
SELECT pickup_id, 1, 5, 28.0, 'Critical plastic bag contamination - entire load affected'
FROM pickups 
WHERE pickup_time >= (CURRENT_DATE - INTERVAL '21 days')::date 
  AND pickup_time < (CURRENT_DATE - INTERVAL '14 days')::date
  AND container_id IN (1, 3, 6, 8, 9, 20, 12, 26, 28, 30)
LIMIT 5;

INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes)
SELECT pickup_id, 1, 5, 32.0, 'Extreme plastic bag contamination'
FROM pickups 
WHERE pickup_time >= (CURRENT_DATE - INTERVAL '14 days')::date 
  AND pickup_time < (CURRENT_DATE - INTERVAL '7 days')::date
  AND container_id IN (1, 2, 3, 4, 5, 11, 6, 7, 8, 14, 15, 9, 10, 11, 17, 18, 20, 21, 22, 12, 13, 25, 26, 28, 29, 30, 31)
LIMIT 8;

INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes)
SELECT pickup_id, 1, 5, 35.0, 'Severe plastic bag and film contamination - requires immediate attention'
FROM pickups 
WHERE pickup_time >= (CURRENT_DATE - INTERVAL '7 days')::date 
  AND container_id IN (1, 3, 4, 6, 8, 9, 17, 20, 21, 12, 13, 28, 30, 31)
LIMIT 10;

