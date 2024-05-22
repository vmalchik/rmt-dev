import { useJobItemsContext, useActiveJobItemId } from "../lib/hooks";
import JobListItem from "./JobListItem";
import Spinner from "./Spinner";

export function JobList() {
  const { jobItemsSlicedAndSorted, isLoading } = useJobItemsContext();
  const activeJobItemId = useActiveJobItemId();
  return (
    <ul className="job-list">
      {isLoading && <Spinner />}
      {!isLoading &&
        jobItemsSlicedAndSorted.map((job) => (
          <JobListItem
            key={job.id}
            job={job}
            isActive={job.id === activeJobItemId}
          />
        ))}
    </ul>
  );
}

export default JobList;
