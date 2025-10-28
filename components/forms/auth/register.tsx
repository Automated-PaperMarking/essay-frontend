"use client";
import React, { useState } from "react";
import z from "zod";
import { useForm } from "@/hooks/useForm";
import { useRegister } from "@/hooks/useAuth";
import { InputField } from "../../ui/input";
import { Eye, EyeOff } from "lucide-react";
import MutationButton from "@/components/ui/mutationButton";

const RegisterSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

interface RegisterPageProps {
  setState?: (
    state:
      | "login"
      | "register"
      | "forgot-password"
      | "otp-verify"
      | "reset-password"
  ) => void;
  setEmail: (email: string) => void;
}

const RegisterPage = ({ setState, setEmail }: RegisterPageProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerMutation = useRegister();

  const { formData, handleChange, errors, validate } =
    useForm<RegisterFormData>(
      { name: "", email: "", password: "", confirmPassword: "" },
      RegisterSchema
    );

  const handleRegister = async () => {
    if (validate()) {
      registerMutation.mutate(
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },
        {
          onSuccess: (data) => {
            if (data.success && setState) {
              // Redirect to OTP verification
              setEmail(formData.email);
              setState("otp-verify");
              // Store timestamp of OTP sent
              localStorage.setItem("otp_last_sent", Date.now().toString());
            }
          },
        }
      );
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
            Create an Account
          </h2>
          <div className="space-y-6">
            <InputField
              name="name"
              label="User Name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />
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
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />
              <button
                type="button"
                className="absolute inset-y-0 top-6 right-3 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>
            <div className="relative">
              <InputField
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
              <button
                type="button"
                className="absolute inset-y-0 top-6 right-3 flex items-center text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>

            <div className="flex items-center justify-center">
              <MutationButton
                loading={registerMutation.isPending}
                loadingText="Signing Up..."
                onClick={handleRegister}
              >
                Register
              </MutationButton>
            </div>
          </div>

          <div className="mt-6 text-center space-y-2">
            {/* Sign In */}
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                className="font-medium text-gray-800 hover:text-gray-500 focus:outline-none focus:underline transition ease-in-out duration-150"
                onClick={() => setState && setState("login")}
              >
                Sign In
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

export default RegisterPage;
