const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const dispatchRoutes = require('./routes/dispatchRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.get('/', (req, res) => {
  res.send('✅ Backend deployed and working!');
});


// Routes
app.use('/api', dispatchRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  // Start server only when running locally
  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }
})
.catch((err) => console.error('MongoDB connection error:', err));

// Export the app for Vercel
module.exports = app;
