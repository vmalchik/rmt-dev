import { createContext, useMemo, useState } from "react";
import { useSearchQuery, useSearchTextContext } from "../lib/hooks";
import { PageControls, SortBy } from "../lib/enums";
import { JobItem } from "../lib/types";

type JobItemsContextProviderProps = {
  children: React.ReactNode;
};

type JobItemsContextType = {
  isLoading: boolean;
  currentPage: number;
  sortBy: SortBy;
  totalPageCount: number;
  jobItemsSlicedAndSorted: JobItem[];
  totalJobItems: number;
  handleChangePage: (direction: PageControls) => void;
  handleChangeSortBy: (sortBy: SortBy) => void;
};

const MAX_PAGE_ITEMS = 7;

export const JobItemsContext = createContext<JobItemsContextType | null>(null);

export default function JobItemsContextProvider({
  children,
}: JobItemsContextProviderProps) {
  // dependency on other context
  const { debouncedSearchText } = useSearchTextContext();

  // state
  const { isLoading, jobItems } = useSearchQuery(debouncedSearchText);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.RELEVANT);

  // derived state / computed state
  const totalJobItems = jobItems.length;
  const totalPageCount = Math.ceil(jobItems.length / MAX_PAGE_ITEMS);

  // Optimization: useMemo to avoid re-sorting jobItems on every render (e.g. when currentPage changes)
  const jobItemsSorted = useMemo(() => {
    return [...jobItems].sort((a, b) => {
      if (sortBy === SortBy.RELEVANT) {
        return b.relevanceScore - a.relevanceScore;
      } else if (sortBy === SortBy.RECENT) {
        return a.daysAgo - b.daysAgo;
      }
      return 0;
    });
  }, [jobItems, sortBy]);

  const jobItemsSlicedAndSorted = useMemo(() => {
    const from = currentPage * MAX_PAGE_ITEMS - MAX_PAGE_ITEMS;
    const to = currentPage * MAX_PAGE_ITEMS;
    return [...jobItemsSorted].slice(from, to);
  }, [jobItemsSorted, currentPage]);

  // useMemo to memoize the context value to avoid re-rendering consumers on every render
  const contextValue: JobItemsContextType = useMemo(() => {
    // event handlers / actions
    const handleChangePage = (direction: PageControls) => {
      if (direction === PageControls.NEXT) {
        setCurrentPage((prev) => prev + 1);
      } else if (direction === PageControls.PREVIOUS) {
        setCurrentPage((prev) => prev - 1);
      }
    };

    const handleChangeSortBy = (sortBy: SortBy) => {
      setCurrentPage(1);
      setSortBy(sortBy);
    };

    return {
      isLoading,
      currentPage,
      sortBy,
      totalPageCount,
      jobItemsSlicedAndSorted,
      totalJobItems,
      handleChangePage,
      handleChangeSortBy,
    };
  }, [
    isLoading,
    currentPage,
    sortBy,
    totalPageCount,
    jobItemsSlicedAndSorted,
    totalJobItems,
  ]);

  return (
    <JobItemsContext.Provider value={contextValue}>
      {children}
    </JobItemsContext.Provider>
  );
}
