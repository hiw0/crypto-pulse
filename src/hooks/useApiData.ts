import { useState, useEffect, useCallback, useRef } from 'react';

interface UseApiDataOptions {
  refreshInterval?: number;
  enabled?: boolean;
}

interface UseApiDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApiData<T>(
  fetcher: () => Promise<T>,
  options: UseApiDataOptions = {}
): UseApiDataResult<T> {
  const { refreshInterval = 60000, enabled = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const doFetch = useCallback(async (isFirst: boolean) => {
    if (isFirst) setLoading(true);
    try {
      const result = await fetcherRef.current();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      if (isFirst) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    doFetch(true);
    const interval = setInterval(() => doFetch(false), refreshInterval);
    return () => clearInterval(interval);
  }, [enabled, refreshInterval, doFetch]);

  const refetch = useCallback(() => doFetch(true), [doFetch]);

  return { data, loading, error, refetch };
}
