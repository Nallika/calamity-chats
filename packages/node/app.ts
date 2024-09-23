import express from 'express';
import * as dotenv from 'dotenv';
import path from 'path';
import next from 'next';

import { serverShell } from './serverShell';

dotenv.config();
const dev = process.env.NODE_ENV !== 'production';
const app = express();

const nextAppDir = dev ? path.join(__dirname, '../front') : path.join(__dirname, '../../front');

const nextApp = next({ 
  dev, 
  dir: nextAppDir,
});

const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  // Run server
  serverShell(app);

  // Default catch-all handler to allow Next.js to handle all other routes
  app.all('*', (req, res) => {
    return handle(req, res);
  });
});
