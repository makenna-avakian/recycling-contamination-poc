# Recycling Contamination Tracker

A full-stack application for tracking recycling pickups and contamination in NYC. Staff can log contamination events, analyze trends, and measure the effectiveness of education/outreach efforts.

> **🤖 ML Features**: This project includes **machine learning-powered** predictive searches that use statistical analysis and pattern recognition to suggest actionable insights. See [AI_IMPLEMENTATION_GUIDE.md](./Docs/ML_Integrations/AI_IMPLEMENTATION_GUIDE.md) for a detailed explanation of how the ML functionality was implemented and how to replicate it (or add true AI/LLM features) in other projects.

## 🎯 Project Goals

Track and analyze:
- **Which routes/customers are worst offenders?**
- **Is contamination improving over time?**
- **Do outreach/education actions help?**

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Node.js + Express
- TypeScript
- PostgreSQL
- Clean Architecture + Domain-Driven Design (DDD)

**Frontend:**
- React 19 + TypeScript
- TanStack Router (file-based routing)
- TanStack Query (data fetching)
- Tailwind CSS (styling)
- Recharts (data visualization)

**Database:**
- PostgreSQL 15

## 📊 Data Model

### Entities

- **Facilities** – MRFs or depots where material is processed
- **Routes** – Collection routes run by trucks, tied to a facility
- **Customers** – Households or businesses served by routes
- **Containers** – Specific bins/carts at a customer location
- **Pickups** – A truck lifting a specific container at a specific time
- **Contamination Categories** – Dimension table of contamination types (plastic bags, food waste, styrofoam, etc.)
- **Contamination Events** – Per pickup, what contamination was seen and how severe (1-5 scale)
- **Education Actions** – Outreach efforts (tags, emails, site visits, phone calls, mail)

### Relationships

```
facilities (1) ──< (many) routes
routes (1) ──< (many) customers
customers (1) ──< (many) containers
containers (1) ──< (many) pickups
pickups (1) ──< (many) contamination_events
contamination_events (many) ──> (1) contamination_categories
customers (1) ──< (many) education_actions
```

## 🚀 Getting Started

### Prerequisites

- PostgreSQL 15+ installed and running
- Node.js 20+ installed
- npm or yarn

### Database Setup

1. **Start PostgreSQL:**
   ```bash
   brew services start postgresql@15
   ```

2. **Run the setup script:**
   ```bash
   ./setup.sh
   ```
   
   This will:
   - Create the `recycling_contamination` database
   - Run the schema to create all tables
   - Load seed data with NYC sample data

3. **Or manually:**
   ```bash
   createdb recycling_contamination
   psql recycling_contamination -f db/schema.sql
   psql recycling_contamination -f db/seed.sql
   ```

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   Create `backend/.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=recycling_contamination
   DB_USER=your_username
   DB_PASSWORD=
   PORT=5001
   NODE_ENV=development
   ```

4. **Start the backend:**
   ```bash
   npm run dev
   ```
   
   Backend runs on `http://localhost:5001`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   Create `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5001
   ```

4. **Start the frontend:**
   ```bash
   npm run dev
   ```
   
   Frontend runs on `http://localhost:5173`

## 📁 Project Structure

```
recycling-contamination-poc/
├── db/
│   ├── schema.sql          # Database schema
│   ├── seed.sql            # Sample data
│   └── queries/            # SQL queries
├── backend/
│   ├── src/
│   │   ├── domain/         # Domain layer (entities, repository interfaces)
│   │   ├── application/    # Application layer (use cases)
│   │   ├── infrastructure/ # Infrastructure layer (database, config)
│   │   └── presentation/   # Presentation layer (Express routes, controllers)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── routes/         # TanStack Router pages
│   │   ├── lib/            # API client
│   │   └── main.tsx        # Entry point
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Contamination API

- `GET /api/contamination/route/:routeId` - Get contamination events by route
- `GET /api/contamination/over-time?startDate=&endDate=` - Get contamination events over time

### Health Check

- `GET /health` - Server health check

## 📈 Frontend Pages

- **Dashboard (`/`)** - Overview with stats cards, charts, and recent events table
- **Routes (`/routes`)** - View contamination data by collection route
- **Trends (`/over-time`)** - Time-series charts showing contamination patterns

## 🗄️ Sample Data

The seed data includes:
- **3 Facilities** - Brooklyn, Queens, Manhattan MRFs
- **6 Routes** - Covering different NYC neighborhoods
- **32 Customers** - Mix of residential and commercial
- **42 Containers** - Various sizes and stream types
- **42 Pickups** - Spanning 3 weeks for trend analysis
- **24 Contamination Events** - Various severity levels and types
- **16 Education Actions** - Different outreach channels

## 🧪 Development

### Backend Commands

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm start        # Run production build
```

### Frontend Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🏛️ Architecture Principles

### Clean Architecture Layers

1. **Domain** - Core business logic, no dependencies
2. **Application** - Use cases, depends on domain
3. **Infrastructure** - Database, external services, depends on domain/application
4. **Presentation** - API/UI, depends on application

### DDD Concepts

- **Entities** - Domain objects with identity
- **Repositories** - Data access abstraction
- **Use Cases** - Business workflows
- **Value Objects** - Immutable domain concepts

## 📝 Notes

- Port 5000 is used by macOS AirPlay, so backend uses port 5001
- Database username should match your system username (or update `.env`)
- Seed data uses NYC addresses and neighborhoods for realism

## 🔮 Future Enhancements

- Add more query endpoints (worst offenders, education effectiveness)
- Date range filtering in frontend
- Export data functionality
- User authentication
- Real-time updates
