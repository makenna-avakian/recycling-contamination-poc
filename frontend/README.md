# Frontend - Recycling Contamination Tracker

React + TypeScript frontend with TanStack Router and Tailwind CSS.

## Features

- 📊 **Dashboard** - Overview with stats and charts
- 🗺️ **Routes** - View contamination data by collection route
- 📈 **Trends** - Track contamination patterns over time
- 🎨 **Beautiful UI** - Modern design with Tailwind CSS
- 📱 **Responsive** - Works on all screen sizes

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **TanStack Router** - File-based routing
- **TanStack Query** - Data fetching and caching
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Axios** - HTTP client

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```env
   VITE_API_URL=http://localhost:5000
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── routes/           # TanStack Router file-based routes
│   ├── __root.tsx   # Root layout with navigation
│   ├── index.tsx    # Dashboard page
│   ├── routes.tsx   # Routes overview page
│   └── over-time.tsx # Trends page
├── lib/
│   └── api.ts       # API client
└── main.tsx         # Entry point
```

## Routes

- `/` - Dashboard with overview stats and charts
- `/routes` - View contamination by route
- `/over-time` - Contamination trends over time

## Development

The app uses TanStack Router's file-based routing. Routes are automatically generated from files in the `src/routes/` directory.

Make sure your backend is running on `http://localhost:5000` before starting the frontend.
