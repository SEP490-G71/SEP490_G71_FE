import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem('authToken');
        const token = "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJ2bi5lZHUuZnB0Lm1lZGljYWxkaWFnbm9zaXMiLCJzdWIiOiJhZG1pbiIsImV4cCI6MTc0OTE4MTAzMSwiaWF0IjoxNzQ5MTc3NDMxLCJqdGkiOiIxZGExMjEzZC0wZjFhLTQ5OWMtODI2NS1iNzU1NzM4MjcxNzIiLCJzY29wZSI6IlJPTEVfQURNSU4ifQ.8ipGxuUnVVFCYP-EqoH0bM1pE2JexA-of3QZBR9VsaEaaiZ6jMzoAu2gwzvd7PLIeBGWxSUul6wnKm0errXB5A";
        // const hostname = window.location.hostname;
        // const subdomain = hostname.split('.')[0];  // Lấy phần subdomain (ví dụ: hospital_abc)
        const subdomain = "hadong";
        console.log(subdomain);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (subdomain && !config.url?.includes('/auth/register')) {
            // Không gửi X-Tenant-ID nếu là API register
            config.headers['X-Tenant-ID'] = subdomain;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

export default axiosInstance;
