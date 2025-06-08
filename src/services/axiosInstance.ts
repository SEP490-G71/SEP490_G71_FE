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
      "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJ2bi5lZHUuZnB0Lm1lZGljYWxkaWFnbm9zaXMiLCJzdWIiOiJhZG1pbiIsImV4cCI6MTc0OTQwMjE0NywiaWF0IjoxNzQ5Mzk4NTQ3LCJqdGkiOiJlM2ZhNTk2Zi1kM2RhLTQ4YmMtYTA4MC1lOTUwOTljNjk1N2QiLCJzY29wZSI6IlJPTEVfQURNSU4ifQ.5NoFqD5UuYLXIa-ma8qflRGQanrfFn9VbOp3Edclrb_k-ADtV43hLP7Pkx4NbJPmflJcsW2kWWq8V_LxTYV-OQ";
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
