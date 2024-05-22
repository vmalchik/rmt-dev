import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { PageControls } from "../lib/types";
import { useJobItemsContext } from "../lib/hooks";

export default function PaginationControls() {
  const { currentPage, totalPageCount, handleChangePage } =
    useJobItemsContext();

  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;
  return (
    <section className="pagination">
      {currentPage > 1 && (
        <PageButton
          direction="previous"
          disabled={previousPage < 1}
          onClick={() => handleChangePage("previous")}
        >
          <ArrowLeftIcon />
          Page {previousPage}
        </PageButton>
      )}

      {currentPage < totalPageCount && (
        <PageButton direction="next" onClick={() => handleChangePage("next")}>
          Page {nextPage}
          <ArrowRightIcon />
        </PageButton>
      )}
    </section>
  );
}

type PageButtonProps = {
  direction: PageControls;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

const PageButton = ({
  direction,
  children,
  onClick,
  disabled,
}: PageButtonProps) => (
  <button
    onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      onClick();
      // target refers to element that triggered the event (element on which the event originally occurred)
      // currentTarget refers to element that event listener is attached to (element that event listener is set on)
      e.currentTarget.blur(); // accessibility tabbing will still work
    }}
    disabled={disabled}
    className={`pagination__button pagination__button--${direction}`}
  >
    {children}
  </button>
);
