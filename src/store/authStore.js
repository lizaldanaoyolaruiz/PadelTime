import { create } from "zustand";
import api from "../services/axios";

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),

  register: async (data) => {
    const res = await api.post("/auth/register", data);
    const { token, user } = res.data;
    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      set({ token, user, isAuthenticated: true });
    }
    return res.data;
  },

  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    const token = res.data.token || res.data.accessToken;
    const user = res.data.user || res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
    return user;
  },

  setAuth: (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
