export default function ResultsCount({ total = 0 }: { total: number }) {
  return (
    <p className="count">
      <span className="u-bold">{total}</span> results
    </p>
  );
}
