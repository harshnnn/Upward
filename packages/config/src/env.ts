import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_ENV: z.string().default('development'),
  LOG_LEVEL: z.string().default('debug'),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('30d'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  WEB_API_URL: z.string().default('http://localhost:3000/api/v1'),
  EXPO_PUBLIC_API_URL: z.string().default('http://localhost:3000/api/v1'),
  EXPO_PUBLIC_APP_SCHEME: z.string().default('upward')
});

export type AppEnv = z.infer<typeof envSchema>;

export const loadEnv = (input: NodeJS.ProcessEnv = process.env): AppEnv => {
  const parsed = envSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Invalid environment: ${parsed.error.message}`);
  }

  return parsed.data;
};
