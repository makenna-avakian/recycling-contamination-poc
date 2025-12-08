#!/usr/bin/env python3
"""
Generate multi-year seed data for SARIMA model testing
Creates realistic contamination data with yearly seasonality patterns
"""

import random
from datetime import datetime, timedelta
import math

# Set seed for reproducibility
random.seed(42)

# Configuration
START_DATE = datetime(2022, 1, 1)  # Start 3 years ago
END_DATE = datetime.now()
NUM_ROUTES = 6
NUM_CUSTOMERS_PER_ROUTE = 5
CONTAINERS_PER_CUSTOMER = 1.5  # Average

# Seasonal patterns (monthly multipliers for contamination)
# Higher contamination in certain months (e.g., holidays, summer)
SEASONAL_PATTERNS = {
    1: 1.1,   # January - post-holiday cleanup
    2: 0.9,   # February - lower
    3: 0.95,  # March
    4: 1.0,   # April
    5: 1.05,  # May - spring cleaning
    6: 1.15,  # June - summer starts
    7: 1.2,   # July - peak summer
    8: 1.15,  # August - summer
    9: 1.0,   # September - back to school
    10: 1.1,  # October
    11: 1.2,  # November - holiday prep
    12: 1.3,  # December - holidays peak
}

# Day of week patterns (weekends might have different patterns)
WEEKEND_MULTIPLIER = 1.1  # Slightly higher contamination on weekends

def generate_pickups_and_contamination():
    """Generate pickups and contamination events with yearly seasonality"""
    
    # Generate dates from START_DATE to END_DATE
    current_date = START_DATE
    pickup_id = 1
    contamination_id = 1
    
    pickups = []
    contamination_events = []
    
    # Track containers (simplified - assume 1 container per customer for now)
    containers = []
    container_id = 1
    
    # Use actual route-container mapping from seed.sql
    # Based on customers -> routes mapping in seed data
    # Route 1: customers 1-3,11-13 -> containers 1-13
    # Route 2: customers 4-6,14-16 -> containers 4-6,8,14-16
    # Route 3: customers 7-10,17-19 -> containers 7,9-11,17-19
    # Route 4: customers 20-24 -> containers 20-24
    # Route 5: customers 9-10,25-27 -> containers 9,10,12-13,25-27
    # Route 6: customers 28-32 -> containers 28-32
    
    route_container_mapping = {
        1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],  # Route 1 containers
        2: [4, 5, 6, 8, 14, 15, 16],                      # Route 2 containers
        3: [7, 9, 10, 11, 17, 18, 19],                     # Route 3 containers
        4: [20, 21, 22, 23, 24],                          # Route 4 containers
        5: [9, 10, 12, 13, 25, 26, 27],                    # Route 5 containers
        6: [28, 29, 30, 31, 32]                           # Route 6 containers
    }
    
    for route_id, container_ids in route_container_mapping.items():
        for container_id in container_ids:
            containers.append({
                'container_id': container_id,
                'route_id': route_id
            })
    
    # Generate daily pickups
    while current_date <= END_DATE:
        day_of_week = current_date.weekday()
        month = current_date.month
        day_of_year = current_date.timetuple().tm_yday
        
        # Base contamination rate (varies by route)
        for route_id in range(1, NUM_ROUTES + 1):
            # Some routes have higher baseline contamination
            route_base_rate = 0.15 + (route_id * 0.02)  # Route 1: 17%, Route 6: 27%
            
            # Apply seasonal multiplier
            seasonal_mult = SEASONAL_PATTERNS[month]
            
            # Apply weekend multiplier
            weekend_mult = WEEKEND_MULTIPLIER if day_of_week >= 5 else 1.0
            
            # Add some yearly trend (slight improvement over years)
            years_passed = (current_date - START_DATE).days / 365.0
            trend_mult = 1.0 - (years_passed * 0.02)  # 2% improvement per year
            
            # Calculate contamination probability
            contamination_prob = route_base_rate * seasonal_mult * weekend_mult * trend_mult
            contamination_prob = min(contamination_prob, 0.5)  # Cap at 50%
            
            # Get containers for this route
            route_containers = [c for c in containers if c['route_id'] == route_id]
            
            # Generate pickups for this route (not every container every day)
            # Assume each container gets picked up every 7-14 days
            for container in route_containers:
                # Random pickup schedule (roughly weekly)
                if random.random() < 0.15:  # ~15% chance per day = weekly pickup
                    # Generate pickup
                    weight = round(random.uniform(8.0, 22.0), 1)
                    driver_names = ['Mike Rodriguez', 'Sarah Johnson', 'Carlos Mendez', 
                                   'David Kim', 'Lisa Wang', 'James Lee']
                    driver_name = random.choice(driver_names)
                    
                    pickup_time = current_date.replace(
                        hour=random.randint(7, 10),
                        minute=random.choice([0, 15, 30, 45])
                    )
                    
                    pickups.append({
                        'pickup_id': pickup_id,
                        'container_id': container['container_id'],
                        'route_id': route_id,
                        'pickup_time': pickup_time,
                        'weight_kg': weight,
                        'driver_name': driver_name,
                        'notes': None
                    })
                    
                    # Generate contamination event based on probability
                    if random.random() < contamination_prob:
                        # Determine severity (1-5)
                        # Higher severity in peak months
                        if seasonal_mult >= 1.2:
                            severity = random.choices([3, 4, 5], weights=[0.3, 0.4, 0.3])[0]
                        elif seasonal_mult >= 1.1:
                            severity = random.choices([2, 3, 4], weights=[0.3, 0.4, 0.3])[0]
                        else:
                            severity = random.choices([1, 2, 3], weights=[0.4, 0.4, 0.2])[0]
                        
                        # Contamination percentage based on severity
                        contamination_pct = round(random.uniform(
                            severity * 5,
                            severity * 8
                        ), 1)
                        
                        # Category (1-8 from seed data)
                        category_id = random.randint(1, 8)
                        
                        # Notes
                        notes_options = [
                            'Plastic bags contamination',
                            'Food waste mixed in',
                            'Styrofoam containers',
                            'Dirty containers',
                            'Some contamination observed',
                            'High contamination',
                            'Minor contamination',
                            None
                        ]
                        notes = random.choice(notes_options)
                        
                        contamination_events.append({
                            'contamination_id': contamination_id,
                            'pickup_id': pickup_id,
                            'category_id': category_id,
                            'severity': severity,
                            'estimated_contamination_pct': contamination_pct,
                            'notes': notes
                        })
                        contamination_id += 1
                    
                    pickup_id += 1
        
        # Move to next day
        current_date += timedelta(days=1)
    
    return pickups, contamination_events

