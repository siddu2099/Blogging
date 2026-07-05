const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (options) => {
  return async (req, res, next) => {
    // 1. Role-based check
    if (options.roles && options.roles.includes(req.user.role)) {
      return next();
    }

    // 2. Ownership-based check
    if (options.allowOwner && options.model && req.params.id) {
      try {
        const resource = await options.model.findById(req.params.id);
        if (resource && resource.author.toString() === req.user._id.toString()) {
          return next();
        }
      } catch (error) {
        return res.status(500).json({ message: 'Ownership validation failed' });
      }
    }

    // Default to Forbidden
    res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
  };
};

module.exports = { protect, authorize };