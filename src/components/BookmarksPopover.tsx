import { forwardRef } from "react";
import { useBookmarksContext } from "../lib/hooks";
import JobList from "./JobList";
import { createPortal } from "react-dom";

type BookmarksPopoverProps = unknown; // Component does not receive any props

const BookmarksPopover = forwardRef<HTMLDivElement, BookmarksPopoverProps>(
  (_, ref) => {
    const { bookmarkedJobItems, isLoading } = useBookmarksContext();

    // place popover into its own space to prevent popover from being impacted by surrounding elements
    // eg. z-index impacting display of popover
    return createPortal(
      <div ref={ref} className="bookmarks-popover">
        <JobList jobItems={bookmarkedJobItems} isLoading={isLoading} />
      </div>,
      document.body
    );
  }
);

export default BookmarksPopover;
