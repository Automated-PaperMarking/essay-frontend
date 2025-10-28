"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginPage from "./login";
import RegisterPage from "./register";
import ForgotPasswordPage from "./frogot-password";
import OtpVerificationPage from "./otp-verify-registration";
import ResetPasswordPage from "./reset-password";

type AuthState =
  | "login"
  | "register"
  | "forgot-password"
  | "otp-verify"
  | "reset-password";

const AuthForms = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get state from URL, default to 'login'
  const getStateFromUrl = (): AuthState => {
    const urlState = searchParams.get("state") as AuthState;
    const validStates: AuthState[] = [
      "login",
      "register",
      "forgot-password",
      "otp-verify",
      "reset-password",
    ];
    return validStates.includes(urlState) ? urlState : "login";
  };

  const [state, setState] = useState<AuthState>(getStateFromUrl());
  const [email, setEmail] = useState(() => {
    // Get email from URL if available
    return searchParams.get("email") || "";
  });

  // Update URL when state changes
  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("state", state);

    // Add email to URL if it exists and we're in a flow that needs it
    if (email && (state === "otp-verify" || state === "reset-password")) {
      currentParams.set("email", email);
    } else {
      currentParams.delete("email");
    }

    const newUrl = `?${currentParams.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [state, email, router, searchParams]);

  // Update state from URL when URL changes
  useEffect(() => {
    const urlState = searchParams.get("state") as AuthState;
    const validStates: AuthState[] = [
      "login",
      "register",
      "forgot-password",
      "otp-verify",
      "reset-password",
    ];
    const validUrlState = validStates.includes(urlState) ? urlState : "login";
    const urlEmail = searchParams.get("email") || "";

    setState(validUrlState);
    if (urlEmail) {
      setEmail(urlEmail);
    }
  }, [searchParams]);

  // Custom setState that updates both local state and URL
  const handleSetState = (newState: AuthState) => {
    setState(newState);
  };

  // Custom setEmail that updates both local state and URL
  const handleSetEmail = (newEmail: string) => {
    setEmail(newEmail);
  };

  return (
    <div>
      {state === "login" && (
        <LoginPage setState={handleSetState} setEmail={handleSetEmail} />
      )}
      {state === "register" && (
        <RegisterPage setState={handleSetState} setEmail={handleSetEmail} />
      )}
      {state === "forgot-password" && (
        <ForgotPasswordPage
          setState={handleSetState}
          setEmail={handleSetEmail}
        />
      )}
      {state === "otp-verify" && (
        <OtpVerificationPage setState={handleSetState} email={email} />
      )}
      {state === "reset-password" && (
        <ResetPasswordPage setState={handleSetState} email={email} />
      )}
    </div>
  );
};

export default AuthForms;
