import { Request, Response } from 'express';

/**
 * @summary Handles requests to non-existent routes.
 * @description Responds with a 404 Not Found error.
 */
export const notFoundMiddleware = (_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: {
      message: 'The requested resource was not found on this server.',
      code: 'NOT_FOUND',
    },
    timestamp: new Date().toISOString(),
  });
};
