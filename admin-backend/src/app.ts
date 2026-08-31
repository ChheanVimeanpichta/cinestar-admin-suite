import 'dotenv/config';
import express from 'express';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS — the admin frontend runs on a different origin (http://localhost:3000)
// and fetches this backend directly (http://localhost:5000). Without these
// headers the browser blocks reading the API responses.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'admin-backend' });
});

// Mount the API router both at /api (frontend default base URL) and at the
// root (when VITE_API_BASE_URL points straight at this backend).
app.use('/api', routes);
app.use(routes);

app.use(errorHandler);

export default app;
