import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRide } from "../context/RideContext";

export default function BookRide() {
  const { user, logout } = useAuth();
  const { meta, form, estimate, submitting, error, updateForm, submitBooking } = useRide();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    const success = await submitBooking();
    if (success) {
      navigate("/tracking");
    }
  }

  return (
    <div className="simple-shell">
      <header className="simple-pagebar">
        <div>
          <p className="eyebrow">Book Ride</p>
          <h1>{user?.name || "Rider"}</h1>
        </div>
        <div className="simple-header-actions">
          <Link className="button secondary" to="/dashboard">Dashboard</Link>
          <Link className="button secondary" to="/tracking">Tracking</Link>
          <button type="button" className="button secondary" onClick={logout}>Log out</button>
        </div>
      </header>

      <section className="simple-book-layout">
        <article className="card booking-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Ride Details</p>
              <h3>Plan your trip</h3>
            </div>
          </div>

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
              {submitting ? "Booking..." : "Confirm booking"}
            </button>
          </form>
        </article>

        <article className="card simple-summary-card">
          <p className="eyebrow">Summary</p>
          <h3>Estimated trip</h3>
          <div className="estimate-panel stacked">
            <div>
              <span>Fare</span>
              <strong>{estimate ? `Rs. ${estimate.fare}` : "..."}</strong>
            </div>
            <div>
              <span>Distance</span>
              <strong>{estimate ? `${estimate.distance.toFixed(1)} km` : "..."}</strong>
            </div>
            <div>
              <span>Time</span>
              <strong>{estimate ? `${estimate.time} min` : "..."}</strong>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
