# MINOR PROJECT REPORT

## Title
Rydo: MERN Stack Ride Booking and Safety Alert Web Application

## Submitted By
- Name: Kuldeep Ravindra Patil
- Project Type: Minor Project
- Technology Stack: MongoDB, Express.js, React.js, Node.js

## Project Links
- GitHub Repository: https://github.com/kuldeeppatil2911/Rydo_project
- Live Application: https://client-omega-five-23.vercel.app
- Live API Health Check: https://rydo-api-service-production.up.railway.app/api/health

## Certificate
This is to certify that the project titled "Rydo: MERN Stack Ride Booking and Safety Alert Web Application" is a genuine minor project carried out by Kuldeep Ravindra Patil as part of academic requirements. The work presented in this report is original and based on the implementation completed during the project period.

## Acknowledgement
I would like to express my sincere gratitude to my guide, faculty members, and institution for their support and encouragement during the development of this project. I also thank my friends and peers for their suggestions and valuable feedback. Their guidance helped me complete this project successfully.

## Abstract
Rydo is a full-stack ride-booking web application developed using the MERN stack. The main purpose of the project is to provide a simple, user-friendly, and safety-focused platform for booking rides online. The system allows users to register, log in securely, book rides, view fare estimates, track ride status, and maintain an emergency contact profile. A special safety feature is included to notify the emergency contact with ride details such as pickup location, drop location, driver name, vehicle number, fare, payment mode, and OTP. The application also provides a live map view and simulated moving driver tracking to improve the overall user experience. The project demonstrates practical use of modern web technologies, REST API development, authentication, database integration, and deployment on cloud platforms.

## 1. Introduction
Transportation and ride-booking applications have become an important part of daily life. Users expect fast booking, route visibility, secure login, and safety support in one platform. Traditional systems often lack a simple academic prototype that combines booking flow with emergency alert functionality. To address this need, the Rydo application was developed as a minor project.

Rydo is designed as a modern web-based ride-booking solution where users can create an account, book a ride, see estimated time and fare, and track booking progress. The project also introduces a safety feature by allowing users to add an emergency contact and optionally send ride details through email and SMS. This makes the project useful not only as a ride-booking prototype but also as a safety-oriented application.

## 2. Problem Statement
Many simple ride-booking demo systems focus only on booking functionality and ignore personal safety features. Users may want a trusted contact to receive ride details during travel. There is a need for a web-based solution that combines:

- easy user authentication
- smooth ride booking
- live ride tracking
- safety notifications to emergency contacts
- simple and responsive user interface

## 3. Objectives
The main objectives of the project are:

- To develop a complete ride-booking web application using the MERN stack.
- To provide secure user registration and login using JWT authentication.
- To allow users to book rides with pickup and drop locations.
- To calculate ride estimate details such as fare, distance, and time.
- To assign a driver and show ride tracking updates.
- To add a safety feature for emergency contact notification.
- To create a responsive and user-friendly interface.
- To deploy the project online for real-time access and demonstration.

## 4. Scope of the Project
The scope of the project includes:

- user account creation and authentication
- ride booking and fare estimation
- driver allocation using demo seed data
- trip tracking and status updates
- emergency contact profile management
- optional emergency notification through email and SMS
- live map-based current location display
- deployment of frontend and backend on cloud platforms

The current project is a prototype and can be enhanced in future with real payment gateway integration, live driver APIs, route optimization, and production-grade messaging infrastructure.

## 5. Literature and Technology Background
The project is based on the MERN stack, which is widely used for modern full-stack web development:

- MongoDB is used for storing users, bookings, drivers, and location-related data.
- Express.js is used to create REST APIs for communication between frontend and backend.
- React.js is used to build the user interface with routing and state management.
- Node.js is used as the runtime environment for the server-side application.

Additional tools and libraries used in the project include:

- Mongoose for MongoDB object modeling
- bcryptjs for password hashing
- JSON Web Token for secure authentication
- Nodemailer for email notifications
- Twilio integration support for SMS notifications
- Vite for frontend development and build optimization
- Railway for backend deployment
- Vercel for frontend deployment

