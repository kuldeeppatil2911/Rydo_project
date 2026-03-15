import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMe, updateMe } from "../api";

export default function Profile() {
  const { user, token, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyEmail: "",
    emergencyAlertsEnabled: true
  });

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    getMe()
      .then((res) => {
        const currentUser = res.data;
        setForm({
          name: currentUser.name || "",
          phone: currentUser.phone || "",
          emergencyName: currentUser.emergencyContact?.name || "",
          emergencyPhone: currentUser.emergencyContact?.phone || "",
          emergencyEmail: currentUser.emergencyContact?.email || "",
          emergencyAlertsEnabled: currentUser.emergencyAlertsEnabled !== false
        });
      })
      .catch(() => logout());
  }, [token, logout, navigate]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        emergencyAlertsEnabled: form.emergencyAlertsEnabled,
        emergencyContact:
          form.emergencyName || form.emergencyPhone || form.emergencyEmail
            ? {
                name: form.emergencyName.trim(),
                phone: form.emergencyPhone.trim(),
                email: form.emergencyEmail.trim()
              }
            : null
      };

      const { data } = await updateMe(payload);
      updateUser(data);
      setSuccess("Profile saved. Emergency alerts now follow your on or off setting.");
    } catch (err) {
      setError(err.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <header className="profile-header">
        <Link to="/" className="back-link">&larr; Back to Rydo</Link>
        <div className="brand-lockup auth-brand">
          <div className="brand-mark">R</div>
          <h1>Rydo</h1>
        </div>
      </header>

      <main className="profile-main">
        <article className="card profile-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Account</p>
              <h3>Profile and emergency contact</h3>
            </div>
          </div>

          <p className="profile-hint">
            Add an emergency contact email or phone. When emergency alerts are on, Rydo sends route details,
            vehicle number, driver name, payment mode, and OTP for safety.
          </p>

          <form className="profile-form" onSubmit={handleSubmit}>
            {error ? <p className="error-banner">{error}</p> : null}
            {success ? <p className="success-banner">{success}</p> : null}

            <label>
              Your name
              <input
                type="text"
                value={form.name}
                onChange={(event) => handleChange("name", event.target.value)}
                required
              />
            </label>

            <label>
              Your phone
              <input
                type="tel"
                value={form.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
              />
            </label>

            <hr className="form-divider" />

            <p className="eyebrow">Emergency contact and safety alerts</p>

            <label className="toggle-row">
              <span>Enable emergency alerts</span>
              <input
                type="checkbox"
                checked={form.emergencyAlertsEnabled}
                onChange={(event) => handleChange("emergencyAlertsEnabled", event.target.checked)}
              />
            </label>

            <label>
              Contact name
              <input
                type="text"
                value={form.emergencyName}
                onChange={(event) => handleChange("emergencyName", event.target.value)}
                placeholder="Family member or friend"
              />
            </label>

            <label>
              Contact phone <span className="required-note">(used for SMS)</span>
              <input
                type="tel"
                value={form.emergencyPhone}
                onChange={(event) => handleChange("emergencyPhone", event.target.value)}
                placeholder="+91 98765 43210"
              />
            </label>

            <label>
              Contact email <span className="required-note">(used for email)</span>
              <input
                type="email"
                value={form.emergencyEmail}
                onChange={(event) => handleChange("emergencyEmail", event.target.value)}
                placeholder="contact@example.com"
              />
            </label>

            <button className="button primary full-width" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save profile and safety settings"}
            </button>
          </form>
        </article>
      </main>
    </div>
  );
}
