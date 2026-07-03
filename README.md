# AuthFlow — MERN Stack Authentication System

A secure, full-stack authentication system built with **MongoDB, Express.js, React, and Node.js (MERN)**. Features JWT-based authentication, protected routes, session persistence, and a live user dashboard.

**🔗 Live Demo:** [https://mern-auth-client-wk0v.onrender.com/login](https://mern-auth-client-wk0v.onrender.com/login)

---

## 📋 Overview

AuthFlow provides secure access for a modern SaaS-style workspace. Users can register, log in, and access a protected dashboard that verifies their session via JWT on every request. The dashboard displays real-time authentication status, token source, session age, and API connectivity.

---

## ✨ Features

- **JWT-Protected Authentication** — Secure login/register flow with encrypted tokens
- **Protected Routes** — Dashboard and profile routes accessible only to authenticated users
- **Session Persistence** — Session restores automatically after page refresh via stored JWT
- **Auto Logout on Invalid Token** — Automatically logs out users if their token is invalid or expired
- **Profile Management** — View and edit user profile details
- **Live Session Monitoring** — Dashboard shows auth status, token source, session age, and API health in real time
- **Password Security** — Passwords are hashed and never exposed in responses

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Axios (API requests with interceptors)
- React Router (client-side routing)

**Backend**
- Node.js
- Express.js
- MongoDB (via Mongoose)
- JSON Web Tokens (JWT) for authentication
- CORS for secure cross-origin requests

**Deployment**
- Frontend: Render (Static Site)
- Backend: Render (Web Service)
- Database: MongoDB Atlas

---

## 🚀 Live Demo

| Service | URL |
|---|---|
| Frontend (Login) | [https://mern-auth-client-wk0v.onrender.com/login](https://mern-auth-client-wk0v.onrender.com/login) |
| Backend API | `https://mern-auth-2-tt2r.onrender.com/api` |

> **Note:** This project is deployed on Render's free tier. If the backend has been inactive, the first request may take 30–50 seconds to respond while the server spins back up.

---

## 📂 Project Structure

```
mern-auth/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   │   ├── api.js          # Axios instance with interceptors
│   │   │   ├── authEvents.js
│   │   │   └── tokenStorage.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env.example
│
└── server/                 # Express backend
    ├── config/
    │   └── db.js            # MongoDB connection
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    │   └── authRoutes.js
    ├── server.js
    └── .env.example
```

---

## ⚙️ Getting Started Locally

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB instance)

### 1. Clone the repository
```bash
git clone https://github.com/mohit823/mern-auth.git
cd mern-auth
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in `server/` based on `.env.example`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5173
```

Run the backend:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd client
npm install
```

Create a `.env` file in `client/` based on `.env.example`:
```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in and receive a JWT |
| GET | `/api/auth/profile` | Get authenticated user's profile (protected) |

---

## 🌐 Deployment Notes

Both frontend and backend are deployed as separate services on Render:

- **Frontend** is deployed as a Render Static Site with a rewrite rule (`/* → /index.html`) to support client-side routing.
- **Backend** is deployed as a Render Web Service, with environment variables (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `PORT`) configured via the Render dashboard.
- CORS is configured on the backend to only accept requests from the deployed frontend origin.

---

## 📌 Roadmap

- [ ] Password reset via email
- [ ] Refresh token rotation
- [ ] Two-factor authentication (2FA)
- [ ] Admin panel for user management

---

## 👤 Author

**Mohit Kumar**
- GitHub: [@mohit823](https://github.com/mohit823)
- Portfolio: Deployed on Render

---

## 📄 License

This project is open source and available for learning purposes.