## 6. Proposed System
The proposed system is a ride-booking web application that operates through a client-server architecture. The user interacts with the React frontend. The frontend sends requests to the Express backend through REST APIs. The backend processes the request, interacts with MongoDB, and returns the appropriate response.

The system contains the following major modules:

- Authentication module
- Profile and emergency contact module
- Ride booking module
- Fare estimation module
- Driver matching module
- Tracking module
- Notification module

## 7. System Architecture
### 7.1 Frontend
The frontend is built with React and Vite. It contains separate pages for:

- Login
- Signup
- Dashboard
- Ride Booking
- Ride Tracking
- Profile

The frontend uses:

- React Router for navigation
- Auth context for login state
- Ride context for booking and tracking state

### 7.2 Backend
The backend is built with Express.js and Node.js. It exposes REST APIs for:

- authentication
- user profile updates
- ride metadata
- driver data
- booking creation and tracking

### 7.3 Database
MongoDB is used as the database. Mongoose models are used to define schemas and interact with collections.

## 8. Modules Description
### 8.1 Authentication Module
This module allows users to register and log in securely. Passwords are hashed using bcrypt before storing them in the database. JWT tokens are used for session authentication.

### 8.2 User Profile Module
This module stores user details such as name, email, phone number, emergency contact details, and safety alert preference.

### 8.3 Ride Booking Module
This module allows users to select pickup and drop locations, choose a ride type, choose payment mode, and create a booking.

### 8.4 Fare Estimation Module
The system calculates distance, time, and estimated fare before confirming a booking.

### 8.5 Driver Matching Module
The application selects a driver from available seeded driver data based on ride type and availability.

### 8.6 Tracking Module
The tracking module shows ride progress, booking status, and a moving driver simulation. It also supports a live current-location map through browser GPS.

### 8.7 Emergency Safety Module
This is a key feature of the project. Users can add an emergency contact and switch the alert feature on or off. When a ride is booked, the system prepares emergency notification details including:

- rider name
- pickup point
- drop point
- driver name
- vehicle number
- fare
- payment mode
- OTP

The system supports:

- email notifications through SMTP
- SMS notifications through Twilio

If the external providers are not configured, the backend still logs the notification flow for demonstration.

## 9. Database Design
The project mainly uses the following collections:

### 9.1 User Collection
Important fields:

- name
- email
- password
- phone
- emergencyContact
- emergencyAlertsEnabled
- createdAt
- updatedAt

### 9.2 Booking Collection
Important fields:

- user
- pickup
- dropoff
- rideType
- driver
- payment
- tripMode
- distance
- time
- fare
- otp
- status
- activityLog
- createdAt
- updatedAt

### 9.3 Driver Collection
Important fields:

- name
- vehicle
- plate
- rating
- eta
- rideType
- status

## 10. API Endpoints
The backend provides the following main API groups:

- `/api/auth` for registration and login
- `/api/users` for user profile and emergency contact updates
- `/api/meta` for ride types and location-related metadata
- `/api/drivers` for available drivers
- `/api/bookings` for estimate, create booking, update status, and recent bookings

## 11. User Interface Flow
The application follows a simple and user-friendly page flow:

1. User opens the application.
2. User signs up or logs in.
3. User reaches the dashboard.
4. User starts a ride booking.
5. User views estimated fare, time, and distance.
6. User confirms booking.
7. User sees tracking page with ride progress and live map.
8. User can manage emergency contact settings from the profile page.

## 12. Implementation Details
### 12.1 Frontend Implementation
The frontend was developed using React. Routing is handled using `react-router-dom`. Authentication and booking state are managed using context providers. The user interface is designed to keep the flow simple and less crowded.

### 12.2 Backend Implementation
The backend was implemented using Express.js. Controllers handle business logic, services manage reusable functions such as notifications and trip calculations, and routes expose the endpoints to the frontend.

