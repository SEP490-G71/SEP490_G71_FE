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
      "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJ2bi5lZHUuZnB0Lm1lZGljYWxkaWFnbm9zaXMiLCJzdWIiOiJhZG1pbiIsImV4cCI6MTc0OTQ2OTQ0NywiaWF0IjoxNzQ5NDY1ODQ3LCJqdGkiOiI3Y2JhNjhjYy1jMTg0LTRmNjMtOWI2Ni02NjEwNzcwNTBmYWQiLCJzY29wZSI6IlJPTEVfQURNSU4ifQ.m6FEja57S94-MhoGfZ-nfJ2KxSdS1j_NffB_iZ-fD_Jh1dirNQz3AUbSTUS_5aB9-xK2P-j9UedqdcrAgyFcJQ";
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
