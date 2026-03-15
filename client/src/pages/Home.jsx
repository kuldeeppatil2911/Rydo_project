import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  createBooking,
  estimateBooking,
  getDrivers,
  getMeta,
  getRecentBookings,
  updateBookingStatus
} from "../api";
import { useAuth } from "../context/AuthContext";
import LiveLocationMap from "../components/LiveLocationMap";

const timelineStages = [
  { label: "Searching", progress: 10, mapProgress: 0, log: "Searching nearby drivers for the best match." },
  { label: "Driver assigned", progress: 28, mapProgress: 0.08, log: "A driver has accepted your ride request." },
  { label: "Driver arriving", progress: 52, mapProgress: 0.32, log: "Your driver is heading to the pickup location." },
  { label: "Trip in progress", progress: 78, mapProgress: 0.58, log: "Trip started. Live tracking is active." },
  { label: "Completed", progress: 100, mapProgress: 1, log: "You have reached your destination. Payment confirmed." }
];

const emptyForm = {
  pickup: "",
  dropoff: "",
  rideType: "",
  payment: "UPI",
  tripMode: "now"
};

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [meta, setMeta] = useState({ locations: [], rideTypes: [] });
  const [form, setForm] = useState(emptyForm);
  const [estimate, setEstimate] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [tripStageIndex, setTripStageIndex] = useState(-1);
  const [activityLog, setActivityLog] = useState(["Book a ride to see real-time trip updates here."]);
  const [heroBookings, setHeroBookings] = useState(1284);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const timerRef = useRef(null);

  const hasEmergencyContact =
    isAuthenticated && (user?.emergencyContact?.email?.trim() || user?.emergencyContact?.phone?.trim());
  const emergencyAlertsEnabled = isAuthenticated && user?.emergencyAlertsEnabled !== false;

  useEffect(() => {
    let ignore = false;

    async function loadInitialData() {
      try {
        const [metaResponse, recentResponse] = await Promise.all([getMeta(), getRecentBookings()]);
        if (ignore) return;

        setMeta(metaResponse.data);
        setRecentBookings(recentResponse.data);

        const defaultLocations = metaResponse.data.locations;
        const defaultRideType = metaResponse.data.rideTypes[0]?.id || "";
        setForm({
          pickup: defaultLocations[0]?.name || "",
          dropoff: defaultLocations[1]?.name || "",
          rideType: defaultRideType,
          payment: "UPI",
          tripMode: "now"
        });
      } catch (loadError) {
        if (!ignore) setError(loadError.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadInitialData();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!form.rideType) return;
    let ignore = false;

    getDrivers(form.rideType)
      .then((response) => {
        if (!ignore) setDrivers(response.data);
      })
      .catch((driverError) => {
        if (!ignore) setError(driverError.message);
      });

    return () => {
      ignore = true;
    };
  }, [form.rideType]);

  useEffect(() => {
    if (!form.pickup || !form.dropoff || !form.rideType) return;
    if (form.pickup === form.dropoff) {
      setError("Pickup and drop-off must be different.");
      return;
    }

    let ignore = false;
    setError("");

    estimateBooking(form)
      .then((response) => {
        if (!ignore) setEstimate(response.data);
      })
      .catch((estimateError) => {
        if (!ignore) setError(estimateError.message);
      });

    return () => {
      ignore = true;
    };
  }, [form]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setHeroBookings((count) => count + Math.floor(Math.random() * 3));
    }, 3200);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!currentBooking || tripStageIndex < 0 || tripStageIndex >= timelineStages.length - 1) {
      return undefined;
    }

    timerRef.current = window.setTimeout(async () => {
      const nextIndex = tripStageIndex + 1;
      const nextStage = timelineStages[nextIndex];

      setTripStageIndex(nextIndex);
      setActivityLog((entries) => [formatLog(nextStage.log), ...entries]);

      try {
        const response = await updateBookingStatus(currentBooking._id, nextStage.label);
        setCurrentBooking(response.data);

        if (nextStage.label === "Completed") {
          const recentResponse = await getRecentBookings();
          setRecentBookings(recentResponse.data);
          setActivityLog((entries) => [
            formatLog(`Trip complete. Total billed amount: Rs. ${response.data.fare}.`),
            ...entries
          ]);
        }
      } catch (updateError) {
        setError(updateError.message);
      }
    }, 2600);

    return () => window.clearTimeout(timerRef.current);
  }, [currentBooking, tripStageIndex]);

  const activeStage = tripStageIndex >= 0 ? timelineStages[tripStageIndex] : null;
  const displayTrip = currentBooking || estimate;
  const routeGeometry = getRouteGeometry(displayTrip);
  const carPosition = getCarPosition(displayTrip, activeStage);

  async function handleSubmit(event) {
    event.preventDefault();
    if (form.pickup === form.dropoff) {
      setError("Pickup and drop-off must be different.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const response = await createBooking(form);
      const booking = response.data;

      setCurrentBooking(booking);
      setTripStageIndex(0);
      setActivityLog([
        formatLog(`Ride booked from ${booking.pickup.name} to ${booking.dropoff.name}.`),
        formatLog(`Fare estimate locked at Rs. ${booking.fare} via ${booking.payment}.`),
        formatLog(`Driver ${booking.driver.name} is being connected to your request.`),
        formatLog(timelineStages[0].log)
      ]);

      if (hasEmergencyContact && emergencyAlertsEnabled) {
        setActivityLog((entries) => [
          formatLog("Emergency alert sent with route, vehicle number, and ride details."),
          ...entries
        ]);
      }

      const recentResponse = await getRecentBookings();
      setRecentBookings(recentResponse.data);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  function resetTrip() {
    window.clearTimeout(timerRef.current);
    setCurrentBooking(null);
    setTripStageIndex(-1);
    setActivityLog(["Book a ride to see real-time trip updates here."]);
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  if (loading) {
    return <div className="loading-screen">Loading Rydo...</div>;
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <nav className="topbar">
          <div className="brand-lockup">
            <div className="brand-mark">R</div>
            <div>
              <p className="eyebrow">MERN Ride Booking</p>
              <h1>Rydo</h1>
            </div>
          </div>
          <div className="topbar-right">
            <div className="topbar-stats">
              <div>
                <span className="metric-label">Driver ETA</span>
                <strong>{estimate?.rideType?.eta || 3} min</strong>
              </div>
              <div>
                <span className="metric-label">Bookings Today</span>
                <strong>{heroBookings.toLocaleString("en-IN")}</strong>
              </div>
            </div>
            <div className="topbar-auth">
              {isAuthenticated ? (
                <>
                  <span className="user-name">{user?.name}</span>
                  <Link className="button secondary small" to="/profile">Profile</Link>
                  <button type="button" className="button secondary small" onClick={logout}>Log out</button>
                </>
              ) : (
                <>
                  <Link className="button secondary small" to="/login">Sign in</Link>
                  <Link className="button primary small" to="/signup">Sign up</Link>
                </>
              )}
            </div>
          </div>
        </nav>

        <section className="hero-grid">
          <div className="hero-copy">
            <p className="hero-kicker">Fast. Reliable. Safety alerts included.</p>
            <h2>Book a ride, match with a driver, and share vehicle and location details with your emergency contact.</h2>
            <p className="hero-text">
              Rydo is a full MERN-stack ride app. Sign in, add an emergency contact in your profile, and turn safety alerts on or off anytime.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#bookingPanel">Book a Ride</a>
              <a className="button secondary" href="#trackingPanel">View Tracking</a>
            </div>
            <div className="hero-features">
              <span>Mongo-backed bookings</span>
              <span>Express REST APIs</span>
              <span>Emergency email and SMS alerts</span>
            </div>
            {error ? <p className="error-banner">{error}</p> : null}
          </div>

          <div className="hero-map card">
            <div className="map-surface">
              <div className="map-grid"></div>
              {displayTrip ? (
                <>
                  <div
                    className="marker pickup"
                    style={{ left: `${displayTrip.pickup.x}%`, top: `${displayTrip.pickup.y}%` }}
                  >
                    <span>Pickup</span>
                  </div>
                  <div
                    className="marker dropoff"
                    style={{ left: `${displayTrip.dropoff.x}%`, top: `${displayTrip.dropoff.y}%` }}
                  >
                    <span>Drop</span>
                  </div>
                  <div className="route-line" style={routeGeometry}></div>
                  <div className="car-marker" style={carPosition}></div>
                </>
              ) : null}
            </div>
            <div className="map-caption">
              <div>
                <span>Current Ride</span>
                <strong>{displayTrip ? `${displayTrip.pickup.name} to ${displayTrip.dropoff.name}` : "Select a route"}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{activeStage?.label || "Idle"}</strong>
              </div>
            </div>
          </div>
        </section>
      </header>

      <main>
        <section className="dashboard-grid">
          <article className="card booking-card" id="bookingPanel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Ride Booking</p>
                <h3>Plan your trip</h3>
              </div>
            </div>

            {hasEmergencyContact && emergencyAlertsEnabled ? (
              <p className="emergency-notice">
                Your emergency contact will receive safety details including route, vehicle number, and OTP when you confirm this booking.
              </p>
            ) : null}

            {hasEmergencyContact && !emergencyAlertsEnabled ? (
              <p className="emergency-notice">
                Emergency contact exists, but safety alerts are currently turned off in your profile.
              </p>
            ) : null}

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

              <section className="estimate-panel">
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
              </section>

              <button className="button primary full-width" type="submit" disabled={submitting || !estimate}>
                {submitting ? "Booking..." : "Confirm booking"}
              </button>
            </form>
          </article>

          <article className="card tracking-card" id="trackingPanel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Live Tracking</p>
                <h3>Your trip status</h3>
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
                <strong>
                  {currentBooking?.driver ? `${currentBooking.driver.vehicle} - ${currentBooking.driver.plate}` : "-"}
                </strong>
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
        </section>

        <section className="insights-grid">
          <article className="card driver-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Available Drivers</p>
                <h3>Nearby matches</h3>
              </div>
            </div>
            <div className="driver-list">
              {drivers.map((driver) => (
                <div className="driver-item" key={driver._id || driver.plate}>
                  <div className="driver-badge">{driver.name.charAt(0)}</div>
                  <div className="driver-meta">
                    <strong>{driver.name}</strong>
                    <span>{driver.vehicle} - {driver.plate} - {driver.rating.toFixed(1)} stars</span>
                  </div>
                  <div className="driver-tag">{driver.rideType === form.rideType ? "Best match" : `${driver.eta} min away`}</div>
                </div>
              ))}
            </div>
          </article>

          <article className="card highlights-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Safety</p>
                <h3>Emergency contact notification</h3>
              </div>
            </div>
            <div className="highlights-grid">
              <div>
                <strong>Add emergency contact</strong>
                <p>In your profile, add a contact email or phone. When you book a ride, they receive route details, driver info, vehicle number, and OTP.</p>
              </div>
              <div>
                <strong>On or off control</strong>
                <p>Just book as usual. If alerts are enabled in your profile, the safety notification is sent automatically.</p>
              </div>
            </div>
          </article>
        </section>

        <section className="insights-grid">
          <LiveLocationMap displayTrip={displayTrip} activeStage={activeStage} />

          <article className="card highlights-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Live Safety</p>
                <h3>Use current GPS for safer pickups</h3>
              </div>
            </div>
            <div className="highlights-grid">
              <div>
                <strong>Real current position</strong>
                <p>The live map reads your browser location and updates automatically while the page is open.</p>
              </div>
              <div>
                <strong>Useful for emergency sharing</strong>
                <p>Your current location can help confirm pickup context alongside the driver and vehicle details.</p>
              </div>
            </div>
          </article>
        </section>

        <section className="card recent-card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Recent Trips</p>
              <h3>Fetched from the backend</h3>
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
                  <div className="recent-tag">{formatDate(booking.createdAt)}</div>
                </div>
              ))
            ) : (
              <div className="recent-item">
                <div>
                  <strong>No trips yet</strong>
                  <p>Your confirmed bookings will appear here after the first ride.</p>
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

function getRouteGeometry(trip) {
  if (!trip?.pickup || !trip?.dropoff) return {};
  const dx = trip.dropoff.x - trip.pickup.x;
  const dy = trip.dropoff.y - trip.pickup.y;
  const length = Math.sqrt((dx ** 2) + (dy ** 2));
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return {
    left: `${trip.pickup.x}%`,
    top: `${trip.pickup.y}%`,
    width: `${length}%`,
    transform: `rotate(${angle}deg)`
  };
}

function getCarPosition(trip, stage) {
  if (!trip?.pickup || !trip?.dropoff) return {};
  const progress = stage?.mapProgress || 0;
  const x = trip.pickup.x + ((trip.dropoff.x - trip.pickup.x) * progress);
  const y = trip.pickup.y + ((trip.dropoff.y - trip.pickup.y) * progress);
  return { left: `${x}%`, top: `${y}%` };
}

function formatLog(message) {
  return `${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${message}`;
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}
