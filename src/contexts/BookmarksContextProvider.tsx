import { useLocalStorage } from "usehooks-ts";
import { createContext } from "react";

type BookmarksContextProviderProps = {
  children: React.ReactNode;
};

type BookmarksContextType = {
  bookmarkedIds: number[];
  handleToggleBookmark: (jobId: number) => void;
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
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}
