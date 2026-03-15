const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getAuthHeader() {
  const token = localStorage.getItem("rydo_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function getMeta() {
  return request("/meta");
}

export function getDrivers(rideType) {
  const query = rideType ? `?rideType=${encodeURIComponent(rideType)}` : "";
  return request(`/drivers${query}`);
}

export function estimateBooking(payload) {
  return request("/bookings/estimate", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function createBooking(payload) {
  return request("/bookings", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateBookingStatus(id, status) {
  return request(`/bookings/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
}

export function getRecentBookings(limit = 4) {
  return request(`/bookings/recent?limit=${limit}`);
}

export function authRegister(payload) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function authLogin(payload) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getMe() {
  return request("/users/me");
}

export function updateMe(payload) {
  return request("/users/me", {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}
