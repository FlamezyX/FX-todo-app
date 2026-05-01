import api from './axios';

export const fetchNotifications = () => api.get('/notifications');
export const markAllRead = () => api.patch('/notifications/read-all');
export const markRead = (id) => api.patch(`/notifications/${id}/read`);
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);
export const fetchPreferences = () => api.get('/notifications/preferences');
export const updatePreferences = (data) => api.put('/notifications/preferences', data);
