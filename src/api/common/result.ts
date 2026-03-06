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

export type CursorResult<TItem, TCursor> = {
  items: TItem[];
  nextCursor?: TCursor;
  hasNext: boolean;
};
