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
    -- Brooklyn Heights customers (Route 1)
    ('NYC-10001', 'Smith Household', 'residential', 1, '123 Montague St', 'Brooklyn', 'NY', '11201'),
    ('NYC-10002', 'Johnson Family', 'residential', 1, '45 Pierrepont St', 'Brooklyn', 'NY', '11201'),
    ('NYC-10003', 'Brooklyn Bagel Co', 'commercial', 1, '78 Henry St', 'Brooklyn', 'NY', '11201'),
    ('NYC-10011', 'River Cafe', 'commercial', 1, '1 Water St', 'Brooklyn', 'NY', '11201'),
    ('NYC-10012', 'Brown Apartment', 'residential', 1, '156 Hicks St', 'Brooklyn', 'NY', '11201'),
    ('NYC-10013', 'DUMBO Loft Building', 'residential', 1, '45 Main St', 'Brooklyn', 'NY', '11201'),
    
    -- Park Slope customers (Route 2)
    ('NYC-10004', 'Williams Residence', 'residential', 2, '234 7th Ave', 'Brooklyn', 'NY', '11215'),
    ('NYC-10005', 'Green Cafe', 'commercial', 2, '156 5th Ave', 'Brooklyn', 'NY', '11215'),
    ('NYC-10006', 'Martinez Family', 'residential', 2, '89 Union St', 'Brooklyn', 'NY', '11215'),
    ('NYC-10014', 'Prospect Park Co-op', 'residential', 2, '321 Prospect Park West', 'Brooklyn', 'NY', '11215'),
    ('NYC-10015', 'Park Slope Bakery', 'commercial', 2, '567 7th Ave', 'Brooklyn', 'NY', '11215'),
    ('NYC-10016', 'Taylor Residence', 'residential', 2, '123 5th Ave', 'Brooklyn', 'NY', '11215'),
    
    -- Astoria customers (Route 3)
    ('NYC-10007', 'Patel Household', 'residential', 3, '345 30th Ave', 'Queens', 'NY', '11103'),
    ('NYC-10008', 'Astoria Pizza Palace', 'commercial', 3, '567 Broadway', 'Queens', 'NY', '11103'),
    ('NYC-10017', 'Greek Taverna', 'commercial', 3, '234 30th Ave', 'Queens', 'NY', '11103'),
    ('NYC-10018', 'Astoria Apartment Complex', 'residential', 3, '789 31st St', 'Queens', 'NY', '11103'),
    ('NYC-10019', 'Anderson Family', 'residential', 3, '123 Ditmars Blvd', 'Queens', 'NY', '11103'),
    
    -- Flushing customers (Route 4)
    ('NYC-10020', 'Lee Restaurant', 'commercial', 4, '456 Main St', 'Queens', 'NY', '11355'),
    ('NYC-10021', 'Flushing Mall', 'commercial', 4, '123 Roosevelt Ave', 'Queens', 'NY', '11354'),
    ('NYC-10022', 'Wang Residence', 'residential', 4, '789 Kissena Blvd', 'Queens', 'NY', '11355'),
    ('NYC-10023', 'Corona Market', 'commercial', 4, '234 Corona Ave', 'Queens', 'NY', '11368'),
    ('NYC-10024', 'Garcia Household', 'residential', 4, '567 108th St', 'Queens', 'NY', '11368'),
    
    -- Upper West Side customers (Route 5)
    ('NYC-10009', 'Chen Residence', 'residential', 5, '789 Amsterdam Ave', 'New York', 'NY', '10025'),
    ('NYC-10010', 'UWS Deli', 'commercial', 5, '234 Columbus Ave', 'New York', 'NY', '10023'),
    ('NYC-10025', 'Lincoln Center Restaurant', 'commercial', 5, '123 Broadway', 'New York', 'NY', '10023'),
    ('NYC-10026', 'Riverside Apartment', 'residential', 5, '456 Riverside Dr', 'New York', 'NY', '10025'),
    ('NYC-10027', 'Central Park West Condo', 'residential', 5, '789 Central Park West', 'New York', 'NY', '10025'),
    
    -- East Village / LES customers (Route 6)
    ('NYC-10028', 'Village Pizza', 'commercial', 6, '123 St Marks Pl', 'New York', 'NY', '10009'),
    ('NYC-10029', 'LES Bar', 'commercial', 6, '456 Orchard St', 'New York', 'NY', '10002'),
    ('NYC-10030', 'East Village Apartment', 'residential', 6, '789 Avenue A', 'New York', 'NY', '10009'),
    ('NYC-10031', 'Chinatown Restaurant', 'commercial', 6, '234 Canal St', 'New York', 'NY', '10013'),
    ('NYC-10032', 'Thompson Residence', 'residential', 6, '567 Bowery', 'New York', 'NY', '10002');

