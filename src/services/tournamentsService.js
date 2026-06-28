import api from './api';

export const getTournaments    = (params)     => api.get('/tournaments', { params });
export const getTournamentById = (id)         => api.get(`/tournaments/${id}`);
export const createTournament  = (data)       => api.post('/tournaments', data);
export const updateTournament  = (id, data)   => api.put(`/tournaments/${id}`, data);
export const deleteTournament  = (id)         => api.delete(`/tournaments/${id}`);
