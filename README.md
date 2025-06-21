# Saria Dispatch Diary

A React-based dispatch management system with Node.js backend for tracking supplier dispatches, vehicles, and weights.

## 🚀 Deployment URLs

- **Frontend**: https://saria-dispatch-diary.vercel.app/
- **Backend**: https://saria-dispatch-diary-szs2.vercel.app/

## 📋 Environment Setup

### Client Environment Variables

Create a `.env` file in the `client/` directory with:

```env
# Production (deployed)
VITE_BACKEND_URL=https://saria-dispatch-diary-szs2.vercel.app/api

# Local Development
# VITE_BACKEND_URL=http://localhost:5000/api
```

### Server Environment Variables

Create a `.env` file in the `server/` directory with:

```env
# MongoDB Connection String
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database

# Server Port
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=https://saria-dispatch-diary.vercel.app
```

## 🔧 CORS Configuration

The backend is configured to accept requests from:
- ✅ Production frontend: `https://saria-dispatch-diary.vercel.app`
- ✅ Local development: `http://localhost:5173`
- ✅ Alternative local port: `http://localhost:3000`

## 🛠️ Installation & Setup

### Client Setup
```bash
cd client
npm install
npm run dev
```

### Server Setup
```bash
cd server
npm install
npm run dev
```

## 🔧 Features

- **Dispatch Form**: Add multiple dispatch entries with supplier, vehicle, and weight
- **Previous Dispatches**: View and manage historical dispatch data
- **PDF Export**: Download dispatch reports as PDF files
- **CRUD Operations**: Create, read, update, and delete dispatch entries
- **Responsive Design**: Works on desktop and mobile devices

## 📁 Project Structure

```
Saria Dispatch Diary/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── DispatchForm.jsx
│   │   │   └── PreviousDispatch.jsx
│   │   └── App.jsx
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── index.js
└── README.md
```

## 🔒 Security Notes

- Environment variables are used for API URLs to keep sensitive information secure
- `.env` files are excluded from Git tracking via `.gitignore`
- CORS is configured to only allow specific frontend URLs
- Use `env.example` files as templates for required environment variables 