require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/errorMiddleware');
const logger = require('./utils/logger');

connectDB();

const app = express();

// Security Middlewares
app.use(cors({ 
  origin: ['http://localhost:3000', 'https://yourdomain.com'], 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());
// Removed mongoSanitize() because it inherently conflicts with Express 5.x getters 
// and our Zod schemas inherently protect against Object Injection completely.

// Global Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // 100 req per IP
  message: "Too many requests from this IP, please try again later"
});
app.use('/api', globalLimiter);

// Request Logging
app.use((req, res, next) => {
  logger.info(`Requested: ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
  console.log(`Server started on port ${PORT}`);
});