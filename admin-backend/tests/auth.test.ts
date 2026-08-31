import request from 'supertest';
import app from '../src/app.js';
import { resetAdminsForTest } from '../src/services/authService.js';
import { prisma } from '../src/config/db.js';

describe('auth endpoints', () => {
  beforeEach(async () => {
    await resetAdminsForTest();
  });

  afterAll(async () => {
    await resetAdminsForTest();
    await prisma.$disconnect();
  });
  it('rejects login with missing fields', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });

  it('rejects login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@gmail.com', password: 'wrong-password' });
    expect(res.status).toBe(401);
  });

  it('logs in the seeded admin and returns a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@gmail.com', password: 'cinestar123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.admin.email).toBe('admin@gmail.com');
    expect(res.body.admin.password).toBeUndefined();
  });

  it('registers a new admin', async () => {
    const testEmail = `manager-${Date.now()}@cinestar.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'New Manager',
        email: testEmail,
        password: 'secret123',
      });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.admin.email).toBe(testEmail);
  });

  it('rejects duplicate registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Dupe',
        email: 'admin@gmail.com',
        password: 'secret123',
      });
    expect(res.status).toBe(409);
  });

  it('returns the current admin for a valid token', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@gmail.com', password: 'cinestar123' });
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${login.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('admin@gmail.com');
  });

  it('rejects /auth/me without a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('protects admin data routes with the auth middleware', async () => {
    const res = await request(app).get('/api/dashboard/stats');
    expect(res.status).toBe(401);
  });
});