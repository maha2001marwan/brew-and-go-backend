'use strict';

// ─────────────────────────────────────────────────────────────
//  In-memory database — perfect for demo & free-tier hosting.
//  Data resets on server restart (expected behaviour for demo).
//  To persist data: swap this module for a MongoDB/Postgres adapter.
// ─────────────────────────────────────────────────────────────

function generateOrderId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'ORD-';
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

const store = {
  users:     [],   // [{ id, name, email, passwordHash, points, createdAt }]
  orders:    [],   // [{ id, userId, itemId, itemName, size, quantity, ... }]
  favorites: {},   // { userId: Set<itemId> }

  // ── User methods ──────────────────────────────────────────
  createUser({ name, email, passwordHash }) {
    const user = {
      id:           `USR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name,
      email,
      passwordHash,
      points:    0,
      createdAt: new Date().toISOString(),
    };
    this.users.push(user);
    return user;
  },

  findUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  findUserById(id) {
    return this.users.find(u => u.id === id) || null;
  },

  addPoints(userId, pts) {
    const user = this.findUserById(userId);
    if (user) {
      user.points = (user.points || 0) + pts;
      return user.points;
    }
    return 0;
  },

  // ── Order methods ─────────────────────────────────────────
  createOrder(data) {
    const order = {
      id:        generateOrderId(),
      status:    'preparing',
      createdAt: new Date().toISOString(),
      ...data,
    };
    this.orders.push(order);
    return order;
  },

  getOrderById(id) {
    return this.orders.find(o => o.id === id) || null;
  },

  getOrdersByUserId(userId) {
    return this.orders
      .filter(o => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getAllOrders() {
    return [...this.orders].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  },

  // ── Favorites methods ─────────────────────────────────────
  getFavorites(userId) {
    return [...(this.favorites[userId] || new Set())];
  },

  addFavorite(userId, itemId) {
    if (!this.favorites[userId]) this.favorites[userId] = new Set();
    this.favorites[userId].add(String(itemId));
  },

  removeFavorite(userId, itemId) {
    if (this.favorites[userId]) this.favorites[userId].delete(String(itemId));
  },

  isFavorite(userId, itemId) {
    return !!(this.favorites[userId] && this.favorites[userId].has(String(itemId)));
  },

  toggleFavorite(userId, itemId) {
    const was = this.isFavorite(userId, itemId);
    if (was) this.removeFavorite(userId, itemId);
    else     this.addFavorite(userId, itemId);
    return !was;
  },

  // ── Stats ─────────────────────────────────────────────────
  getStats() {
    return {
      totalUsers:  this.users.length,
      totalOrders: this.orders.length,
      totalRevenue: parseFloat(
        this.orders.reduce((s, o) => s + (o.totalPrice || 0), 0).toFixed(2),
      ),
    };
  },
};

module.exports = store;
