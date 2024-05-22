import { useJobItemsContext } from "../lib/hooks";

export default function ResultsCount() {
  const { totalJobItems } = useJobItemsContext();
  return (
    <p className="count">
      <span className="u-bold">{totalJobItems}</span> results
    </p>
  );
}
