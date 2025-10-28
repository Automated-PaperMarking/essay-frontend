"use client";
import z from "zod";
import { useForm } from "@/hooks/useForm";
import { useResetPassword } from "@/hooks/useAuth";
import { InputField } from "../../ui/input";
import MutationButton from "@/components/ui/mutationButton";

const ResetPasswordSchema = z
  .object({
    email: z.string().email("Enter your registered email"),
    otp: z.string().length(6, "OTP must be 6 digits"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
};

interface ResetPasswordPageProps {
  setState?: (
    state:
      | "login"
      | "register"
      | "forgot-password"
      | "otp-verify"
      | "reset-password"
  ) => void;
  email?: string;
}

const ResetPasswordPage = ({ setState, email }: ResetPasswordPageProps) => {
  const resetPasswordMutation = useResetPassword();

  const { formData, handleChange, errors, validate } =
    useForm<ResetPasswordFormData>(
      { email: email || "", otp: "", newPassword: "", confirmPassword: "" },
      ResetPasswordSchema
    );

  const handleResetPassword = async () => {
    if (validate()) {
      resetPasswordMutation.mutate(
        {
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword,
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

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
            Reset Password
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
            <InputField
              name="otp"
              label="OTP Code"
              value={formData.otp}
              onChange={handleChange}
              error={errors.otp}
            />
            <InputField
              name="newPassword"
              label="New Password"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              error={errors.newPassword}
            />
            <InputField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />

            <div className="flex items-center justify-center">
              <MutationButton
                loading={resetPasswordMutation.isPending}
                loadingText="Resetting..."
                onClick={handleResetPassword}
              >
                Reset Password
              </MutationButton>
            </div>
          </div>

          <div className="mt-6 text-center space-y-2">
            {/* Back to OTP Verify */}
            <p className="text-sm text-gray-600">
              Need to verify OTP again?{" "}
              <button
                type="button"
                className="font-medium text-gray-800 hover:text-gray-500 focus:outline-none focus:underline transition ease-in-out duration-150"
                onClick={() => setState && setState("otp-verify")}
              >
                Go Back
              </button>
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

export default ResetPasswordPage;
