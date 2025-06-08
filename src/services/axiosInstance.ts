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
      "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJ2bi5lZHUuZnB0Lm1lZGljYWxkaWFnbm9zaXMiLCJzdWIiOiJhZG1pbiIsImV4cCI6MTc0OTQwNDEzMywiaWF0IjoxNzQ5NDAwNTMzLCJqdGkiOiIxMTk2NWNkZS1mMDc2LTQ5MjMtODdlYi01NWMwYmYxZmI4ZTQiLCJzY29wZSI6IlJPTEVfQURNSU4ifQ.djsY1k6LdHrLeaN0d7NcXjwFdIZR_DEBs0V8opUdmq9Dlu0BRnU9PjuK6SSt_AfslCYYVAZg7CYfIEp54yYyAA";
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
