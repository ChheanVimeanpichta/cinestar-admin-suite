import 'dotenv/config';
import app from './app.js';
import { prisma } from './config/db.js';

const initialPort = Number(process.env.PORT ?? 5000);

async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✓ Successfully connected to AWS RDS MySQL database.');
  } catch (err: any) {
    console.warn('⚠ Database handshake notice (system will use cached/fallback data if needed):', err?.message || err);
  }
}

function startServer(port: number) {
  const server = app.listen(port, () => {
    console.log(`Admin backend listening on port ${port}`);
    checkDatabaseConnection();
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Please free up port ${port} or terminate the process using it.`);
      process.exit(1);
    } else {
      console.error(`Failed to start server on port ${port}:`, err);
      process.exit(1);
    }
  });
}

// Process-level resilience against unhandled promise rejections (e.g. DB connection pool timeouts)
process.on('unhandledRejection', (reason: any) => {
  console.warn('⚠ Unhandled Rejection intercepted (server staying alive):', reason?.message || reason);
});

process.on('uncaughtException', (err: any) => {
  console.error('⚠ Uncaught Exception intercepted (server staying alive):', err?.message || err);
});

startServer(initialPort);

