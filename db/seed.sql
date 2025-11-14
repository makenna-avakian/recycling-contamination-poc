-- Seed data for NYC recycling contamination tracking

-- 1. Facilities (NYC MRFs and depots)
INSERT INTO facilities (name, city, state) VALUES
    ('Sims Municipal Recycling - Brooklyn', 'Brooklyn', 'NY'),
    ('Queens Material Recovery Facility', 'Queens', 'NY'),
    ('Manhattan Transfer Station', 'New York', 'NY');

-- 2. Routes (collection routes in different NYC neighborhoods)
INSERT INTO routes (facility_id, route_code, description) VALUES
    (1, 'BK-101', 'Brooklyn Heights / DUMBO collection route'),
    (1, 'BK-102', 'Park Slope / Prospect Heights route'),
    (2, 'QN-201', 'Astoria / Long Island City route'),
    (2, 'QN-202', 'Flushing / Corona route'),
    (3, 'MN-301', 'Upper West Side route'),
    (3, 'MN-302', 'East Village / Lower East Side route');

-- 3. Contamination categories (common NYC recycling contamination types)
INSERT INTO contamination_categories (code, description) VALUES
    ('PLASTIC_BAG', 'Plastic bags and film'),
    ('FOOD_WASTE', 'Food scraps and organic waste'),
    ('FOAM', 'Styrofoam containers and packaging'),
    ('ELECTRONICS', 'Electronics and batteries'),
    ('HAZARDOUS', 'Hazardous materials (paint, chemicals)'),
    ('TEXTILES', 'Clothing and textiles'),
    ('GLASS_BROKEN', 'Broken glass mixed with recyclables'),
    ('DIRTY_CONTAINERS', 'Food containers not rinsed');

-- 4. Customers (mix of residential and commercial)
INSERT INTO customers (external_ref, name, customer_type, route_id, address_line1, city, state, postal_code) VALUES
    -- Brooklyn Heights customers
    ('NYC-10001', 'Smith Household', 'residential', 1, '123 Montague St', 'Brooklyn', 'NY', '11201'),
    ('NYC-10002', 'Johnson Family', 'residential', 1, '45 Pierrepont St', 'Brooklyn', 'NY', '11201'),
    ('NYC-10003', 'Brooklyn Bagel Co', 'commercial', 1, '78 Henry St', 'Brooklyn', 'NY', '11201'),
    
    -- Park Slope customers
    ('NYC-10004', 'Williams Residence', 'residential', 2, '234 7th Ave', 'Brooklyn', 'NY', '11215'),
    ('NYC-10005', 'Green Cafe', 'commercial', 2, '156 5th Ave', 'Brooklyn', 'NY', '11215'),
    ('NYC-10006', 'Martinez Family', 'residential', 2, '89 Union St', 'Brooklyn', 'NY', '11215'),
    
    -- Astoria customers
    ('NYC-10007', 'Patel Household', 'residential', 3, '345 30th Ave', 'Queens', 'NY', '11103'),
    ('NYC-10008', 'Astoria Pizza Palace', 'commercial', 3, '567 Broadway', 'Queens', 'NY', '11103'),
    
    -- Upper West Side customers
    ('NYC-10009', 'Chen Residence', 'residential', 5, '789 Amsterdam Ave', 'New York', 'NY', '10025'),
    ('NYC-10010', 'UWS Deli', 'commercial', 5, '234 Columbus Ave', 'New York', 'NY', '10023');

-- 5. Containers (bins/carts for customers)
INSERT INTO containers (customer_id, label, size_gallons, stream_type) VALUES
    -- Smith Household containers
    (1, 'Blue Cart 96G', 96, 'single_stream'),
    (1, 'Green Cart 64G', 64, 'organics'),
    
    -- Johnson Family containers
    (2, 'Recycling Cart', 96, 'single_stream'),
    
    -- Brooklyn Bagel Co containers
    (3, 'Commercial Bin 1', 64, 'single_stream'),
    (3, 'Commercial Bin 2', 64, 'organics'),
    
    -- Williams Residence containers
    (4, 'Blue Bin', 96, 'single_stream'),
    
    -- Green Cafe containers
    (5, 'Cafe Recycling', 64, 'single_stream'),
    (5, 'Compost Bin', 32, 'organics'),
    
    -- Martinez Family containers
    (6, 'Recycling Cart', 96, 'single_stream'),
    
    -- Patel Household containers
    (7, 'Blue Cart', 96, 'single_stream'),
    
    -- Astoria Pizza Palace containers
    (8, 'Pizza Box Bin', 64, 'single_stream'),
    (8, 'Food Waste Bin', 32, 'organics'),
    
    -- Chen Residence containers
    (9, 'Recycling Cart', 96, 'single_stream'),
    
    -- UWS Deli containers
    (10, 'Deli Recycling', 64, 'single_stream');

