const express = require('express');
const { registerUser, loginUser, refreshAuthToken, logoutUser } = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { message: "Too many login attempts from this IP, please try again after 15 minutes" }
});

router.post('/register', registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/refresh', refreshAuthToken);
router.post('/logout', logoutUser);

module.exports = router;