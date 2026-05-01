import api from './axios';

export const fetchStats = () => api.get('/stats');