-- 5. Containers (bins/carts for customers)
INSERT INTO containers (customer_id, label, size_gallons, stream_type) VALUES
    -- Route 1 containers
    (1, 'Blue Cart 96G', 96, 'single_stream'),
    (1, 'Green Cart 64G', 64, 'organics'),
    (2, 'Recycling Cart', 96, 'single_stream'),
    (3, 'Commercial Bin 1', 64, 'single_stream'),
    (3, 'Commercial Bin 2', 64, 'organics'),
    (11, 'Restaurant Recycling', 64, 'single_stream'),
    (11, 'Restaurant Organics', 64, 'organics'),
    (12, 'Apartment Bin', 96, 'single_stream'),
    (13, 'Building Recycling', 96, 'single_stream'),
    (13, 'Building Organics', 64, 'organics'),
    
    -- Route 2 containers
    (4, 'Blue Bin', 96, 'single_stream'),
    (5, 'Cafe Recycling', 64, 'single_stream'),
    (5, 'Compost Bin', 32, 'organics'),
    (6, 'Recycling Cart', 96, 'single_stream'),
    (14, 'Co-op Recycling', 96, 'single_stream'),
    (15, 'Bakery Recycling', 64, 'single_stream'),
    (15, 'Bakery Organics', 32, 'organics'),
    (16, 'Residence Bin', 96, 'single_stream'),
    
    -- Route 3 containers
    (7, 'Blue Cart', 96, 'single_stream'),
    (8, 'Pizza Box Bin', 64, 'single_stream'),
    (8, 'Food Waste Bin', 32, 'organics'),
    (17, 'Taverna Recycling', 64, 'single_stream'),
    (18, 'Complex Bin 1', 96, 'single_stream'),
    (18, 'Complex Bin 2', 96, 'single_stream'),
    (19, 'Residence Cart', 96, 'single_stream'),
    
    -- Route 4 containers
    (20, 'Restaurant Bin', 64, 'single_stream'),
    (21, 'Mall Recycling', 96, 'single_stream'),
    (22, 'Residence Bin', 96, 'single_stream'),
    (23, 'Market Recycling', 64, 'single_stream'),
    (24, 'Household Cart', 96, 'single_stream'),
    
    -- Route 5 containers
    (9, 'Recycling Cart', 96, 'single_stream'),
    (10, 'Deli Recycling', 64, 'single_stream'),
    (25, 'Restaurant Recycling', 64, 'single_stream'),
    (26, 'Apartment Bin', 96, 'single_stream'),
    (27, 'Condo Recycling', 96, 'single_stream'),
    
    -- Route 6 containers
    (28, 'Pizza Place Bin', 64, 'single_stream'),
    (29, 'Bar Recycling', 64, 'single_stream'),
    (30, 'Apartment Bin', 96, 'single_stream'),
    (31, 'Restaurant Bin', 64, 'single_stream'),
    (32, 'Residence Cart', 96, 'single_stream');