def generate_sql_inserts(pickups, contamination_events):
    """Generate SQL INSERT statements"""
    
    sql_lines = []
    
    # Pickups
    sql_lines.append("-- Multi-year pickups (generated for SARIMA model)")
    sql_lines.append("INSERT INTO pickups (container_id, route_id, pickup_time, weight_kg, driver_name, notes) VALUES")
    
    pickup_values = []
    for p in pickups:
        pickup_time_str = p['pickup_time'].strftime("'%Y-%m-%d %H:%M:%S'")
        weight = p['weight_kg']
        driver = p['driver_name'].replace("'", "''")
        if p['notes']:
            notes = "'" + p['notes'].replace("'", "''") + "'"
        else:
            notes = 'NULL'
        
        pickup_values.append(
            f"    ({p['container_id']}, {p['route_id']}, {pickup_time_str}, {weight}, '{driver}', {notes})"
        )
    
    # Split into chunks to avoid huge SQL statements
    chunk_size = 1000
    for i in range(0, len(pickup_values), chunk_size):
        chunk = pickup_values[i:i+chunk_size]
        if i > 0:
            sql_lines.append("INSERT INTO pickups (container_id, route_id, pickup_time, weight_kg, driver_name, notes) VALUES")
        sql_lines.append(",\n".join(chunk) + ";")
        sql_lines.append("")
    
    # Contamination events
    sql_lines.append("-- Multi-year contamination events")
    sql_lines.append("INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes) VALUES")
    
    contamination_values = []
    for c in contamination_events:
        if c['notes']:
            notes = "'" + c['notes'].replace("'", "''") + "'"
        else:
            notes = 'NULL'
        contamination_values.append(
            f"    ({c['pickup_id']}, {c['category_id']}, {c['severity']}, {c['estimated_contamination_pct']}, {notes})"
        )
    
    # Split into chunks
    for i in range(0, len(contamination_values), chunk_size):
        chunk = contamination_values[i:i+chunk_size]
        if i > 0:
            sql_lines.append("INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes) VALUES")
        sql_lines.append(",\n".join(chunk) + ";")
        sql_lines.append("")
    
    return "\n".join(sql_lines)

if __name__ == "__main__":
    print("Generating multi-year seed data...")
    print(f"Date range: {START_DATE.date()} to {END_DATE.date()}")
    
    pickups, contamination_events = generate_pickups_and_contamination()
    
    print(f"Generated {len(pickups)} pickups")
    print(f"Generated {len(contamination_events)} contamination events")
    
    sql_content = generate_sql_inserts(pickups, contamination_events)
    
    # Write to file
    output_file = "db/multi_year_seed.sql"
    with open(output_file, 'w') as f:
        f.write(sql_content)
    
    print(f"\nSQL written to {output_file}")
    print(f"\nTo use this data:")
    print(f"  1. Run: psql recycling_contamination -f db/schema.sql")
    print(f"  2. Run: psql recycling_contamination -f db/seed.sql")
    print(f"  3. Run: psql recycling_contamination -f {output_file}")

