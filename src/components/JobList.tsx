import JobListItem from "./JobListItem";
import { Job } from "./JobListItem";

type JobListProps = { jobItems: Job[] };

export function JobList({ jobItems }: JobListProps) {
  return (
    <ul className="job-list">
      {jobItems.map((job: Job) => (
        <JobListItem key={job.id} job={job} />
      ))}
    </ul>
  );
}

export default JobList;
