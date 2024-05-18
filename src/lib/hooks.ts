import { useEffect, useState } from "react";
import { Job, JobItem } from "./types";
import { BASE_API_URL } from "./constants";

const MAX_JOB_ITEMS = 7;

export const useFetchJobItems = (searchText: string) => {
  const [jobItems, setJobItems] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // derived state
  const jobItemsSliced = jobItems.slice(0, MAX_JOB_ITEMS);

  // Note: React recommends fetching data in response to user action inside event handler
  //       However, here we are using useEffect for usage/practice
  useEffect(() => {
    if (!searchText) return;
    setIsLoading(true);
    const url = new URL(BASE_API_URL);
    const params = new URLSearchParams(url.search);
    params.set("search", searchText);

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
  }, [searchText]);

  return [jobItemsSliced, isLoading] as const;
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
  const [job, setJob] = useState<JobItem | null>(null);
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
        console.log(data);
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
