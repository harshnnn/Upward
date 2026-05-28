import { envValidationSchema } from './validation';

export * from './validation';

export const loadEnv = (): Record<string, unknown> => {
	return envValidationSchema(process.env);
};
