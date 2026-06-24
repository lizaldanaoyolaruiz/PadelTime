import api from './api';

export const getTorneos    = (params)     => api.get('/torneos', { params });
export const getTorneoById = (id)         => api.get(`/torneos/${id}`);
export const createTorneo  = (data)       => api.post('/torneos', data);
export const updateTorneo  = (id, data)   => api.put(`/torneos/${id}`, data);
export const deleteTorneo  = (id)         => api.delete(`/torneos/${id}`);
