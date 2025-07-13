// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");

//     const hostname = window.location.hostname;
//     // const subdomain = hostname.split('.')[0];
//     console.log(hostname);

//     const subdomain = "hadong";
//     console.log(subdomain);


//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     // else {
//     //   window.location.href = "/home/login";
//     // }

//     if (subdomain && !config.url?.includes("/auth/register")) {
//       config.headers["X-Tenant-ID"] = subdomain;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// export default axiosInstance;


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
      "eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJ2bi5lZHUuZnB0Lm1lZGljYWxkaWFnbm9zaXMiLCJzdWIiOiJhZG1pbiIsImV4cCI6MTc1MjQyNjc2MCwiaWF0IjoxNzUyNDA1MTYwLCJqdGkiOiJlNWNjMjhjOS02MzhjLTQyMzItYjM2Zi0wYWM4OWYwMDIwMzIiLCJzY29wZSI6IlJPTEVfQURNSU4ifQ.R3fpN1-_tNKcTQMNBUejxpdc8TGZ4HJBhkcEax78RkQIzrrwOPd90aY2avn-Ps91rq9yLnvnjNYwyPQ6rZvy_g";
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
