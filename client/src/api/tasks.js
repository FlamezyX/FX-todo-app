import api from './axios';

export const fetchTasks = (params) => api.get('/tasks', { params });
export const createTask = (data) => api.post('/tasks', data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const toggleSubtask = (subtaskId) => api.patch(`/tasks/subtask/${subtaskId}/toggle`);
