import { z } from 'zod';

const webEnvSchema = z.object({
  VITE_API_URL: z.string().url().default('http://localhost:3000/api/v1'),
  VITE_APP_NAME: z.string().default('Upward'),
  VITE_ENABLE_ANALYTICS: z
    .union([z.literal('true'), z.literal('false')])
    .optional()
    .default('false'),
  VITE_DEFAULT_THEME: z.union([z.literal('dark'), z.literal('light')]).optional().default('dark')
});

export type WebEnv = z.infer<typeof webEnvSchema>;

export const webEnv = webEnvSchema.parse(import.meta.env);
