import api from './axios';

export const getCourtsSchedule = (params) =>
  api.get('/courts/schedule', { params });

export const updateCourtSchedule = (courtId, data) =>
  api.put(`/courts/${courtId}/schedule`, data);

export const getBlockouts = (params) =>
  api.get('/blockouts', { params });

export const createBlockout = (data) =>
  api.post('/blockouts', data);

export const updateBlockout = (id, data) =>
  api.put(`/blockouts/${id}`, data);

export const deleteBlockout = (id) =>
  api.delete(`/blockouts/${id}`);
