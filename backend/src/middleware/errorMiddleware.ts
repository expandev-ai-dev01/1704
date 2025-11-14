import { Request, Response, NextFunction } from 'express';
import { config } from '@/config';
import { AppError } from '@/utils/AppError';

/**
 * @summary Global error handling middleware.
 * @description Catches errors from route handlers and middleware.
 * Sends a structured JSON error response.
 */
export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
): void => {
  console.error(err);

  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const message = isAppError ? err.message : 'An unexpected internal server error occurred.';

  const errorResponse: Record<string, unknown> = {
    success: false,
    error: {
      message,
      code: isAppError ? err.errorCode : 'INTERNAL_SERVER_ERROR',
    },
    timestamp: new Date().toISOString(),
  };

  if (config.env !== 'production' && err.stack) {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};
