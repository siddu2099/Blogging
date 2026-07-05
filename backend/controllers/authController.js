const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { authRegisterSchema, authLoginSchema } = require('../utils/validators');

const generateAccessToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });

const generateRefreshTokenString = () => crypto.randomBytes(40).toString('hex');

const handleTokens = async (user, req, res) => {
  const accessToken = generateAccessToken(user._id);
  const refreshTokenString = generateRefreshTokenString();
  
  // Store refresh token
  await RefreshToken.create({
    user: user._id,
    token: refreshTokenString,
    deviceInfo: req.headers['user-agent'],
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  });

  // Set HTTP-only cookie
  res.cookie('refreshToken', refreshTokenString, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return accessToken;
};

const registerUser = async (req, res, next) => {
  try {
    const validatedData = authRegisterSchema.parse(req.body);
    const { name, email, password } = validatedData;
    
    if (await User.findOne({ email })) return res.status(400).json({ message: 'User exists' });

    const user = await User.create({ name, email, password });
    if (user) {
      const accessToken = await handleTokens(user, req, res);
      res.status(201).json({
        _id: user._id, name: user.name, email: user.email, role: user.role, token: accessToken
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) { next(error); }
};

const loginUser = async (req, res, next) => {
  try {
    const validatedData = authLoginSchema.parse(req.body);
    const { email, password } = validatedData;
    
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const accessToken = await handleTokens(user, req, res);
      res.json({
        _id: user._id, name: user.name, email: user.email, role: user.role, token: accessToken
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) { next(error); }
};

const refreshAuthToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: 'Not authorized, no refresh token' });

    const storedToken = await RefreshToken.findOne({ token }).populate('user');
    if (!storedToken) return res.status(401).json({ message: 'Invalid refresh token' });

    if (storedToken.isRevoked) {
      return res.status(401).json({ message: 'Refresh token revoked, please login again' });
    }

    if (new Date() > storedToken.expiresAt) {
      return res.status(401).json({ message: 'Refresh token expired' });
    }

    // Rotate token (Invalidate old, issue new)
    storedToken.isRevoked = true;
    await storedToken.save();

    const newAccessToken = await handleTokens(storedToken.user, req, res);

    res.json({ token: newAccessToken });
  } catch (error) { next(error); }
};

const logoutUser = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      await RefreshToken.findOneAndUpdate({ token }, { isRevoked: true });
    }
    
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch (error) { next(error); }
};

module.exports = { registerUser, loginUser, refreshAuthToken, logoutUser };