import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
     password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine(
      (value) => /[0-9!@#$%^&*]/.test(value),
      {
        message: 'Password must contain at least one number or special character',
      }
    ),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterSchemaType = z.infer<typeof registerSchema>;
