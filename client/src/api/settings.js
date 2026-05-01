import api from './axios';

export const fetchSettingsProfile = () => api.get('/settings/profile');
export const updateProfile = (data) => api.put('/settings/profile', data);
export const changePassword = (data) => api.put('/settings/password', data);
export const updatePreferences = (data) => api.put('/settings/preferences', data);
