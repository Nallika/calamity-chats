import { Request, Response, NextFunction, Express } from 'express';
import http from 'http';
import cors from 'cors';
import log4js from 'log4js';
import compression from 'compression';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import routes from './routes';
import { connectDB, disconnectDB } from './db/db';
import * as dotenv from 'dotenv';

const PORT = process.env.PORT;
const isDev = process.env.NODE_ENV === 'development';

// Initialize logger
log4js.configure({
  appenders: {
    console: { type: "console" },
    botsLog: { type: 'file', filename: 'bots.log' },
    errorLog: { type: 'file', filename: 'error.log' }
  },
  categories: {
    default: {
      appenders: isDev ? ['errorLog'] : ['console'],
      level: 'warn'
    },
    botsLog: {
      appenders: isDev ? ['botsLog'] : ['console'],
      level: 'debug'
    }
  }
});

// Log in files for dev only
if (isDev) {
  // log4js logger for errors
  const errorLogger = log4js.getLogger();
  const originalConsoleError = console.error;

  // re-load console.error to log errors via log4js
  console.error = function(...args) {
    errorLogger.error(args.join(' '));
    originalConsoleError.apply(console, args);
  };
}

/**
 * Take express app as param and run server environment from it
 */
export const serverShell = (app: Express) => {
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: `http://localhost:${process.env.PORT}`
    }
  });
  
  app.use(cors());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(compression());
  app.use(log4js.connectLogger(log4js.getLogger('http'), { level: 'auto' }));
  app.use((req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore  @todo: for dev mode
    req.io = io;
    next();
  });
  
  app.use('/api', routes);
  
  const startServer = async () => {
    try {
      await connectDB();
  
      server.listen(PORT, () => {
        console.log(`> Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error('serverShell: unable start server ', error);
    }
  }
  /**
   * Stop server and disconnect db
   */
  const shutDown = async () => {
    try {
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      process.exit(0);
    }
  };
  
  process.on('SIGINT', shutDown);
  process.on('SIGTERM', shutDown);
  
  startServer().catch(console.error);
}
