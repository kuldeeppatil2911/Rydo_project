# Rydo MERN Project

Rydo is a full-stack ride-booking web application built with MongoDB, Express, React, and Node.js.

## Structure

- `client` - React + Vite frontend
- `server` - Express API with MongoDB models and booking logic

## Core Features

- Live fare estimation from pickup, drop-off, ride type, and trip mode
- Driver matching and booking creation through API endpoints
- Real-time trip progression on the frontend with backend status updates
- Recent bookings fetched from the server
- Seeded locations and drivers for a ready-to-demo project flow

## Run

1. Install dependencies with `npm install`
2. Copy `server/.env.example` to `server/.env`
3. Set `MONGO_URI` in `server/.env`
4. Start both apps with `npm run dev`

Frontend runs on `http://localhost:5173`

Backend runs on `http://localhost:5000`
