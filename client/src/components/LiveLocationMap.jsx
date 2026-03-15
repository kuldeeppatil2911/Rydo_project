import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, Circle, useMap } from "react-leaflet";
import L from "leaflet";

const defaultCenter = [22.3072, 73.1812];

const liveIcon = new L.DivIcon({
  className: "live-location-pin",
  html: '<div class="live-location-pin__dot"></div>',
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

export default function LiveLocationMap() {
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

  const center = useMemo(() => position || defaultCenter, [position]);

  return (
    <article className="card live-map-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Live Map</p>
          <h3>Current location</h3>
        </div>
      </div>

      <p className="live-map-copy">
        This map uses your browser GPS permission to show your current live location. It is useful for ride pickup
        confirmation and emergency safety sharing.
      </p>

      <div className="live-map-frame">
        <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="leaflet-map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RecenterMap center={center} />
          {position ? (
            <>
              <Marker position={position} icon={liveIcon}>
                <Popup>You are here right now.</Popup>
              </Marker>
              <Circle center={position} radius={accuracy || 30} pathOptions={{ color: "#d14b27", fillOpacity: 0.16 }} />
            </>
          ) : null}
        </MapContainer>
      </div>

      <div className="live-map-meta">
        <div>
          <span>Status</span>
          <strong>{status}</strong>
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
