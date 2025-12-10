import { CursorResult, Result } from "@/api/common/result";
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

type SafeQueryOptions<TData = unknown> = UseQueryOptions<TData> & {
  onSuccess: (data: TData) => void;
  onError: () => void;
};
export function useSafeQuery<TData>(options: SafeQueryOptions<TData>): UseQueryResult<TData> {
  const wrappedOptions: UseQueryOptions<TData> = {
    ...options,
    queryFn: async (ctx) => {
      if (typeof options.queryFn !== "function") {
        throw new Error("queryFn is not a function");
      }
      try {
        return await options.queryFn(ctx);
      } catch (err: any) {
        options.onError();
        throw err;
      }
    },
  };
  return useQuery<TData>(wrappedOptions);
}

type SafeQueryResultOptions<TData> = {
  onSuccess?: (data: TData) => void;
  onError?: (err: Error, errs?: Error[]) => void;
  errorMessage?: string;
};

type SafeQueryResult<TData> = Omit<UseQueryOptions<TData>, "queryFn"> & {
  fn: () => Promise<Result<TData>>;
  options?: SafeQueryResultOptions<TData>;
};

export function useSafeQueryResult<TData>(params: SafeQueryResult<TData>) {
  const wrappedOptions = {
    ...params,
    queryFn: async () => {
      if (typeof params.fn !== "function") {
        throw new Error("queryFn is not a function");
      }
      var result = (await params.fn()) as Result<TData>;
      if (result.success) {
        params.options?.onSuccess?.(result.data as TData);
        return result.data as TData;
      } else {
        const error = new Error(result.error?.toString() || "Query failed");
        params.options?.onError?.(error, result.errors as any);
        throw error;
      }
    },
  };
  return useQuery<TData>(wrappedOptions);
}

type SafeInfiniteQueryResultOptions<TData> = {
  onSuccess?: (data: TData) => void;
  onError?: (err: Error, errs?: Error[]) => void;
  errorMessage?: string;
};

type SafeInfiniteQueryResult<TData, TCursor> = Omit<
  UseInfiniteQueryOptions<
    CursorResult<TData, TCursor>,
    Error,
    InfiniteData<CursorResult<TData, TCursor>>
  >,
  "queryFn" | "getNextPageParam" | "initialPageParam"
> & {
  fn: (cursor?: TCursor) => Promise<Result<CursorResult<TData, TCursor>>>;
  options?: SafeInfiniteQueryResultOptions<CursorResult<TData, TCursor>>;
};

export function useSafeInfiniteQueryResult<TData, TCursor = string>({
  fn,
  options,
  ...params
}: SafeInfiniteQueryResult<TData, TCursor>) {
  return useInfiniteQuery<
    CursorResult<TData, TCursor>,
    Error,
    InfiniteData<CursorResult<TData, TCursor>>
  >({
    ...params,
    queryFn: async (context) => {
      if (typeof fn !== "function") {
        throw new Error("fn is not a function");
      }
      const result = await fn(context.pageParam as TCursor | undefined);
      if (result.success) {
        options?.onSuccess?.(result.data as CursorResult<TData, TCursor>);
        return result.data as CursorResult<TData, TCursor>;
      } else {
        const error = new Error(result.error?.toString() || "Query failed");
        options?.onError?.(error, result.errors as any);
        throw error;
      }
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
  });
}
