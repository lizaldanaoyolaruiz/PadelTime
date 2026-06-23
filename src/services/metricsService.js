import api from "./axios";

export const getMetrics = async (periodo = 'mes', startDate = null, endDate = null) => {
  const params = { periodo };
  if (startDate) params.startDate = startDate;
  if (endDate)   params.endDate   = endDate;
  const response = await api.get('/metrics', { params });
  return response.data;
};