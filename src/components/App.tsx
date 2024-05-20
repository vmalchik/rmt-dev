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

const MAX_JOB_ITEMS = 7;
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

  // derived state / computed state
  const jobItemsSliced = jobItems.slice(0, MAX_JOB_ITEMS);
  const totalJobItems = jobItems.length;

  // event handlers / actions
  const handleChangePage = (direction: PageControls) => {
    if (direction === "next") {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "previous") {
      setCurrentPage((prev) => prev - 1);
    }
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
            <SortingControls />
          </SidebarTop>
          <JobList jobItems={jobItemsSliced} isLoading={isLoading} />
          <PaginationControls
            currentPage={currentPage}
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
