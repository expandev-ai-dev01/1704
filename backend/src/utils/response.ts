/**
 * @summary Formats a successful API response.
 * @param data The payload to be included in the response.
 * @param metadata Optional metadata, e.g., for pagination.
 * @returns A standardized success response object.
 */
export const successResponse = <T>(data: T, metadata?: Record<string, unknown>) => {
  return {
    success: true,
    data,
    metadata: {
      ...metadata,
      timestamp: new Date().toISOString(),
    },
  };
};

/**
 * @summary Formats a failed API response.
 * @param message A descriptive error message.
 * @param code A unique error code string.
 * @param details Optional additional details about the error.
 * @returns A standardized error response object.
 */
export const errorResponse = (message: string, code: string, details?: any) => {
  return {
    success: false,
    error: {
      message,
      code,
      details,
    },
    timestamp: new Date().toISOString(),
  };
};
