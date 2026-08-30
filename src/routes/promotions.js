'use strict';
const router = require('express').Router();
const cache  = require('../utils/cache');

const now = () => new Date();
const daysFromNow = (d) => new Date(Date.now() + d * 86_400_000).toISOString();

const PROMOTIONS = [
  {
    id: 'promo_1', title: 'Morning Rush ☀️',
    subtitle: '20% off all Hot drinks before 10 AM every day',
    code: 'MORNING20', discountPercent: 20, category: 'Hot',
    color: '#D4820A', validUntil: daysFromNow(30), active: true,
  },
  {
    id: 'promo_2', title: 'Cold Summer ❄️',
    subtitle: 'Buy 2 Cold drinks, get the 3rd for free',
    code: 'COLD3FOR2', discountPercent: 33, category: 'Cold',
    color: '#4FC3F7', validUntil: daysFromNow(14), active: true,
  },
  {
    id: 'promo_3', title: 'Bakery Bliss 🥐',
    subtitle: 'Free Croissant with any Large coffee order',
    code: 'BAKEFREE', discountPercent: 15, category: 'Bakery',
    color: '#D4A853', validUntil: daysFromNow(7), active: true,
  },
  {
    id: 'promo_4', title: 'Loyalty Boost ⭐',
    subtitle: 'Double loyalty points on all orders this weekend',
    code: 'DOUBLE2X', discountPercent: 0, category: 'All',
    color: '#9C27B0', validUntil: daysFromNow(3), active: true,
  },
];

// GET /api/v1/promotions
router.get('/', (_req, res) => {
  const cached = cache.get('promotions');
  if (cached) return res.json(cached);

  const active = PROMOTIONS.filter(p => p.active && new Date(p.validUntil) > now());
  const body   = { success: true, count: active.length, data: active };
  cache.set('promotions', body, 300);
  res.json(body);
});

module.exports = router;
