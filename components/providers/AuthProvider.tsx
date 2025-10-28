"use client";

import { UserProvider } from "@/contexts/userContext";
import { QueryProvider } from "./QueryProvider";
import React, { ReactNode } from "react";

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <QueryProvider>
      <UserProvider>{children}</UserProvider>
    </QueryProvider>
  );
};

export default AuthProvider;
