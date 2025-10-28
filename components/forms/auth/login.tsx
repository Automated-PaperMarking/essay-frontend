"use client";
import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import z from "zod";
import { useUser } from "@/contexts/userContext";
import { useForm } from "@/hooks/useForm";
import { useLogin } from "@/hooks/useAuth";
import { InputField } from "../../ui/input";
import MutationButton from "../../ui/mutationButton";
import { Eye, EyeOff } from "lucide-react";

// Login validation schema
const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = {
  email: string;
  password: string;
};
interface LoginPageProps {
  setState?: (
    state:
      | "login"
      | "register"
      | "forgot-password"
      | "otp-verify"
      | "reset-password"
  ) => void;
  setEmail?: (email: string) => void;
}

const LoginPage = ({ setState, setEmail }: LoginPageProps) => {
  const { isAuthenticated, isChecking } = useUser();
  const router = useRouter();
  const [showpassword, setShowPassword] = useState(false);

  const loginMutation = useLogin();

  const { formData, handleChange, errors, validate } = useForm<LoginFormData>(
    { email: "", password: "" },
    LoginSchema
  );

  // Handle redirect when authenticated
  useEffect(() => {
    if (isAuthenticated && !isChecking) {
      router.replace("/listing-builder/");
    }
  }, [isAuthenticated, isChecking, router]);

  // Show loading while checking authentication
  // if (isChecking) {
  //   return <Loading />;
  // }

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  const handleLogin = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the form errors");
      return;
    }

    loginMutation.mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
            Login
          </h2>
          <div className="space-y-6">
            <InputField
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <div className="relative">
              <InputField
                name="password"
                label="Password"
                type={showpassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />
              <button
                type="button"
                className="absolute inset-y-0 top-6 right-3 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showpassword)}
              >
                {showpassword ? <Eye /> : <EyeOff />}
              </button>
            </div>

            <div className="flex items-center justify-center">
              <MutationButton
                onClick={handleLogin}
                loading={loginMutation.isPending}
                loadingText="Signing In..."
              >
                Sign In
              </MutationButton>
            </div>
          </div>

          <div className="mt-6 text-center space-y-2">
            {/* Sign Up */}
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="font-medium text-gray-800 hover:text-gray-500 focus:outline-none focus:underline transition ease-in-out duration-150"
                onClick={() => setState && setState("register")}
              >
                Sign Up
              </button>
            </p>

            {/* Forgot Password */}
            <p className="text-sm text-gray-600">
              Forgot your password?{" "}
              <button
                type="button"
                className="font-medium text-gray-800 hover:text-gray-500 focus:outline-none focus:underline transition ease-in-out duration-150"
                onClick={() => setState && setState("forgot-password")}
              >
                Reset it here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
