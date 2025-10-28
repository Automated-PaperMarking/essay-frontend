"use client";
import React, { useEffect, useState } from "react";
import z from "zod";
import { useForm } from "@/hooks/useForm";
import { useResendVerification, useVerifyOtp } from "@/hooks/useAuth";
import { InputField } from "../../ui/input";
import MutationButton from "@/components/ui/mutationButton";

const OtpSchema = z.object({
  email: z.string().email("Enter your registered email"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type OtpFormData = {
  email: string;
  otp: string;
};

interface OtpVerificationPageProps {
  setState?: (
    state:
      | "login"
      | "register"
      | "forgot-password"
      | "otp-verify"
      | "reset-password"
  ) => void;
  email: string;
}

const OtpVerificationPage = ({ setState, email }: OtpVerificationPageProps) => {
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendVerification();

  const { formData, handleChange, errors, validate } = useForm<OtpFormData>(
    { email: email, otp: "" },
    OtpSchema
  );

  // ⏱ Timer state
  const [timeLeft, setTimeLeft] = useState(0);

  // On first load, calculate remaining time
  useEffect(() => {
    const lastSent = localStorage.getItem("otp_last_sent");
    if (lastSent) {
      const elapsed = Math.floor((Date.now() - parseInt(lastSent)) / 1000);
      const remaining = 120 - elapsed;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimeLeft(remaining > 0 ? remaining : 0);
    } else {
      // No record → assume OTP just sent
      localStorage.setItem("otp_last_sent", Date.now().toString());
      setTimeLeft(120);
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? `0${s}` : s}`;
  };

  const handleVerifyOtp = async () => {
    if (validate()) {
      verifyOtpMutation.mutate(
        {
          email: formData.email,
          otp: formData.otp,
        },
        {
          onSuccess: (data) => {
            if (data.success && setState) {
              setState("login");
            }
          },
        }
      );
    }
  };

  const handleResendOtp = () => {
    resendOtpMutation.mutate(
      { email: formData.email },
      {
        onSuccess: () => {
          // Reset timer and save timestamp
          localStorage.setItem("otp_last_sent", Date.now().toString());
          setTimeLeft(120);
        },
      }
    );
  };

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
            Verify OTP
          </h2>

          <div className="space-y-6">
            <InputField
              name="otp"
              label="OTP Code"
              value={formData.otp}
              onChange={handleChange}
              error={errors.otp}
            />

            <div className="flex items-center justify-center">
              <MutationButton
                loading={verifyOtpMutation.isPending}
                loadingText="Verifying..."
                onClick={handleVerifyOtp}
              >
                Verify
              </MutationButton>
            </div>
          </div>

          <div className="mt-6 text-center space-y-3">
            {/* Resend OTP Section */}
            <p className="text-sm text-gray-600">
              {timeLeft > 0 ? (
                <>
                  You can resend OTP in{" "}
                  <span className="font-medium text-gray-800">
                    {formatTime(timeLeft)}
                  </span>
                </>
              ) : (
                <>
                  Didn&apos;t receive the code?{" "}
                  <button
                    type="button"
                    disabled={resendOtpMutation.isPending}
                    className="font-medium text-gray-800 hover:text-gray-500 focus:outline-none focus:underline transition ease-in-out duration-150"
                    onClick={handleResendOtp}
                  >
                    {resendOtpMutation.isPending ? "Resending..." : "Resend OTP"}
                  </button>
                </>
              )}
            </p>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
