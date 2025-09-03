import axios from 'axios';
import { PersonaInstance, ChatRequest, ChatResponse, BurnReport } from '../types/api';

// Configure the base API URL - update this to match your deployed backend
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request/response interceptors for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const personaApi = {
  // Rehydrate a persona from blueprint to active instance
  rehydratePersona: async (personaId: string): Promise<PersonaInstance> => {
    const response = await api.post(`/api/v1/personas/${personaId}/rehydrate`);
    return response.data;
  },
};

export const orchestratorApi = {
  // Send a chat message to an active persona instance
  chat: async (request: ChatRequest): Promise<ChatResponse> => {
    const response = await api.post('/api/v1/orchestrator/chat', request);
    return response.data;
  },
};

export const areApi = {
  // Run a Controlled Burn test on an active persona instance
  runBurn: async (instanceId: string): Promise<BurnReport> => {
    const response = await api.post(`/api/v1/are/run_burn/${instanceId}`);
    return response.data;
  },
};

export const healthApi = {
  // Check if the API is online
  checkHealth: async (): Promise<{ status: string }> => {
    const response = await api.get('/');
    return response.data;
  },
};