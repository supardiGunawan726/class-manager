"use client";

const { createContext, useContext } = require("react");

const UserClassContext = createContext();

export function UserClassProvider({ userClass, children }) {
  return (
    <UserClassContext.Provider value={userClass}>
      {children}
    </UserClassContext.Provider>
  );
}

export function useUserClassContext() {
  const userClassContext = useContext(UserClassContext);

  return userClassContext;
}
