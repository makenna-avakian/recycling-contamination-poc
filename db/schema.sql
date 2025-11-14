-- Drop tables if they exist (for easy re-running during POC)

DROP TABLE IF EXISTS contamination_events CASCADE;

DROP TABLE IF EXISTS contamination_categories CASCADE;

DROP TABLE IF EXISTS pickups CASCADE;

DROP TABLE IF EXISTS containers CASCADE;

DROP TABLE IF EXISTS education_actions CASCADE;

DROP TABLE IF EXISTS customers CASCADE;

DROP TABLE IF EXISTS routes CASCADE;

DROP TABLE IF EXISTS facilities CASCADE;

-- 1. Facilities (MRFs, depots, etc.)

CREATE TABLE facilities (

    facility_id      SERIAL PRIMARY KEY,

    name             TEXT NOT NULL,

    city             TEXT,

    state            TEXT,

    active           BOOLEAN NOT NULL DEFAULT TRUE,

    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

-- 2. Routes

CREATE TABLE routes (

    route_id         SERIAL PRIMARY KEY,

    facility_id      INTEGER NOT NULL REFERENCES facilities(facility_id),

    route_code       TEXT NOT NULL UNIQUE,      

    description      TEXT,

    active           BOOLEAN NOT NULL DEFAULT TRUE,

    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

-- 3. Customers (households, businesses, etc.)

CREATE TABLE customers (

    customer_id      SERIAL PRIMARY KEY,

    external_ref     TEXT,                      

    name             TEXT NOT NULL,             

    customer_type    TEXT NOT NULL CHECK (customer_type IN ('residential', 'commercial')),

    route_id         INTEGER NOT NULL REFERENCES routes(route_id),

    address_line1    TEXT,

    city             TEXT,

    state            TEXT,

    postal_code      TEXT,

    active           BOOLEAN NOT NULL DEFAULT TRUE,

    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

-- 4. Containers (bins/carts assigned to customers)

CREATE TABLE containers (

    container_id     SERIAL PRIMARY KEY,

    customer_id      INTEGER NOT NULL REFERENCES customers(customer_id),

    label            TEXT,                      

    size_gallons     INTEGER,

    stream_type      TEXT NOT NULL CHECK (

                        stream_type IN ('single_stream', 'mixed_paper', 'glass_only', 'organics')

                      ),

    active           BOOLEAN NOT NULL DEFAULT TRUE,

    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

-- 5. Pickups (one row per container lift)

CREATE TABLE pickups (

    pickup_id        SERIAL PRIMARY KEY,

    container_id     INTEGER NOT NULL REFERENCES containers(container_id),

    route_id         INTEGER NOT NULL REFERENCES routes(route_id),

    pickup_time      TIMESTAMPTZ NOT NULL,

    weight_kg        NUMERIC(10,2),             

    driver_name      TEXT,

    notes            TEXT,

    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

-- 6. Contamination categories (lookup / dimension)

CREATE TABLE contamination_categories (

    category_id      SERIAL PRIMARY KEY,

    code             TEXT NOT NULL UNIQUE,      

    description      TEXT NOT NULL

);

-- 7. Contamination events (per pickup)

CREATE TABLE contamination_events (

    contamination_id SERIAL PRIMARY KEY,

    pickup_id        INTEGER NOT NULL REFERENCES pickups(pickup_id) ON DELETE CASCADE,

    category_id      INTEGER NOT NULL REFERENCES contamination_categories(category_id),

    severity         INTEGER NOT NULL CHECK (severity BETWEEN 1 AND 5),

    estimated_contamination_pct NUMERIC(5,2),   

    notes            TEXT,

    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

-- 8. Education / outreach actions to customers

CREATE TABLE education_actions (

    action_id        SERIAL PRIMARY KEY,

    customer_id      INTEGER NOT NULL REFERENCES customers(customer_id),

    action_date      DATE NOT NULL,

    channel          TEXT NOT NULL CHECK (channel IN ('tag_on_bin', 'email', 'phone_call', 'site_visit', 'mail')),

    description      TEXT,

    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()

);

-- Indexes for query performance

-- Fast lookups by route + time

CREATE INDEX idx_pickups_route_time

    ON pickups (route_id, pickup_time);

-- Fast lookup of pickups by container

CREATE INDEX idx_pickups_container

    ON pickups (container_id);

-- Fast lookup of contamination events by pickup

CREATE INDEX idx_contamination_events_pickup

    ON contamination_events (pickup_id);

-- Fast lookup of customers by route

CREATE INDEX idx_customers_route

    ON customers (route_id);

-- Fast lookup of education actions by customer and date

CREATE INDEX idx_education_actions_customer_date

    ON education_actions (customer_id, action_date);

