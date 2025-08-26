import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    const hostname = window.location.hostname;
    console.log(hostname);

    // const subdomain = hostname.split(".")[0];
    const subdomain = "test";

    console.log(subdomain);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (
      subdomain &&
      !config.url?.includes("/auth/register") &&
      !config.url?.includes("/service-packages")
    ) {
      config.headers["X-Tenant-ID"] = subdomain;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";

    if (status === 401) {
      if (!/\/auth\/login\b/.test(url)) {
        localStorage.removeItem("token");
        window.location.replace("/home/signin");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
