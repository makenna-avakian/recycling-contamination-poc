import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ContaminationEvent {
  contaminationId: number;
  pickupId: number;
  categoryId: number;
  severity: number;
  estimatedContaminationPct: number;
  notes: string | null;
  createdAt: string;
  pickupTime: string;
}

export interface PredictiveSearch {
  title: string;
  description: string;
  queryType: 'route' | 'category' | 'severity' | 'trend' | 'customer';
  queryParams: Record<string, any>;
  confidence: number;
  insight: string;
}

export const contaminationApi = {
  getByRoute: async (routeId: number): Promise<ContaminationEvent[]> => {
    const response = await api.get(`/api/contamination/route/${routeId}`);
    return response.data;
  },

  getOverTime: async (startDate?: string, endDate?: string): Promise<ContaminationEvent[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/api/contamination/over-time?${params.toString()}`);
    return response.data;
  },

  getPredictiveSearches: async (): Promise<PredictiveSearch[]> => {
    const response = await api.get('/api/contamination/predictive-searches');
    return response.data;
  },
};

export default api;

