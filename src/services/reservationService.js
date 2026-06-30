import api from "./axios";

export const getReservasOwner = (params) => api.get("/bookings", { params });
export const getSlotsCalendar = (params) =>
  api.get("/bookings/slots", { params });
export const getSlotsPublicos = (params) =>
  api.get("/bookings/slots", { params: { ...params, vista: "publica" } });
export const createReserva = (data) => api.post("/bookings", data);
export const confirmarReserva = (id) => api.patch(`/bookings/${id}/confirm`);
export const rechazarReserva = (id, nota) =>
  api.patch(`/bookings/${id}/reject`, { reason: nota });
export const cancelarReserva = (id) => api.patch(`/bookings/${id}/cancel`);
export const getBookingStats = (params) =>
  api.get("/bookings/stats", { params });
export const crearMantenimiento = (data) => api.post("/maintenance", data);
export const getMantenimientos = (params) =>
  api.get("/maintenance", { params });
export const eliminarMantenimiento = (id) => api.delete(`/maintenance/${id}`);
