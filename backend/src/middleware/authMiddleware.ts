import { Request, Response, NextFunction } from 'express';

/**
 * @summary Placeholder for authentication middleware.
 * @description This middleware should be implemented to protect routes.
 * It should verify a token (e.g., JWT) from the Authorization header,
 * decode it, and attach user information to the request object.
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // TODO: Implement JWT verification logic here.
  // 1. Extract token from 'Authorization: Bearer <token>' header.
  // 2. Handle cases where the token is missing.
  // 3. Verify the token's signature and expiration.
  // 4. Decode the token to get user payload (idUser, idAccount, roles, etc.).
  // 5. Attach the payload to the request object (e.g., req.user = decodedPayload).
  // 6. If token is invalid or expired, respond with 401 Unauthorized.
  // 7. If valid, call next().

  console.warn('Warning: authMiddleware is not implemented. Allowing request to proceed.');
  next();
};
