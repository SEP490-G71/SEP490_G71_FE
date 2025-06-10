import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('authToken');
    const token =
      "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJ2bi5lZHUuZnB0Lm1lZGljYWxkaWFnbm9zaXMiLCJzdWIiOiJhZG1pbiIsImV4cCI6MTc0OTU3MTUzNCwiaWF0IjoxNzQ5NTY3OTM0LCJqdGkiOiJmY2QzZTY5Ni0wZmQzLTQ3NzQtOGY0MS03ZWNkMDUxYjFiMTEiLCJzY29wZSI6IlJPTEVfQURNSU4ifQ.9Zdgyy89ADkZZXob4spSZgmD1vLEoDKuvS8oyui0a8ziGiyvaS0hhr2AM_nImbv9GHMjjfI_VAX6su3WXS_2MQ";
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
