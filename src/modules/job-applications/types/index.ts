export type JobApplicationStatus =
  | "PENDING"
  | "REVIEWED"
  | "REJECTED"
  | "ACCEPTED";

export interface JobApplicationCareer {
  id?: string | null;
  title?: string | null;
}

export interface JobApplication {
  id: string;
  jobApplicationNo?: number | null;
  fullName?: string | null;
  email?: string | null;
  mobile?: string | null;
  yearOfExperience?: string | null;
  coverLetter?: string | null;
  CV?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  linkedinProfile?: string | null;
  portfolioUrl?: string | null;
  status?: JobApplicationStatus | string | null;
  notes?: string | null;
  createdAt?: string | null;
  career?: JobApplicationCareer | null;
}

export interface JobApplicationsWhereInput {
  status?: JobApplicationStatus;
  career?: { id?: string };
}

export interface JobApplicationsListResult {
  jobs: {
    jobCount?: number | null;
    jobs: JobApplication[];
  };
}

export interface SingleJobApplicationResult {
  job: JobApplication;
}

export interface JobApplicationsQueryVariables {
  where?: JobApplicationsWhereInput;
  search?: string;
  skip?: number;
  take?: number;
  orderBy?: Array<{ createdAt?: "ASC" | "DESC" }>;
}

export interface UpdateJobApplicationInput {
  status?: JobApplicationStatus;
  notes?: string;
}
