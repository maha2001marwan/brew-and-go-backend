'use strict';
const router = require('express').Router();
const store  = require('../data/store');

router.get('/', (_req, res) => {
  res.status(200).json({
    status:      'online',
    container:   'Docker',
    timestamp:   new Date().toISOString(),
    uptime:      `${Math.floor(process.uptime())}s`,
    environment: process.env.NODE_ENV || 'production',
    version:     '2.0.0',
    stats:       store.getStats(),
  });
});

module.exports = router;
