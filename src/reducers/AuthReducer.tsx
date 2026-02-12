// authReducer.ts

import { AuthAction, AuthState, userType } from "../utills";

export const authInitialState: AuthState = {
  token: localStorage.getItem("token") || null,
  user: (localStorage.getItem("user") as userType) || "",
};

export const authReducer = (
  state: AuthState,
  action: AuthAction
): AuthState => {
  switch (action.type) {
    case "SET_TOKEN":
      localStorage.setItem("token", action?.payload?.token || ""); // Store token
      localStorage.setItem("user", action?.payload?.user || ""); // Store user
      return { ...state, ...action.payload };
    case "CLEAR_TOKEN":
      localStorage.removeItem("token"); // Clear token
      localStorage.removeItem("user"); // Clear user
      return { ...state, ...authInitialState };
    default:
      throw new Error(`Unhandled action type`);
  }
};
