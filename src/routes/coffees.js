'use strict';
const router = require('express').Router();
const menu   = require('../data/menu');
const cache  = require('../utils/cache');

// GET /api/v1/coffees/featured  — MUST be before /:id
router.get('/featured', (_req, res) => {
  const cached = cache.get('featured');
  if (cached) return res.json(cached);
  const data = menu.filter(i => i.featured);
  const body = { success: true, count: data.length, data };
  cache.set('featured', body, 600);
  res.json(body);
});

// GET /api/v1/coffees?category=&search=
router.get('/', (req, res) => {
  const { category, search } = req.query;
  const key = `coffees_${category || 'all'}_${search || ''}`;
  const cached = cache.get(key);
  if (cached) return res.json(cached);

  let results = [...menu];
  if (category && category !== 'All') {
    results = results.filter(i => i.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      i => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q),
    );
  }

  const body = { success: true, count: results.length, data: results };
  cache.set(key, body, 120);
  res.json(body);
});

// GET /api/v1/coffees/:id
router.get('/:id', (req, res) => {
  const item = menu.find(c => c.id === req.params.id);
  if (!item) {
    return res.status(404).json({
      success: false,
      message: `Coffee item '${req.params.id}' not found.`,
    });
  }
  const related = menu
    .filter(c => c.category === item.category && c.id !== item.id)
    .slice(0, 3);
  res.json({ success: true, data: { ...item, related } });
});

module.exports = router;
