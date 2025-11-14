import { useQuery } from '@tanstack/react-query';
import { contaminationApi, type PredictiveSearch } from '../lib/api';
import { useNavigate } from '@tanstack/react-router';

export function PredictiveSearches() {
  const navigate = useNavigate();
  const { data: searches, isLoading } = useQuery({
    queryKey: ['predictive-searches'],
    queryFn: () => contaminationApi.getPredictiveSearches(),
  });

  const handleSearchClick = (search: PredictiveSearch) => {
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
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">🤖 AI-Powered Insights</h2>
        <div className="animate-pulse space-y-3">
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!searches || searches.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg shadow-lg p-6 border border-purple-200">
      <div className="flex items-center mb-4">
        <div className="text-2xl mr-2">🤖</div>
        <h2 className="text-xl font-semibold text-gray-900">AI-Powered Insights</h2>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Based on recent trends, here are some searches that might be helpful:
      </p>
      
      <div className="space-y-3">
        {searches.map((search, index) => (
          <button
            key={index}
            onClick={() => handleSearchClick(search)}
            className="w-full text-left bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200 hover:border-purple-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <h3 className="font-semibold text-gray-900 mr-2">{search.title}</h3>
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                    {Math.round(search.confidence * 100)}% confidence
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{search.description}</p>
                <p className="text-xs text-gray-500 italic">💡 {search.insight}</p>
              </div>
              <div className="ml-4 text-purple-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

