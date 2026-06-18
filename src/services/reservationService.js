import api from './axios';

export const getReservasOwner = (params)  => api.get('/bookings', { params });
export const createReserva    = (data)    => api.post('/bookings', data);
export const confirmarReserva = (id)      => api.patch(`/bookings/${id}/confirm`);
export const rechazarReserva  = (id, nota) => api.patch(`/bookings/${id}/reject`, { reason: nota });
export const cancelarReserva  = (id)      => api.patch(`/bookings/${id}/cancel`);
