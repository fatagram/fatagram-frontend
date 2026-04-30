export type ApiError = {
  code: string;
  detail?: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
  errors?: ApiError[];
};

export type CursorResponse<TCursor, TData> = ApiResponse<TData[]> & {
  nextCursor: TCursor;
  hasNext: boolean;
};
