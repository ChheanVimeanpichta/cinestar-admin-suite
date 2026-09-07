import request from 'supertest';
import app from '../src/app.js';
import { prisma } from '../src/config/db.js';
import { signAdminToken } from '../src/utils/jwt.js';

describe('movie dynamic endpoints', () => {
  jest.setTimeout(30000);
  const adminToken = signAdminToken({ sub: 'adm-1', email: 'admin@gmail.com', role: 'admin' });

  afterAll(async () => {
    await prisma.$disconnect();
  }, 30000);

  it('lists all movies with admin token', async () => {
    const res = await request(app)
      .get('/api/movies')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('allows public listing of movies without auth token', async () => {
    const res = await request(app).get('/api/movies');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('rejects creating a movie without auth token', async () => {
    const res = await request(app)
      .post('/api/movies')
      .send({ title: 'Unauthorized Movie' });
    expect(res.status).toBe(401);
  });

  it('creates, updates, and deletes a movie dynamically', async () => {
    const testMovieId = `test-mv-${Date.now()}`;
    const createRes = await request(app)
      .post('/api/movies')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        id: testMovieId,
        title: 'Interstellar Odyssey',
        poster: 'https://example.com/interstellar.jpg',
        genre: 'Sci-Fi',
        score: 9.1,
        synopsis: 'A journey through a wormhole.',
        badge: 'IMAX',
        hasBookBtn: true,
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.id).toBe(testMovieId);
    expect(createRes.body.title).toBe('Interstellar Odyssey');

    // Verify GET by ID
    const getRes = await request(app)
      .get(`/api/movies/${testMovieId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.title).toBe('Interstellar Odyssey');

    // Verify Update
    const updateRes = await request(app)
      .put(`/api/movies/${testMovieId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Interstellar Odyssey: Remastered',
        score: 9.5,
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.title).toBe('Interstellar Odyssey: Remastered');
    expect(updateRes.body.score).toBe(9.5);

    // Verify Delete
    const deleteRes = await request(app)
      .delete(`/api/movies/${testMovieId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);

    // Verify 404 after delete
    const getAfterDeleteRes = await request(app)
      .get(`/api/movies/${testMovieId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(getAfterDeleteRes.status).toBe(404);
  });

  it('bulk deletes movies', async () => {
    const id1 = `bulk-1-${Date.now()}`;
    const id2 = `bulk-2-${Date.now()}`;

    await request(app)
      .post('/api/movies')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ id: id1, title: 'Bulk 1' });

    await request(app)
      .post('/api/movies')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ id: id2, title: 'Bulk 2' });

    const bulkRes = await request(app)
      .post('/api/movies/bulk-delete')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ids: [id1, id2] });

    expect(bulkRes.status).toBe(200);
    expect(bulkRes.body.success).toBe(true);
    expect(bulkRes.body.deletedCount).toBe(2);
  });
});
