import { useState } from "react";
import Background from "./Background";
import Container from "./Container";
import Footer from "./Footer";
import Header, { HeaderTop } from "./Header";
import BookmarksButton from "./BookmarksButton";
import Logo from "./Logo";
import SearchForm from "./SearchForm";
import Sidebar, { SidebarTop } from "./Sidebar";
import JobItemContent from "./JobItemContent";
import JobList from "./JobList";
import PaginationControls from "./PaginationControls";
import ResultsCount from "./ResultsCount";
import SortingControls from "./SortingControls";
import { useDebounce, useFetchJobItems } from "../lib/hooks";
import { Toaster } from "react-hot-toast";
import { PageControls } from "../lib/types";
import { SortBy } from "../lib/enums";

const MAX_PAGE_ITEMS = 7;
const MAX_SEARCH_DEBOUNCE_TIME_MS = 250; // 0.25 seconds

function App() {
  // state
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(
    searchText,
    MAX_SEARCH_DEBOUNCE_TIME_MS
  );
  const { isLoading, jobItems } = useFetchJobItems(debouncedSearchText);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortBy | null>(null);

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
    setSortBy((prev) => (prev === sortBy ? null : sortBy));
  };

  return (
    <>
      <Background />
      <Header>
        <HeaderTop>
          <Logo />
          <BookmarksButton />
        </HeaderTop>
        <SearchForm searchText={searchText} setSearchText={setSearchText} />
      </Header>
      <Container>
        <Sidebar>
          <SidebarTop>
            <ResultsCount total={totalJobItems} />
            <SortingControls sortBy={sortBy} onClick={handleChangeSortBy} />
          </SidebarTop>
          <JobList jobItems={jobItemsSlicedAndSorted} isLoading={isLoading} />
          <PaginationControls
            currentPage={currentPage}
            totalNumberOfPages={totalPageCount}
            onClick={handleChangePage}
          />
        </Sidebar>
        <JobItemContent />
      </Container>
      <Footer />
      <Toaster position={"top-right"} />
    </>
  );
}

export default App;
