import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/ml-capabilities')({
  component: MLCapabilitiesPage,
});

function MLCapabilitiesPage() {
  const capabilities = [
    {
      title: 'Time Series Forecasting',
      icon: '📈',
      description: 'Predicts future contamination trends using SARIMA (Seasonal ARIMA) models',
      features: [
        'Forecasts contamination events up to 30 days ahead',
        'Captures weekly seasonal patterns (s=7)',
        'Handles trends and non-stationary data',
        'Provides confidence intervals for predictions',
      ],
      technical: 'Uses auto-parameter selection with grid search for optimal (p,d,q)(P,D,Q,s) parameters',
    },
    {
      title: 'Trend Detection',
      icon: '🔍',
      description: 'Identifies increasing, decreasing, or stable contamination patterns',
      features: [
        'Week-over-week trend analysis',
        'Percentage change calculations',
        'Threshold-based classification (>20% increase = "increasing")',
        'Moving average analysis over rolling windows',
      ],
      technical: 'Compares recent periods (last 7 days) vs previous periods using statistical analysis',
    },
    {
      title: 'Category Analysis',
      icon: '📊',
      description: 'Identifies which contamination types are most problematic',
      features: [
        'Frequency-based pattern recognition',
        'Top category identification',
        'Category-specific trend analysis',
        'Actionable insights for targeted education',
      ],
      technical: 'Uses COUNT() aggregations and frequency analysis to identify most common patterns',
    },
    {
      title: 'Route-Level Predictions',
      icon: '🗺️',
      description: 'Analyzes contamination patterns at the route level',
      features: [
        'Route-specific trend detection',
        'Identifies worst-performing routes',
        'Predicts route-level contamination increases',
        'Helps prioritize intervention efforts',
      ],
      technical: 'Aggregates contamination events by route and applies time series analysis',
    },
    {
      title: 'Severity Analysis',
      icon: '⚠️',
      description: 'Tracks and predicts severity level trends',
      features: [
        'Average severity trend detection',
        'Severity distribution analysis',
        'Identifies routes with consistently high severity',
        'Predicts severity escalation',
      ],
      technical: 'Analyzes severity levels (1-5 scale) using statistical trend detection',
    },
    {
      title: 'Anomaly Detection',
      icon: '🚨',
      description: 'Finds unusual patterns and outliers in contamination data',
      features: [
        'Statistical threshold-based detection',
        'Identifies sudden spikes or drops',
        'Flags routes with unusual patterns',
        'Helps catch issues early',
      ],
      technical: 'Uses statistical thresholds and frequency analysis to identify outliers',
    },
  ];

  const modelDetails = [
    {
      name: 'SARIMA (Seasonal ARIMA)',
      description: 'Time series forecasting model that captures seasonal patterns',
      advantages: [
        'Handles weekly, monthly, and yearly seasonality',
        'Accounts for trends and non-stationary data',
        'Provides interpretable predictions',
        'Fast training and prediction times',
      ],
    },
    {
      name: 'Statistical Trend Analysis',
      description: 'Pattern recognition using statistical methods',
      advantages: [
        'Zero external dependencies',
        'Real-time analysis',
        'Interpretable results',
        'Low computational cost',
      ],
    },
    {
      name: 'Frequency Analysis',
      description: 'Identifies patterns through aggregation and counting',
      advantages: [
        'Simple and effective',
        'Fast execution',
        'Works with small datasets',
        'Easy to understand',
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-bold">ML Model Capabilities</h1>
            <p className="text-purple-100 mt-2 text-lg">
              Discover what our machine learning models can do to help predict and prevent contamination
            </p>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Our ML-powered system uses <strong>SARIMA (Seasonal ARIMA)</strong> models and statistical analysis 
          to predict contamination trends and generate actionable insights. Instead of requiring users to know 
          what to search for, the system proactively suggests relevant queries based on historical data patterns.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">30 Days</div>
            <div className="text-sm text-blue-700 mt-1">Forecast Horizon</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="text-2xl font-bold text-green-600">&lt;5 Seconds</div>
            <div className="text-sm text-green-700 mt-1">Training Time</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">7 Days</div>
            <div className="text-sm text-purple-700 mt-1">Seasonal Period</div>
          </div>
        </div>
      </div>

      {/* Capabilities Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.map((capability, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="text-4xl">{capability.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{capability.title}</h3>
                  <p className="text-gray-600 mb-4">{capability.description}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Features:</h4>
                  <ul className="space-y-1">
                    {capability.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                  <h4 className="text-xs font-semibold text-gray-500 mb-1">Technical Details:</h4>
                  <p className="text-xs text-gray-600 italic">{capability.technical}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model Details */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">ML Models & Techniques</h2>
        <div className="space-y-6">
          {modelDetails.map((model, index) => (
            <div
              key={index}
              className="border-l-4 border-purple-500 pl-6 py-4 bg-gray-50 rounded-r-lg"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">{model.name}</h3>
              <p className="text-gray-600 mb-4">{model.description}</p>
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Advantages:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {model.advantages.map((advantage, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{advantage}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
        <div className="space-y-4">
          {[
            {
              step: 1,
              title: 'Data Fetching',
              description: 'Queries database for historical contamination data (up to 365 days)',
            },
            {
              step: 2,
              title: 'Time Series Creation',
              description: 'Aggregates data by day into time series format',
            },
            {
              step: 3,
              title: 'SARIMA Fitting',
              description: 'Fits SARIMA model with weekly seasonality (s=7) using grid search',
            },
            {
              step: 4,
              title: 'Forecasting',
              description: 'Predicts next 30 days of contamination events',
            },
            {
              step: 5,
              title: 'Trend Analysis',
              description: 'Identifies increasing/decreasing trends using statistical analysis',
            },
            {
              step: 6,
              title: 'Search Generation',
              description: 'Creates actionable insights and predictive searches based on predictions',
            },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                {item.step}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Real-World Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Proactive Campaign Planning',
              description: 'Predict which routes will have increasing contamination, allowing you to launch education campaigns before problems worsen',
            },
            {
              title: 'Resource Allocation',
              description: 'Identify routes that need immediate attention, helping prioritize staff time and resources',
            },
            {
              title: 'Category-Specific Education',
              description: 'Discover which contamination types are trending up, enabling targeted educational materials',
            },
            {
              title: 'Performance Monitoring',
              description: 'Track whether contamination is improving or worsening over time across different routes',
            },
          ].map((useCase, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">{useCase.title}</h3>
              <p className="text-sm text-gray-600">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-3xl font-bold text-blue-600">~1-5s</div>
            <div className="text-sm text-blue-700 mt-1">Training Time</div>
            <div className="text-xs text-blue-600 mt-2">Per route</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-3xl font-bold text-green-600">&lt;1s</div>
            <div className="text-sm text-green-700 mt-1">Prediction Time</div>
            <div className="text-xs text-green-600 mt-2">Per route</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-3xl font-bold text-purple-600">100-500MB</div>
            <div className="text-sm text-purple-700 mt-1">Memory Usage</div>
            <div className="text-xs text-purple-600 mt-2">Depending on data size</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-3xl font-bold text-orange-600">14+ Days</div>
            <div className="text-sm text-orange-700 mt-1">Minimum Data</div>
            <div className="text-xs text-orange-600 mt-2">Required for SARIMA</div>
          </div>
        </div>
      </div>
    </div>
  );
}
