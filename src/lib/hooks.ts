import { useContext, useEffect, useState } from "react";
import { JobDescription, JobItem } from "./types";
import { BASE_API_URL } from "./constants";
import { useQueries, useQuery } from "@tanstack/react-query";
import { handleError } from "./utils";
import { BookmarksContext } from "../contexts/BookmarksContextProvider";
import { ActiveIdContext } from "../contexts/ActiveIdContextProvider";
import { SearchTextContext } from "../contexts/SearchTextContextProvider";
import { JobItemsContext } from "../contexts/JobItemsContextProvider";

// Note:
// Two alternative popular libraries for data fetching in React:
// https://www.npmjs.com/package/react-query
// https://www.npmjs.com/package/swr

const MAX_CACHE_STALE_TIME_MS = 1000 * 60 * 60; // 1 hour

type FetchJobItemsResponse = {
  public: boolean;
  sorted: boolean;
  jobItems: JobItem[];
};

const searchJobs = async (
  searchText: string
): Promise<FetchJobItemsResponse> => {
  const url = new URL(BASE_API_URL);
  const params = new URLSearchParams(url.search);
  params.set("search", searchText);
  url.search = params.toString();

  const response = await fetch(url);
  if (response.status >= 300 && response.status < 400) {
    throw new Error(`Redirection error: ${response.status}`);
  }
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.description);
  }

  return await response.json();
};

export const useSearchQuery = (searchText: string) => {
  const { data, isInitialLoading, error } = useQuery(
    ["search-jobs", searchText],
    () => searchJobs(searchText),
    {
      staleTime: MAX_CACHE_STALE_TIME_MS,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: Boolean(searchText),
      onError: handleError,
    }
  );

  const jobItems = data?.jobItems || [];

  return { jobItems, isLoading: isInitialLoading, error } as const;
};

// -------------------------------------------------------------------------

export const useFetchJobItems = (ids: number[]) => {
  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["job-id", id],
      queryFn: () => fetchJobById(id),
      staleTime: MAX_CACHE_STALE_TIME_MS,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: Boolean(id),
      onError: handleError,
    })),
  });

  const jobItems = results
    .map((result) => result.data?.jobItem)
    .filter((jobItem) => Boolean(jobItem)) as JobDescription[];

  // If at least one item in array is loading then all are loading
  const isLoading = results.some((result) => result.isLoading);

  return { jobItems, isLoading } as const;
};

type FetchJobItemByIdResponse = {
  public: boolean;
  jobItem: JobDescription;
};

const fetchJobById = async (
  jobId: number
): Promise<FetchJobItemByIdResponse> => {
  const url = new URL(`${BASE_API_URL}/${jobId}`);
  const response = await fetch(url);
  // Good to use schema validators like Zod to validate response data
  // Alternative is to use ts-reset package
  if (response.status >= 300 && response.status < 400) {
    throw new Error(`Redirection error: ${response.status}`);
  }
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.description);
  }
  return await response.json();
};

export const useFetchJobItemById = (jobId: number | null) => {
  const { data, isInitialLoading, error } = useQuery(
    ["job-id", jobId],
    () => (jobId ? fetchJobById(jobId) : null),
    {
      staleTime: MAX_CACHE_STALE_TIME_MS,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: Boolean(jobId),
      onError: handleError,
    }
  );

  const job = data?.jobItem;

  return { job, isLoading: isInitialLoading, error } as const;
};

export const useDebounce = <T>(value: T, time: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedValue(value), time);
    return () => clearTimeout(timerId);
  }, [value, time]);

  return debouncedValue;
};

export const useActiveJobItemId = () => {
  const [activeJobItemId, setActiveJobItemId] = useState<number | null>(null);

  const handleHashChange = () => {
    const id = +window.location.hash.slice(1);
    setActiveJobItemId(id || null);
  };
  useEffect(() => {
    window.addEventListener("hashchange", handleHashChange);
    handleHashChange();
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return activeJobItemId;
};

const initState = <T>(key: string, initialDefaultValue: T) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : initialDefaultValue;
};

export const useLocalStorage = <T>(key: string, initialDefaultValue: T) => {
  const [data, setData] = useState<T>(initState(key, initialDefaultValue));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data));
  }, [key, data]);

  return [data, setData] as const;
};

export const useOnClickOutside = (
  refs: React.RefObject<HTMLElement>[],
  callback: () => void
) => {
  useEffect(() => {
    const callbackHandler = (e: MouseEvent) => {
      const containsTarget = refs.some((ref) =>
        ref.current?.contains(e.target as Node)
      );
      if (e.target instanceof HTMLElement && !containsTarget) {
        callback();
      }
    };
    document.addEventListener("click", callbackHandler);
    return () => document.removeEventListener("click", callbackHandler);
  }, [refs, callback]);
};

export const useBookmarksContext = () => {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error(
      "useBookmarks must be used within a BookmarksContextProvider"
    );
  }
  return context;
};

export const useActiveJobIdContext = () => {
  const context = useContext(ActiveIdContext);
  if (!context) {
    throw new Error(
      "useActiveJobIdContext must be used within a ActiveIdContextProvider"
    );
  }
  return context;
};

export const useSearchTextContext = () => {
  const context = useContext(SearchTextContext);
  if (!context) {
    throw new Error(
      "useSearchTextContext must be used within a SearchTextContextProvider"
    );
  }
  return context;
};

export const useJobItemsContext = () => {
  const context = useContext(JobItemsContext);
  if (!context) {
    throw new Error(
      "useJobItemsContext must be used within a JobItemsContextProvider"
    );
  }
  return context;
};
