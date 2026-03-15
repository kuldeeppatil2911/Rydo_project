import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRide } from "../context/RideContext";
import LiveLocationMap from "../components/LiveLocationMap";

export default function Tracking() {
  const { user, logout } = useAuth();
  const { activeStage, currentBooking, activityLog, tripStageIndex, timelineStages, form, displayTrip, resetTrip } = useRide();

  return (
    <div className="flow-shell">
      <aside className="flow-sidebar">
        <p className="eyebrow">Ride Flow</p>
        <h1>Track your ride</h1>
        <p className="flow-copy">
          Watch the driver move on the live map, review OTP and vehicle details, and keep safety information visible.
        </p>
        <div className="flow-steps">
          <div className="flow-step complete">1. Booking</div>
          <div className="flow-step active">2. Tracking</div>
          <div className="flow-step">3. Safety</div>
        </div>
        <div className="flow-links">
          <Link className="button secondary full-width" to="/dashboard">Back to dashboard</Link>
          <Link className="button secondary full-width" to="/book">Book another ride</Link>
          <button type="button" className="button secondary full-width" onClick={logout}>Log out</button>
        </div>
      </aside>

      <main className="flow-main">
        <header className="flow-topbar">
          <div>
            <p className="eyebrow">Live ride</p>
            <h2>{user?.name || "Rider"}</h2>
          </div>
          <div className="topbar-stats">
            <div>
              <span className="metric-label">Status</span>
              <strong>{activeStage?.label || "Idle"}</strong>
            </div>
            <div>
              <span className="metric-label">Payment</span>
              <strong>{currentBooking?.payment || form.payment}</strong>
            </div>
          </div>
        </header>

        <section className="flow-grid">
          <article className="card tracking-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Step 2</p>
                <h3>Live tracking</h3>
              </div>
            </div>

            <div className="status-pill">{activeStage?.label || "Idle"}</div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${activeStage?.progress || 0}%` }}></div>
            </div>

            <div className="timeline">
              {timelineStages.map((stage, index) => (
                <div
                  key={stage.label}
                  className={`timeline-step ${index === tripStageIndex ? "active" : ""} ${index < tripStageIndex ? "complete" : ""}`}
                >
                  {stage.label}
                </div>
              ))}
            </div>

            <div className="trip-summary-grid">
              <div>
                <span>Assigned driver</span>
                <strong>{currentBooking?.driver?.name || "Waiting for booking"}</strong>
              </div>
              <div>
                <span>Vehicle</span>
                <strong>{currentBooking?.driver ? `${currentBooking.driver.vehicle} - ${currentBooking.driver.plate}` : "-"}</strong>
              </div>
              <div>
                <span>OTP</span>
                <strong>{currentBooking?.otp || "----"}</strong>
              </div>
              <div>
                <span>Route</span>
                <strong>{displayTrip ? `${displayTrip.pickup.name} to ${displayTrip.dropoff.name}` : "Not started"}</strong>
              </div>
            </div>

            <div className="activity-log">
              <div className="activity-log-header">
                <span>Trip feed</span>
                <button className="text-button" type="button" onClick={resetTrip}>Reset</button>
              </div>
              <ul>
                {activityLog.map((entry, index) => (
                  <li key={`${entry}-${index}`}>{entry}</li>
                ))}
              </ul>
            </div>
          </article>

          <LiveLocationMap displayTrip={displayTrip} activeStage={activeStage} />
        </section>
      </main>
    </div>
  );
}
