import { createContext, useState } from "react";
import { useSearchQuery, useSearchTextContext } from "../lib/hooks";
import { SortBy } from "../lib/enums";
import { JobItem, PageControls } from "../lib/types";

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
  const from = currentPage * MAX_PAGE_ITEMS - MAX_PAGE_ITEMS;
  const to = currentPage * MAX_PAGE_ITEMS;
  const totalPageCount = Math.ceil(jobItems.length / MAX_PAGE_ITEMS);
  const jobItemsSorted = [...jobItems].sort((a, b) => {
    if (sortBy === SortBy.RELEVANT) {
      return b.relevanceScore - a.relevanceScore;
    } else if (sortBy === SortBy.RECENT) {
      return a.daysAgo - b.daysAgo;
    }
    return 0;
  });

  const jobItemsSlicedAndSorted = [...jobItemsSorted].slice(from, to);
  const totalJobItems = jobItems.length;

  // event handlers / actions
  const handleChangePage = (direction: PageControls) => {
    if (direction === "next") {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "previous") {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleChangeSortBy = (sortBy: SortBy) => {
    setCurrentPage(1);
    setSortBy(sortBy);
  };

  return (
    <JobItemsContext.Provider
      value={{
        isLoading,
        currentPage,
        sortBy,
        totalPageCount,
        jobItemsSlicedAndSorted,
        totalJobItems,
        handleChangePage,
        handleChangeSortBy,
      }}
    >
      {children}
    </JobItemsContext.Provider>
  );
}
