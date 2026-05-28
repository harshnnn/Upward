export type ApiResponseMeta = {
  requestId: string;
  timestamp: string;
  version?: string;
};

export type SuccessResponse<TData> = {
  success: true;
  data: TData;
  meta: ApiResponseMeta;
};

export type ErrorDetail = {
  field?: string;
  message: string;
  code?: string;
};

export type ErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ErrorDetail[];
    requestId: string;
    timestamp: string;
  };
};
