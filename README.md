# Recycling Contamination POC

Practicing database development!

A city wants to track recycling pickups and contamination. Staff can log what kind of contamination was seen, how bad it was, and later analyze:

- Which routes/customers are worst offenders?
- Is contamination improving over time?
- Do outreach/education actions help?

## Data Model

We model:

- **Facilities** – MRFs or depots
- **Routes** – collection routes run by trucks, tied to a facility
- **Customers** – households or businesses served by routes
- **Containers** – specific bins/carts at a customer
- **Pickups** – a truck lifting a specific container at a specific time
- **Contamination events** – per pickup, what contamination was seen and how severe
- **Education/outreach actions** – emails, tags, visits to educate customers

## Entities & Relationships

- **facilities** – where material is processed
- **routes** – collection routes run by trucks, tied to a facility
- **customers** – households or businesses served by routes
- **containers** – specific bins/carts at a customer
- **pickups** – a truck lifting a specific container at a specific time
- **contamination_categories** – a dimension table of contamination types
- **contamination_events** – per pickup, what contamination was seen and how severe
- **education_actions** – emails, tags, visits to educate customers
