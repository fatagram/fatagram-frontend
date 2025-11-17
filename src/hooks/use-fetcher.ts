import { ApiResponse } from "@/api/common/apiResponse";
import { Result } from "@/api/common/result";
import { useCallback, useState } from "react";

type FetcherOptions<T, P> = {
  onSuccess?: (data?: T) => void;
  onError?: (error: any, errors: any) => void;
};

export function useFetcher<TData, TParam>(
  fn: (params: TParam) => Promise<Result<TData>>,
  options?: FetcherOptions<TData, TParam>,
) {
  const [data, setData] = useState<TData | null | undefined>(undefined);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetch = useCallback(
    async (params: TParam) => {
      setIsLoading(true);
      setError(null);
      const result = await fn(params);
      setIsLoading(false);
      if (result.success) {
        setData(result.data);
        options?.onSuccess && options.onSuccess(result.data);
      } else {
        setError(result.data);
        options?.onError && options.onError(result.errorCode, result.errorCodes);
      }
    },
    [fn, options],
  );

  return { data, error, isLoading, fetch };
}
