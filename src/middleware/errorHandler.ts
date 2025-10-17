import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export function notFound(req: Request, res: Response) {
  logger.warn(`Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ success: false, error: 'Route not found' });
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    ip: req.ip,
  });

  const status = err.status || 500;
  const payload = {
    success: false,
    error: err.message || 'Internal Server Error',
    details: err.details || undefined,
  };
  res.status(status).json(payload);
}
