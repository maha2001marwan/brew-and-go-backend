'use strict';
const router  = require('express').Router();
const menu    = require('../data/menu');
const store   = require('../data/store');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // every favorites route requires auth

// GET /api/v1/favorites
router.get('/', (req, res) => {
  const ids   = store.getFavorites(req.user.id);
  const items = menu.filter(i => ids.includes(i.id));
  res.json({ success: true, count: items.length, data: items });
});

// POST /api/v1/favorites  — toggle (add if absent, remove if present)
router.post('/', (req, res) => {
  const { itemId } = req.body;
  if (!itemId) {
    return res.status(400).json({ success: false, message: 'itemId is required.' });
  }
  if (!menu.find(c => c.id === String(itemId))) {
    return res.status(404).json({ success: false, message: `Item '${itemId}' not found.` });
  }

  const isNowFav = store.toggleFavorite(req.user.id, String(itemId));
  res.json({
    success:    true,
    isFavorite: isNowFav,
    message:    isNowFav ? 'Added to favourites.' : 'Removed from favourites.',
  });
});

// DELETE /api/v1/favorites/:itemId
router.delete('/:itemId', (req, res) => {
  store.removeFavorite(req.user.id, req.params.itemId);
  res.json({ success: true, message: 'Removed from favourites.' });
});

module.exports = router;
