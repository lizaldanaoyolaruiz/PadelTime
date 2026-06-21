import api from './axios';

export const checkFavorito   = (complexId) => api.get(`/favorites/${complexId}/check`);
export const agregarFavorito = (complexId) => api.post(`/favorites/${complexId}`);
export const quitarFavorito  = (complexId) => api.delete(`/favorites/${complexId}`);
