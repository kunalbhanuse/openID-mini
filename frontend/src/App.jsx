import { Route, Routes, useNavigate } from "react-router-dom";
import Shell from "./components/layout/Shell";
import { useCurrentUser } from "./hooks/useCurrentUser";
import { api } from "./api/client";
import ClientRegistry from "./pages/ClientRegistry";
import Consent from "./pages/Consent";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import OAuthCallback from "./pages/OAuthCallback";
import OAuthTest from "./pages/OAuthTest";
import Signup from "./pages/Signup";

export default function App() {
  const navigate = useNavigate();
  const { user, setUser, refreshUser } = useCurrentUser();

  const logout = async () => {
    await api("/o/user/logout", { method: "POST" });
    setUser(null);
    navigate("/");
  };

  return (
    <Shell user={user} onLogout={logout}>
      <Routes>
        <Route path="/" element={<Dashboard user={user} />} />
        <Route
          path="/login"
          element={<Login refreshUser={refreshUser} />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/clients" element={<ClientRegistry />} />
        <Route path="/consent" element={<Consent />} />
        <Route path="/oauth-test" element={<OAuthTest />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
      </Routes>
    </Shell>
  );
}