-- 6. Pickups (pickup events spanning multiple weeks for trend analysis)
INSERT INTO pickups (container_id, route_id, pickup_time, weight_kg, driver_name, notes) VALUES
    -- Week 1 (Jan 1-7)
    (1, 1, '2024-01-01 08:30:00-05', 13.8, 'Mike Rodriguez', 'Contamination noted'),
    (2, 1, '2024-01-01 08:35:00-05', 9.1, 'Mike Rodriguez', NULL),
    (6, 2, '2024-01-02 07:45:00-05', 16.8, 'Sarah Johnson', 'High contamination'),
    (7, 2, '2024-01-02 08:00:00-05', 10.2, 'Sarah Johnson', NULL),
    (9, 3, '2024-01-03 08:30:00-05', 14.5, 'Carlos Mendez', NULL),
    (12, 5, '2024-01-04 09:15:00-05', 11.3, 'David Kim', NULL),
    (28, 6, '2024-01-05 07:30:00-05', 15.7, 'Lisa Wang', NULL),
    
    -- Week 2 (Jan 8-14)
    (1, 1, '2024-01-08 08:30:00-05', 11.2, 'Mike Rodriguez', NULL),
    (3, 1, '2024-01-08 09:15:00-05', 14.5, 'Mike Rodriguez', NULL),
    (6, 2, '2024-01-09 07:45:00-05', 15.1, 'Sarah Johnson', NULL),
    (8, 2, '2024-01-09 08:10:00-05', 12.3, 'Sarah Johnson', 'Some contamination'),
    (10, 3, '2024-01-10 08:45:00-05', 8.2, 'Carlos Mendez', NULL),
    (20, 4, '2024-01-11 08:00:00-05', 18.9, 'James Lee', NULL),
    (26, 5, '2024-01-12 09:00:00-05', 13.4, 'David Kim', NULL),
    (30, 6, '2024-01-13 07:45:00-05', 12.1, 'Lisa Wang', NULL),
    
    -- Week 3 (Jan 15-21) - Current week
    (1, 1, '2024-01-15 08:30:00-05', 12.5, 'Mike Rodriguez', 'Normal pickup'),
    (2, 1, '2024-01-15 08:35:00-05', 8.2, 'Mike Rodriguez', NULL),
    (3, 1, '2024-01-15 09:15:00-05', 15.3, 'Mike Rodriguez', 'Heavy load'),
    (4, 1, '2024-01-15 09:20:00-05', 18.7, 'Mike Rodriguez', NULL),
    (5, 1, '2024-01-15 09:25:00-05', 10.1, 'Mike Rodriguez', NULL),
    (11, 1, '2024-01-15 09:30:00-05', 16.2, 'Mike Rodriguez', NULL),
    
    (6, 2, '2024-01-16 07:45:00-05', 14.2, 'Sarah Johnson', NULL),
    (7, 2, '2024-01-16 08:00:00-05', 9.8, 'Sarah Johnson', NULL),
    (8, 2, '2024-01-16 08:10:00-05', 11.5, 'Sarah Johnson', 'Some contamination observed'),
    (14, 2, '2024-01-16 08:20:00-05', 17.3, 'Sarah Johnson', NULL),
    (15, 2, '2024-01-16 08:30:00-05', 13.6, 'Sarah Johnson', NULL),
    
    (9, 3, '2024-01-17 08:30:00-05', 16.3, 'Carlos Mendez', NULL),
    (10, 3, '2024-01-17 08:45:00-05', 7.5, 'Carlos Mendez', NULL),
    (11, 3, '2024-01-17 09:00:00-05', 13.2, 'Carlos Mendez', NULL),
    (17, 3, '2024-01-17 09:15:00-05', 19.1, 'Carlos Mendez', NULL),
    (18, 3, '2024-01-17 09:30:00-05', 14.8, 'Carlos Mendez', NULL),
    
    (20, 4, '2024-01-18 08:00:00-05', 16.4, 'James Lee', NULL),
    (21, 4, '2024-01-18 08:15:00-05', 22.3, 'James Lee', 'Heavy commercial load'),
    (22, 4, '2024-01-18 08:30:00-05', 11.7, 'James Lee', NULL),
    
    (12, 5, '2024-01-18 09:15:00-05', 12.8, 'David Kim', NULL),
    (13, 5, '2024-01-18 09:30:00-05', 19.4, 'David Kim', 'Heavy contamination'),
    (25, 5, '2024-01-18 09:45:00-05', 15.2, 'David Kim', NULL),
    (26, 5, '2024-01-18 10:00:00-05', 10.9, 'David Kim', NULL),
    
    (28, 6, '2024-01-19 07:30:00-05', 14.6, 'Lisa Wang', NULL),
    (29, 6, '2024-01-19 07:45:00-05', 12.3, 'Lisa Wang', NULL),
    (30, 6, '2024-01-19 08:00:00-05', 13.8, 'Lisa Wang', NULL),
    (31, 6, '2024-01-19 08:15:00-05', 17.1, 'Lisa Wang', NULL);

