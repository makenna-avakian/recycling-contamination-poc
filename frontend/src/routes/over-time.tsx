import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { contaminationApi } from '../lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

export const Route = createFileRoute('/over-time')({
  component: OverTimePage,
});

function OverTimePage() {
  const { data: contaminationData, isLoading } = useQuery({
    queryKey: ['contamination-over-time'],
    queryFn: () => contaminationApi.getOverTime(),
  });

  // Process data for time series
  const timeSeriesData = contaminationData?.reduce((acc: any[], event) => {
    const date = new Date(event.pickupTime || event.createdAt).toLocaleDateString();
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.count += 1;
      existing.totalSeverity += event.severity;
      existing.totalPct += event.estimatedContaminationPct;
      existing.avgSeverity = existing.totalSeverity / existing.count;
      existing.avgPct = existing.totalPct / existing.count;
    } else {
      acc.push({
        date,
        count: 1,
        totalSeverity: event.severity,
        totalPct: event.estimatedContaminationPct,
        avgSeverity: event.severity,
        avgPct: event.estimatedContaminationPct,
      });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contamination Trends</h1>
        <p className="mt-2 text-gray-600">Track contamination patterns over time</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Events Over Time</h2>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={timeSeriesData}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="count" stroke="#22c55e" fillOpacity={1} fill="url(#colorCount)" name="Events" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Average Severity Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avgSeverity" stroke="#f59e0b" strokeWidth={2} name="Avg Severity" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Average Contamination % Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avgPct" stroke="#ef4444" strokeWidth={2} name="Avg Contamination %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

