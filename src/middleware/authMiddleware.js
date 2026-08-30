'use strict';
const jwt = require('jsonwebtoken');

const SECRET = () => process.env.JWT_SECRET || 'brew-default-secret-change-in-prod';

/** Blocks unauthenticated requests */
const protect = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please login first.',
    });
  }
  try {
    req.user = jwt.verify(header.split(' ')[1], SECRET());
    next();
  } catch (_) {
    res.status(401).json({
      success: false,
      message: 'Session expired or invalid token. Please login again.',
    });
  }
};

/** Attaches user if token is present, but never blocks */
const optionalAuth = (req, _res, next) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try { req.user = jwt.verify(header.split(' ')[1], SECRET()); } catch (_) {}
  }
  next();
};

module.exports = { protect, optionalAuth };
