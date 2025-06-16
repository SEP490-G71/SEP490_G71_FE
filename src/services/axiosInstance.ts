import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJ2bi5lZHUuZnB0Lm1lZGljYWxkaWFnbm9zaXMiLCJzdWIiOiJhZG1pbiIsImV4cCI6MTc1MDAwODkxMiwiaWF0IjoxNzUwMDA1MzEyLCJqdGkiOiJlNTRlZDIxNS1lYmE0LTRmMmItOWJlYy0wYmM4MDcwNGEyNTkiLCJzY29wZSI6IlJPTEVfQURNSU4ifQ.eTp05y_bXnfHHzOD93sSARdY7vcvDCS9qvulhLwWcnGVWtSGXmDeIJ0ho6BW_WsZrcVPRZCaa99Pi5U8EFTwvg";
    // const hostname = window.location.hostname;
    // const subdomain = hostname.split(".")[0];

    const subdomain = "hadong";
    console.log(subdomain);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (subdomain && !config.url?.includes("/auth/register")) {
      config.headers["X-Tenant-ID"] = subdomain;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
