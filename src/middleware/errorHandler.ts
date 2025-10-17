import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  console.error('Error:', err);
  
  if (err.name === 'PrismaClientKnownRequestError') {
    return sendError(res, 'Database error: ' + err.message, 400);
  }
  
  if (err.name === 'ValidationError') {
    return sendError(res, err.message, 400);
  }
  
  return sendError(res, err.message || 'Internal server error', 500);
};

export const notFoundHandler = (req: Request, res: Response): Response => {
  return sendError(res, `Route ${req.originalUrl} not found`, 404);
};
