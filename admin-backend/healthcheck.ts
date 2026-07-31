import http from 'http';

const target = process.env.HEALTHCHECK_URL ?? 'http://localhost:5000/health';

http.get(target, (res) => {
  process.exit(res.statusCode === 200 ? 0 : 1);
}).on('error', () => {
  process.exit(1);
});
