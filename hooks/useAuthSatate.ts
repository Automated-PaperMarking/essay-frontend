import { useCallback } from "react";
import { useUrlParams } from "./useUrlParams";

/**
 * Hook specifically for auth form state management
 */
export const useAuthState = () => {
  const { getParam, setParam, setParams } = useUrlParams();

  type AuthState =
    | "login"
    | "register"
    | "forgot-password"
    | "otp-verify"
    | "reset-password";

  const getAuthState = useCallback((): AuthState => {
    const validStates: AuthState[] = [
      "login",
      "register",
      "forgot-password",
      "otp-verify",
      "reset-password",
    ];
    const state = getParam("state") as AuthState;
    return validStates.includes(state) ? state : "login";
  }, [getParam]);

  const setAuthState = useCallback(
    (state: AuthState, email?: string) => {
      if (email) {
        setParams({ state, email });
      } else {
        setParam("state", state);
      }
    },
    [setParam, setParams]
  );

  const getEmail = useCallback((): string => {
    return getParam("email") || "";
  }, [getParam]);

  return {
    getAuthState,
    setAuthState,
    getEmail,
  };
};
