"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useUser } from "@/contexts/userContext";
import { authApi } from "@/services/authApi";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/errorHandling";

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
}

export interface VerifyOtpData {
  email: string;
  otp: string;
}

// Custom hook for login
export const useLogin = () => {
  const { updateAccessToken } = useUser();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      if (data.success && data.access_token) {
        updateAccessToken(data.access_token);
        toast.success("Login successful!");
        router.push("/listing-builder");
      } else {
      }
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      // Handle specific backend error for unverified account
      if (errorMessage.includes("verify your email")) {
        toast.error("Please verify your email before logging in");
      } else {
      }
    },
  });
};

// Custom hook for registration (signup)
export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterData) => authApi.signup(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(
          data.message ||
            "Registration successful! Please check your email to verify your account."
        );
      } else {
        toast.error(data.message || "Registration failed");
      }
    },
  });
};

// Custom hook for requesting password reset OTP
export const useRequestOtp = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordData) => authApi.requestOtp(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Password reset OTP sent to your email.");
      } else {
        toast.error(data.message || "Failed to send reset email");
      }
    },
  });
};

// Custom hook for resending verification OTP
export const useResendVerification = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordData) => authApi.resendVerification(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Verification OTP sent to your email.");
      } else {
        toast.error(data.message || "Failed to send verification email");
      }
    },
  });
};

// Custom hook for OTP verification
export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (data: VerifyOtpData) =>
      authApi.verifyOtp({
        email: data.email,
        otp: data.otp,
      }),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "OTP verified successfully!");
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    },
  });
};

// Custom hook for reset password
export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ResetPasswordData) => authApi.resetPassword(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(
          data.message ||
            "Password reset successful! Please login with your new password."
        );
        router.push("/");
      } else {
      }
    },
   
  });
};

// Custom hook for change password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: {
      oldPassword: string;
      newPassword: string;
      confirmPassword: string;
    }) => authApi.changePassword(data),
    onSuccess: (data) => {
      if (data.statusCode === 200) {
        toast.success(data.message || "Password changed successfully!");
      } else {
      }
    },
  });
};

// Custom hook for logout
export const useLogout = () => {
  const { logout } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      // No backend logout endpoint, just clear local data
      return Promise.resolve();
    },
    onSuccess: () => {
      logout();
      queryClient.clear(); // Clear all cached data
      toast.success("Logged out successfully");
      router.push("/");
    },
    onError: (error) => {
      // Even if API call fails, still logout locally
      logout();
      queryClient.clear();
      toast.success("Logged out successfully");
      router.push("/");
    },
  });
};

// Custom hook for getting user profile
export const useProfile = () => {
  const { isAuthenticated } = useUser();

  return useQuery({
    queryKey: ["profile"],
    queryFn: () => authApi.getProfile(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Custom hook for checking auth status
export const useAuthStatus = () => {
  const { user, isAuthenticated, isChecking } = useUser();

  return useQuery({
    queryKey: ["authStatus"],
    queryFn: () => Promise.resolve({ user, isAuthenticated }),
    enabled: !isChecking,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