-- 7. Contamination events (contamination found during pickups)
INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes) VALUES
    -- Week 1 contamination
    (1, 1, 4, 22.0, 'Plastic bags contamination'),
    (1, 2, 3, 15.0, 'Food waste mixed in'),
    (3, 1, 3, 18.5, 'Plastic bags present'),
    (3, 8, 2, 9.0, 'Some dirty containers'),
    
    -- Week 2 contamination
    (11, 1, 2, 12.0, 'Few plastic bags'),
    (11, 2, 2, 7.5, 'Minor food waste'),
    (13, 1, 3, 16.0, 'Plastic bags mixed in'),
    (15, 3, 4, 20.0, 'Styrofoam contamination'),
    (15, 1, 3, 14.0, 'Plastic bags'),
    
    -- Week 3 contamination (recent)
    (24, 1, 3, 15.5, 'Plastic bags mixed in'),
    (24, 2, 2, 8.0, 'Some food waste'),
    (27, 1, 4, 25.0, 'Many plastic bags'),
    (27, 3, 3, 12.5, 'Styrofoam containers'),
    (27, 8, 2, 10.0, 'Dirty containers'),
    (30, 1, 2, 11.0, 'Some plastic bags'),
    (32, 1, 5, 30.0, 'Severe plastic bag contamination'),
    (32, 2, 4, 20.0, 'Significant food waste'),
    (32, 3, 2, 8.0, 'Some styrofoam'),
    (33, 1, 3, 17.0, 'Plastic bags present'),
    (35, 2, 3, 13.5, 'Food waste contamination'),
    (35, 8, 2, 9.5, 'Dirty containers'),
    (37, 1, 4, 23.0, 'Heavy plastic bag contamination'),
    (37, 2, 3, 16.0, 'Food waste mixed in'),
    (40, 1, 2, 10.5, 'Minor plastic bag issue'),
    (41, 3, 4, 21.0, 'Styrofoam contamination'),
    (42, 1, 3, 15.0, 'Plastic bags'),
    (42, 2, 2, 8.5, 'Some food waste');

-- 8. Education actions (outreach efforts to customers)
INSERT INTO education_actions (customer_id, action_date, channel, description) VALUES
    -- Week 1 education actions
    (2, '2024-01-05', 'email', 'Welcome email with recycling tips'),
    (7, '2024-01-06', 'mail', 'Mailed recycling guide brochure'),
    (1, '2024-01-07', 'tag_on_bin', 'Left informational tag about proper recycling'),
    
    -- Week 2 education actions (targeting contamination issues)
    (1, '2024-01-10', 'tag_on_bin', 'Left informational tag about plastic bag contamination'),
    (1, '2024-01-12', 'email', 'Sent email with recycling guidelines'),
    (4, '2024-01-11', 'tag_on_bin', 'Tagged bin with contamination notice'),
    (8, '2024-01-11', 'email', 'Sent email about food waste contamination'),
    (10, '2024-01-13', 'site_visit', 'In-person visit to discuss proper recycling'),
    (10, '2024-01-14', 'email', 'Follow-up email with resources'),
    (15, '2024-01-12', 'tag_on_bin', 'Tagged bin with styrofoam contamination notice'),
    
    -- Week 3 education actions (ongoing outreach)
    (3, '2024-01-15', 'email', 'Sent commercial recycling guidelines'),
    (11, '2024-01-16', 'site_visit', 'Restaurant recycling consultation'),
    (20, '2024-01-17', 'email', 'Commercial recycling best practices email'),
    (25, '2024-01-18', 'tag_on_bin', 'Tagged bin with contamination notice'),
    (28, '2024-01-19', 'phone_call', 'Called to discuss recycling improvements'),
    (31, '2024-01-19', 'email', 'Sent recycling education materials');

