'use strict';
const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const Joi     = require('joi');
const store   = require('../data/store');
const logger  = require('../utils/logger');

const SECRET     = () => process.env.JWT_SECRET     || 'brew-default-secret-change-in-prod';
const EXPIRES_IN = () => process.env.JWT_EXPIRES_IN || '7d';

const signToken = (userId) =>
  jwt.sign({ id: userId }, SECRET(), { expiresIn: EXPIRES_IN() });

const safeUser = (u) => ({ id: u.id, name: u.name, email: u.email, points: u.points });

// Validation schemas
const regSchema = Joi.object({
  name:     Joi.string().min(2).max(50).required(),
  email:    Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});
const loginSchema = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().required(),
});

// POST /api/v1/auth/register
router.post('/register', async (req, res) => {
  try {
    const { error, value } = regSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details.map(d => d.message).join(', '),
      });
    }

    if (store.findUserByEmail(value.email)) {
      return res.status(409).json({ success: false, message: 'Email is already registered.' });
    }

    const passwordHash = await bcrypt.hash(value.password, 12);
    const user         = store.createUser({ name: value.name, email: value.email, passwordHash });
    const token        = signToken(user.id);

    logger.info(`[AUTH] Registered: ${value.email}`);
    res.status(201).json({ success: true, token, user: safeUser(user) });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ success: false, message: 'Registration failed. Try again.' });
  }
});

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const user = store.findUserByEmail(value.email);
    if (!user || !(await bcrypt.compare(value.password, user.passwordHash))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = signToken(user.id);
    logger.info(`[AUTH] Login: ${value.email}`);
    res.status(200).json({ success: true, token, user: safeUser(user) });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ success: false, message: 'Login failed. Try again.' });
  }
});

// GET /api/v1/auth/me  — verify token & return profile
router.get('/me', (req, res) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided.' });
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], SECRET());
    const user    = store.findUserById(decoded.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user: safeUser(user) });
  } catch (_) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
});

module.exports = router;
