import { createContext, useState } from "react";
import { useDebounce } from "../lib/hooks";

type SearchTextContextProviderProps = {
  children: React.ReactNode;
};

type SearchTextContextType = {
  searchText: string;
  debouncedSearchText: string;
  handleChangeSearchText: (newText: string) => void;
};

export const SearchTextContext = createContext<SearchTextContextType | null>(
  null
);

const MAX_SEARCH_DEBOUNCE_TIME_MS = 250; // 0.25 seconds

export default function SearchTextContextProvider({
  children,
}: SearchTextContextProviderProps) {
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(
    searchText,
    MAX_SEARCH_DEBOUNCE_TIME_MS
  );

  const handleChangeSearchText = (newText: string) => {
    setSearchText(newText);
  };
  return (
    <SearchTextContext.Provider
      value={{
        searchText,
        debouncedSearchText,
        handleChangeSearchText,
      }}
    >
      {children}
    </SearchTextContext.Provider>
  );
}
