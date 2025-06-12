import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJ2bi5lZHUuZnB0Lm1lZGljYWxkaWFnbm9zaXMiLCJzdWIiOiJhZG1pbiIsImV4cCI6MTc0OTcyOTQwNSwiaWF0IjoxNzQ5NzI1ODA1LCJqdGkiOiJmYmRmMWIzYy0xODBmLTQ2YTItYjYzYS05NzU2ZjQyMTlhYTAiLCJzY29wZSI6IlJPTEVfQURNSU4ifQ.9iiqwrOKems0tBFE8QMil83U9fpPuvK8uDiJ8NvpaE_pumblq6aYqSeRKfh0ygIeRkTEE_ILu9MQK2rEARvvYQ"
    // const hostname = window.location.hostname;
    // const subdomain = hostname.split('.')[0];  // Lấy phần subdomain (ví dụ: hospital_abc)
    const subdomain = "hadong";
    console.log(subdomain);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (subdomain && !config.url?.includes("/auth/register")) {
      // Không gửi X-Tenant-ID nếu là API register
      config.headers["X-Tenant-ID"] = subdomain;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;