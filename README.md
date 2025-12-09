# Recycling Contamination Tracker

A full-stack application for tracking recycling pickups and contamination in NYC. Staff can log contamination events, analyze trends, and measure the effectiveness of education/outreach efforts.

> **🤖 ML Features**: This project includes **SARIMA-based machine learning** predictive searches that use time series forecasting models to predict contamination trends. The ML service uses Python with statsmodels for SARIMA model fitting and prediction. The frontend includes an interactive **ML Capabilities** page explaining all model features. See [ML_IMPLEMENTATION_GUIDE.md](./Docs/ML_Integrations/ML_IMPLEMENTATION_GUIDE.md) for details.

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
- Responsive design with mobile menu support

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
- `GET /api/contamination/predictive-searches` - Get ML-powered predictive search suggestions

### Health Check

- `GET /health` - Server health check

## 📈 Frontend Pages

- **Dashboard (`/`)** - Overview with stats cards, charts, ML-powered predictive searches, and recent events table
- **Routes (`/routes`)** - View contamination data by collection route with category breakdown and severity distribution charts
- **Trends (`/over-time`)** - Time-series charts showing contamination patterns over time

## 🗄️ Sample Data

The seed data includes:
- **3 Facilities** - Brooklyn, Queens, Manhattan MRFs
- **6 Routes** - Covering different NYC neighborhoods
- **32 Customers** - Mix of residential and commercial
- **42 Containers** - Various sizes and stream types
- **200+ Pickups** - Spanning 30+ days with increasing trend patterns
- **100+ Contamination Events** - Various severity levels and types, including plastic bag trends
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

## 🤖 ML Service Setup

The backend uses a Python-based ML service for SARIMA predictive trend analysis.

### Install Python Dependencies

```bash
cd backend/ml_service
pip3 install -r requirements.txt
```

### Environment Variables

The ML service uses the same database environment variables as the backend (from `backend/.env`):
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`

### Testing the ML Service

```bash
cd backend/ml_service
python3 sarima_predictor.py
```

This should output JSON with predictive search suggestions.

## 🔒 Security Considerations

### Environment Variables & Secrets

- **Never commit `.env` files** - All `.env` files are in `.gitignore`
- **Use environment variables** for all sensitive configuration:
  - Database credentials (`DB_USER`, `DB_PASSWORD`, `DB_HOST`)
  - API URLs (`VITE_API_URL`, `FRONTEND_URL`)
  - Server ports and configuration
- **Production recommendations**:
  - Use a secrets management service (AWS Secrets Manager, HashiCorp Vault, etc.)
  - Rotate database passwords regularly
  - Use strong, unique passwords for production databases
  - Never hardcode credentials in source code

### Database Security

- **Parameterized queries** - All database queries use parameterized statements to prevent SQL injection
- **Connection pooling** - Uses PostgreSQL connection pooling for efficient and secure connections
- **Input validation** - All route parameters and query strings are validated before use
- **Database user permissions** - Use a dedicated database user with minimal required permissions

### API Security

- **CORS configuration** - CORS is configured to only allow requests from the frontend URL
- **Input validation** - Route IDs and dates are validated before processing
- **Error handling** - Error messages hide sensitive details in production (`NODE_ENV=production`)
- **Read-only endpoints** - Current API endpoints are read-only (GET requests only)

### Frontend Security

- **Environment variables** - API URL configured via environment variable, not hardcoded
- **No sensitive data** - Frontend doesn't store or transmit sensitive credentials
- **HTTPS in production** - Always use HTTPS in production environments

### Production Deployment Checklist

- [ ] Set `NODE_ENV=production` in production environment
- [ ] Configure CORS to only allow your production frontend domain
- [ ] Use HTTPS for all API and frontend endpoints
- [ ] Set up database backups and monitoring
- [ ] Configure rate limiting for API endpoints
- [ ] Set up authentication/authorization if adding write endpoints
- [ ] Review and update `.gitignore` to ensure no sensitive files are tracked
- [ ] Use a reverse proxy (nginx, Cloudflare) for additional security layers
- [ ] Regularly update dependencies for security patches
- [ ] Monitor logs for suspicious activity

### Security Best Practices

1. **Keep dependencies updated** - Regularly run `npm audit` and update packages
2. **Principle of least privilege** - Database users should have minimal required permissions
3. **Defense in depth** - Multiple layers of security (network, application, database)
4. **Regular audits** - Review code and dependencies for security vulnerabilities
5. **Secure defaults** - Error messages don't expose sensitive information in production

## 📝 Notes

- Port 5000 is used by macOS AirPlay, so backend uses port 5001
- Database username should match your system username (or update `.env`)
- Seed data uses NYC addresses and neighborhoods for realism
- ML service requires Python 3.8+ and at least 2 weeks of historical data for SARIMA models
