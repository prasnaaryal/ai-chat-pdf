import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";

// Get the baseURL from the environment and ensure it uses HTTPS
const baseURL: string =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://pdf.emailora.com";

// Ensure that the base URL is always HTTPS
const httpsBaseURL = baseURL.startsWith("http://")
  ? baseURL.replace("http://", "https://")
  : baseURL;

const axiosConfig = axios.create({
  baseURL: httpsBaseURL, // Ensure the base URL is always HTTPS
  headers: {
    "Content-Type": "application/json", // Default header for most API requests
  },
});

// Add a request interceptor to dynamically handle different content types if needed
axiosConfig.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.data instanceof FormData) {
      // If the request data is FormData (like for file uploads), let the browser set the boundary
      config.headers["Content-Type"] = "multipart/form-data";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle global errors and HTTPS redirection
axiosConfig.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;

    // If the error is due to a 307 redirect, check the location and force HTTPS if necessary
    if (error.response && error.response.status === 307) {
      const location = error.response.headers["location"];
      console.log({ location });

      // If the Location header is HTTP, change it to HTTPS
      if (location && location.startsWith("http://")) {
        const httpsLocation = location.replace("http://", "https://");
        originalRequest.url = httpsLocation;

        // Retry the request with the new HTTPS URL
        return axiosConfig(originalRequest);
      }
    }

    // Handle CORS errors specifically
    if (
      error.response &&
      error.response.status === 0 &&
      error.response.data === ""
    ) {
      console.error(
        "CORS error detected, likely caused by redirecting to HTTP"
      );
    }

    // Log any other errors globally
    console.error("API error:", error);
    return Promise.reject(error);
  }
);

export default axiosConfig;
