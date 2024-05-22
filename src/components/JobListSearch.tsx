import { useJobItemsContext } from "../lib/hooks";
import JobList from "./JobList";

// Component is a wrapper for JobList component for optimized rendering and keeping JobList component clean and reusable
export default function JobListSearch() {
  const { jobItemsSlicedAndSorted, isLoading } = useJobItemsContext();
  return <JobList jobItems={jobItemsSlicedAndSorted} isLoading={isLoading} />;
}
