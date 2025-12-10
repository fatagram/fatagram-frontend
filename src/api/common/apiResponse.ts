export type ApiError = {
  code?: string;
  message?: string;
  codes?: string[];
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
};

export type CursorResponse<TCursor, TData> = ApiResponse<TData[]> & {
  nextCursor: TCursor;
  hasNext: boolean;
};
