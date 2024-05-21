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
    e.stopPropagation(); // Prevents the parent element from receiving the event on the capturing phase
    e.preventDefault(); // Prevents the default action of the event from being triggered on other element types such as links
  };
  return (
    <button className="bookmark-btn" onClick={(e) => handleClicked(e)}>
      <BookmarkFilledIcon
        className={`${bookmarkedIds.includes(id) ? "filled" : ""}`}
      />
    </button>
  );
}
