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
      "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJ2bi5lZHUuZnB0Lm1lZGljYWxkaWFnbm9zaXMiLCJzdWIiOiJhZG1pbiIsImV4cCI6MTc0OTQ1ODc5MywiaWF0IjoxNzQ5NDU1MTkzLCJqdGkiOiJjNDdiYzVkNy01MzVjLTRhYjItODM0Yy05YmMzYmZlYmY4MDAiLCJzY29wZSI6IlJPTEVfQURNSU4ifQ.geQDGU4EAotVcx3Wwn9Gh6mUhkdhGqbYjVGn5tE1x04Nle9cM51NGCzyxWCLoXZENF93ScmvnUG8UsbS9_xIuA";
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
