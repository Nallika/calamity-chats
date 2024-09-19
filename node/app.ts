import express from 'express';
import * as dotenv from 'dotenv';
import next from 'next';
import { serverShell } from './serverShell';

dotenv.config();
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Run server
  serverShell(server);

  // Default catch-all handler to allow Next.js to handle all other routes
  server.all('*', (req, res) => {
    return handle(req, res);
  });
});
