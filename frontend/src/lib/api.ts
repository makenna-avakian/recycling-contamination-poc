import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 95000, // 95 second timeout (backend has 90s, add buffer)
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
  queryParams: Record<string, unknown>;
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

export interface GeneratedEmail {
  subject: string;
  body: string;
}

export interface OllamaStatus {
  available: boolean;
  message: string;
}

export const aiApi = {
  generateEmail: async (contaminationType: string): Promise<GeneratedEmail> => {
    try {
      const response = await api.post('/api/ai/generate-email', { contaminationType }, {
        timeout: 95000, // 95 seconds
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          throw new Error('Request timed out. AI generation is taking too long. Please try again.');
        }
        if (error.response?.status === 503) {
          throw new Error('Ollama is not running. Please start it with: ollama serve');
        }
        throw new Error(error.response?.data?.message || error.message || 'Failed to generate email');
      }
      throw error;
    }
  },

  generateCampaign: async (contaminationType?: string, trendInfo?: string): Promise<Record<string, unknown>> => {
    try {
      const response = await api.post<Record<string, unknown>>('/api/ai/generate-campaign', { contaminationType, trendInfo }, {
        timeout: 45000, // 45 seconds
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          throw new Error('Request timed out. AI generation is taking too long. Please try again.');
        }
        if (error.response?.status === 503) {
          throw new Error('Ollama is not running. Please start it with: ollama serve');
        }
        throw new Error(error.response?.data?.message || error.message || 'Failed to generate campaign');
      }
      throw error;
    }
  },

  getStatus: async (): Promise<OllamaStatus> => {
    const response = await api.get('/api/ai/status', {
      timeout: 5000, // 5 seconds for status check
    });
    return response.data;
  },
};

export default api;

