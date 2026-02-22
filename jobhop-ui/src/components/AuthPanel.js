import { useState } from "react";
import { login, register } from "../services/api";
import "../styles/auth.css";

export default function AuthPanel({ onAuthSuccess }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const data =
        mode === "login"
          ? await login(email, password)
          : await register(email, password, displayName);

      localStorage.setItem("token", data.token);
      onAuthSuccess({ id: data.id, email: data.email, displayName: data.displayName });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">{mode === "login" ? "Sign in" : "Join JobHop"}</h1>
        <p className="auth-subtitle">
          {mode === "login"
            ? "Stay connected with your professional world."
            : "Join the world’s professional network — it’s free."}
        </p>

        {error ? <div className="auth-error">{error}</div> : null}

        <form onSubmit={handleSubmit}>
          {mode === "register" ? (
            <input
              className="auth-input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display name"
              required
            />
          ) : null}

          <input
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />

          <input
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (6+ characters)"
            type="password"
            required
            minLength={6}
          />

          <button className="auth-primary-btn" type="submit">
            {mode === "login" ? "Sign in" : "Agree & Join"}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <div className="auth-row" style={{ justifyContent: "center" }}>
          {mode === "login" ? (
            <div>
              New to JobHop?{" "}
              <button className="auth-link-btn" onClick={() => setMode("register")} type="button">
                Join now
              </button>
            </div>
          ) : (
            <div>
              Already on JobHop?{" "}
              <button className="auth-link-btn" onClick={() => setMode("login")} type="button">
                Sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
