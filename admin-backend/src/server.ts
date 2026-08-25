import 'dotenv/config';
import app from './app.js';

const initialPort = Number(process.env.PORT ?? 5000);

function startServer(port: number) {
  const server = app.listen(port, () => {
    console.log(`Admin backend listening on port ${port}`);
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

startServer(initialPort);

