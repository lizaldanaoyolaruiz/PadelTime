import api from "./api";

export const createComplex = (data) => api.post("/complexes", data);
export const getAllComplexes = () => api.get("/complexes/admin");
export const updateComplex = (id, data) => api.put(`/complexes/${id}`, data);
export const deleteComplex = (id) => api.delete(`/complexes/${id}`);
export const approveComplex = (id) => api.patch(`/complexes/${id}/approve`);
export const rejectComplex = (id, reason = "") =>
  api.patch(`/complexes/${id}/reject`, { reason });
export const suspendComplex = (id, reason = "") =>
  api.patch(`/complexes/${id}/suspend`, { reason });

export const sendApprovalEmail = (_id) =>
  Promise.resolve({ data: { sent: true } });
export const sendRejectionEmail = (_id) =>
  Promise.resolve({ data: { sent: true } });
