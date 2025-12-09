import { useQuery } from '@tanstack/react-query';
import { contaminationApi, type PredictiveSearch } from '../lib/api';
import { useNavigate } from '@tanstack/react-router';
import { type ReactNode } from 'react';

type AlertType = 'campaign' | 'email' | 'route' | 'trend';

interface AlertConfig {
  type: AlertType;
  icon: ReactNode;
  color: string;
  borderColor: string;
  bgColor: string;
  actionLabel: string;
}

function getAlertConfig(search: PredictiveSearch): AlertConfig {
  // Campaign alert - create campaign
  if (search.title === 'Overall Contamination Trend Alert' || 
      search.insight?.includes('Create a new campaign')) {
    return {
      type: 'campaign',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: 'text-blue-700',
      borderColor: 'border-blue-300 hover:border-blue-500',
      bgColor: 'bg-blue-50',
      actionLabel: 'Create Campaign'
    };
  }

  // Email alert - send email
  if (search.title.startsWith('Focus on')) {
    return {
      type: 'email',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'text-purple-700',
      borderColor: 'border-purple-300 hover:border-purple-500',
      bgColor: 'bg-purple-50',
      actionLabel: 'Send Email'
    };
  }

  // Route alert - view routes
  if (search.queryType === 'route' && search.queryParams.routeId) {
    return {
      type: 'route',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      color: 'text-green-700',
      borderColor: 'border-green-300 hover:border-green-500',
      bgColor: 'bg-green-50',
      actionLabel: 'View Routes'
    };
  }

  // Trend alert - view trends (default)
  return {
    type: 'trend',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: 'text-orange-700',
    borderColor: 'border-orange-300 hover:border-orange-500',
    bgColor: 'bg-orange-50',
    actionLabel: 'View Trends'
  };
}

export function PredictiveSearches() {
  const navigate = useNavigate();
  const { data: searches, isLoading } = useQuery({
    queryKey: ['predictive-searches'],
    queryFn: () => contaminationApi.getPredictiveSearches(),
  });

  const handleSearchClick = (search: PredictiveSearch) => {
    // Check if this is an "Overall Contamination Trend Alert" - navigate to campaign preview
    if (search.title === 'Overall Contamination Trend Alert' || 
        search.insight?.includes('Create a new campaign')) {
      navigate({
        to: '/campaign-preview'
      });
      return;
    }

    // Check if this is a "Focus on..." prediction
    if (search.title.startsWith('Focus on')) {
      // Extract the contamination type from the title (e.g., "Focus on Plastic bags and film" -> "Plastic bags and film")
      const contaminationType = search.title.replace('Focus on ', '');
      
      // Navigate to email preview page
      navigate({
        to: '/email-preview',
        search: { contaminationType }
      });
      return;
    }
    
    // Original navigation logic for other prediction types
    if (search.queryType === 'route' && search.queryParams.routeId) {
      navigate({ to: '/routes' });
      // Could scroll to specific route card or highlight it
    } else if (search.queryType === 'trend') {
      navigate({ 
        to: '/over-time',
        search: search.queryParams
      });
    } else {
      navigate({ to: '/over-time' });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <svg className="w-6 h-6 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">AI Insights</h2>
            <p className="text-sm text-gray-500">Analyzing trends...</p>
          </div>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg"></div>
          <div className="h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg"></div>
          <div className="h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!searches || searches.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">AI-Powered Insights</h2>
            <p className="text-sm text-purple-100 mt-0.5">
              Actionable recommendations based on ML analysis
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="space-y-4">
          {searches.map((search, index) => {
            const config = getAlertConfig(search);
            return (
              <button
                key={index}
                onClick={() => handleSearchClick(search)}
                className={`group w-full text-left rounded-xl p-5 hover:shadow-xl transition-all duration-300 border-2 ${config.borderColor} ${config.bgColor} hover:scale-[1.02] hover:-translate-y-0.5`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon Container */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${config.bgColor} border-2 ${config.borderColor} flex items-center justify-center ${config.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    {config.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                            {search.title}
                          </h3>
                          <span className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${config.color} ${config.bgColor} border ${config.borderColor} shadow-sm`}>
                            {config.actionLabel}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                          {search.description}
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/80 rounded-lg border border-gray-200 shadow-sm">
                            <svg className="w-3.5 h-3.5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs font-semibold text-gray-700">
                              {Math.round(search.confidence * 100)}% confidence
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/80 rounded-lg border border-gray-200 shadow-sm">
                            <span className="text-lg">💡</span>
                            <span className="text-xs font-medium text-gray-700 italic">
                              {search.insight}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  <div className={`flex-shrink-0 ${config.color} mt-1 group-hover:translate-x-1 transition-transform duration-300`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

