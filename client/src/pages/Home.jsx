import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRide } from "../context/RideContext";

export default function Home() {
  const { user, logout } = useAuth();
  const { heroBookings, recentBookings, currentBooking, activeStage } = useRide();

  return (
    <div className="simple-shell">
      <header className="simple-header card">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Welcome, {user?.name || "Rider"}</h1>
          <p className="simple-subtitle">Choose one action and continue step by step.</p>
        </div>
        <div className="simple-header-actions">
          <Link className="button primary" to="/book">Book Ride</Link>
          <Link className="button secondary" to="/profile">Profile</Link>
          <button type="button" className="button secondary" onClick={logout}>Log out</button>
        </div>
      </header>

      <section className="simple-stats">
        <div className="card simple-stat">
          <span className="metric-label">Bookings Today</span>
          <strong>{heroBookings.toLocaleString("en-IN")}</strong>
        </div>
        <div className="card simple-stat">
          <span className="metric-label">Current Status</span>
          <strong>{activeStage?.label || "Ready"}</strong>
        </div>
        <div className="card simple-stat">
          <span className="metric-label">Current Trip</span>
          <strong>{currentBooking ? currentBooking.driver.name : "No active ride"}</strong>
        </div>
      </section>

      <section className="simple-actions">
        <Link className="card simple-action-card" to="/book">
          <h3>Book a ride</h3>
          <p>Choose pickup, drop-off, ride type, and payment.</p>
        </Link>
        <Link className="card simple-action-card" to="/tracking">
          <h3>Track ride</h3>
          <p>See driver, OTP, route, and live map tracking.</p>
        </Link>
        <Link className="card simple-action-card" to="/profile">
          <h3>Profile and safety</h3>
          <p>Manage emergency contact and safety settings.</p>
        </Link>
      </section>

      <section className="card recent-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Recent Trips</p>
            <h3>Trip history</h3>
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
                <p>Your bookings will appear here after your first ride.</p>
              </div>
              <div className="recent-tag">Waiting</div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
