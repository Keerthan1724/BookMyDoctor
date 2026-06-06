import axios from "axios";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from "./sessionService";

const API = axios.create({
  baseURL: "/api/",
});

const publicAPI = axios.create({
  baseURL: "/api/",
});

API.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const refreshToken = getRefreshToken();

    if (error.response && error.response.status === 401 && refreshToken) {
      try {
        const res = await axios.post("/api/token/refresh/", {
          refresh: refreshToken,
        });

        setAccessToken(res.data.access);

        error.config.headers.Authorization = `Bearer ${res.data.access}`;

        return API(error.config);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        clearSession();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export { publicAPI };
export default API;
