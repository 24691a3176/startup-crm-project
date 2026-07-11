import api from './api';

export const leadService = {
  getLeads: async (params) => {
    const response = await api.get('/api/leads', { params });
    return response.data;
  },
  
  createLead: async (leadData) => {
    const response = await api.post('/api/leads', leadData);
    return response.data;
  },
  
  updateLead: async (id, leadData) => {
    const response = await api.put(`/api/leads/${id}`, leadData);
    return response.data;
  },
  
  updateLeadStatus: async (id, status) => {
    const response = await api.patch(`/api/leads/${id}/status`, { status });
    return response.data;
  },
  
  deleteLead: async (id) => {
    const response = await api.delete(`/api/leads/${id}`);
    return response.data;
  },
  
  // Routes match backend: GET /api/leads/stats  and  GET /api/leads/monthly-stats
  getLeadStats: async () => {
    const response = await api.get('/api/leads/stats');
    return response.data;
  },
  
  getMonthlyStats: async () => {
    const response = await api.get('/api/leads/monthly-stats');
    return response.data;
  }
};
