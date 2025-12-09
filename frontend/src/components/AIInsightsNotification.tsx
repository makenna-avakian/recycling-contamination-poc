import { useQuery } from '@tanstack/react-query';
import { contaminationApi } from '../lib/api';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export function AIInsightsNotification() {
  const navigate = useNavigate();
  const router = useRouterState();
  const { data: searches } = useQuery({
    queryKey: ['predictive-searches'],
    queryFn: () => contaminationApi.getPredictiveSearches(),
    refetchInterval: 60000, // Refetch every minute
  });

  const [hasNewInsights, setHasNewInsights] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const isOnDashboard = router.location.pathname === '/';

  // Check for new insights
  useEffect(() => {
    if (searches && searches.length > 0) {
      const lastViewed = localStorage.getItem('ai-insights-last-viewed');
      const lastInsightIds = localStorage.getItem('ai-insights-ids');
      
      // Get current insight IDs
      const currentInsightIds = JSON.stringify(searches.map(s => s.title).sort());
      
      // Check if insights have changed or haven't been viewed recently
      const hasChanged = lastInsightIds !== currentInsightIds;
      const isStale = !lastViewed || (Date.now() - parseInt(lastViewed)) > 300000; // 5 minutes
      
      if (hasChanged || isStale) {
        setHasNewInsights(true);
        setIsAnimating(true);
        // Stop animation after a few seconds
        setTimeout(() => setIsAnimating(false), 3000);
      } else {
        setHasNewInsights(false);
      }
    }
  }, [searches]);

  const handleClick = () => {
    // Mark as viewed
    if (searches) {
      localStorage.setItem('ai-insights-last-viewed', Date.now().toString());
      localStorage.setItem('ai-insights-ids', JSON.stringify(searches.map(s => s.title).sort()));
    }
    
    setHasNewInsights(false);
    
    // If already on dashboard, just scroll. Otherwise navigate first.
    if (isOnDashboard) {
      // Small delay to ensure state updates
      setTimeout(() => {
        const insightsElement = document.getElementById('ai-insights-section');
        if (insightsElement) {
          insightsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    } else {
      // Navigate to dashboard and scroll to insights
      navigate({ to: '/' });
      
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const insightsElement = document.getElementById('ai-insights-section');
        if (insightsElement) {
          insightsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  };

  if (!searches || searches.length === 0) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        hasNewInsights
          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${isAnimating ? 'animate-pulse' : ''}`}
      title={hasNewInsights ? 'New AI insights available!' : 'View AI insights'}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
      <span className="hidden sm:inline">AI Insights</span>
      {hasNewInsights && (
        <>
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white shadow-lg">
            {searches.length}
          </span>
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 animate-ping opacity-75"></span>
        </>
      )}
    </button>
  );
}

