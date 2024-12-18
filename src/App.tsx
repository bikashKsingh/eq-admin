import "@flaticon/flaticon-uicons/css/all/all.css";
import { Router } from "./components/layoutes";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
