# Backend - Clean Architecture + DDD

This backend follows **Domain-Driven Design (DDD)** and **Clean Architecture** principles.

## Architecture Layers

```
src/
├── domain/              # Core business logic (no dependencies)
│   ├── entities/        # Domain models
│   └── repositories/    # Repository interfaces (abstractions)
│
├── application/         # Use cases (business workflows)
│   └── use-cases/       # Application logic
│
├── infrastructure/      # External concerns
│   ├── database/        # PostgreSQL connection & repository implementations
│   └── config/          # Dependency injection
│
└── presentation/        # API layer (Express)
    ├── controllers/     # HTTP request handlers
    ├── routes/          # Route definitions
    └── middleware/      # Express middleware
```

## Key Principles

1. **Dependency Rule**: Inner layers don't depend on outer layers
   - Domain has no dependencies
   - Application depends only on Domain
   - Infrastructure implements Domain interfaces
   - Presentation depends on Application

2. **Repository Pattern**: Data access is abstracted through interfaces
   - Domain defines `IContaminationRepository` interface
   - Infrastructure implements `ContaminationRepository`
   - Application uses the interface, not the implementation

3. **Use Cases**: Business logic lives in Application layer
   - Each use case represents a single business operation
   - Use cases orchestrate domain entities and repositories

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=recycling_contamination
   DB_USER=your_username
   DB_PASSWORD=
   PORT=5000
   NODE_ENV=development
   ```

3. **Run in development:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## API Endpoints

- `GET /health` - Health check
- `GET /api/contamination/route/:routeId` - Get contamination by route
- `GET /api/contamination/over-time?startDate=&endDate=` - Get contamination over time

## Adding New Features

1. **Domain Layer**: Add entity or repository interface
2. **Application Layer**: Create use case that uses repositories
3. **Infrastructure Layer**: Implement repository interface
4. **Presentation Layer**: Create controller and route
5. **Dependencies**: Wire everything up in `dependencies.ts`

