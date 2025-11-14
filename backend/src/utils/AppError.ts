/**
 * @summary Custom error class for application-specific errors.
 * @description Allows for creating errors with a status code and a specific error code string.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;

  constructor(message: string, statusCode = 500, errorCode = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
