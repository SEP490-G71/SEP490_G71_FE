import axios from "axios";

const axiosInstanceSuperAdmin = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstanceSuperAdmin.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("sa_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstanceSuperAdmin.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";

    if (
      status === 401 &&
      !/\/auth\/login\b/.test(url) &&
      !/\/auth\/superadmin\/login\b/.test(url)
    ) {
      localStorage.removeItem("sa_token");
      window.location.replace("/superadmin/signin");
    }

    return Promise.reject(error);
  }
);

export default axiosInstanceSuperAdmin;
