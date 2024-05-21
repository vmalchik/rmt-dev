import { SortBy } from "../lib/enums";

type SortingControlsProps = {
  sortBy: SortBy | null;
  onClick: (sortBy: SortBy) => void;
};
export default function SortingControls({
  sortBy,
  onClick,
}: SortingControlsProps) {
  return (
    <section className="sorting">
      <i className="fa-solid fa-arrow-down-short-wide"></i>

      <SortControlButton
        sort={SortBy.RELEVANT}
        onClick={onClick}
        isActive={SortBy.RELEVANT === sortBy}
      />
      <SortControlButton
        sort={SortBy.RECENT}
        onClick={onClick}
        isActive={SortBy.RECENT === sortBy}
      />
      {/* <button className="sorting__button sorting__button--relevant">
        Relevant
      </button>

      <button className="sorting__button sorting__button--recent">
        Recent
      </button> */}
    </section>
  );
}

type SortControlButtonProps = {
  sort: SortBy;
  onClick: (sortBy: SortBy) => void;
  isActive: boolean;
};

const SortControlButton = ({
  sort,
  onClick,
  isActive,
}: SortControlButtonProps) => (
  <button
    onClick={() => onClick(sort)}
    className={`sorting__button sorting__button--${
      isActive ? "active" : "inactive"
    }`}
  >
    {sort}
  </button>
);
