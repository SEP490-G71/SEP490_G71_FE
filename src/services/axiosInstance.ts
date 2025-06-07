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
      "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJ2bi5lZHUuZnB0Lm1lZGljYWxkaWFnbm9zaXMiLCJzdWIiOiJhZG1pbiIsImV4cCI6MTc0OTI4OTM4NywiaWF0IjoxNzQ5Mjg1Nzg3LCJqdGkiOiJmYzQ4Y2JkYi1jNmRkLTQ3ZGItYTgxMi00YTFiZjIwNzg2ZTMiLCJzY29wZSI6IlJPTEVfQURNSU4ifQ.M68_IhUyNm8toqGX36dRymH9L2weEQZ5-WPns_PwYY1OJZhR8vKVG-MTpZOKn-2meTaFsiZM28vFwiAXjA04fw";
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
