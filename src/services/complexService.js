import api from './api';

export const getAllComplexes     = ()              => api.get('/admin/clubs');
export const createComplex      = (data)          => api.post('/admin/clubs', data);
export const updateComplex      = (id, data)      => api.put(`/admin/clubs/${id}`, data);
export const deleteComplex      = (id)            => api.delete(`/admin/clubs/${id}`);
export const approveComplex     = (id)            => api.patch(`/admin/clubs/${id}/approve`);
export const rejectComplex      = (id, reason='') => api.patch(`/admin/clubs/${id}/reject`, { reason });
export const suspendComplex     = (id)            => api.patch(`/admin/clubs/${id}/suspend`);

export const sendApprovalEmail  = (_id) => Promise.resolve({ data: { sent: true } });
export const sendRejectionEmail = (_id) => Promise.resolve({ data: { sent: true } });
