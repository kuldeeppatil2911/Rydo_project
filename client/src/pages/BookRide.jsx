import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRide } from "../context/RideContext";

export default function BookRide() {
  const { user, logout } = useAuth();
  const { meta, form, estimate, submitting, error, hasEmergencyContact, emergencyAlertsEnabled, updateForm, submitBooking } = useRide();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    const success = await submitBooking();
    if (success) {
      navigate("/tracking");
    }
  }

  return (
    <div className="flow-shell">
      <aside className="flow-sidebar">
        <p className="eyebrow">Ride Flow</p>
        <h1>Book your ride</h1>
        <p className="flow-copy">
          Choose pickup, drop-off, ride type, and payment in a clean booking step before moving to live tracking.
        </p>
        <div className="flow-steps">
          <div className="flow-step active">1. Booking</div>
          <div className="flow-step">2. Tracking</div>
          <div className="flow-step">3. Safety</div>
        </div>
        <div className="flow-links">
          <Link className="button secondary full-width" to="/dashboard">Back to dashboard</Link>
          <Link className="button secondary full-width" to="/profile">Profile</Link>
          <button type="button" className="button secondary full-width" onClick={logout}>Log out</button>
        </div>
      </aside>

      <main className="flow-main">
        <header className="flow-topbar">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h2>{user?.name || "Rider"}</h2>
          </div>
          <div className="topbar-stats">
            <div>
              <span className="metric-label">Fare</span>
              <strong>{estimate ? `Rs. ${estimate.fare}` : "..."}</strong>
            </div>
            <div>
              <span className="metric-label">ETA</span>
              <strong>{estimate?.rideType?.eta || 3} min</strong>
            </div>
          </div>
        </header>

        <section className="flow-grid">
          <article className="card booking-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Step 1</p>
                <h3>Trip details</h3>
              </div>
            </div>

            {hasEmergencyContact && emergencyAlertsEnabled ? (
              <p className="emergency-notice">
                Emergency alerts are enabled. Your contact will receive safety details after booking.
              </p>
            ) : null}

            {error ? <p className="error-banner">{error}</p> : null}

            <form className="booking-form" onSubmit={handleSubmit}>
              <label>
                Pickup
                <select value={form.pickup} onChange={(event) => updateForm("pickup", event.target.value)} required>
                  {meta.locations.map((location) => (
                    <option key={location.name} value={location.name}>{location.name}</option>
                  ))}
                </select>
              </label>

              <label>
                Drop-off
                <select value={form.dropoff} onChange={(event) => updateForm("dropoff", event.target.value)} required>
                  {meta.locations.map((location) => (
                    <option key={location.name} value={location.name}>{location.name}</option>
                  ))}
                </select>
              </label>

              <label>
                Ride type
                <div className="ride-type-grid">
                  {meta.rideTypes.map((rideType) => (
                    <button
                      key={rideType.id}
                      className={`ride-type-button ${form.rideType === rideType.id ? "active" : ""}`}
                      type="button"
                      onClick={() => updateForm("rideType", rideType.id)}
                    >
                      <strong>{rideType.name}</strong>
                      <span>{rideType.description}</span>
                    </button>
                  ))}
                </div>
              </label>

              <div className="dual-grid">
                <label>
                  Payment
                  <select value={form.payment} onChange={(event) => updateForm("payment", event.target.value)}>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Wallet">Wallet</option>
                  </select>
                </label>
                <label>
                  Trip mode
                  <select value={form.tripMode} onChange={(event) => updateForm("tripMode", event.target.value)}>
                    <option value="now">Ride now</option>
                    <option value="scheduled">Schedule for later</option>
                  </select>
                </label>
              </div>

              <button className="button primary full-width" type="submit" disabled={submitting || !estimate}>
                {submitting ? "Booking..." : "Confirm and continue"}
              </button>
            </form>
          </article>

          <article className="card booking-sidecard">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Fare Preview</p>
                <h3>Trip summary</h3>
              </div>
            </div>

            <div className="estimate-panel stacked">
              <div>
                <span>Estimated fare</span>
                <strong>{estimate ? `Rs. ${estimate.fare}` : "..."}</strong>
              </div>
              <div>
                <span>Distance</span>
                <strong>{estimate ? `${estimate.distance.toFixed(1)} km` : "..."}</strong>
              </div>
              <div>
                <span>Travel time</span>
                <strong>{estimate ? `${estimate.time} min` : "..."}</strong>
              </div>
            </div>

            <div className="ride-mood-panel">
              <p className="eyebrow">Ride Theme</p>
              <h3>City glow pickup</h3>
              <p>
                Smooth booking, cleaner steps, and a focused ride-first layout for your project presentation and demo.
              </p>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
