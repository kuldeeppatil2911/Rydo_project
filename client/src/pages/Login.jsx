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
    <div className="auth-page auth-page-minimal">
      <div className="auth-scene">
        <div className="auth-scene-copy">
          <p className="eyebrow">Rydo</p>
          <h2>Simple ride booking.</h2>
          <p className="auth-scene-text">Sign in and continue.</p>
        </div>

        <div className="auth-phone-frame">
          <div className="auth-phone-notch" />
          <section className="auth-screen">
            <div className="auth-brand-center">
              <div className="brand-mark minimal-mark">
                <span className="minimal-mark-core" />
              </div>
              <h1>Rydo</h1>
              <p>Sign in to continue</p>
            </div>

            <form className="auth-form auth-form-minimal" onSubmit={handleSubmit}>
              {error ? <p className="error-banner">{error}</p> : null}

              <label className="sr-only" htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                required
                autoComplete="email"
              />

              <label className="sr-only" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                required
                autoComplete="current-password"
              />

              <button className="button primary full-width auth-submit" type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="auth-divider"><span>or</span></div>

            <p className="auth-footer auth-footer-center">
              New to Rydo? <Link to="/signup">Create account</Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
