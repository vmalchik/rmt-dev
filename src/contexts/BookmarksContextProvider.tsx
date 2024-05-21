import { useLocalStorage } from "usehooks-ts";
import { createContext } from "react";
import { useFetchJobItems } from "../lib/hooks";
import { JobDescription } from "../lib/types";

type BookmarksContextProviderProps = {
  children: React.ReactNode;
};

type BookmarksContextType = {
  bookmarkedIds: number[];
  handleToggleBookmark: (jobId: number) => void;
  bookmarkedJobItems: JobDescription[];
  isLoading: boolean;
};

export const BookmarksContext = createContext<BookmarksContextType | null>(
  null
);

export default function BookmarksContextProvider({
  children,
}: BookmarksContextProviderProps) {
  const [bookmarkedIds, setBookmarkedIds] = useLocalStorage<number[]>(
    "bookmarkedIds",
    []
  );

  const { jobItems: bookmarkedJobItems, isLoading } =
    useFetchJobItems(bookmarkedIds);

  const handleToggleBookmark = (jobId: number) => {
    setBookmarkedIds((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  return (
    <BookmarksContext.Provider
      value={{
        bookmarkedIds,
        handleToggleBookmark,
        bookmarkedJobItems,
        isLoading,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}
