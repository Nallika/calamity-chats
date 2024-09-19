import { Server as HttpServer } from 'http';
import { Socket } from 'socket.io';

declare module 'express-serve-static-core' {
  interface Request {
    io: SocketServer;
  }
}


// to make the file a module and avoid the TypeScript error
export {}

declare global {
  namespace Express {
    export interface Request {
      io: SocketServer;
    }
  }
}

