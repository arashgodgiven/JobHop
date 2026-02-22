import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./pages/NavBar";
import AuthPage from "./pages/AuthPage";
import MessagesPage from "./pages/MessagesPage";
import ConnectionsPage from "./pages/ConnectionsPage";
import { clearSession, loadSession, saveSession } from "./services/authStorage";

export default function App() {
  const [me, setMe] = useState(null);

  useEffect(() => {
    const session = loadSession();
    if (session) setMe(session);
  }, []);

  function onAuthSuccess(session) {
    saveSession(session);
    setMe(session);
  }

  function logout() {
    clearSession();
    setMe(null);
  }

  return (
    <BrowserRouter>
      <NavBar me={me} onLogout={logout} />

      <Routes>
        <Route
          path="/auth"
          element={me ? <Navigate to="/messages" replace /> : <AuthPage onAuthSuccess={onAuthSuccess} />}
        />

        <Route
          path="/messages"
          element={me ? <MessagesPage /> : <Navigate to="/auth" replace />}
        />

        <Route
          path="/connections"
          element={me ? <ConnectionsPage /> : <Navigate to="/auth" replace />}
        />

        <Route
          path="*"
          element={<Navigate to={me ? "/messages" : "/auth"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}
