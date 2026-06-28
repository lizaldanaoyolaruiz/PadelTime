import api from './axios';

export const getPublicCourts = (complexId) => api.get('/courts/public', { params: { complexId } });
export const getPublicCourtById = (id) => api.get(`/courts/public/${id}`);

export const getMyCourts = (complexId) => api.get('/courts', { params: { complexId } });

export const createCourt = (data) => {
  const form = new FormData();
  Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== null) form.append(k, v); });
  return api.post('/courts', form);
};

export const updateCourt = (id, data) => {
  const form = new FormData();
  Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== null) form.append(k, v); });
  return api.put(`/courts/${id}`, form);
};

export const deleteCourt = (id) => api.delete(`/courts/${id}`);

export const uploadCourtPhotos = (id, files) => {
  const form = new FormData();
  files.forEach(f => form.append('photos', f));
  return api.post(`/courts/${id}/photos`, form);
};

export const deleteCourtPhoto = (id, url) =>
  api.delete(`/courts/${id}/photos`, { data: { url } });

export const setCourtPrincipalPhoto = (id, url) =>
  api.patch(`/courts/${id}/photos/principal`, { url });
