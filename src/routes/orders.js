'use strict';
const router = require('express').Router();
const menu   = require('../data/menu');
const store  = require('../data/store');
const { optionalAuth, protect } = require('../middleware/authMiddleware');
const logger = require('../utils/logger');

const SIZE_MUL = { S: 1.0, M: 1.2, L: 1.4 };

// POST /api/v1/orders — place an order (auth optional, earns points if logged in)
router.post('/', optionalAuth, (req, res) => {
  const { itemId, size, quantity, customizations } = req.body;

  if (!itemId || !size || !quantity) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: itemId, size, quantity.',
    });
  }

  const item = menu.find(c => c.id === String(itemId));
  if (!item) {
    return res.status(404).json({ success: false, message: `Item '${itemId}' not found.` });
  }

  const sizeUp = String(size).toUpperCase();
  if (!['S', 'M', 'L'].includes(sizeUp)) {
    return res.status(400).json({ success: false, message: 'Size must be S, M, or L.' });
  }

  const qty = parseInt(quantity, 10);
  if (isNaN(qty) || qty < 1 || qty > 10) {
    return res.status(400).json({ success: false, message: 'Quantity must be 1–10.' });
  }

  const unitPrice  = parseFloat((item.price * SIZE_MUL[sizeUp]).toFixed(2));
  const totalPrice = parseFloat((unitPrice * qty).toFixed(2));
  const wait       = Math.floor(Math.random() * 5) + 3;
  const pointsEarned = req.user ? Math.round(totalPrice) : 0;

  const order = store.createOrder({
    userId:         req.user?.id || null,
    itemId:         String(itemId),
    itemName:       item.name,
    imageUrl:       item.imageUrl,
    category:       item.category,
    size:           sizeUp,
    quantity:       qty,
    unitPrice,
    totalPrice,
    estimatedWaitMinutes: wait,
    customizations: customizations || {},
  });

  if (req.user) store.addPoints(req.user.id, pointsEarned);

  logger.info(
    `[ORDER] ${order.id} | ${item.name} | ${sizeUp} x${qty} | $${totalPrice}` +
    (req.user ? ` | +${pointsEarned}pts` : ' | guest'),
  );

  res.status(201).json({
    success: true,
    orderId: order.id,
    message: 'Order placed successfully!',
    details: {
      item:                 item.name,
      imageUrl:             item.imageUrl,
      size:                 sizeUp,
      quantity:             qty,
      unitPrice,
      totalPrice,
      estimatedWaitMinutes: wait,
      placedAt:             order.createdAt,
      loyaltyPointsEarned:  pointsEarned,
      customizations:       customizations || {},
    },
  });
});

// GET /api/v1/orders/history — auth required
router.get('/history', protect, (req, res) => {
  const orders = store.getOrdersByUserId(req.user.id);
  res.json({ success: true, count: orders.length, data: orders });
});

// GET /api/v1/orders/:id
router.get('/:id', (req, res) => {
  const order = store.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: `Order '${req.params.id}' not found.`,
    });
  }
  res.json({ success: true, data: order });
});

module.exports = router;
