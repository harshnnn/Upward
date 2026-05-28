export type ApiResponseMeta = {
  requestId: string;
  timestamp: string;
  version: string;
};

export type ApiSuccessResponse<TData> = {
  success: true;
  data: TData;
  meta: ApiResponseMeta;
};

export type ApiErrorDetail = {
  field?: string;
  code?: string;
  message: string;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[];
    requestId: string;
    timestamp: string;
  };
};
