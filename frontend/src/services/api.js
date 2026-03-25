import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (error.response && error.response.status === 401 && refreshToken) {
      const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
        refresh: refreshToken,
      });

      localStorage.setItem("accessToken", res.data.access);

      error.config.headers.Authorization = `Bearer ${res.data.access}`;

      return API(error.config);
    }

    return Promise.reject(error);
  },
);

export default API;
