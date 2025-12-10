export interface BaseQuery {
  keyword?: string;
  sortDesc?: boolean;
  fromDate?: Date;
  toDate?: Date;
}

export interface CursorQuery<TCursor> extends BaseQuery {
  cursor?: TCursor;
  limit?: number;
}
