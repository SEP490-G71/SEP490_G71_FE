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
    // const subdomain = hostname.split('.')[0];
    console.log(hostname);

    const subdomain = "hadong";
    console.log(subdomain);


    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // else {
    //   window.location.href = "/home/login";
    // }

    if (subdomain && !config.url?.includes("/auth/register")) {
      config.headers["X-Tenant-ID"] = subdomain;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;


