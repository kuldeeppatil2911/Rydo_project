import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  createBooking,
  estimateBooking,
  getDrivers,
  getMeta,
  getRecentBookings,
  updateBookingStatus
} from "../api";
import { useAuth } from "./AuthContext";

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

const RideContext = createContext(null);

export function RideProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
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
        if (ignore) {
          return;
        }

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
        if (!ignore) {
          setError(loadError.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!form.rideType) {
      return;
    }

    let ignore = false;

    getDrivers(form.rideType)
      .then((response) => {
        if (!ignore) {
          setDrivers(response.data);
        }
      })
      .catch((driverError) => {
        if (!ignore) {
          setError(driverError.message);
        }
      });

    return () => {
      ignore = true;
    };
  }, [form.rideType]);

  useEffect(() => {
    if (!form.pickup || !form.dropoff || !form.rideType) {
      return;
    }

    if (form.pickup === form.dropoff) {
      setError("Pickup and drop-off must be different.");
      return;
    }

    let ignore = false;
    setError("");

    estimateBooking(form)
      .then((response) => {
        if (!ignore) {
          setEstimate(response.data);
        }
      })
      .catch((estimateError) => {
        if (!ignore) {
          setError(estimateError.message);
        }
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

  async function submitBooking() {
    if (form.pickup === form.dropoff) {
      setError("Pickup and drop-off must be different.");
      return false;
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
      return true;
    } catch (submitError) {
      setError(submitError.message);
      return false;
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

  const value = {
    meta,
    form,
    estimate,
    drivers,
    recentBookings,
    currentBooking,
    tripStageIndex,
    activityLog,
    heroBookings,
    loading,
    submitting,
    error,
    hasEmergencyContact,
    emergencyAlertsEnabled,
    timelineStages,
    activeStage: tripStageIndex >= 0 ? timelineStages[tripStageIndex] : null,
    displayTrip: currentBooking || estimate,
    setError,
    updateForm,
    submitBooking,
    resetTrip
  };

  return <RideContext.Provider value={value}>{children}</RideContext.Provider>;
}

export function useRide() {
  const context = useContext(RideContext);

  if (!context) {
    throw new Error("useRide must be used within RideProvider");
  }

  return context;
}

function formatLog(message) {
  return `${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${message}`;
}
