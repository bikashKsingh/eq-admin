export type userType = "ADMIN" | "TRAINER" | "";

export type AuthState = {
  token: string | null; // Store the token, null if not authenticated
  user: userType;
};

export type AuthAction =
  | { type: "SET_TOKEN"; payload: AuthState }
  | { type: "CLEAR_TOKEN" };

export type AuthContextType = {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
};
