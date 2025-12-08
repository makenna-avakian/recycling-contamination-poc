#!/usr/bin/env python3
"""
Generate enhanced seed data for trend alerts and visualizations
Creates realistic contamination data with clear trends over the last 90 days
"""

import random
from datetime import datetime, timedelta

# Set seed for reproducibility
random.seed(42)

# Configuration
START_DATE = datetime.now() - timedelta(days=90)  # Last 90 days
END_DATE = datetime.now()
NUM_ROUTES = 6

# Route-specific patterns (for creating different trends)
# Each route will have different characteristics
ROUTE_PATTERNS = {
    1: {
        'base_rate': 0.30,  # 30% contamination rate (higher for better visualization)
        'trend': 'increasing',  # Increasing trend
        'trend_strength': 0.20,  # 20% increase over 90 days
        'severity_profile': [0.1, 0.2, 0.3, 0.25, 0.15],  # More high severity
        'categories': [1, 1, 2, 3, 8],  # Mostly plastic bags, some food waste
    },
    2: {
        'base_rate': 0.25,
        'trend': 'decreasing',  # Decreasing trend (education working)
        'trend_strength': 0.25,  # 25% decrease over 90 days
        'severity_profile': [0.2, 0.3, 0.3, 0.15, 0.05],  # Mostly low-medium
        'categories': [1, 2, 2, 8, 3],  # Mix of categories
    },
    3: {
        'base_rate': 0.28,
        'trend': 'stable',  # Stable trend
        'trend_strength': 0.0,
        'severity_profile': [0.15, 0.25, 0.3, 0.2, 0.1],
        'categories': [1, 3, 3, 4, 5],  # More diverse categories
    },
    4: {
        'base_rate': 0.35,  # High contamination route
        'trend': 'increasing',  # Rapidly increasing
        'trend_strength': 0.30,  # 30% increase
        'severity_profile': [0.05, 0.15, 0.25, 0.3, 0.25],  # Many high severity
        'categories': [1, 1, 2, 2, 3],  # Mostly plastic bags and food waste
    },
    5: {
        'base_rate': 0.20,  # Low contamination route
        'trend': 'decreasing',
        'trend_strength': 0.20,
        'severity_profile': [0.3, 0.35, 0.25, 0.08, 0.02],  # Mostly low severity
        'categories': [1, 8, 8, 2, 3],
    },
    6: {
        'base_rate': 0.32,
        'trend': 'increasing',
        'trend_strength': 0.22,
        'severity_profile': [0.1, 0.2, 0.3, 0.25, 0.15],
        'categories': [2, 2, 1, 3, 4],  # More food waste
    },
}

# Container mapping (from seed.sql)
ROUTE_CONTAINERS = {
    1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    2: [4, 5, 6, 8, 14, 15, 16],
    3: [7, 9, 10, 11, 17, 18, 19],
    4: [20, 21, 22, 23, 24],
    5: [9, 10, 12, 13, 25, 26, 27],
    6: [28, 29, 30, 31, 32]
}

DRIVERS = ['Mike Rodriguez', 'Sarah Johnson', 'Carlos Mendez', 'David Kim', 'Lisa Wang', 'James Lee']

def generate_enhanced_seed_data():
    """Generate enhanced seed data with clear trends"""
    
    pickups = []
    contamination_events = []
    
    pickup_id = 1000  # Start after existing seed data
    contamination_id = 1000
    
    current_date = START_DATE
    
    while current_date <= END_DATE:
        day_of_week = current_date.weekday()
        days_elapsed = (current_date - START_DATE).days
        progress = days_elapsed / 90.0  # 0 to 1
        
        # Generate pickups for each route
        for route_id in range(1, NUM_ROUTES + 1):
            pattern = ROUTE_PATTERNS[route_id]
            containers = ROUTE_CONTAINERS[route_id]
            
            # Calculate contamination rate with trend
            if pattern['trend'] == 'increasing':
                trend_mult = 1.0 + (pattern['trend_strength'] * progress)
            elif pattern['trend'] == 'decreasing':
                trend_mult = 1.0 - (pattern['trend_strength'] * progress)
            else:  # stable
                trend_mult = 1.0
            
            contamination_rate = pattern['base_rate'] * trend_mult
            
            # Weekend effect (slightly higher contamination)
            if day_of_week >= 5:
                contamination_rate *= 1.1
            
            # Cap contamination rate
            contamination_rate = min(contamination_rate, 0.5)
            
            # Generate pickups for containers on this route
            for container_id in containers:
                # Not every container every day - simulate weekly pickup schedule
                # Increase frequency to get more data points
                if random.random() < 0.20:  # ~20% chance = more frequent pickups
                    weight = round(random.uniform(8.0, 22.0), 1)
                    driver = random.choice(DRIVERS)
                    
                    # Add notes occasionally
                    notes = None
                    if random.random() < 0.1:
                        notes_options = [
                            'Normal pickup',
                            'Heavy load',
                            'Contamination noted',
                            'High contamination',
                            'Some contamination observed'
                        ]
                        notes = random.choice(notes_options)
                    
                    pickup_time = current_date.replace(
                        hour=random.randint(7, 10),
                        minute=random.choice([0, 15, 30, 45])
                    )
                    
                    pickups.append({
                        'pickup_id': pickup_id,
                        'container_id': container_id,
                        'route_id': route_id,
                        'pickup_time': pickup_time,
                        'weight_kg': weight,
                        'driver_name': driver,
                        'notes': notes
                    })
                    
                    # Generate contamination event based on rate
                    if random.random() < contamination_rate:
                        # Select severity based on route profile
                        severity = random.choices(
                            [1, 2, 3, 4, 5],
                            weights=pattern['severity_profile']
                        )[0]
                        
                        # Contamination percentage based on severity
                        contamination_pct = round(random.uniform(
                            severity * 5,
                            severity * 8
                        ), 1)
                        
                        # Select category based on route pattern
                        category_id = random.choice(pattern['categories'])
                        
                        # Notes for contamination
                        notes_options = [
                            'Plastic bags contamination',
                            'Food waste mixed in',
                            'Styrofoam containers',
                            'Dirty containers',
                            'Some contamination observed',
                            'High contamination',
                            'Many plastic bags',
                            'Significant food waste',
                            'Heavy plastic bag contamination',
                            None
                        ]
                        contamination_notes = random.choice(notes_options)
                        
                        contamination_events.append({
                            'contamination_id': contamination_id,
                            'pickup_id': pickup_id,
                            'category_id': category_id,
                            'severity': severity,
                            'estimated_contamination_pct': contamination_pct,
                            'notes': contamination_notes
                        })
                        contamination_id += 1
                    
                    pickup_id += 1
        
        current_date += timedelta(days=1)
    
    return pickups, contamination_events

