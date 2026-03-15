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
    <div className="auth-page">
      <div className="auth-card card">
        <section className="auth-stage">
          <div className="brand-lockup auth-brand">
            <div className="brand-mark">R</div>
            <h1>Rydo</h1>
          </div>
          <p className="eyebrow">Create account</p>
          <h2>Build your rider profile first.</h2>
          <p className="auth-stage-copy">
            Set up your account before you start booking. After sign up, the app moves into the dashboard and ride flow.
          </p>
          <div className="auth-stage-points">
            <div>
              <strong>Personal account</strong>
              <span>Save your rider identity for future bookings.</span>
            </div>
            <div>
              <strong>Safety ready</strong>
              <span>Add emergency contact details later from your profile.</span>
            </div>
            <div>
              <strong>Presentation friendly</strong>
              <span>A clear first step before ride booking and tracking screens.</span>
            </div>
          </div>
        </section>

        <section className="auth-panel">
          <p className="eyebrow">Register</p>
          <h3>Create your account</h3>
          <form className="auth-form" onSubmit={handleSubmit}>
            {error ? <p className="error-banner">{error}</p> : null}
            <label>
              Name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                required
                autoComplete="name"
              />
            </label>
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
                placeholder="At least 6 characters"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </label>
            <label>
              Phone
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+91 98765 43210"
                autoComplete="tel"
              />
            </label>
            <button className="button primary full-width" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create and continue"}
            </button>
          </form>
          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
