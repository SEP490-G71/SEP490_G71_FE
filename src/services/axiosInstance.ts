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
      "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJ2bi5lZHUuZnB0Lm1lZGljYWxkaWFnbm9zaXMiLCJzdWIiOiJhZG1pbiIsImV4cCI6MTc0OTU1NzIzMywiaWF0IjoxNzQ5NTUzNjMzLCJqdGkiOiJkZDM5NDcyOS1iYjk4LTQxZDYtOTRhOC04MjMyNjdmMzczOTUiLCJzY29wZSI6IlJPTEVfQURNSU4ifQ.jrkZ7_vjlZMR_S8tWHmVIbp3w38YwfoFnzxXb6hH5kIqxZzqM1QvfL3cLQkwKYXjXSOCSZJIIbbn4vSaVf4aog";
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