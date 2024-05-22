import { useActiveJobItemId } from "../lib/hooks";
import { JobItem } from "../lib/types";
import JobListItem from "./JobListItem";
import Spinner from "./Spinner";

type JobListProps = {
  jobItems: JobItem[];
  isLoading: boolean;
};

export function JobList({ jobItems, isLoading }: JobListProps) {
  const activeJobItemId = useActiveJobItemId();
  return (
    <ul className="job-list">
      {isLoading && <Spinner />}
      {!isLoading &&
        jobItems.map((job) => (
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
