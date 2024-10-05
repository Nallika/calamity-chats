import { Server } from 'socket.io';

declare module 'express-serve-static-core' {
  interface Request {
    io: Server;
  }
}

// to make the file a module and avoid the TypeScript error
export {}

declare global {
  namespace Express {
    export interface Request {
      io: Server;
    }
  }
}

