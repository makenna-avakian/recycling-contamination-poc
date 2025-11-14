import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
};

export default api;

