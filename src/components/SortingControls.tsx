import React from "react";
import { SortBy } from "../lib/enums";
import { useJobItemsContext } from "../lib/hooks";

export default function SortingControls() {
  const { sortBy, handleChangeSortBy } = useJobItemsContext();

  return (
    <section className="sorting">
      <i className="fa-solid fa-arrow-down-short-wide"></i>

      <SortControlButton
        onClick={() => handleChangeSortBy(SortBy.RELEVANT)}
        isActive={SortBy.RELEVANT === sortBy}
      >
        {SortBy.RELEVANT}
      </SortControlButton>
      <SortControlButton
        onClick={() => handleChangeSortBy(SortBy.RECENT)}
        isActive={SortBy.RECENT === sortBy}
      >
        {SortBy.RECENT}
      </SortControlButton>
    </section>
  );
}

type SortControlButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  isActive: boolean;
};

const SortControlButton = ({
  children,
  onClick,
  isActive,
}: SortControlButtonProps) => (
  <button
    onClick={onClick}
    className={`sorting__button sorting__button--${
      isActive ? "active" : "inactive"
    }`}
  >
    {children}
  </button>
);
