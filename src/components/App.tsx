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
import { useFetchJobItems } from "../lib/hooks";
import { Toaster } from "react-hot-toast";

const MAX_JOB_ITEMS = 7;

function App() {
  const [searchText, setSearchText] = useState("");
  const { isLoading, jobItems } = useFetchJobItems(searchText);

  // derived state - removed to prevent hook from being "too opinionated"
  const jobItemsSliced = jobItems.slice(0, MAX_JOB_ITEMS);
  const totalJobItems = jobItems.length;

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
          <PaginationControls />
        </Sidebar>
        <JobItemContent />
      </Container>
      <Footer />
      <Toaster position={"top-right"} />
    </>
  );
}

export default App;
