import { Request, Response, NextFunction } from 'express';
import { successResponse } from '@/utils/response';
import * as securityService from '@/services/security/securityService';
import { LoginPayload } from '@/services/security/securityTypes';

/**
 * @api {post} /v1/external/security/login User Login
 * @apiName UserLogin
 * @apiGroup Security
 * @apiVersion 1.0.0
 *
 * @apiDescription Authenticates a user and returns a JWT.
 *
 * @apiBody {String} email User's email address.
 * @apiBody {String} password User's password.
 * @apiBody {Boolean} [rememberLogin=false] If true, the session token will have a longer expiration.
 *
 * @apiSuccess {Object} data The response data.
 * @apiSuccess {String} data.token The JWT for the session.
 * @apiSuccess {Object} data.user The user's basic information.
 * @apiSuccess {Number} data.user.id The user's ID.
 * @apiSuccess {String} data.user.name The user's name.
 * @apiSuccess {String} data.user.email The user's email.
 *
 * @apiError {String} ValidationError Invalid input parameters.
 * @apiError {String} UnauthorizedError Invalid credentials or locked account.
 * @apiError {String} InternalServerError An unexpected error occurred.
 */
export const postHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loginPayload: LoginPayload = {
      email: req.body.email,
      password: req.body.password,
      rememberLogin: req.body.rememberLogin || false,
      ipAddress: req.ip || '::1',
      userAgent: req.get('User-Agent') || 'unknown',
    };

    const result = await securityService.login(loginPayload);

    return res.status(200).json(successResponse(result));
  } catch (error) {
    return next(error);
  }
};
