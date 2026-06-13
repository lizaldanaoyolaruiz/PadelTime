import api from './axios';

export const getReservasOwner = (params) => api.get('/reservas/owner', { params });
export const confirmarReserva = (id) => api.patch(`/reservas/${id}/confirmar`);
export const rechazarReserva  = (id, nota) => api.patch(`/reservas/${id}/rechazar`, { nota });
export const cancelarReserva  = (id) => api.patch(`/reservas/${id}/cancelar`);
