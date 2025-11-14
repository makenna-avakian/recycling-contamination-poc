import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { contaminationApi } from '../lib/api';

export const Route = createFileRoute('/routes')({
  component: RoutesPage,
});

function RoutesPage() {
  const routes = [1, 2, 3, 4, 5, 6]; // Route IDs from seed data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Routes</h1>
        <p className="mt-2 text-gray-600">Contamination data by collection route</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((routeId) => (
          <RouteCard key={routeId} routeId={routeId} />
        ))}
      </div>
    </div>
  );
}

function RouteCard({ routeId }: { routeId: number }) {
  const { data: contaminationData, isLoading } = useQuery({
    queryKey: ['contamination-route', routeId],
    queryFn: () => contaminationApi.getByRoute(routeId),
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const eventCount = contaminationData?.length || 0;
  const avgSeverity = contaminationData?.length
    ? contaminationData.reduce((sum, e) => sum + e.severity, 0) / contaminationData.length
    : 0;
  const avgPct = contaminationData?.length
    ? contaminationData.reduce((sum, e) => sum + e.estimatedContaminationPct, 0) / contaminationData.length
    : 0;

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Route {routeId}</h3>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          avgSeverity >= 4 ? 'bg-red-100 text-red-800' :
          avgSeverity >= 3 ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {avgSeverity.toFixed(1)} avg
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Events:</span>
          <span className="font-medium text-gray-900">{eventCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Avg Contamination:</span>
          <span className="font-medium text-gray-900">{avgPct.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}

