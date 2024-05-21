import React from "react";
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
        onClick={() => onClick(SortBy.RELEVANT)}
        isActive={SortBy.RELEVANT === sortBy}
      >
        {SortBy.RELEVANT}
      </SortControlButton>
      <SortControlButton
        onClick={() => onClick(SortBy.RECENT)}
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
