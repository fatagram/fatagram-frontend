import { Result } from "@/api/common/result";
import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useSnackbar } from "./contexts/use-snackbar";

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
