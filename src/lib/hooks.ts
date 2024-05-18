import { useEffect, useState } from "react";
import { JobDescription, JobItem } from "./types";
import { BASE_API_URL } from "./constants";
import { useQuery } from "@tanstack/react-query";

// Notes:
// Library for debouncing values in React
// import { useDebounceValue } from "usehooks-ts";

// Two popular libraries for data fetching in React:
// https://www.npmjs.com/package/react-query
// https://www.npmjs.com/package/swr

const MAX_SEARCH_DEBOUNCE_TIME_MS = 250; // 0.25 seconds
const MAX_CACHE_STALE_TIME_MS = 1000 * 60 * 60; // 1 hour

// **    Original implementation using useState and useEffect   **
// **    Replaced with useQuery from react-query library        **
// export const useFetchJobItems = (searchText: string) => {
//   // const [debouncedSearchText, debounce] = useDebounceValue(searchText, MAX_SEARCH_DEBOUNCE_TIME_MS);
//   const debouncedSearchText = useDebounce(
//     searchText,
//     MAX_SEARCH_DEBOUNCE_TIME_MS
//   );

//   // Alternative way to debounce search text using usehooks-ts library
//   // useEffect(() => {
//   //   if (searchText === debouncedSearchText) return;
//   //   debounce(searchText);
//   // }, [searchText, debouncedSearchText, debounce]);

//   const [jobItems, setJobItems] = useState<JobItem[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // derived state - removed to prevent hook from being "too opinionated"
//   // const jobItemsSliced = jobItems.slice(0, MAX_JOB_ITEMS);
//   // const totalJobItems = jobItems.length;

//   useEffect(() => {
//     if (!debouncedSearchText) return;
//     setIsLoading(true);
//     // Flexible but less robust way to construct URL
//     // const url = `${BASE_API_URL}?search=${debouncedSearchText}`;
//     // Preferred way to construct URL for following reasons:
//     // - URLSearchParams automatically encodes special characters
//     // - URL object provides convenient methods to modify URL
//     // - URL object provides a clean way to construct and read URL
//     // - URL object provides a clean way to append query parameters
//     const url = new URL(BASE_API_URL);
//     const params = new URLSearchParams(url.search);
//     params.set("search", debouncedSearchText);
//     url.search = params.toString();

//     // Mock backend server will always return random amount of data
//     const fetchData = async () => {
//       try {
//         const response = await fetch(url);
//         const data = await response.json();
//         setJobItems(data.jobItems);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [debouncedSearchText]);

//   return { jobItems, isLoading } as const;
// };

// ------------------  New implementation using useQuery  ------------------

type FetchJobItemsResponse = {
  public: boolean;
  sorted: boolean;
  jobItems: JobItem[];
};

const fetchJobs = async (
  searchText: string
): Promise<FetchJobItemsResponse> => {
  const url = new URL(BASE_API_URL);
  const params = new URLSearchParams(url.search);
  params.set("search", searchText);
  url.search = params.toString();

  const response = await fetch(url);
  // Handle redirections (3xx)
  if (response.status >= 300 && response.status < 400) {
    throw new Error(`Redirection error: ${response.status}`);
  }
  // Handle client (4xx) or server errors (5xx)
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.description);
  }

  return await response.json();
};

export const useFetchJobItems = (searchText: string) => {
  const debouncedSearchText = useDebounce(
    searchText,
    MAX_SEARCH_DEBOUNCE_TIME_MS
  );

  const { data, isInitialLoading, error } = useQuery(
    ["job-items", debouncedSearchText], // cache key
    () => fetchJobs(debouncedSearchText),
    {
      staleTime: MAX_CACHE_STALE_TIME_MS,
      refetchOnWindowFocus: false, // don't refetch on window focus
      retry: false, // don't retry on error
      enabled: Boolean(debouncedSearchText), // fetch if search text is not empty
      onError: (error) => console.error(error),
    }
  );

  const jobItems = data?.jobItems || [];

  return { jobItems, isLoading: isInitialLoading, error } as const;
};

// **    Original implementation using useState and useEffect   **
// **    Replaced with useQuery from react-query library        **
// export const useFetchJobItemById = (jobId: number | null) => {
//   const [job, setJob] = useState<JobDescription | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (!jobId) return;
//     setIsLoading(true);
//     const url = new URL(`${BASE_API_URL}/${jobId}`);

//     // Mock backend server will always return random amount of data
//     const fetchData = async () => {
//       try {
//         const response = await fetch(url);
//         const data = await response.json();
//         setJob(data.jobItem);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [jobId]);

//   return [job, isLoading] as const;
// };

// ------------------  New implementation using useQuery  ------------------

type FetchJobItemByIdResponse = {
  public: boolean;
  jobItem: JobDescription;
};

const fetchJobById = async (
  jobId: number
): Promise<FetchJobItemByIdResponse> => {
  const url = new URL(`${BASE_API_URL}/${jobId}`);
  const response = await fetch(url);
  // Handle redirections (3xx)
  if (response.status >= 300 && response.status < 400) {
    throw new Error(`Redirection error: ${response.status}`);
  }
  // Handle client (4xx) or server errors (5xx)
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.description);
  }
  // if (!response.ok || response.status < 200 || response.status >= 300) {
  //   let errorMessage = `Failed to fetch job item. Status: ${response.status}`;

  //   const contentType = response.headers.get("Content-Type");
  //   if (contentType && contentType.includes("application/json")) {
  //     const errorData = await response.json();
  //     errorMessage += ` - ${errorData.message}`;
  //   } else {
  //     const errorText = await response.text();
  //     errorMessage += ` - ${errorText}`;
  //   }

  //   throw new Error(errorMessage);
  // }

  return await response.json();
};

export const useFetchJobItemById = (jobId: number | null) => {
  // Following is not allowed in hooks. Cannot call conditionally in hooks
  // if (!jobId) return { job: null, isLoading: false, error: null } as const;

  // ["jobId", jobId] array is similar to useEffect dependencies array.
  // Here it helps with cache and cache invalidation
  const { data, isInitialLoading, error } = useQuery(
    ["job-id", jobId], // cache key
    () => (jobId ? fetchJobById(jobId) : null),
    {
      staleTime: MAX_CACHE_STALE_TIME_MS,
      refetchOnWindowFocus: false, // don't refetch on window focus
      retry: false, // don't retry on error
      enabled: Boolean(jobId), // fetch data immediately on component mount if jobId is not null
      onError: (error) => console.error(error),
    }
  );

  const job = data?.jobItem;

  return { job, isLoading: isInitialLoading, error } as const;
};

// Use generic type to make useDebounce hook more flexible
// <T> let's TypeScript know that we are using a generic type
// Generics establishes a relationship between:
// - the type of the value passed to the hook
// - the type of the value returned by the hook
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
    // convert id to number
    const id = +window.location.hash.slice(1);
    setActiveJobItemId(id || null);
  };
  useEffect(() => {
    // register event listener
    window.addEventListener("hashchange", handleHashChange);
    // handle initial hash check on page load
    handleHashChange();
    // unregister event listener
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return activeJobItemId;
};
