# Rydo

Rydo is a full-stack ride-booking web application built for a minor project using MongoDB, Express, React, and Node.js. It supports ride booking, fare estimation, driver matching, trip tracking, authentication, profile management, live map tracking, and emergency contact notifications.

## Live Links

- Frontend: `https://rydo-project.vercel.app`
- Backend health: `https://rydo-api-service-production.up.railway.app/api/health`

## Tech Stack

- MongoDB with Mongoose
- Express.js REST API
- React with Vite
- Node.js
- JWT authentication
- Nodemailer for emergency contact alerts
- Twilio SMS support
- React Leaflet for live map experience

## Features

- User signup and login with JWT-based authentication
- Profile page with emergency contact details
- Ride booking with pickup, drop-off, ride type, payment, and trip mode
- Dynamic fare, distance, and time estimation
- Driver matching from seeded demo data
- Live trip progress simulation with booking status updates
- Live browser-GPS map showing the user's current location
- Cleaner mobile-inspired login and signup UI
- Recent trip history fetched from MongoDB
- Emergency contact email and SMS notification when a signed-in user books a ride
- Profile toggle to turn emergency safety alerts on or off

## Project Structure

- `client` : React frontend
- `server` : Express backend and MongoDB models

## API Modules

- `/api/auth` : register and login
- `/api/users` : profile and emergency contact updates
- `/api/meta` : ride types and location data
- `/api/drivers` : available drivers
- `/api/bookings` : estimate, create, update status, and recent bookings

## Environment Setup

Create `server/.env` from `server/.env.example` and configure:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/rydo
JWT_SECRET=your-super-secret-key-change-in-production

# Optional: SMTP for emergency contact notifications
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_USER=
# SMTP_PASS=
# SMTP_FROM=noreply@rydo.com

# Optional: Twilio SMS for emergency text notifications
# TWILIO_ACCOUNT_SID=
# TWILIO_AUTH_TOKEN=
# TWILIO_PHONE_NUMBER=
```

## Local Run

1. Install dependencies:

```bash
npm install
```

2. Start the development servers:

```bash
npm run dev
```

3. Open:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Build

To build the frontend for production:

```bash
npm run build --workspace client
```

## Deployment

The project is currently deployed with:

- Vercel for the frontend
- Railway for the backend
- MongoDB Atlas for the database

Before deployment, set these environment variables on the hosting platform:

- `CLIENT_URL`
- `MONGO_URI`
- `JWT_SECRET`
- `VITE_API_URL`
- Optional SMTP values for email alerts
- Optional Twilio values for SMS alerts

## Notes

- The backend seeds default drivers and locations automatically when the database is empty.
- Emergency contact email sending works when SMTP variables are configured. SMS sending works when Twilio variables are configured.
- Without SMTP or Twilio configuration, the server logs the notification intent so the safety flow still remains demo-friendly.
- In production, the frontend uses the Railway API URL and the backend CORS is configured for the deployed Vercel domain.
- This project is designed to be demo-friendly for academic presentation and minor project evaluation.
