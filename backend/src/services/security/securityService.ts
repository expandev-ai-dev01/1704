import bcrypt from 'bcryptjs';
import { executeProcedure, sql } from '@/utils/database';
import { AppError } from '@/utils/AppError';
import { generateToken } from '@/utils/jwt';
import { LoginPayload, UserFromDb, JwtPayload } from './securityTypes';

/**
 * @summary Authenticates a user based on email and password.
 * @param {LoginPayload} payload - The login credentials and context.
 * @returns {Promise<{token: string, user: {id: number, name: string, email: string}}>} The session token and user info.
 */
export const login = async (payload: LoginPayload) => {
  // For this simple case, we assume a default account. In a real multi-tenant app,
  // this would be determined from the domain, a header, or other means.
  const idAccount = 1;

  const userResult = await executeProcedure('[security].[spUserGetByEmail]', {
    idAccount: idAccount,
    email: payload.email,
  });

  const user: UserFromDb | undefined = userResult[0]?.[0];

  if (!user) {
    // Log failed attempt for non-existent user
    await executeProcedure('[security].[spUserLoginFailure]', {
      idAccount: idAccount,
      email: payload.email,
      ipAddress: payload.ipAddress,
      userAgent: payload.userAgent,
    });
    throw new AppError('Invalid credentials.', 401, 'INVALID_CREDENTIALS');
  }

  if (user.lockoutUntil && new Date(user.lockoutUntil) > new Date()) {
    const minutesRemaining = Math.ceil(
      (new Date(user.lockoutUntil).getTime() - new Date().getTime()) / 60000
    );
    throw new AppError(
      `Account is locked. Please try again in ${minutesRemaining} minutes.`,
      403,
      'ACCOUNT_LOCKED'
    );
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.passwordHash);

  if (!isPasswordValid) {
    await executeProcedure('[security].[spUserLoginFailure]', {
      idAccount: idAccount,
      email: payload.email,
      ipAddress: payload.ipAddress,
      userAgent: payload.userAgent,
    });
    throw new AppError('Invalid credentials.', 401, 'INVALID_CREDENTIALS');
  }

  const jwtPayload: JwtPayload = {
    idUser: user.idUser,
    idAccount: idAccount,
    name: user.name,
  };

  const { token, expiresAt } = generateToken(jwtPayload, payload.rememberLogin);

  await executeProcedure('[security].[spUserLoginSuccess]', {
    idAccount: idAccount,
    idUser: user.idUser,
    ipAddress: payload.ipAddress,
    userAgent: payload.userAgent,
    token: token,
    expiresAt: expiresAt,
  });

  return {
    token,
    user: {
      id: user.idUser,
      name: user.name,
      email: payload.email,
    },
  };
};
