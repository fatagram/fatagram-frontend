import { Result, Error } from "@/api/common/result";
import { useCallback, useState } from "react";

type FetcherOptions = {
  onSuccess?: () => void;
  onError?: () => void;
};

export function useFetcher<TData, TParam>(
  fn: (params: TParam) => Promise<TData>,
  options?: FetcherOptions,
) {
  const [data, setData] = useState<TData>();
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetch = useCallback(
    async (params: TParam) => {
      setIsFetching(true);
      try {
        const result = await fn(params);
        setData(result);
        options?.onSuccess?.();
      } catch (error) {
        options?.onError?.();
      } finally {
        setIsFetching(false);
      }
    },
    [fn, options],
  );

  return {
    data,
    isFetching,
    fetch,
  };
}

type ResultFetcherOptions<TData> = {
  onSuccess?: (data?: TData) => void;
  onError?: (error?: Error, errors?: Error[]) => void;
};

export function useResultFetcher<TData, TParam = void>(
  fn: (params: TParam) => Promise<Result<TData>>,
  options?: ResultFetcherOptions<TData>,
) {
  const [data, setData] = useState<TData>();
  const [error, setError] = useState<Error | undefined>();
  const [errors, setErrors] = useState<Error[] | undefined>();
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetch = useCallback(
    async (
      ...args: TParam extends void
        ? [opts?: ResultFetcherOptions<TData>]
        : [params: TParam, opts?: ResultFetcherOptions<TData>]
    ) => {
      let params: TParam | undefined;
      let opts: ResultFetcherOptions<TData> | undefined;

      // If the underlying function does not declare any parameters,
      // treat the first argument (if any) as options only.
      if (fn.length === 0) {
        params = undefined as TParam;
        if (args.length >= 1) {
          opts = args[0] as ResultFetcherOptions<TData>;
        }
      } else {
        // Functions that expect a parameter:
        // - fetch(param)
        // - fetch(param, opts)
        if (args.length === 0) {
          params = undefined as TParam;
        } else if (args.length === 1) {
          params = args[0] as TParam;
        } else {
          params = args[0] as TParam;
          opts = args[1] as ResultFetcherOptions<TData>;
        }
      }

      setIsFetching(true);
      setError(undefined);
      setErrors(undefined);

      try {
        const result = await fn(params);
        if (result.success) {
          setData(result.data);
          opts?.onSuccess?.(result.data);
          options?.onSuccess?.(result.data);
        } else {
          setError(result.error);
          setErrors(result.errors);
          opts?.onError?.(result.error, result.errors);
          options?.onError?.(result.error, result.errors);
        }
      } catch (error) {
        throw error;
      } finally {
        setIsFetching(false);
      }
    },
    [fn],
  );

  return {
    data,
    error,
    errors,
    isFetching,
    fetch,
  };
}
