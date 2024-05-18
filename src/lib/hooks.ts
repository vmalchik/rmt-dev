import { useEffect, useState } from "react";
import { Job } from "./types";

export const useFetchJobItems = (searchText: string) => {
  const [jobItems, setJobItems] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Note: React recommends fetching data in response to user action inside event handler
  //       However, here we are using useEffect for usage/practice
  useEffect(() => {
    if (!searchText) return;
    setIsLoading(true);
    const url = new URL(
      "https://bytegrad.com/course-assets/projects/rmtdev/api/data"
    );
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

  return { jobItems, isLoading };
};
