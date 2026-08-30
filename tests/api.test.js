'use strict';
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';

const request = require('supertest');
const app     = require('../server');

// ── Health ────────────────────────────────────────────────────
describe('GET /api/v1/health', () => {
  it('returns status online', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('online');
    expect(res.body.container).toBe('Docker');
    expect(res.body.version).toBe('2.0.0');
  });
});

// ── Coffees ───────────────────────────────────────────────────
describe('GET /api/v1/coffees', () => {
  it('returns all 12 items', async () => {
    const res = await request(app).get('/api/v1/coffees');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(12);
  });

  it('filters by category=Hot', async () => {
    const res = await request(app).get('/api/v1/coffees?category=Hot');
    expect(res.status).toBe(200);
    expect(res.body.data.every(i => i.category === 'Hot')).toBe(true);
  });

  it('searches by name', async () => {
    const res = await request(app).get('/api/v1/coffees?search=mocha');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

describe('GET /api/v1/coffees/featured', () => {
  it('returns only featured items', async () => {
    const res = await request(app).get('/api/v1/coffees/featured');
    expect(res.status).toBe(200);
    expect(res.body.data.every(i => i.featured === true)).toBe(true);
  });
});

describe('GET /api/v1/coffees/:id', () => {
  it('returns a single item with related', async () => {
    const res = await request(app).get('/api/v1/coffees/1');
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe('1');
    expect(Array.isArray(res.body.data.related)).toBe(true);
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/v1/coffees/999');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

// ── Orders ────────────────────────────────────────────────────
describe('POST /api/v1/orders', () => {
  it('places an order successfully', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({ itemId: '1', size: 'M', quantity: 2 });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.orderId).toMatch(/^ORD-/);
    expect(res.body.details.totalPrice).toBeGreaterThan(0);
  });

  it('rejects missing fields', async () => {
    const res = await request(app).post('/api/v1/orders').send({ itemId: '1' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects invalid size', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({ itemId: '1', size: 'XL', quantity: 1 });
    expect(res.status).toBe(400);
  });

  it('rejects quantity > 10', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({ itemId: '1', size: 'M', quantity: 11 });
    expect(res.status).toBe(400);
  });
});

// ── Auth ──────────────────────────────────────────────────────
describe('Auth endpoints', () => {
  const ts   = Date.now();
  const user = { name: 'Test User', email: `test${ts}@brew.com`, password: 'SecurePass123!' };
  let token;

  it('registers a new user', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(user);
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(user.email);
    token = res.body.token;
  });

  it('rejects duplicate email', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(user);
    expect(res.status).toBe(409);
  });

  it('logs in successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: user.password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: user.email, password: 'WrongPassword!' });
    expect(res.status).toBe(401);
  });

  it('returns profile on GET /auth/me', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(user.email);
  });
});

// ── Promotions ────────────────────────────────────────────────
describe('GET /api/v1/promotions', () => {
  it('returns active promotions', async () => {
    const res = await request(app).get('/api/v1/promotions');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

// ── 404 ───────────────────────────────────────────────────────
describe('404 handler', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/v1/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
