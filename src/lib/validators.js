import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['user', 'admin', 'superadmin'], {
    errorMap: () => ({ message: 'Please select a role' }),
  }),
  keepSignedIn: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Enter a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(72, 'Password is too long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    timezone: z.string().optional().default('UTC'),
    inviteCode: z.string().optional(),
    keepSignedIn: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export const topicSchema = z.object({
  title: z.string().min(2, 'Topic required').max(120),
  direction: z.string().max(500).optional(),
  generateImage: z.boolean().default(true),
});

export const brandProfileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});