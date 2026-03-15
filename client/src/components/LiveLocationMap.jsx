import React, { useEffect, useMemo, useState } from "react";
import { Circle, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

const defaultCenter = [22.3072, 73.1812];

const riderIcon = new L.DivIcon({
  className: "live-location-pin",
  html: '<div class="live-location-pin__dot"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const driverIcon = new L.DivIcon({
  className: "driver-map-pin",
  html: '<div class="driver-map-pin__dot"></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const destinationIcon = new L.DivIcon({
  className: "destination-map-pin",
  html: '<div class="destination-map-pin__dot"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

function RecenterMap({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, Math.max(map.getZoom(), 14), { animate: true });
  }, [center, map]);

  return null;
}

export default function LiveLocationMap({ displayTrip, activeStage }) {
  const [position, setPosition] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [status, setStatus] = useState("Requesting live location...");

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setStatus("Geolocation is not supported in this browser.");
      return undefined;
    }

    const watchId = navigator.geolocation.watchPosition(
      (geoPosition) => {
        setPosition([geoPosition.coords.latitude, geoPosition.coords.longitude]);
        setAccuracy(Math.round(geoPosition.coords.accuracy || 0));
        setStatus("Live location active");
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setStatus("Location permission denied. Allow GPS access to see your live position.");
        } else if (error.code === error.TIMEOUT) {
          setStatus("Location request timed out. Trying again...");
        } else {
          setStatus("Unable to fetch current location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const center = position || defaultCenter;
  const routeData = useMemo(() => buildRouteData(center, displayTrip, activeStage), [center, displayTrip, activeStage]);

  return (
    <article className="card live-map-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Live Map</p>
          <h3>Current location and driver</h3>
        </div>
      </div>

      <p className="live-map-copy">
        This map uses your browser GPS permission to show your current live location. When a ride is active, the
        driver moves on the real map toward you and then toward the destination.
      </p>

      <div className="live-map-frame">
        <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="leaflet-map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap center={center} />

          <Marker position={center} icon={riderIcon}>
            <Popup>Your current location</Popup>
          </Marker>
          <Circle center={center} radius={accuracy || 30} pathOptions={{ color: "#d14b27", fillOpacity: 0.16 }} />

          {routeData ? (
            <>
              <Polyline positions={[routeData.pickup, routeData.destination]} pathOptions={{ color: "#14324a", weight: 4, opacity: 0.7 }} />
              <Marker position={routeData.destination} icon={destinationIcon}>
                <Popup>Estimated destination on live map</Popup>
              </Marker>
              <Marker position={routeData.driver} icon={driverIcon}>
                <Popup>{routeData.driverLabel}</Popup>
              </Marker>
            </>
          ) : null}
        </MapContainer>
      </div>

      <div className="live-map-meta">
        <div>
          <span>Status</span>
          <strong>{routeData?.driverLabel || status}</strong>
        </div>
        <div>
          <span>Accuracy</span>
          <strong>{accuracy ? `${accuracy} m` : "Waiting..."}</strong>
        </div>
        <div>
          <span>Coordinates</span>
          <strong>{position ? `${position[0].toFixed(5)}, ${position[1].toFixed(5)}` : "Not available yet"}</strong>
        </div>
      </div>
    </article>
  );
}

function buildRouteData(center, displayTrip, activeStage) {
  if (!displayTrip?.pickup || !displayTrip?.dropoff) {
    return null;
  }

  const pickup = center;
  const destination = deriveDestination(center, displayTrip);
  const stageLabel = activeStage?.label || "Idle";
  const driver = deriveDriverPosition(pickup, destination, stageLabel, activeStage?.mapProgress || 0);

  return {
    pickup,
    destination,
    driver,
    driverLabel: getDriverLabel(stageLabel)
  };
}

function deriveDestination(center, displayTrip) {
  const lat = center[0];
  const kmDistance = Math.max(displayTrip.distance || 2, 1.6);
  const angle = Math.atan2(displayTrip.dropoff.y - displayTrip.pickup.y, displayTrip.dropoff.x - displayTrip.pickup.x);
  const latOffset = (kmDistance / 111) * Math.sin(angle);
  const lngOffset = (kmDistance / (111 * Math.cos((lat * Math.PI) / 180))) * Math.cos(angle);

  return [center[0] + latOffset, center[1] + lngOffset];
}

function deriveDriverPosition(pickup, destination, stageLabel, mapProgress) {
  const approachStart = interpolatePoint(pickup, destination, -0.35);

  if (stageLabel === "Searching") {
    return interpolatePoint(pickup, destination, -0.5);
  }

  if (stageLabel === "Driver assigned") {
    return approachStart;
  }

  if (stageLabel === "Driver arriving") {
    return interpolateBetween(approachStart, pickup, 0.72);
  }

  if (stageLabel === "Trip in progress") {
    const normalizedProgress = Math.max(0, Math.min(1, (mapProgress - 0.58) / 0.42));
    return interpolateBetween(pickup, destination, normalizedProgress);
  }

  if (stageLabel === "Completed") {
    return destination;
  }

  return pickup;
}

function interpolatePoint(origin, target, factor) {
  return [
    origin[0] + ((target[0] - origin[0]) * factor),
    origin[1] + ((target[1] - origin[1]) * factor)
  ];
}

function interpolateBetween(start, end, progress) {
  return [
    start[0] + ((end[0] - start[0]) * progress),
    start[1] + ((end[1] - start[1]) * progress)
  ];
}

function getDriverLabel(stageLabel) {
  if (stageLabel === "Searching") return "Searching for nearby driver";
  if (stageLabel === "Driver assigned") return "Driver assigned and moving";
  if (stageLabel === "Driver arriving") return "Driver arriving at pickup";
  if (stageLabel === "Trip in progress") return "Driver moving on trip route";
  if (stageLabel === "Completed") return "Trip completed at destination";
  return "Live location active";
}
