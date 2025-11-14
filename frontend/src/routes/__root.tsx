import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
              >
                🗑️ Recycling Contamination Tracker
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:border-b-2 hover:border-primary-600 transition-colors"
                  activeProps={{
                    className: 'text-primary-600 border-b-2 border-primary-600',
                  }}
                >
                  Dashboard
                </Link>
                <Link
                  to="/routes"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:border-b-2 hover:border-primary-600 transition-colors"
                  activeProps={{
                    className: 'text-primary-600 border-b-2 border-primary-600',
                  }}
                >
                  Routes
                </Link>
                <Link
                  to="/over-time"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:border-b-2 hover:border-primary-600 transition-colors"
                  activeProps={{
                    className: 'text-primary-600 border-b-2 border-primary-600',
                  }}
                >
                  Trends
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  ),
});

