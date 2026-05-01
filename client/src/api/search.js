import api from './axios';

export const globalSearch = (q) => api.get('/search', { params: { q } });
export const fetchTimeline = (filter, page) => api.get('/timeline', { params: { filter, page } });
