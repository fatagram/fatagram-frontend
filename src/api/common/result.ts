export type Error = {
  code: string;
  detail?: string;
};

export type Result<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: Error;
  errors?: Error[];
};
