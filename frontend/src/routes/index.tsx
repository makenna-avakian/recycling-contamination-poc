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

  // Process data for charts with proper date sorting and trend calculation
  const timeSeriesData = contaminationData?.reduce((acc: any[], event) => {
    const date = new Date(event.pickupTime || event.createdAt);
    const dateKey = date.toISOString().split('T')[0]; // Use ISO date for consistency
    const existing = acc.find(item => item.dateKey === dateKey);
    if (existing) {
      existing.count += 1;
      existing.totalSeverity += event.severity;
      existing.totalPct += event.estimatedContaminationPct;
      existing.avgSeverity = existing.totalSeverity / existing.count;
      existing.avgPct = existing.totalPct / existing.count;
    } else {
      acc.push({
        dateKey,
        date: date.toLocaleDateString(),
        timestamp: date.getTime(),
        count: 1,
        totalSeverity: event.severity,
        totalPct: event.estimatedContaminationPct,
        avgSeverity: event.severity,
        avgPct: event.estimatedContaminationPct,
      });
    }
    return acc;
  }, []).sort((a, b) => a.timestamp - b.timestamp) || [];

  // Calculate moving average for trend line
  const timeSeriesWithMovingAvg = timeSeriesData.map((item, index) => {
    if (index < 6) {
      return { ...item, movingAvg: null };
    }
    const window = timeSeriesData.slice(index - 6, index + 1);
    const avg = window.reduce((sum, d) => sum + d.count, 0) / window.length;
    return { ...item, movingAvg: avg };
  });

  // Calculate trend indicators - compare actual calendar days, not just data points
  const calculateTrend = (data: any[], days: number = 7) => {
    if (data.length === 0) return null;
    
    const now = new Date();
    const recentCutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const previousCutoff = new Date(now.getTime() - days * 2 * 24 * 60 * 60 * 1000);
    
    // Filter by actual calendar dates
    const recent = data.filter(d => {
      const date = new Date(d.timestamp);
      return date >= recentCutoff && date <= now;
    });
    
    const previous = data.filter(d => {
      const date = new Date(d.timestamp);
      return date >= previousCutoff && date < recentCutoff;
    });
    
    if (recent.length === 0 || previous.length === 0) return null;
    
    // Calculate average events per day for each period
    const recentTotal = recent.reduce((sum, d) => sum + d.count, 0);
    const previousTotal = previous.reduce((sum, d) => sum + d.count, 0);
    
    // Get unique days in each period
    const recentDays = new Set(recent.map(d => d.dateKey)).size;
    const previousDays = new Set(previous.map(d => d.dateKey)).size;
    
    const recentAvg = recentDays > 0 ? recentTotal / recentDays : 0;
    const previousAvg = previousDays > 0 ? previousTotal / previousDays : 0;
    
    if (previousAvg === 0) return null;
    
    const change = ((recentAvg - previousAvg) / previousAvg) * 100;
    return {
      change,
      isIncreasing: change > 0,
      recentAvg,
      previousAvg,
      recentDays,
      previousDays,
    };
  };

  const eventTrend = calculateTrend(timeSeriesData, 7);
  
  // Calculate severity trend using calendar days
  const calculateSeverityTrend = (data: any[], days: number = 7) => {
    if (data.length === 0) return null;
    
    const now = new Date();
    const recentCutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const previousCutoff = new Date(now.getTime() - days * 2 * 24 * 60 * 60 * 1000);
    
    const recent = data.filter(d => {
      const date = new Date(d.timestamp);
      return date >= recentCutoff && date <= now;
    });
    
    const previous = data.filter(d => {
      const date = new Date(d.timestamp);
      return date >= previousCutoff && date < recentCutoff;
    });
    
    if (recent.length === 0 || previous.length === 0) return null;
    
    const recentAvg = recent.reduce((sum, d) => sum + d.avgSeverity, 0) / recent.length;
    const previousAvg = previous.reduce((sum, d) => sum + d.avgSeverity, 0) / previous.length;
    
    if (previousAvg === 0) return null;
    
    const change = ((recentAvg - previousAvg) / previousAvg) * 100;
    return { change, isIncreasing: change > 0, recentAvg, previousAvg };
  };
  
  const severityTrend = calculateSeverityTrend(timeSeriesData, 7);

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

      {/* ML-Powered Predictive Searches */}
      <PredictiveSearches />

      {/* Stats Cards with Trend Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-primary-500 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">📊</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Events</p>
                <p className="text-2xl font-semibold text-gray-900">{contaminationData?.length || 0}</p>
              </div>
            </div>
            {eventTrend && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                eventTrend.isIncreasing ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
              }`}>
                {eventTrend.isIncreasing ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                )}
                <span className="text-xs font-semibold">
                  {eventTrend.isIncreasing ? '+' : ''}{eventTrend.change.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          {eventTrend && (
            <p className="text-xs text-gray-500 mt-2 ml-12">
              vs. previous 7 days
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between">
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
            {severityTrend && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                severityTrend.isIncreasing ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
              }`}>
                {severityTrend.isIncreasing ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                )}
                <span className="text-xs font-semibold">
                  {severityTrend.isIncreasing ? '+' : ''}{severityTrend.change.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          {severityTrend && (
            <p className="text-xs text-gray-500 mt-2 ml-12">
              vs. previous 7 days
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-shadow">
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

      {/* Charts with Trend Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Contamination Over Time</h2>
            {eventTrend && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                eventTrend.isIncreasing 
                  ? 'bg-red-50 border border-red-200' 
                  : 'bg-green-50 border border-green-200'
              }`}>
                {eventTrend.isIncreasing ? (
                  <>
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-sm font-semibold text-red-700">
                      {eventTrend.isIncreasing ? '+' : ''}{eventTrend.change.toFixed(1)}% increase
                    </span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                    <span className="text-sm font-semibold text-green-700">
                      {eventTrend.change.toFixed(1)}% decrease
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={timeSeriesWithMovingAvg}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={eventTrend?.isIncreasing ? "#ef4444" : "#22c55e"} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={eventTrend?.isIncreasing ? "#ef4444" : "#22c55e"} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                label={{ value: 'Events', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#374151' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke={eventTrend?.isIncreasing ? "#ef4444" : "#22c55e"} 
                strokeWidth={3} 
                name="Contamination Events"
                dot={{ fill: eventTrend?.isIncreasing ? "#ef4444" : "#22c55e", r: 4 }}
                activeDot={{ r: 6 }}
              />
              {/* Trend line (moving average) */}
              {timeSeriesData.length > 7 && (
                <Line 
                  type="monotone" 
                  dataKey="movingAvg" 
                  stroke="#6366f1" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  name="7-Day Average"
                  dot={false}
                  connectNulls={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
          {eventTrend && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600">
                <span className="font-semibold">Trend Analysis:</span> {' '}
                {eventTrend.isIncreasing ? (
                  <span className="text-red-700">
                    Contamination events are increasing. Average {eventTrend.recentAvg.toFixed(1)} events/day 
                    in the last 7 calendar days ({eventTrend.recentDays} days with data) vs {eventTrend.previousAvg.toFixed(1)} events/day 
                    in the previous 7 calendar days ({eventTrend.previousDays} days with data).
                  </span>
                ) : (
                  <span className="text-green-700">
                    Contamination events are decreasing. Average {eventTrend.recentAvg.toFixed(1)} events/day 
                    in the last 7 calendar days ({eventTrend.recentDays} days with data) vs {eventTrend.previousAvg.toFixed(1)} events/day 
                    in the previous 7 calendar days ({eventTrend.previousDays} days with data).
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Severity Trend</h2>
            {severityTrend && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                severityTrend.isIncreasing 
                  ? 'bg-red-50 border border-red-200' 
                  : 'bg-green-50 border border-green-200'
              }`}>
                {severityTrend.isIncreasing ? (
                  <>
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-sm font-semibold text-red-700">
                      {severityTrend.isIncreasing ? '+' : ''}{severityTrend.change.toFixed(1)}% increase
                    </span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                    <span className="text-sm font-semibold text-green-700">
                      {severityTrend.change.toFixed(1)}% decrease
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                domain={[0, 5]}
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                label={{ value: 'Severity', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#374151' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="avgSeverity" 
                stroke={severityTrend?.isIncreasing ? "#f59e0b" : "#22c55e"} 
                strokeWidth={3} 
                name="Average Severity"
                dot={{ fill: severityTrend?.isIncreasing ? "#f59e0b" : "#22c55e", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          {severityTrend && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600">
                <span className="font-semibold">Severity Analysis:</span> {' '}
                {severityTrend.isIncreasing ? (
                  <span className="text-red-700">
                    Average severity is increasing. {severityTrend.recentAvg.toFixed(2)}/5 in the last 7 days 
                    vs {severityTrend.previousAvg.toFixed(2)}/5 in the previous period.
                  </span>
                ) : (
                  <span className="text-green-700">
                    Average severity is decreasing. {severityTrend.recentAvg.toFixed(2)}/5 in the last 7 days 
                    vs {severityTrend.previousAvg.toFixed(2)}/5 in the previous period.
                  </span>
                )}
              </p>
            </div>
          )}
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

