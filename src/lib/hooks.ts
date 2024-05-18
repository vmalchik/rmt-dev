import { useEffect, useState } from "react";
import { JobDescription, JobItem } from "./types";
import { BASE_API_URL } from "./constants";
// import { useDebounceValue } from "usehooks-ts";

const MAX_JOB_ITEMS = 7;
const MAX_SEARCH_DEBOUNCE_TIME_MS = 250;

export const useFetchJobItems = (searchText: string) => {
  // const [debouncedSearchText, debounce] = useDebounceValue(searchText, MAX_SEARCH_DEBOUNCE_TIME_MS);
  const debouncedSearchText = useDebounce(
    searchText,
    MAX_SEARCH_DEBOUNCE_TIME_MS
  );

  // Alternative way to debounce search text using usehooks-ts library
  // useEffect(() => {
  //   if (searchText === debouncedSearchText) return;
  //   debounce(searchText);
  // }, [searchText, debouncedSearchText, debounce]);

  const [jobItems, setJobItems] = useState<JobItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // derived state
  const jobItemsSliced = jobItems.slice(0, MAX_JOB_ITEMS);
  const totalJobItems = jobItems.length;

  useEffect(() => {
    if (!debouncedSearchText) return;
    setIsLoading(true);
    // Flexible but less robust way to construct URL
    // const url = `${BASE_API_URL}?search=${debouncedSearchText}`;
    // Preferred way to construct URL for following reasons:
    // - URLSearchParams automatically encodes special characters
    // - URL object provides convenient methods to modify URL
    // - URL object provides a clean way to construct and read URL
    // - URL object provides a clean way to append query parameters
    const url = new URL(BASE_API_URL);
    const params = new URLSearchParams(url.search);
    params.set("search", debouncedSearchText);
    url.search = params.toString();

    // Mock backend server will always return random amount of data
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setJobItems(data.jobItems);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearchText]);

  return { jobItemsSliced, isLoading, totalJobItems } as const;
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

export const useFetchJobItemById = (jobId: number | null) => {
  const [job, setJob] = useState<JobDescription | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!jobId) return;
    setIsLoading(true);
    const url = new URL(`${BASE_API_URL}/${jobId}`);

    // Mock backend server will always return random amount of data
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setJob(data.jobItem);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  return [job, isLoading] as const;
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
