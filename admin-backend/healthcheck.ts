import 'dotenv/config';
import http from 'http';

const port = process.env.PORT ?? 5000;
const target = process.env.HEALTHCHECK_URL ?? `http://localhost:${port}/health`;

http.get(target, (res) => {
  process.exit(res.statusCode === 200 ? 0 : 1);
}).on('error', () => {
  process.exit(1);
});
