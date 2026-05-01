import api from './axios';

export const fetchGoals = () => api.get('/goals');
export const createGoal = (data) => api.post('/goals', data);
export const updateGoal = (id, data) => api.put(`/goals/${id}`, data);
export const deleteGoal = (id) => api.delete(`/goals/${id}`);
export const linkTask = (goalId, taskId) => api.post(`/goals/${goalId}/link`, { taskId });
export const unlinkTask = (taskId) => api.patch(`/goals/unlink/${taskId}`);
