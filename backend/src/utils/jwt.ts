import jwt from 'jsonwebtoken';
import { config } from '@/config';
import { JwtPayload } from '@/services/security/securityTypes';

/**
 * @summary Generates a JSON Web Token.
 * @param {JwtPayload} payload - The data to include in the token.
 * @param {boolean} rememberMe - If true, a longer expiration time is used.
 * @returns {{token: string, expiresAt: Date}} The generated token and its expiration date.
 */
export const generateToken = (payload: JwtPayload, rememberMe: boolean) => {
  const expiresIn = rememberMe ? config.jwt.rememberMeExpiresIn : config.jwt.expiresIn;

  const token = jwt.sign(payload, config.jwt.secret, {
    expiresIn,
  });

  const decoded = jwt.decode(token) as { exp: number };
  const expiresAt = new Date(decoded.exp * 1000);

  return { token, expiresAt };
};

/**
 * @summary Verifies a JSON Web Token.
 * @param {string} token - The token to verify.
 * @returns {JwtPayload | null} The decoded payload if the token is valid, otherwise null.
 */
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};
