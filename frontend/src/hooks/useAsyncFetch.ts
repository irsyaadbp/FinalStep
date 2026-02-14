import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAsyncFetchOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
  immediate?: boolean;
}

/**
 * Custom hook for handling asynchronous data fetching with loading and error states.
 */
export function useAsyncFetch<T>(asyncFn: () => Promise<T>, options: UseAsyncFetchOptions<T> = {}) {
  const { immediate = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const asyncFnRef = useRef(asyncFn);
  asyncFnRef.current = asyncFn;

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await asyncFnRef.current();
      setData(result);
      if (optionsRef.current.onSuccess) optionsRef.current.onSuccess(result);
    } catch (err: unknown) {
      setError(err);
      if (optionsRef.current.onError) optionsRef.current.onError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
    // Only run on mount or when immediate changes to true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate]);

  return { data, isLoading, error, execute, setData };
}
