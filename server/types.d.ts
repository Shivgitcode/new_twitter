import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        // Define the properties of your user object here
        id: string;
        name: string;
        email: string;
        // ...other properties
      };
    }
  }
}