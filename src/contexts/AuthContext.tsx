// AuthContext.tsx
import React, { createContext, useReducer, ReactNode } from "react";
import { AuthContextType, AuthState, AuthAction } from "../utills";
import { authReducer, authInitialState } from "../reducers/AuthReducer";

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

type AuthProviderProps = {
  children: ReactNode;
};

// Create the provider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer<React.Reducer<AuthState, AuthAction>>(
    authReducer,
    authInitialState
  );

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
