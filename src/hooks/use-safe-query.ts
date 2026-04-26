import { CursorResult, Error as Err, Result } from "@/api/common/result";
import {
  InfiniteData,
  QueryKey,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useEffect, useRef } from "react";

export type SafeQueryCallbacks<TData> = {
  onSuccess?: (data: TData) => void;
  onError?: (err?: Err, errs?: Err[]) => void;
  errorMessage?: string;
};

type SafeQueryOptionsParams<TData> = {
  queryKey: QueryKey;
  fn: () => Promise<Result<TData>>;
  options?: {
    refetchOnWindowFocus?: boolean;
    refetchOnMount?: boolean;
  };
};

type UseSafeQueryParams<TData> = Omit<UseQueryOptions<TData>, "queryFn"> & {
  fn: () => Promise<Result<TData>>;
  options?: SafeQueryCallbacks<TData>;
  fetchOptions?: {
    refetchOnWindowFocus?: boolean;
    refetchOnMount?: "always" | boolean;
    retry?: boolean | number;
  };
};

export function createSafeQueryOptions<TData>(params: SafeQueryOptionsParams<TData>) {
  return {
    queryKey: params.queryKey,
    queryFn: async (): Promise<TData> => {
      const result = await params.fn();

      if (!result.success) throw result;

      if (result.data === undefined) {
        throw new Error("Success result is missing data");
      }

      return result.data;
    },
  };
}

export function useSafeQueryResult<TData>(params: UseSafeQueryParams<TData>) {
  const { fn, options, fetchOptions, ...queryOptions } = params;

  const onSuccessRef = useRef(options?.onSuccess);
  const onErrorRef = useRef(options?.onError);

  useEffect(() => {
    onSuccessRef.current = options?.onSuccess;
    onErrorRef.current = options?.onError;
  });

  const callbacksCalledRef = useRef(false);

  const safeOptions = createSafeQueryOptions({
    queryKey: queryOptions.queryKey,
    fn,
  });

  const query = useQuery<TData>({
    retry: 0,
    ...queryOptions,
    ...safeOptions,
    ...fetchOptions,
  });

  const lastDataUpdatedAtRef = useRef<number>(0);

  useEffect(() => {
    if (query.isSuccess && query.data !== undefined) {
      if (query.dataUpdatedAt > lastDataUpdatedAtRef.current) {
        lastDataUpdatedAtRef.current = query.dataUpdatedAt;
        onSuccessRef.current?.(query.data);
      }
    } else if (query.isError) {
      if (!callbacksCalledRef.current) {
        const errRes = query.error as unknown as Result<TData>;
        onErrorRef.current?.(errRes.error, errRes.errors);
        callbacksCalledRef.current = true;
      }
    } else if (query.isFetching) {
      callbacksCalledRef.current = false;
    }
  }, [query.status, query.isFetching, query.dataUpdatedAt]);

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
  fetchOptions?: {
    refetchOnWindowFocus?: boolean;
    refetchOnMount?: boolean;
    retry?: boolean | number;
  };
};

export function useSafeInfiniteQueryResult<TData, TCursor = string>(
  params: SafeInfiniteQueryResult<TData, TCursor>,
) {
  const { fn, options, fetchOptions, ...queryOptions } = params;

  const onSuccessRef = useRef(options?.onSuccess);
  const onErrorRef = useRef(options?.onError);
  useEffect(() => {
    onSuccessRef.current = options?.onSuccess;
    onErrorRef.current = options?.onError;
  });

  const lastProcessedPageRef = useRef<TCursor | undefined | string>(null);

  const query = useInfiniteQuery<
    CursorResult<TData, TCursor>,
    Result<CursorResult<TData, TCursor>>,
    InfiniteData<CursorResult<TData, TCursor>>,
    QueryKey,
    TCursor | undefined
  >({
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
    retry: 0,
    ...queryOptions,
    ...fetchOptions,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      const pages = query.data.pages;
      const lastPage = pages[pages.length - 1];

      const currentPageKey = lastPage.nextCursor?.toString() ?? "end-of-list";

      if (lastPage && lastProcessedPageRef.current !== currentPageKey) {
        onSuccessRef.current?.(lastPage);
        lastProcessedPageRef.current = currentPageKey;
      }
    } else if (query.isError && query.error) {
      const errRes = query.error as unknown as Result<CursorResult<TData, TCursor>>;
      onErrorRef.current?.(errRes.error, errRes.errors);
    }

    if (!query.data) {
      lastProcessedPageRef.current = null;
    }
  }, [query.data, query.status]);

  return query;
}
