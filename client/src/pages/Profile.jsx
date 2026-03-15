import { useEffect, useState } from "react";
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
    emergencyEmail: ""
  });

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    getMe()
      .then((res) => {
        const u = res.data;
        setForm({
          name: u.name || "",
          phone: u.phone || "",
          emergencyName: u.emergencyContact?.name || "",
          emergencyPhone: u.emergencyContact?.phone || "",
          emergencyEmail: u.emergencyContact?.email || ""
        });
      })
      .catch(() => logout());
  }, [token, logout, navigate]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
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
      setSuccess("Profile and emergency contact saved. They will be notified when you book a ride.");
    } catch (err) {
      setError(err.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  }

  if (!user) return <div className="loading-screen">Loading...</div>;

  return (
    <div className="profile-page">
      <header className="profile-header">
        <Link to="/" className="back-link">← Back to Rydo</Link>
        <div className="brand-lockup auth-brand">
          <div className="brand-mark">R</div>
          <h1>Rydo</h1>
        </div>
      </header>

      <main className="profile-main">
        <article className="card profile-card">
          <div className="section-heading">
            <p className="eyebrow">Account</p>
            <h3>Profile & emergency contact</h3>
          </div>
          <p className="profile-hint">
            Add an emergency contact with an email. When you book a ride, they will receive a notification with your ride details (pickup, drop-off, driver, OTP).
          </p>
          <form className="profile-form" onSubmit={handleSubmit}>
            {error && <p className="error-banner">{error}</p>}
            {success && <p className="success-banner">{success}</p>}
            <label>
              Your name
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
              />
            </label>
            <label>
              Your phone
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </label>
            <hr className="form-divider" />
            <p className="eyebrow">Emergency contact (notified when you book a ride)</p>
            <label>
              Contact name
              <input
                type="text"
                value={form.emergencyName}
                onChange={(e) => handleChange("emergencyName", e.target.value)}
                placeholder="e.g. Family member or friend"
              />
            </label>
            <label>
              Contact phone
              <input
                type="tel"
                value={form.emergencyPhone}
                onChange={(e) => handleChange("emergencyPhone", e.target.value)}
              />
            </label>
            <label>
              Contact email <span className="required-note">(required for notification)</span>
              <input
                type="email"
                value={form.emergencyEmail}
                onChange={(e) => handleChange("emergencyEmail", e.target.value)}
                placeholder="their@email.com"
              />
            </label>
            <button className="button primary full-width" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save profile & emergency contact"}
            </button>
          </form>
        </article>
      </main>
    </div>
  );
}
