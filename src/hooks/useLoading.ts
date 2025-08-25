import { useState, useCallback, useRef, useEffect } from 'react';

export interface LoadingState {
  [key: string]: boolean;
}

export interface UseLoadingReturn {
  isLoading: (key?: string) => boolean;
  isAnyLoading: () => boolean;
  startLoading: (key?: string) => void;
  stopLoading: (key?: string) => void;
  setLoading: (loading: boolean, key?: string) => void;
  loadingStates: LoadingState;
  withLoading: <T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    key?: string
  ) => (...args: T) => Promise<R>;
}

const DEFAULT_KEY = 'default';

export const useLoading = (initialState: boolean | LoadingState = false): UseLoadingReturn => {
  const [loadingStates, setLoadingStates] = useState<LoadingState>(() => {
    if (typeof initialState === 'boolean') {
      return { [DEFAULT_KEY]: initialState };
    }
    return initialState;
  });

  const timeoutRefs = useRef<{ [key: string]: NodeJS.Timeout }>({});

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  const isLoading = useCallback((key: string = DEFAULT_KEY): boolean => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const isAnyLoading = useCallback((): boolean => {
    return Object.values(loadingStates).some(loading => loading);
  }, [loadingStates]);

  const startLoading = useCallback((key: string = DEFAULT_KEY) => {
    // Clear any existing timeout for this key
    if (timeoutRefs.current[key]) {
      clearTimeout(timeoutRefs.current[key]);
      delete timeoutRefs.current[key];
    }

    setLoadingStates(prev => ({
      ...prev,
      [key]: true
    }));
  }, []);

  const stopLoading = useCallback((key: string = DEFAULT_KEY, delay: number = 0) => {
    if (delay > 0) {
      // Clear any existing timeout for this key
      if (timeoutRefs.current[key]) {
        clearTimeout(timeoutRefs.current[key]);
      }

      timeoutRefs.current[key] = setTimeout(() => {
        setLoadingStates(prev => ({
          ...prev,
          [key]: false
        }));
        delete timeoutRefs.current[key];
      }, delay);
    } else {
      setLoadingStates(prev => ({
        ...prev,
        [key]: false
      }));
    }
  }, []);

  const setLoading = useCallback((loading: boolean, key: string = DEFAULT_KEY) => {
    if (loading) {
      startLoading(key);
    } else {
      stopLoading(key);
    }
  }, [startLoading, stopLoading]);

  const withLoading = useCallback(<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    key: string = DEFAULT_KEY
  ) => {
    return async (...args: T): Promise<R> => {
      try {
        startLoading(key);
        const result = await fn(...args);
        return result;
      } finally {
        stopLoading(key);
      }
    };
  }, [startLoading, stopLoading]);

  return {
    isLoading,
    isAnyLoading,
    startLoading,
    stopLoading,
    setLoading,
    loadingStates,
    withLoading,
  };
};

// Hook for async operations with automatic loading state management
export const useAsyncOperation = <T extends any[], R>(
  operation: (...args: T) => Promise<R>,
  key?: string
) => {
  const { isLoading, withLoading } = useLoading();
  
  const execute = useCallback(
    withLoading(operation, key),
    [operation, withLoading, key]
  );

  return {
    execute,
    isLoading: isLoading(key),
  };
};

// Hook for form submission with loading state
export const useFormSubmission = <T = any>(
  onSubmit: (data: T) => Promise<void>
) => {
  const { isLoading, withLoading } = useLoading();
  
  const handleSubmit = useCallback(
    withLoading(async (data: T) => {
      await onSubmit(data);
    }, 'form'),
    [onSubmit, withLoading]
  );

  return {
    handleSubmit,
    isSubmitting: isLoading('form'),
  };
};

// Hook for data fetching with loading state
export const useDataFetching = <T>(
  fetchFunction: () => Promise<T>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { isLoading, withLoading } = useLoading();

  const fetchData = useCallback(
    withLoading(async () => {
      try {
        setError(null);
        const result = await fetchFunction();
        setData(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An error occurred');
        setError(error);
        throw error;
      }
    }, 'fetch'),
    [fetchFunction, withLoading]
  );

  useEffect(() => {
    fetchData();
  }, dependencies);

  return {
    data,
    error,
    isLoading: isLoading('fetch'),
    refetch: fetchData,
  };
};