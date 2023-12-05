"use client";

import { createContext, useContext } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children, auth }) {
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const authContext = useContext(AuthContext);
  return authContext;
}
