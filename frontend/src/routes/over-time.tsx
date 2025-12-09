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

  // Process data for time series with proper date handling
  const timeSeriesData = contaminationData?.reduce((acc: any[], event) => {
    const date = new Date(event.pickupTime || event.createdAt);
    const dateKey = date.toISOString().split('T')[0];
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

  // Calculate moving averages
  const timeSeriesWithMovingAvg = timeSeriesData.map((item, index) => {
    const movingAvgCount = index < 6 ? null : 
      timeSeriesData.slice(index - 6, index + 1).reduce((sum, d) => sum + d.count, 0) / 7;
    const movingAvgSeverity = index < 6 ? null :
      timeSeriesData.slice(index - 6, index + 1).reduce((sum, d) => sum + d.avgSeverity, 0) / 7;
    const movingAvgPct = index < 6 ? null :
      timeSeriesData.slice(index - 6, index + 1).reduce((sum, d) => sum + d.avgPct, 0) / 7;
    return {
      ...item,
      movingAvgCount,
      movingAvgSeverity,
      movingAvgPct,
    };
  });

  // Calculate trend indicators
  const calculateTrend = (data: any[], days: number = 7) => {
    if (data.length < days * 2) return null;
    
    const recent = data.slice(-days);
    const previous = data.slice(-days * 2, -days);
    
    const recentAvg = recent.reduce((sum, d) => sum + d.count, 0) / recent.length;
    const previousAvg = previous.reduce((sum, d) => sum + d.count, 0) / previous.length;
    
    if (previousAvg === 0) return null;
    
    const change = ((recentAvg - previousAvg) / previousAvg) * 100;
    return {
      change,
      isIncreasing: change > 0,
      recentAvg,
      previousAvg,
    };
  };

  const eventTrend = calculateTrend(timeSeriesData, 7);
  const severityTrend = timeSeriesData.length >= 14 ? (() => {
    const recent = timeSeriesData.slice(-7);
    const previous = timeSeriesData.slice(-14, -7);
    const recentAvg = recent.reduce((sum, d) => sum + d.avgSeverity, 0) / recent.length;
    const previousAvg = previous.reduce((sum, d) => sum + d.avgSeverity, 0) / previous.length;
    const change = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;
    return { change, isIncreasing: change > 0, recentAvg, previousAvg };
  })() : null;
  const contaminationTrend = timeSeriesData.length >= 14 ? (() => {
    const recent = timeSeriesData.slice(-7);
    const previous = timeSeriesData.slice(-14, -7);
    const recentAvg = recent.reduce((sum, d) => sum + d.avgPct, 0) / recent.length;
    const previousAvg = previous.reduce((sum, d) => sum + d.avgPct, 0) / previous.length;
    const change = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;
    return { change, isIncreasing: change > 0, recentAvg, previousAvg };
  })() : null;

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

      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Events Over Time</h2>
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
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={timeSeriesWithMovingAvg}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={eventTrend?.isIncreasing ? "#ef4444" : "#22c55e"} stopOpacity={0.8}/>
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
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke={eventTrend?.isIncreasing ? "#ef4444" : "#22c55e"} 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorCount)" 
              name="Contamination Events" 
            />
            {timeSeriesData.length > 7 && (
              <Line 
                type="monotone" 
                dataKey="movingAvgCount" 
                stroke="#6366f1" 
                strokeWidth={2} 
                strokeDasharray="5 5"
                name="7-Day Average"
                dot={false}
                connectNulls={false}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
        {eventTrend && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600">
              <span className="font-semibold">Trend Analysis:</span> {' '}
              {eventTrend.isIncreasing ? (
                <span className="text-red-700">
                  Contamination events are increasing. Average {eventTrend.recentAvg.toFixed(1)} events/day 
                  in the last 7 days vs {eventTrend.previousAvg.toFixed(1)} events/day in the previous period.
                </span>
              ) : (
                <span className="text-green-700">
                  Contamination events are decreasing. Average {eventTrend.recentAvg.toFixed(1)} events/day 
                  in the last 7 days vs {eventTrend.previousAvg.toFixed(1)} events/day in the previous period.
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Average Severity Trend</h2>
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
                      {severityTrend.isIncreasing ? '+' : ''}{severityTrend.change.toFixed(1)}%
                    </span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                    <span className="text-sm font-semibold text-green-700">
                      {severityTrend.change.toFixed(1)}%
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesWithMovingAvg}>
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
                name="Avg Severity"
                dot={{ fill: severityTrend?.isIncreasing ? "#f59e0b" : "#22c55e", r: 4 }}
                activeDot={{ r: 6 }}
              />
              {timeSeriesData.length > 7 && (
                <Line 
                  type="monotone" 
                  dataKey="movingAvgSeverity" 
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
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Average Contamination % Trend</h2>
            {contaminationTrend && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                contaminationTrend.isIncreasing 
                  ? 'bg-red-50 border border-red-200' 
                  : 'bg-green-50 border border-green-200'
              }`}>
                {contaminationTrend.isIncreasing ? (
                  <>
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-sm font-semibold text-red-700">
                      {contaminationTrend.isIncreasing ? '+' : ''}{contaminationTrend.change.toFixed(1)}%
                    </span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                    <span className="text-sm font-semibold text-green-700">
                      {contaminationTrend.change.toFixed(1)}%
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesWithMovingAvg}>
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
                label={{ value: 'Contamination %', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
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
                dataKey="avgPct" 
                stroke={contaminationTrend?.isIncreasing ? "#ef4444" : "#22c55e"} 
                strokeWidth={3} 
                name="Avg Contamination %"
                dot={{ fill: contaminationTrend?.isIncreasing ? "#ef4444" : "#22c55e", r: 4 }}
                activeDot={{ r: 6 }}
              />
              {timeSeriesData.length > 7 && (
                <Line 
                  type="monotone" 
                  dataKey="movingAvgPct" 
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
        </div>
      </div>
    </div>
  );
}

