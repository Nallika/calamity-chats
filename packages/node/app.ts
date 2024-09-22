import express from 'express';
import * as dotenv from 'dotenv';
import path from 'path';
import next from 'next';

import { serverShell } from './serverShell';

dotenv.config();
const dev = process.env.NODE_ENV !== 'production';
const nextAppDir = dev ? path.join(__dirname, '../front') : path.join(__dirname, '../../front');

// Specify the directory of the Next.js application
const nextApp = next({ 
  dev, 
  dir: nextAppDir, // Path Next.js app
});
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();

  // Run server
  serverShell(app);

  // Default catch-all handler to allow Next.js to handle all other routes
  app.all('*', (req, res) => {
    return handle(req, res);
  });
});
