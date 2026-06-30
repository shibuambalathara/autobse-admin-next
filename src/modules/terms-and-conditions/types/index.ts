export const TERMS_CONDITIONS_PAGE_SIZE = 10;

export interface TermsConditionRow {
  id: string;
  userId?: string | null;
  eventId: string;
  createdById?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface TermsConditionListResult {
  getTermsAndConditions: {
    termsAndConditionsCount?: number | null;
    termsAndConditions: TermsConditionRow[];
  };
}

export interface ArchivedTermsRow {
  id: string;
  userId?: string | null;
  archivedAt?: string | null;
  archivedById?: string | null;
  eventArchiveId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface UserArchivedTermsResult {
  termsAndConditionsArchive: {
    termsAndConditionsArchiveCount?: number | null;
    termsAndConditionsArchive: ArchivedTermsRow[];
  };
}
