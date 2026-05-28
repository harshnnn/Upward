export type ApiErrorShape = {
  code: string;
  message: string;
  details?: Array<{ field?: string; message: string; code?: string }>;
  requestId?: string;
  timestamp?: string;
};

export const getApiErrorMessage = (error: unknown): string => {
  if (typeof error !== 'object' || !error || !('response' in error)) {
    return 'Something went wrong. Please try again.';
  }

  const response = (error as { response?: { data?: { error?: ApiErrorShape } } }).response;
  return response?.data?.error?.message ?? 'Something went wrong. Please try again.';
};
