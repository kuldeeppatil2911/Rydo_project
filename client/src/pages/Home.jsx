import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRide } from "../context/RideContext";

export default function Home() {
  const { user, logout } = useAuth();
  const { heroBookings, estimate, recentBookings, currentBooking, activeStage, hasEmergencyContact, emergencyAlertsEnabled } = useRide();

  return (
    <div className="dashboard-shell">
      <header className="dashboard-hero">
        <nav className="topbar">
          <div className="brand-lockup">
            <div className="brand-mark">R</div>
            <div>
              <p className="eyebrow">Ride Experience</p>
              <h1>Rydo Dashboard</h1>
            </div>
          </div>
          <div className="topbar-right">
            <div className="topbar-stats">
              <div>
                <span className="metric-label">Bookings Today</span>
                <strong>{heroBookings.toLocaleString("en-IN")}</strong>
              </div>
              <div>
                <span className="metric-label">Current Status</span>
                <strong>{activeStage?.label || "Ready"}</strong>
              </div>
            </div>
            <div className="topbar-auth">
              <span className="user-name">{user?.name}</span>
              <Link className="button secondary small" to="/profile">Profile</Link>
              <button type="button" className="button secondary small" onClick={logout}>Log out</button>
            </div>
          </div>
        </nav>

        <section className="dashboard-showcase">
          <div className="dashboard-copy">
            <p className="hero-kicker">Ride theme inspired, cleaner journey flow</p>
            <h2>Move through booking, tracking, and safety one screen at a time.</h2>
            <p className="hero-text">
              This version follows a more presentable product flow: sign in first, then use separate ride screens
              instead of one long page.
            </p>
            <div className="hero-actions">
              <Link className="button primary" to="/book">Start booking</Link>
              <Link className="button secondary" to="/tracking">Open tracking</Link>
            </div>
          </div>

          <div className="dashboard-visual card">
            <div className="dashboard-road">
              <div className="dashboard-lane"></div>
              <div className="dashboard-car"></div>
              <div className="dashboard-badge dashboard-badge-start">Login</div>
              <div className="dashboard-badge dashboard-badge-mid">Book</div>
              <div className="dashboard-badge dashboard-badge-end">Track</div>
            </div>
            <div className="map-caption">
              <div>
                <span>Estimated fare</span>
                <strong>{estimate ? `Rs. ${estimate.fare}` : "Ready to calculate"}</strong>
              </div>
              <div>
                <span>Safety mode</span>
                <strong>{hasEmergencyContact && emergencyAlertsEnabled ? "Enabled" : "Optional"}</strong>
              </div>
            </div>
          </div>
        </section>
      </header>

      <main>
        <section className="dashboard-grid">
          <Link className="card action-card" to="/book">
            <p className="eyebrow">Step 1</p>
            <h3>Ride booking</h3>
            <p>Select route, fare type, payment, and confirm the ride from a focused booking screen.</p>
          </Link>

          <Link className="card action-card" to="/tracking">
            <p className="eyebrow">Step 2</p>
            <h3>Live tracking</h3>
            <p>See live trip progress, driver movement, OTP, route details, and current map state.</p>
          </Link>

          <Link className="card action-card" to="/profile">
            <p className="eyebrow">Step 3</p>
            <h3>Safety profile</h3>
            <p>Control emergency alerts, add contact information, and prepare the project for demo use.</p>
          </Link>

          <article className="card action-card">
            <p className="eyebrow">Current Trip</p>
            <h3>{currentBooking ? currentBooking.driver.name : "No active booking"}</h3>
            <p>
              {currentBooking
                ? `${currentBooking.pickup.name} to ${currentBooking.dropoff.name}`
                : "Create a booking to start the live tracking flow."}
            </p>
          </article>
        </section>

        <section className="card recent-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Recent Trips</p>
              <h3>Quick history</h3>
            </div>
          </div>
          <div className="recent-list">
            {recentBookings.length ? (
              recentBookings.map((booking) => (
                <div className="recent-item" key={booking._id}>
                  <div>
                    <strong>{booking.pickup.name} to {booking.dropoff.name}</strong>
                    <p>{booking.rideType.name} - {booking.payment} - Rs. {booking.fare}</p>
                  </div>
                  <div className="recent-tag">{new Date(booking.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</div>
                </div>
              ))
            ) : (
              <div className="recent-item">
                <div>
                  <strong>No trips yet</strong>
                  <p>Your bookings will show here after the first confirmed ride.</p>
                </div>
                <div className="recent-tag">Waiting</div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
