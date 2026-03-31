import { CursorResult, Error as Err, Result } from "@/api/common/result";
import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useEffect, useRef } from "react";

export type SafeQueryOptions<TData = unknown> = UseQueryOptions<TData> & {
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

export type SafeQueryResultOptions<TData> = {
  onSuccess?: (data: TData) => void;
  onError?: (err?: Err, errs?: Err[]) => void;
  errorMessage?: string;
};

export type SafeQueryOptionsParams<TData> = {
  queryKey: QueryKey;
  fn: () => Promise<Result<TData>>;
};

export function createSafeQueryOptions<TData>(params: SafeQueryOptionsParams<TData>) {
  return {
    queryKey: params.queryKey,
    queryFn: async (): Promise<TData> => {
      const result = await params.fn();
      if (!result.success) throw result;
      return result.data!;
    },
  };
}

type SafeQueryResult<TData> = Omit<UseQueryOptions<TData>, "queryFn"> & {
  fn: () => Promise<Result<TData>>;
  options?: SafeQueryResultOptions<TData>;
};

export function useSafeQueryResult<TData>(params: SafeQueryResult<TData>) {
  const { fn, options, ...queryOptions } = params;
  const callbacksCalledRef = useRef(false);

  const safeOptions = createSafeQueryOptions({ queryKey: queryOptions.queryKey!, fn });

  const query = useQuery<TData, Result<TData>>({
    ...queryOptions,
    ...safeOptions,
    retry: 0,
  } as any);

  useEffect(() => {
    if (query.isSuccess && query.data) {
      if (!callbacksCalledRef.current) {
        options?.onSuccess?.(query.data);
        callbacksCalledRef.current = true;
      }
    } else if (query.isError) {
      if (!callbacksCalledRef.current) {
        const errorResult = query.error as Result<TData>;
        options?.onError?.(errorResult.error, errorResult.errors);
        callbacksCalledRef.current = true;
      }
    } else if (query.isPending) {
      callbacksCalledRef.current = false;
    }
  }, [query.status]);

  return query;
}

export type SafeInfiniteQueryResultOptions<TData> = {
  onSuccess?: (data: TData) => void;
  onError?: (err?: Err, errs?: Err[]) => void;
  errorMessage?: string;
};

type SafeInfiniteQueryResult<TData, TCursor> = Omit<
  UseInfiniteQueryOptions<
    CursorResult<TData, TCursor>,
    Result<CursorResult<TData, TCursor>>,
    InfiniteData<CursorResult<TData, TCursor>>,
    readonly unknown[],
    TCursor | undefined
  >,
  "queryFn" | "getNextPageParam" | "initialPageParam"
> & {
  fn: (cursor?: TCursor) => Promise<Result<CursorResult<TData, TCursor>>>;
  options?: SafeInfiniteQueryResultOptions<CursorResult<TData, TCursor>>;
};

export function useSafeInfiniteQueryResult<TData, TCursor = string>(
  params: SafeInfiniteQueryResult<TData, TCursor>,
) {
  const { fn, options, ...queryOptions } = params;

  const query = useInfiniteQuery<
    CursorResult<TData, TCursor>,
    Result<CursorResult<TData, TCursor>>,
    InfiniteData<CursorResult<TData, TCursor>>,
    QueryKey,
    TCursor | undefined
  >({
    ...queryOptions,
    queryFn: async ({ pageParam }) => {
      const result = await fn(pageParam as TCursor | undefined);
      if (!result.success) {
        throw result;
      }
      return result.data!;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage: CursorResult<TData, TCursor>) => {
      return lastPage.hasNext ? lastPage.nextCursor : undefined;
    },
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      const pages = query.data.pages;
      const lastPage = pages[pages.length - 1];
      if (lastPage) {
        options?.onSuccess?.(lastPage as any);
      }
    }

    if (query.isError && query.error) {
      const errRes = query.error as unknown as unknown as Result<CursorResult<TData, TCursor>>;
      options?.onError?.(errRes.error, errRes.errors);
    }
  }, [query.dataUpdatedAt, query.errorUpdatedAt]);

  return query;
}
