import api from "./axios";

export const registerUser = (userData) =>
  api.post("/auth/register", userData).then((r) => r.data);

export const loginUser = (credentials) =>
  api.post("/auth/login", credentials).then((r) => r.data);
