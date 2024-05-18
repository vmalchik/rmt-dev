export type JobItem = {
  id: number;
  title: string;
  badgeLetters: string;
  company: string;
  date: string;
  relevanceScore: number;
  daysAgo: number;
};

// Intersection type to combine JobItem with additional properties
export type JobDescription = JobItem & {
  companyURL: string;
  coverImgURL: string;
  description: string;
  duration: string;
  location: string;
  qualifications: Array<string>; // two different ways to type arrays
  reviews: string[]; // alternative way to type arrays
  salary: string;
};
