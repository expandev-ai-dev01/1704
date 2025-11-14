import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address.').max(255),
    password: z.string().min(1, 'Password is required.'),
    rememberLogin: z.boolean().optional(),
  }),
});
