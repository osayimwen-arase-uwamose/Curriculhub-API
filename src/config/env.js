import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({ 
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  PORT: z.coerce
    .number()
    .int()
    .positive()
    .default(5000),

  MONGODB_URI: z
    .string()
    .min(1),

  JWT_ACCESS_SECRET: z
    .string()
    .min(32),
  
  JWT_ISSUER: z
    .string()
    .min(1),

  JWT_AUDIENCE: z
    .string()
    .min(1),

  ACCESS_TOKEN_EXPIRES_IN: z
    .string()
    .default('15m'),

  REFRESH_TOKEN_EXPIRES_IN_DAYS: z.coerce
    .number()
    .int()
    .positive()
    .default(30),

  COOKIE_SECURE: z
    .string()
    .transform((value) => value === 'true')
    .default('false'),

  COOKIE_SAME_SITE: z
    .enum(['strict', 'lax', 'none'])
    .default('lax'),

  COOKIE_DOMAIN: z
    .string()
    .optional(),

  FRONTEND_URL: z
    .string()
    .url(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) { 
  console.error('Invalid environment configuration');

  console.error(
    parsed.error.flatten().fieldErrors
  );

  process.exit(1);
};

export const env = parsed.data;

if (
  env.NODE_ENV === 'production'
  && env.JWT_ACCESS_SECRET.length < 64
) { 
  throw new Error('JWT_ACCESS_SECRET must contain at least 64 characters in production');
};
