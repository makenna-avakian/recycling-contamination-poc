import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { contaminationApi } from '../lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { PredictiveSearches } from '../components/PredictiveSearches';

export const Route = createFileRoute('/')({
  component: Dashboard,
});

function Dashboard() {
  const { data: contaminationData, isLoading } = useQuery({
    queryKey: ['contamination-over-time'],
    queryFn: () => contaminationApi.getOverTime(),
  });

  // Process data for charts
  const timeSeriesData = contaminationData?.reduce((acc: any[], event) => {
    const date = new Date(event.pickupTime || event.createdAt).toLocaleDateString();
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.count += 1;
      existing.avgSeverity = (existing.avgSeverity + event.severity) / 2;
      existing.totalPct += event.estimatedContaminationPct;
    } else {
      acc.push({
        date,
        count: 1,
        avgSeverity: event.severity,
        totalPct: event.estimatedContaminationPct,
      });
    }
    return acc;
  }, []) || [];

  const severityDistribution = contaminationData?.reduce((acc: any[], event) => {
    const severity = event.severity;
    const existing = acc.find(item => item.severity === severity);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ severity: `Level ${severity}`, count: 1 });
    }
    return acc;
  }, []) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!contaminationData || contaminationData.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Overview of recycling contamination data</p>
        </div>
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg">No contamination data found</p>
          <p className="text-gray-400 text-sm mt-2">Make sure the database has seed data loaded</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Overview of recycling contamination data</p>
      </div>

      {/* AI-Powered Predictive Searches */}
      <PredictiveSearches />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="text-2xl">📊</div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Events</p>
              <p className="text-2xl font-semibold text-gray-900">{contaminationData?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="text-2xl">⚠️</div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Severity</p>
              <p className="text-2xl font-semibold text-gray-900">
                {contaminationData?.length 
                  ? (contaminationData.reduce((sum, e) => sum + e.severity, 0) / contaminationData.length).toFixed(1)
                  : '0'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="text-2xl">📈</div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Contamination %</p>
              <p className="text-2xl font-semibold text-gray-900">
                {contaminationData?.length
                  ? (contaminationData.reduce((sum, e) => sum + e.estimatedContaminationPct, 0) / contaminationData.length).toFixed(1)
                  : '0'}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contamination Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={2} name="Events" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Severity Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={severityDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="severity" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Events Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Contamination Events</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contamination %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contaminationData && contaminationData.length > 0 ? (
                contaminationData.slice(0, 10).map((event) => (
                <tr key={event.contaminationId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(event.pickupTime || event.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      event.severity >= 4 ? 'bg-red-100 text-red-800' :
                      event.severity >= 3 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      Level {event.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.estimatedContaminationPct.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {event.notes || '-'}
                  </td>
                </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No contamination events found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

