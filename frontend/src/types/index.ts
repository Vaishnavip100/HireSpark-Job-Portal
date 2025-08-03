export interface Job {
  _id: string; // <-- CHANGE id: number to _id: string
  title: string;
  role: 'Job Seeker' | 'Recruiter';
  company: string;
  description: string;
  skills: string[];
  location: string;
  type: string;
  salary: string;
  createdAt: string; // <-- CHANGE postedTime to createdAt
  postedTime: string;
  logo: string;
  remote?: boolean;
  category: string;
  salaryMin: number;
  salaryMax: number;
  experienceRequired: number;
}

export interface Company {
  id: number;
  name: string;
  description: string;
  location: string;
  employees: string;
  industry: string;
  logo: string;
  openPositions: number;
}

export interface FilterState {
  searchTerm: string;
  jobTitle: string;
  location: string;
  category: string;
  jobTypes: string[];
  locations: string[];
  categories: string[];
  salaryRange: number;
  experienceRange: number;
  sortBy: string;
}