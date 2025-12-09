import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { contaminationApi } from '../lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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

// Category mapping based on seed data order
const CATEGORY_MAP: Record<number, string> = {
  1: 'Plastic Bags',
  2: 'Food Waste',
  3: 'Foam',
  4: 'Electronics',
  5: 'Hazardous',
  6: 'Textiles',
  7: 'Broken Glass',
  8: 'Dirty Containers',
};

const COLORS = {
  category: ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'],
  severity: {
    1: '#10b981', // green
    2: '#84cc16', // light green
    3: '#f59e0b', // yellow
    4: '#ef4444', // red
    5: '#dc2626', // dark red
  },
};

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

  // Calculate category breakdown
  const categoryBreakdown = contaminationData?.reduce((acc: Record<number, number>, event) => {
    acc[event.categoryId] = (acc[event.categoryId] || 0) + 1;
    return acc;
  }, {}) || {};

  const categoryData = Object.entries(categoryBreakdown)
    .map(([categoryId, count]) => ({
      name: CATEGORY_MAP[parseInt(categoryId)] || `Category ${categoryId}`,
      count,
      categoryId: parseInt(categoryId),
    }))
    .sort((a, b) => b.count - a.count);

  // Calculate severity distribution
  const severityBreakdown = contaminationData?.reduce((acc: Record<number, number>, event) => {
    acc[event.severity] = (acc[event.severity] || 0) + 1;
    return acc;
  }, {}) || {};

  const severityData = [1, 2, 3, 4, 5].map(level => ({
    level: `Level ${level}`,
    count: severityBreakdown[level] || 0,
    severity: level,
  }));

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
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Events:</span>
          <span className="font-medium text-gray-900">{eventCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Avg Contamination:</span>
          <span className="font-medium text-gray-900">{avgPct.toFixed(1)}%</span>
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryData.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Category Breakdown</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                style={{ fontSize: '10px' }}
              />
              <YAxis style={{ fontSize: '10px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              />
              <Bar 
                dataKey="count" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.category[index % COLORS.category.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Severity Distribution */}
      {contaminationData && contaminationData.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Severity Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={severityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="level" 
                style={{ fontSize: '11px' }}
              />
              <YAxis style={{ fontSize: '10px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              />
              <Bar 
                dataKey="count" 
                radius={[4, 4, 0, 0]}
              >
                {severityData.map((entry) => (
                  <Cell 
                    key={`cell-${entry.severity}`} 
                    fill={COLORS.severity[entry.severity as keyof typeof COLORS.severity]} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

