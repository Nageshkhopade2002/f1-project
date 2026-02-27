// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});


// attach token automatically
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("token");
  const token = raw
    ? (() => {
        try {
          const parsed = JSON.parse(raw);
          return parsed?.token || raw;
        } catch {
          return raw;
        }
      })()
    : null;

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ===================== SCHEDULE – USER ===================== */
export const getScheduleByYear = (year) =>
  api.get(`/schedule/${year}`).then(res => res.data);

export const getRaceDetails = (id) =>
  api.get(`/schedule/race/${id}`).then(res => res.data);

/* ===================== SCHEDULE – ADMIN ===================== */
export const createSeason = (data) =>
  api.post(`/admin/schedule/season`, data).then(res => res.data);

export const createCircuit = (data) =>
  api.post(`/admin/schedule/circuit`, data).then(res => res.data);

export const createRace = (data) =>
  api.post(`/admin/schedule/race`, data).then(res => res.data);

export const createSession = (data) =>
  api.post(`/admin/schedule/session`, data).then(res => res.data);

// ===== ADMIN – SCHEDULE CRUD =====
export const getAllRaces2026 = () =>
  api.get("/schedule/2026").then(res => res.data);

export const updateRace = (id, data) =>
  api.put(`/admin/schedule/race/${id}`, data).then(res => res.data);

export const deleteRace = (id) =>
  api.delete(`/admin/schedule/race/${id}`).then(res => res.data);

/* ===================== TEAMS ===================== */
export const getAllTeams = () =>
  api.get("/teams").then(res => res.data);

export const getTeamById = (id) =>
  api.get(`/teams/${id}`).then(res => res.data);


/* ===================== DRIVERS ===================== */
export const getAllDrivers = () =>
  api.get("/drivers").then(res => res.data);

export const getDriverById = (id) =>
  api.get(`/drivers/${id}`).then(res => res.data);


/* ===================== NEWS ===================== */
export const getAllNews = () =>
  api.get("/news").then(res => res.data);

export const getNewsById = (id) =>
  api.get(`/news/${id}`).then(res => res.data);



export default api;