def generate_sql_inserts(pickups, contamination_events):
    """Generate SQL INSERT statements"""
    
    sql_lines = []
    
    # Pickups
    sql_lines.append("-- Enhanced seed data for trend alerts and visualizations")
    sql_lines.append("-- Generated data with clear trends over last 90 days")
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
    
    # Split into chunks
    chunk_size = 500
    for i in range(0, len(pickup_values), chunk_size):
        chunk = pickup_values[i:i+chunk_size]
        if i > 0:
            sql_lines.append("INSERT INTO pickups (container_id, route_id, pickup_time, weight_kg, driver_name, notes) VALUES")
        sql_lines.append(",\n".join(chunk) + ";")
        sql_lines.append("")
    
    # Contamination events - match by container_id and pickup_time
    sql_lines.append("-- Enhanced contamination events with diverse severity and categories")
    sql_lines.append("INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes)")
    sql_lines.append("SELECT")
    sql_lines.append("    p.pickup_id,")
    sql_lines.append("    c.category_id,")
    sql_lines.append("    c.severity,")
    sql_lines.append("    c.estimated_contamination_pct,")
    sql_lines.append("    c.notes")
    sql_lines.append("FROM (VALUES")
    
    contamination_value_parts = []
    for c in contamination_events:
        # Find the pickup this contamination event belongs to
        pickup = next((p for p in pickups if p['pickup_id'] == c['pickup_id']), None)
        if not pickup:
            continue
            
        pickup_time_str = pickup['pickup_time'].strftime("'%Y-%m-%d %H:%M:%S'")
        if c['notes']:
            notes = "'" + c['notes'].replace("'", "''") + "'"
        else:
            notes = 'NULL'
        
        contamination_value_parts.append(
            f"    ({pickup['container_id']}, {pickup_time_str}, {c['category_id']}, {c['severity']}, {c['estimated_contamination_pct']}, {notes})"
        )
    
    # Split into chunks
    for i in range(0, len(contamination_value_parts), chunk_size):
        chunk = contamination_value_parts[i:i+chunk_size]
        if i > 0:
            sql_lines.append("INSERT INTO contamination_events (pickup_id, category_id, severity, estimated_contamination_pct, notes)")
            sql_lines.append("SELECT p.pickup_id, c.category_id, c.severity, c.estimated_contamination_pct, c.notes")
            sql_lines.append("FROM (VALUES")
        sql_lines.append(",\n".join(chunk))
        sql_lines.append(") AS c(container_id, pickup_time, category_id, severity, estimated_contamination_pct, notes)")
        sql_lines.append("INNER JOIN pickups p ON p.container_id = c.container_id")
        sql_lines.append("    AND p.pickup_time = c.pickup_time::timestamp;")
        sql_lines.append("")
    
    return "\n".join(sql_lines)

if __name__ == "__main__":
    print("Generating enhanced seed data...")
    print(f"Date range: {START_DATE.date()} to {END_DATE.date()}")
    print(f"Routes configured with different trends:")
    for route_id, pattern in ROUTE_PATTERNS.items():
        print(f"  Route {route_id}: {pattern['trend']} trend ({pattern['trend_strength']*100:.0f}% change)")
    
    pickups, contamination_events = generate_enhanced_seed_data()
    
    print(f"\nGenerated {len(pickups)} pickups")
    print(f"Generated {len(contamination_events)} contamination events")
    
    # Show severity distribution
    severity_counts = {}
    for event in contamination_events:
        severity_counts[event['severity']] = severity_counts.get(event['severity'], 0) + 1
    print(f"\nSeverity distribution:")
    for severity in sorted(severity_counts.keys()):
        print(f"  Level {severity}: {severity_counts[severity]} events")
    
    # Show category distribution
    category_counts = {}
    for event in contamination_events:
        category_counts[event['category_id']] = category_counts.get(event['category_id'], 0) + 1
    print(f"\nCategory distribution:")
    for category_id in sorted(category_counts.keys()):
        print(f"  Category {category_id}: {category_counts[category_id]} events")
    
    sql_content = generate_sql_inserts(pickups, contamination_events)
    
    # Write to file
    output_file = "db/enhanced_seed.sql"
    with open(output_file, 'w') as f:
        f.write(sql_content)
    
    print(f"\nSQL written to {output_file}")
    print(f"\nTo use this data:")
    print(f"  1. Run: psql recycling_contamination -f db/schema.sql")
    print(f"  2. Run: psql recycling_contamination -f db/seed.sql")
    print(f"  3. Run: psql recycling_contamination -f {output_file}")

