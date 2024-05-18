import BookmarkIcon from "./BookmarkIcon";

export type Job = {
  id: number;
  title: string;
  badgeLetters: string;
  company: string;
  date: string;
  relevanceScore: number;
  daysAgo: number;
};

type JobListItemProps = {
  job: Job;
};

export default function JobListItem({ job }: JobListItemProps) {
  return (
    <li className="job-item">
      <a className="job-item__link">
        <div className="job-item__badge">{job.badgeLetters}</div>

        <div className="job-item__middle">
          <h3 className="third-heading">{job.title}</h3>
          <p className="job-item__company">{job.company}</p>
        </div>

        <div className="job-item__right">
          <BookmarkIcon />
          <time className="job-item__time">{job.daysAgo}d</time>
        </div>
      </a>
    </li>
  );
}
