import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { PageControls } from "../lib/types";

type PaginationControlsProps = {
  currentPage: number;
  onClick: (direction: PageControls) => void;
};

export default function PaginationControls({
  currentPage,
  onClick,
}: PaginationControlsProps) {
  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;
  return (
    <section className="pagination">
      {previousPage >= 1 && (
        <PageButton
          direction="previous"
          disabled={previousPage < 1}
          onClick={() => onClick("previous")}
        >
          <ArrowLeftIcon />
          Page {previousPage}
        </PageButton>
      )}

      <PageButton direction="next" onClick={() => onClick("next")}>
        Page {nextPage}
        <ArrowRightIcon />
      </PageButton>
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
    onClick={onClick}
    disabled={disabled}
    className={`pagination__button pagination__button--${direction}`}
  >
    {children}
  </button>
);
