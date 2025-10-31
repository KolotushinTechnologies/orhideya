import { Request, Response, NextFunction } from 'express';

/**
 * CORS middleware to allow cross-origin requests
 * This middleware adds the necessary headers to allow requests from any origin
 */
export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Allow specific HTTP methods
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  
  // Allow specific headers - include all headers that might be sent by the client
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    // Respond with 200 OK for preflight requests
    return res.sendStatus(200);
  }
  
  next();
};
