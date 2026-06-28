import api from "./api";

export const getPublicComplexes   = ()   => api.get('/complexes/public');
export const getPublicComplexById = (id) => api.get(`/complexes/public/${id}`);

export const getMyComplexes = ()            => api.get('/complexes/me/all');
export const getMyComplex   = (complexId)   =>
  api.get('/complexes/me', complexId ? { params: { complexId } } : undefined);

export const createComplex = (data)     => api.post("/complexes", data);
export const updateComplex = (id, data) => api.put(`/complexes/${id}`, data);
export const deleteComplex = (id)       => api.delete(`/complexes/${id}`);

export const uploadComplexPhotos = (id, files) => {
  const form = new FormData();
  files.forEach((f) => form.append('photos', f));
  return api.post(`/complexes/${id}/photos`, form);
};

export const deleteComplexPhoto = (id, url) =>
  api.delete(`/complexes/${id}/photos`, { data: { url } });

export const setComplexPrincipalPhoto = (id, url) =>
  api.patch(`/complexes/${id}/photos/principal`, { url });

export const createComplexByAdmin = (data) => api.post('/complexes/admin', data);
export const getAdminComplexes    = (params) => api.get('/complexes/admin', { params });
export const getAllComplexes    = ()       => api.get("/complexes/admin");

export const toggleFeatured = (id)               => api.patch(`/complexes/${id}/featured`);
export const approveComplex = (id)               => api.patch(`/complexes/${id}/approve`);
export const rejectComplex  = (id, reason = "")  => api.patch(`/complexes/${id}/reject`, { reason });
export const suspendComplex = (id, reason = "")  => api.patch(`/complexes/${id}/suspend`, { reason });

export const sendApprovalEmail  = (_id) => Promise.resolve({ data: { sent: true } });
export const sendRejectionEmail = (_id) => Promise.resolve({ data: { sent: true } });
