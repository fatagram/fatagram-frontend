export type Result<T> = {
  success: boolean;
  data?: T;
  errorCode?: string;
  errorCodes?: string[];
};
