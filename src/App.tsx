import "@flaticon/flaticon-uicons/css/all/all.css";
import { Router } from "./components/layoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function App() {
  return (
    <GoogleOAuthProvider
      clientId={
        "342897127583-1uaaj41jkspjfbv9gmr2j7m2v36s93dv.apps.googleusercontent.com"
      }
    >
      <AuthProvider>
        <Router />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
