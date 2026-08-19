import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

const firstNameSchema = z
  .string({ 
    required_error: 'First name is required.',
  })
  .min(1, 'First name cannot be empty.');

const middleNameSchema = z
  .string()
  .optional();

const lastNameSchema = z
  .string({ 
    required_error: 'Last name is required.',
  })
  .min(1, 'Last name cannot be empty.');

const emailSchema = z
  .string()
  .email('Invalid email address.')
  .trim()
  .toLowerCase();

const passwordSchema = z
  .string()
  .min(
    12,
    'Password must contain at least 12 characters.',
  )
  .max(
    128,
    'Password cannot exceed 128 characters.',
  );

const objectIdSchema = z
  .string()
  .refine(
    (val) => isValidObjectId(val), {
      message: 'Invalid user ID format.',
    }
  )
  .optional()
  .nullable();

const referralCodeSchema = z
  .string()
  .optional();

const registerSchema = z
  .object({ 
    firstName: firstNameSchema,
    middleName: middleNameSchema,
    lastName: lastNameSchema,
    email: emailSchema,
    password: passwordSchema,
    referredBy: objectIdSchema,
    referralCode: referralCodeSchema,
  });

const loginSchema = z
  .object({ 
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
  });

export { 
  registerSchema,
  loginSchema,
};
