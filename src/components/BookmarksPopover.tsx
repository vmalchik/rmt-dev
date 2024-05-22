import { forwardRef } from "react";
import { useBookmarksContext } from "../lib/hooks";
import JobList from "./JobList";

type BookmarksPopoverProps = unknown; // Component does not receive any props

const BookmarksPopover = forwardRef<HTMLDivElement, BookmarksPopoverProps>(
  (_, ref) => {
    const { bookmarkedJobItems, isLoading } = useBookmarksContext();

    return (
      <div ref={ref} className="bookmarks-popover">
        <JobList jobItems={bookmarkedJobItems} isLoading={isLoading} />
      </div>
    );
  }
);

export default BookmarksPopover;
