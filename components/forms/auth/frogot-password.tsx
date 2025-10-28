"use client";
import React from "react";
import z from "zod";
import { useForm } from "@/hooks/useForm";
import { useRequestOtp } from "@/hooks/useAuth";
import { InputField } from "../../ui/input";
import MutationButton from "@/components/ui/mutationButton";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = {
  email: string;
};

interface ForgotPasswordPageProps {
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

const ForgotPasswordPage = ({
  setState,
  setEmail,
}: ForgotPasswordPageProps) => {
  const requestOtpMutation = useRequestOtp();

  const { formData, handleChange, errors, validate } =
    useForm<ForgotPasswordFormData>({ email: "" }, ForgotPasswordSchema);

  const handleForgotPassword = async () => {
    if (validate()) {
      requestOtpMutation.mutate(
        {
          email: formData.email,
        },
        {
          onSuccess: (data) => {
            if (data.success && setEmail && setState) {
              setEmail(formData.email);
              setState("reset-password");
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
            Forgot Password
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

            <div className="flex items-center justify-center">
              <MutationButton
                loading={requestOtpMutation.isPending}
                loadingText="Sending OTP..."
                onClick={handleForgotPassword}
              >
                Send OTP
              </MutationButton>
            </div>
          </div>

          <div className="mt-6 text-center space-y-2">
            {/* Back to Login */}
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <button
                type="button"
                className="font-medium text-gray-800 hover:text-gray-500 focus:outline-none focus:underline transition ease-in-out duration-150"
                onClick={() => setState && setState("login")}
              >
                Sign In
              </button>
            </p>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
