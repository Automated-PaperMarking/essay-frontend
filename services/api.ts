import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const publicRoutes = [
  "/?state=login",
  "/?state=register",
  "/?state=forgot-password",
  "/?state=otp-verify",
  "/?state=reset-password",
];
const apiService = axios.create({
  baseURL: "apiv2",

  headers: {
    "Content-Type": "application/json",
  },
});

interface ErrorResponse {
  message?: string;
  requiresVerification?: boolean;
  email?: string;
}

interface CustomError {
  response?: {
    data: ErrorResponse;
    status: number;
  };
  request?: unknown;
}

const getErrorMessage = (error: CustomError): string => {
  if (error.response) {
    return error.response.data.message || "Server error";
  } else if (error.request) {
    return "No response from server";
  } else {
    return "Request failed";
  }
};

const simulateNetworkDelay = () => {
  const delay = 500;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

apiService.interceptors.request.use(async (config) => {
  try {
    const token = Cookies.get("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Check if files are being uploaded and set appropriate headers
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    await simulateNetworkDelay();

    return config;
  } catch {
    throw new Error("Failed to set Authorization header");
  }
});

apiService.interceptors.response.use(
  (response) => response.data,
  (error: CustomError) => {
    const errorMessage = getErrorMessage(error);
    toast.error(errorMessage);
    if (error.response && error.response.status === 400) {
      if (error.response.data.requiresVerification === true) {
        localStorage.setItem("otp_last_sent", Date.now().toString());
        window.location.href = `/?state=otp-verify&email=${error.response.data.email}`;
      }
    }
    if (error.response && error.response.status === 403) {
      toast.error("You are not authorized for this section");
      return Promise.reject("You are not authorized for this section");
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      const currentPath = window.location.pathname + window.location.search;

      // Only redirect if the current path is NOT a public route
      const isPublicRoute = publicRoutes.includes(currentPath);

      if (!isPublicRoute) {
        window.location.href = "/";
      }
    }

    return Promise.reject(errorMessage);
  }
);

export default apiService;
