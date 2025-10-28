import apiService from "./api";
import {
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  VerifyOtpData,
} from "@/hooks/useAuth";


// Auth API responses based on backend documentation
interface LoginResponse {
  success: boolean;
  access_token: string;
}

interface SignupResponse {
  success: boolean;
  message: string;
  requiresVerification: boolean;
}

interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

interface ApiResponse<T = unknown> {
  message: string;
  statusCode: number;
  data?: T;
}

interface BasicResponse {
  success: boolean;
  message: string;
}

interface ProfileData {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdDate: string;
  lastLogin?: string;
}

// Type assertion helpers for API responses
const isLoginResponse = (data: unknown): data is LoginResponse => {
  return (
    typeof data === "object" &&
    data !== null &&
    "success" in data &&
    "access_token" in data
  );
};

const isBasicResponse = (data: unknown): data is BasicResponse => {
  return (
    typeof data === "object" &&
    data !== null &&
    "success" in data &&
    "message" in data
  );
};

const isApiResponse = (data: unknown): data is ApiResponse => {
  return (
    typeof data === "object" &&
    data !== null &&
    "statusCode" in data &&
    "message" in data
  );
};

export const authApi = {
  // Login
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const data = (await apiService.post(
        "/auth/login",
        credentials
      )) as LoginResponse;
      if (!isLoginResponse(data)) {
        throw new Error("Invalid response format");
      }
      return data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      throw new Error(errorMessage);
    }
  },

  // Signup (changed from register to match backend)
  signup: async (data: RegisterData): Promise<SignupResponse> => {
    try {
      const response = (await apiService.post("/auth/signup", {
        email: data.email,
        password: data.password,
        username: data.name, // Backend expects username, not name
      })) as SignupResponse;
      if (!isBasicResponse(response)) {
        throw new Error("Invalid response format");
      }
      return response;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      throw new Error(errorMessage);
    }
  },

  // Request OTP for password reset (changed from forgotPassword)
  requestOtp: async (data: ForgotPasswordData): Promise<BasicResponse> => {
    try {
      const response = (await apiService.post(
        "/auth/request-otp",
        data
      )) as BasicResponse;
      if (!isBasicResponse(response)) {
        throw new Error("Invalid response format");
      }
      return response;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send reset email";
      throw new Error(errorMessage);
    }
  },

  // Verify OTP (for email verification)
  verifyOtp: async (data: VerifyOtpData): Promise<VerifyOtpResponse> => {
    try {
      const response = (await apiService.post("/auth/verify-otp", {
        email: data.email,
        otp: Number(data.otp),
      })) as VerifyOtpResponse;
      if (!isBasicResponse(response)) {
        throw new Error("Invalid response format");
      }
      return response;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "OTP verification failed";
      throw new Error(errorMessage);
    }
  },

  // Resend verification OTP
  resendVerification: async (
    data: ForgotPasswordData
  ): Promise<BasicResponse> => {
    try {
      const response = (await apiService.post(
        "/auth/resend-verification",
        data
      )) as BasicResponse;
      if (!isBasicResponse(response)) {
        throw new Error("Invalid response format");
      }
      return response;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to resend verification";
      throw new Error(errorMessage);
    }
  },

  // Reset Password (updated to match backend)
  resetPassword: async (data: ResetPasswordData): Promise<BasicResponse> => {
    try {
      const response = (await apiService.post("/auth/reset-password", {
        email: data.email,
        otp: Number(data.otp),
        newPassword: data.newPassword,
        confirmPassword: data.newPassword, // Backend expects confirmPassword
      })) as BasicResponse;
      if (!isBasicResponse(response)) {
        throw new Error("Invalid response format");
      }
      return response;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Password reset failed";
      throw new Error(errorMessage);
    }
  },

  // Change Password (protected endpoint)
  changePassword: async (data: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse> => {
    try {
      const response = (await apiService.patch(
        "/auth/change-password",
        data
      )) as ApiResponse;
      if (!isApiResponse(response)) {
        throw new Error("Invalid response format");
      }
      return response;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Password change failed";
      throw new Error(errorMessage);
    }
  },

  // Get current user profile
  getProfile: async (): Promise<ApiResponse<ProfileData>> => {
    try {
      const response = (await apiService.get(
        "/auth/profile"
      )) as ApiResponse<ProfileData>;
      if (!isApiResponse(response)) {
        throw new Error("Invalid response format");
      }
      return response;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch profile";
      throw new Error(errorMessage);
    }
  },
};
