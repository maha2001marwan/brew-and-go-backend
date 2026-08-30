'use strict';
require('dotenv').config();

const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const compression = require('compression');
const morgan      = require('morgan');
const rateLimit   = require('express-rate-limit');

const logger      = require('./src/utils/logger');
const healthRouter      = require('./src/routes/health');
const coffeesRouter     = require('./src/routes/coffees');
const ordersRouter      = require('./src/routes/orders');
const authRouter        = require('./src/routes/auth');
const promotionsRouter  = require('./src/routes/promotions');
const favoritesRouter   = require('./src/routes/favorites');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Security headers ─────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false }));

// ── GZIP compression ─────────────────────────────────────────
app.use(compression());

// ── CORS ─────────────────────────────────────────────────────
app.use(cors({
  origin:         '*',
  methods:        ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body parsing ─────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ── HTTP request logging ─────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: { write: msg => logger.http(msg.trim()) },
  }));
}

// ── Global rate limiting (200 req / 15 min per IP) ───────────
app.use('/api/', rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             200,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { success: false, message: 'Too many requests. Try again later.' },
}));

// ── Stricter rate limit on auth routes ───────────────────────
app.use('/api/v1/auth/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      20,
  message:  { success: false, message: 'Too many auth attempts. Try again later.' },
}));

// ── API Routes ────────────────────────────────────────────────
app.use('/api/v1/health',      healthRouter);
app.use('/api/v1/coffees',     coffeesRouter);
app.use('/api/v1/orders',      ordersRouter);
app.use('/api/v1/auth',        authRouter);
app.use('/api/v1/promotions',  promotionsRouter);
app.use('/api/v1/favorites',   favoritesRouter);

// ── Root index ────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    application: 'Brew & Go Coffee Shop API',
    version:     '2.0.0',
    endpoints: [
      'GET    /api/v1/health',
      'GET    /api/v1/coffees',
      'GET    /api/v1/coffees/featured',
      'GET    /api/v1/coffees/:id',
      'POST   /api/v1/orders',
      'GET    /api/v1/orders/history   [auth]',
      'GET    /api/v1/orders/:id',
      'POST   /api/v1/auth/register',
      'POST   /api/v1/auth/login',
      'GET    /api/v1/auth/me          [auth]',
      'GET    /api/v1/promotions',
      'GET    /api/v1/favorites        [auth]',
      'POST   /api/v1/favorites        [auth]',
      'DELETE /api/v1/favorites/:itemId [auth]',
    ],
  });
});

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route '${req.originalUrl}' not found.` });
});

// ── Global error handler ──────────────────────────────────────
app.use((err, _req, res, _next) => {
  logger.error(err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
  });
});

// ── Start server (skip in test mode) ─────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`
╔═══════════════════════════════════════════╗
║       ☕  Brew & Go API  ·  v2.0.0         ║
║       Port: ${String(PORT).padEnd(5)}  Env: ${(process.env.NODE_ENV || 'production').padEnd(12)}  ║
╚═══════════════════════════════════════════╝`);
  });
}

module.exports = app;
