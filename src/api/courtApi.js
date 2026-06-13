import api from './axios';

export const getMyCourts = (complexId) => api.get('/courts', { params: { complexId } });

export const createCourt = (data, photo) => {
  const form = new FormData();
  Object.entries(data).forEach(([k, v]) => form.append(k, v));
  if (photo) form.append('photo', photo);
  return api.post('/courts', form);
};

export const updateCourt = (id, data, photo) => {
  const form = new FormData();
  Object.entries(data).forEach(([k, v]) => form.append(k, v));
  if (photo) form.append('photo', photo);
  return api.put(`/courts/${id}`, form);
};

export const deleteCourt = (id) => api.delete(`/courts/${id}`);
