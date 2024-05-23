import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import { useBookmarksContext } from "../lib/hooks";

type BookmarkIconProps = {
  id: number;
};

export default function BookmarkIcon({ id }: BookmarkIconProps) {
  const { bookmarkedIds, handleToggleBookmark } = useBookmarksContext();
  const handleClicked = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    handleToggleBookmark(id);
    e.stopPropagation();
    e.preventDefault();
  };
  return (
    <button className="bookmark-btn" onClick={(e) => handleClicked(e)}>
      <BookmarkFilledIcon
        className={`${bookmarkedIds.includes(id) ? "filled" : ""}`}
      />
    </button>
  );
}
