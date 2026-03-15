import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRide } from "../context/RideContext";
import LiveLocationMap from "../components/LiveLocationMap";

export default function Tracking() {
  const { logout } = useAuth();
  const { activeStage, currentBooking, activityLog, tripStageIndex, timelineStages, form, displayTrip, resetTrip } = useRide();

  return (
    <div className="simple-shell">
      <header className="simple-pagebar">
        <div>
          <p className="eyebrow">Tracking</p>
          <h1>{activeStage?.label || "Live ride"}</h1>
        </div>
        <div className="simple-header-actions">
          <Link className="button secondary" to="/dashboard">Dashboard</Link>
          <Link className="button secondary" to="/book">Book Ride</Link>
          <button type="button" className="button secondary" onClick={logout}>Log out</button>
        </div>
      </header>

      <section className="simple-track-layout">
        <article className="card tracking-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Trip Status</p>
              <h3>Current ride</h3>
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
              <span>Driver</span>
              <strong>{currentBooking?.driver?.name || "Waiting"}</strong>
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
              <span>Payment</span>
              <strong>{currentBooking?.payment || form.payment}</strong>
            </div>
          </div>

          <div className="activity-log">
            <div className="activity-log-header">
              <span>Trip updates</span>
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
    </div>
  );
}