-- 6. Pickups (recent pickup events)
INSERT INTO pickups (container_id, route_id, pickup_time, weight_kg, driver_name, notes) VALUES
    -- Recent pickups with various dates
    (1, 1, '2024-01-15 08:30:00-05', 12.5, 'Mike Rodriguez', 'Normal pickup'),
    (2, 1, '2024-01-15 08:35:00-05', 8.2, 'Mike Rodriguez', NULL),
    (3, 1, '2024-01-15 09:15:00-05', 15.3, 'Mike Rodriguez', 'Heavy load'),
    (4, 1, '2024-01-15 09:20:00-05', 18.7, 'Mike Rodriguez', NULL),
    (5, 1, '2024-01-15 09:25:00-05', 10.1, 'Mike Rodriguez', NULL),
    
    (6, 2, '2024-01-16 07:45:00-05', 14.2, 'Sarah Johnson', NULL),
    (7, 2, '2024-01-16 08:00:00-05', 9.8, 'Sarah Johnson', NULL),
    (8, 2, '2024-01-16 08:10:00-05', 11.5, 'Sarah Johnson', 'Some contamination observed'),
    
    (9, 3, '2024-01-17 08:30:00-05', 16.3, 'Carlos Mendez', NULL),
    (10, 3, '2024-01-17 08:45:00-05', 7.5, 'Carlos Mendez', NULL),
    (11, 3, '2024-01-17 09:00:00-05', 13.2, 'Carlos Mendez', NULL),
    
    (12, 5, '2024-01-18 09:15:00-05', 12.8, 'David Kim', NULL),
    (13, 5, '2024-01-18 09:30:00-05', 19.4, 'David Kim', 'Heavy contamination'),
    
    -- Older pickups for time-series analysis
    (1, 1, '2024-01-08 08:30:00-05', 11.2, 'Mike Rodriguez', NULL),
    (1, 1, '2024-01-01 08:30:00-05', 13.8, 'Mike Rodriguez', 'Contamination noted'),
    (3, 1, '2024-01-08 09:15:00-05', 14.5, 'Mike Rodriguez', NULL),
    (6, 2, '2024-01-09 07:45:00-05', 15.1, 'Sarah Johnson', NULL),
    (6, 2, '2024-01-02 07:45:00-05', 16.8, 'Sarah Johnson', 'High contamination');

-- 7. Contamination events (contamination found during pickups)
INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes) VALUES
    -- Contamination on recent pickups
    (8, 1, 3, 15.5, 'Plastic bags mixed in'),
    (8, 2, 2, 8.0, 'Some food waste'),
    
    (13, 1, 4, 25.0, 'Many plastic bags'),
    (13, 3, 3, 12.5, 'Styrofoam containers'),
    (13, 8, 2, 10.0, 'Dirty containers'),
    
    -- Historical contamination
    (16, 1, 4, 22.0, 'Plastic bags contamination'),
    (16, 2, 3, 15.0, 'Food waste mixed in'),
    
    (20, 1, 5, 30.0, 'Severe plastic bag contamination'),
    (20, 2, 4, 20.0, 'Significant food waste'),
    (20, 3, 2, 8.0, 'Some styrofoam');

-- 8. Education actions (outreach efforts to customers)
INSERT INTO education_actions (customer_id, action_date, channel, description) VALUES
    -- Education actions for customers with contamination
    (1, '2024-01-10', 'tag_on_bin', 'Left informational tag about plastic bag contamination'),
    (1, '2024-01-12', 'email', 'Sent email with recycling guidelines'),
    
    (4, '2024-01-11', 'tag_on_bin', 'Tagged bin with contamination notice'),
    
    (10, '2024-01-13', 'site_visit', 'In-person visit to discuss proper recycling'),
    (10, '2024-01-14', 'email', 'Follow-up email with resources'),
    
    -- Proactive education
    (2, '2024-01-05', 'email', 'Welcome email with recycling tips'),
    (7, '2024-01-06', 'mail', 'Mailed recycling guide brochure');

