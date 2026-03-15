import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authLogin } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await authLogin({ email, password });
      login(data.user, data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <section className="auth-stage">
          <div className="brand-lockup auth-brand">
            <div className="brand-mark">R</div>
            <h1>Rydo</h1>
          </div>
          <p className="eyebrow">Step 1</p>
          <h2>Sign in before the ride begins.</h2>
          <p className="auth-stage-copy">
            Start with a dedicated entry screen, then move into booking, live tracking, and safety controls one stage at a time.
          </p>
          <div className="auth-stage-points">
            <div>
              <strong>Focused entry</strong>
              <span>Login first, then open the ride dashboard.</span>
            </div>
            <div>
              <strong>Ride-themed flow</strong>
              <span>Cleaner progression for booking and tracking during your presentation.</span>
            </div>
            <div>
              <strong>Safety ready</strong>
              <span>Emergency alerts and live map stay available after sign in.</span>
            </div>
          </div>
        </section>

        <section className="auth-panel">
          <p className="eyebrow">Sign in</p>
          <h3>Welcome back</h3>
          <form className="auth-form" onSubmit={handleSubmit}>
            {error ? <p className="error-banner">{error}</p> : null}
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </label>
            <button className="button primary full-width" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Enter Rydo"}
            </button>
          </form>
          <p className="auth-footer">
            Don&apos;t have an account? <Link to="/signup">Create one</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
