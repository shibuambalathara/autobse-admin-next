export type JobDepartment =
  | "Software_Engineering"
  | "Accounting_and_Finance"
  | "Digital_Marketing"
  | "Human_Resources"
  | "Marketing_and_Sales";

export type JobType = "Full_Time" | "Part_Time";

export type CareerUrgency = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export interface Career {
  id: string;
  careerNo?: number | null;
  title?: string | null;
  category?: JobDepartment | null;
  type?: JobType | null;
  urgency?: CareerUrgency | null;
  location?: string | null;
  yearOfExperience?: string | null;
  package?: string | null;
  description?: string | null;
  requirement?: string | null;
  responsibilities?: string | null;
  applicationDeadline?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdById?: string | null;
  createdBy?: {
    id?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  } | null;
}

export interface CareerWhereInput {
  category?: JobDepartment;
  type?: JobType;
  location?: string;
  urgency?: CareerUrgency;
}

export interface CareersListResult {
  careers: {
    careerCount?: number | null;
    deletedCareerCount?: number | null;
    careers: Career[];
  };
}

export interface DeletedCareersResult {
  deletedCareers: {
    deletedCareerCount?: number | null;
    careers: Career[];
  };
}

export interface SingleCareerResult {
  career: Career;
}

export interface DistinctLocationsResult {
  distinctLocations: string[];
}

export interface CreateCareerInput {
  title: string;
  category: JobDepartment;
  urgency: CareerUrgency;
  type: JobType;
  location: string;
  yearOfExperience: string;
  package: string;
  description: string;
  responsibilities: string;
  requirement: string;
  applicationDeadline: string;
}

export interface UpdateCareerInput {
  title?: string;
  category?: JobDepartment;
  urgency?: CareerUrgency;
  type?: JobType;
  location?: string;
  yearOfExperience?: string;
  package?: string;
  description?: string;
  responsibilities?: string;
  requirement?: string;
  applicationDeadline?: string | Date;
}

export interface CareersQueryVariables {
  where?: CareerWhereInput;
  search?: string;
  skip?: number;
  take?: number;
  orderBy?: Array<{ createdAt?: "ASC" | "DESC" }>;
}
