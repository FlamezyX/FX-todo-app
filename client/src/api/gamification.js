import api from './axios';

export const fetchGamificationProfile = () => api.get('/gamification/profile');