### 12.3 Security Implementation
The project uses:

- password hashing using bcryptjs
- token-based authentication using JWT
- protected routes for authenticated access

### 12.4 Deployment Implementation
The backend is deployed on Railway and the frontend is deployed on Vercel. MongoDB Atlas is used as the cloud database. This allows the project to be demonstrated online from any location.

## 13. Testing
The project was tested by manually verifying the major flows:

- user registration
- user login
- profile update
- emergency contact update
- ride booking
- fare estimation
- tracking page navigation
- live deployment access

Additional deployment verification:

- frontend build generation using Vite
- backend health route check
- database connectivity through MongoDB Atlas

## 14. Results
The project was implemented successfully and the core objectives were achieved. The application supports secure authentication, ride booking, trip tracking, profile management, and emergency contact handling. The project also demonstrates live deployment and real-world integration readiness through SMTP and Twilio configuration support.

## 15. Advantages
- Simple and responsive interface
- Secure login system
- Full-stack architecture using MERN
- Safety-oriented emergency contact feature
- Live deployment for demo and presentation
- Easy to extend in future

## 16. Limitations
- Driver movement is simulated and not connected to a real GPS fleet service
- Payment gateway is not integrated
- SMS and email require third-party provider configuration
- Route optimization and live traffic data are not included
- Admin dashboard is not yet implemented

## 17. Future Scope
The project can be enhanced with:

- real-time driver tracking using live GPS devices
- online payment gateway integration
- admin dashboard for ride and driver management
- ride scheduling with calendar support
- push notifications
- multilingual support
- advanced analytics and reports
- real map route drawing and ETA prediction

## 18. Conclusion
Rydo is a useful and practical MERN stack minor project that demonstrates full-stack web development skills and real-world problem solving. The project combines ride booking, authentication, database connectivity, tracking, and safety alert functionality into one web platform. It is suitable for academic presentation because it covers frontend development, backend APIs, database design, security, and deployment. The project also has enough future scope to be extended into a more advanced real-world application.

## 19. Hardware and Software Requirements
### Hardware Requirements
- Processor: Intel i3 or above
- RAM: 4 GB or above
- Storage: 10 GB free space
- Internet connection

### Software Requirements
- Operating System: Windows 10/11
- Node.js
- npm
- MongoDB Atlas
- Code Editor: VS Code
- Browser: Chrome / Edge

## 20. References
1. MongoDB Documentation: https://www.mongodb.com/docs/
2. Express.js Documentation: https://expressjs.com/
3. React Documentation: https://react.dev/
4. Node.js Documentation: https://nodejs.org/
5. Mongoose Documentation: https://mongoosejs.com/
6. Vercel Documentation: https://vercel.com/docs
7. Railway Documentation: https://docs.railway.com/
8. Nodemailer Documentation: https://nodemailer.com/
9. Twilio Documentation: https://www.twilio.com/docs/

## 21. Viva Questions Preparation
Possible questions that may be asked during the minor project presentation:

1. What is the MERN stack?
2. Why did you choose MongoDB for this project?
3. How does JWT authentication work in your project?
4. How is password security handled?
5. What is the purpose of the emergency contact feature?
6. How is the fare estimate calculated?
7. What is the role of React Context in the frontend?
8. How is the project deployed?
9. What are the limitations of the current system?
10. What features would you add in the future?

## 22. Annexure
Important project files:

- Frontend entry: `client/src/App.jsx`
- Frontend styles: `client/src/styles.css`
- Backend entry: `server/src/server.js`
- Booking controller: `server/src/controllers/bookingController.js`
- Notification service: `server/src/services/notificationService.js`
- User model: `server/src/models/User.js`
- Booking model: `server/src/models/Booking.js`
- Driver model: `server/src/models/Driver.js`

## 23. Submission Note
Before final college submission, you can add:

- college name
- department name
- guide name
- academic year
- certificate signature section
- table of contents
- screenshots of login, dashboard, booking, tracking, and profile pages
