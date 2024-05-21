import { TriangleDownIcon } from "@radix-ui/react-icons";
import BookmarksPopover from "./BookmarksPopover";
import { useEffect, useState } from "react";

export default function BookmarksButton() {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    // This code is checking if the element that was clicked (e.target) or click was in an element that is a parent of the popover or the button.
    // Note: setting following on the .bookmarks-btn button element will not work:
    // e.stopPropagation();
    // e.preventDefault();
    // Reason: Clicking inside the popover will close it because the event will bubble up to the document and close the popover.
    const closePopover = (e: MouseEvent) => {
      // NOTE SAFE: Reason - class name change will break the code
      if (
        e.target instanceof HTMLElement && // prove that e.target is an HTMLElement to avoid type error and to short-circuit the condition
        !e.target.closest(".bookmarks-popover") && // exclude closing if event is inside the popover
        !e.target.closest(".bookmarks-btn") // exclude closing if event is inside the button
      )
        setIsOpen(false);
    };
    document.addEventListener("click", closePopover); // e => closePopover(e) to check type requirement
    () => document.removeEventListener("click", closePopover);
  }, []);

  return (
    <section>
      <button onClick={handleClick} className="bookmarks-btn">
        Bookmarks <TriangleDownIcon />
      </button>
      {isOpen && <BookmarksPopover />}
    </section>
  );
}
