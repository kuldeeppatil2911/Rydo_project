import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authRegister } from "../api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await authRegister({ name, email, password, phone });
      login(data.user, data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Sign up failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page auth-page-minimal">
      <div className="auth-scene">
        <div className="auth-scene-copy">
          <p className="eyebrow">Create account</p>
          <h2>Get started fast.</h2>
          <p className="auth-scene-text">Create your profile and book your first ride.</p>
        </div>

        <div className="auth-phone-frame auth-phone-frame-tall">
          <div className="auth-phone-notch" />
          <section className="auth-screen">
            <div className="auth-brand-center compact">
              <div className="brand-mark minimal-mark">
                <span className="minimal-mark-core" />
              </div>
              <h1>Rydo</h1>
              <p>Create your account</p>
            </div>

            <form className="auth-form auth-form-minimal" onSubmit={handleSubmit}>
              {error ? <p className="error-banner">{error}</p> : null}

              <label className="sr-only" htmlFor="signup-name">Name</label>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Name"
                required
                autoComplete="name"
              />

              <label className="sr-only" htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                required
                autoComplete="email"
              />

              <label className="sr-only" htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                required
                minLength={6}
                autoComplete="new-password"
              />

              <label className="sr-only" htmlFor="signup-phone">Phone</label>
              <input
                id="signup-phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Phone"
                autoComplete="tel"
              />

              <button className="button primary full-width auth-submit" type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create account"}
              </button>
            </form>

            <div className="auth-divider"><span>or</span></div>

            <p className="auth-footer auth-footer-center">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
