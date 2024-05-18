export type Job = {
  id: number;
  title: string;
  badgeLetters: string;
  company: string;
  date: string;
  relevanceScore: number;
  daysAgo: number;
};

export type JobItem = {
  id: number;
  title: string;
  badgeLetters: string;
  company: string;
  companyURL: string;
  coverImgURL: string;
  daysAgo: number;
  description: string;
  duration: string;
  location: string;
  qualifications: string[];
  relevanceScore: number;
  reviews: string[];
  salary: string;
};
