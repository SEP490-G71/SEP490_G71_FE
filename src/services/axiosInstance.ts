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
//     else {
//       window.location.href = "/home/login";
//     }

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
"eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJ2bi5lZHUuZnB0Lm1lZGljYWxkaWFnbm9zaXMiLCJzdWIiOiJhZG1pbiIsImV4cCI6MTc1MDE3OTczNywiaWF0IjoxNzUwMTc2MTM3LCJqdGkiOiIwYTc1OTRhMy1jYTdjLTQwYTctYjU1Yy04YjljNDc1OTExMDIiLCJzY29wZSI6IlJPTEVfQURNSU4ifQ.GuVSM7A8SdBdzzg_cNtHnK90qd6RpJO_oFnmEr4Yn_ap3YPLxH9CWcvpI81DTQgaCj_YlFM953e9JkTHQtnBOA";
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