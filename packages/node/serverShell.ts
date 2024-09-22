import { Request, Response, NextFunction, Express } from 'express';
import http from 'http';
import cors from 'cors';
import logger from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import routes from './routes';
import { connectDB, disconnectDB } from './db/db';
import * as dotenv from 'dotenv';

const PORT = process.env.PORT;

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
  app.use(logger('dev'));
  
  app.use((req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore  @todo: for dev mode
    req.io = io;
    next();
  });
  
  app.use('/api', routes);
  
  const startServer = async () => {
    await connectDB();
  
    server.listen(PORT, () => {
      console.log(`> Server is running on port ${PORT}`);
    });
  }
  
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
