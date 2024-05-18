import { Job } from "../lib/types";
import JobListItem from "./JobListItem";
import Spinner from "./Spinner";

type JobListProps = { jobItems: Job[]; isLoading: boolean };

export function JobList({ jobItems, isLoading }: JobListProps) {
  return (
    <ul className="job-list">
      {isLoading && <Spinner />}
      {!isLoading &&
        jobItems.map((job: Job) => <JobListItem key={job.id} job={job} />)}
    </ul>
  );
}

export default JobList;
