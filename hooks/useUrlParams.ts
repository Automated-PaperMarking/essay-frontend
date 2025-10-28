"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Custom hook for managing URL search parameters
 * Provides methods to get, set, and remove URL parameters
 */
export const useUrlParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get a parameter value from URL
  const getParam = useCallback(
    (key: string): string | null => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  // Set a parameter in URL
  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, value);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  // Remove a parameter from URL
  const removeParam = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      const paramString = params.toString();
      const newUrl = paramString ? `?${paramString}` : window.location.pathname;
      router.replace(newUrl, { scroll: false });
    },
    [searchParams, router]
  );

  // Set multiple parameters at once
  const setParams = useCallback(
    (paramsObj: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(paramsObj).forEach(([key, value]) => {
        params.set(key, value);
      });
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  // Clear all parameters
  const clearParams = useCallback(() => {
    router.replace(window.location.pathname, { scroll: false });
  }, [router]);

  return {
    getParam,
    setParam,
    removeParam,
    setParams,
    clearParams,
    searchParams,
  };
};

