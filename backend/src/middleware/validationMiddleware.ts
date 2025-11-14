import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

/**
 * @summary Creates a validation middleware using a Zod schema.
 * @param schema The Zod schema to validate against.
 * @returns An Express middleware function.
 */
export const validationMiddleware =
  (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        return res.status(400).json({
          success: false,
          error: {
            message: 'Input validation failed.',
            code: 'VALIDATION_ERROR',
            details: errorDetails,
          },
          timestamp: new Date().toISOString(),
        });
      }
      // Forward other errors to the global error handler
      return next(error);
    }
  };
