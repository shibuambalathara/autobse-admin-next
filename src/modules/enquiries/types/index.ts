export type EnquiryStatus = "created" | "solved";

export interface Enquiry {
  id: string;
  firstName: string;
  lastName: string;
  mobile: string;
  state: string;
  message: string;
  status: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface EnquiriesResult {
  Enquiries: {
    enquiryCount?: number | null;
    enquiry: Enquiry[];
  };
}

export interface EnquiryWhereInput {
  state?: string;
  status?: EnquiryStatus;
}

export interface EnquiriesQueryVariables {
  where?: EnquiryWhereInput;
  orderBy?: Array<{ createdAt?: "ASC" | "DESC" }>;
  take?: number;
  skip?: number;
  search?: string;
}
