import api from '../api/axios';

export const getMyComplejo = () => api.get('/owner/complejo').then(r => r.data);
export const createComplejo = (data) => api.post('/owner/complejo', data).then(r => r.data);
export const updateComplejo = (data) => api.put('/owner/complejo', data).then(r => r.data);

// Cloudinary unsigned upload — requiere VITE_CLOUDINARY_CLOUD_NAME + VITE_CLOUDINARY_PRESET en .env
export const uploadImage = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const preset = import.meta.env.VITE_CLOUDINARY_PRESET;
  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', preset);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: form,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || 'Error subiendo imagen');
  return json.secure_url;
};

export const getMisCanchas = () => api.get('/owner/canchas').then(r => r.data);
export const createCancha = (data) => api.post('/owner/canchas', data).then(r => r.data);
export const updateCancha = (id, data) => api.put(`/owner/canchas/${id}`, data).then(r => r.data);
export const deleteCancha = (id) => api.delete(`/owner/canchas/${id}`).then(r => r.data);

export const getConfigPagos = () => api.get('/owner/config-pagos').then(r => r.data);
export const updateConfigPagos = (data) => api.put('/owner/config-pagos', data).then(r => r.data);
