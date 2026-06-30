const ERROR_MESSAGES: Record<number, string> = {
  1001: "No such user found. Please check the details and try again.",
  1002: "Failed to update user. Please try again later.",
  1011: "This mobile number is already registered. Please use a different number.",
  1012: "This PAN card number is already registered. Please check or use a different one.",
  1013: "This ID number already exists. Please verify the details.",
  1015: "Only administrators can update mobile or role fields.",
  1007: "Failed to set user OTP.",
  2002: "Invalid username and password.",
  2003: "Auction ended.",
  2004: "Auction not started.",
  2005: "Auction not active.",
  2006: "No more bids allowed.",
  2007: "Amount must be a multiple of quote increment.",
  2008: "Not allowed to bid on vehicle in this state.",
  2009: "Amount is less than starting bid.",
  2010: "Amount is less than your previous bid.",
  2011: "Amount is less than current bid.",
  2012: "Buying limit reached.",
  2001: "Only administrators or staff have permission to perform this action.",
  20001: "You are not allowed to perform this action.",
  2022: "Dealer already blocked by this seller.",
  2023: "Dealer not blocked by this seller.",
  5011: "The name or state you entered already exists. Please choose a different name.",
  92000: "Excel split failed.",
  92004: "Location not found for state name. Please use state names that match locations in the system.",
  92005: "Multiple locations with the same name were found. Please ensure each location name is unique.",
  9001: "Excel creation failed.",
  9007: "Invalid file type. Only Excel files (.xls, .xlsx) are allowed.",
  9008: "File should not be empty.",
  8001: "File upload failed.",
  81001: "Vehicle image upload failed.",
  81002: "Failed to get all vehicle images.",
  81003: "No vehicle image found.",
  94000: "Open token already exists.",
  11003: "Bid status cannot be changed.",
  11006: "Bid is already fulfilled.",
  61001: "Failed to remove existing pending users",
  6001: "Event not found.",
  6006: "Event cannot be archived at this time.",
  6007: "Archiving event failed.",
  9002: "No enquiries found.",
  19000: "Enquiry creation failed.",
  21000: "Blog creation failed.",
  21001: "No blog found.",
  21002: "Failed to update blog.",
  21003: "Blog image update to database failed.",
  21004: "Failed to delete blog.",
  21005: "Failed to restore blog.",
  21006: "Either id or slug must be provided.",
  23000: "Career creation failed.",
  23001: "No career found.",
  23002: "Career id is required.",
  23003: "Career update failed.",
  23004: "Career remove failed.",
  23005: "No deleted career found.",
  23006: "Career restore failed.",
  24000: "Job application creation failed.",
  24001: "No jobs found.",
  24002: "Job id is required.",
  24003: "Job update failed.",
  24004: "Delete job failed.",
  24005: "No deleted job found.",
  24006: "Job restore failed.",
  24007: "Invalid file type. Only PDF, DOC, and DOCX files are allowed.",
  24008: "CV file should not be empty.",
  24009: "CV file upload to S3 failed.",
  24010: "A job application for this mobile number or email already exists for this career.",
  24011: "Invalid date of birth. Please provide a valid date.",
  24012: "Unable to process the job application at this time.",
  26000: "Schedule call creation failed.",
  26001: "No schedule call found.",
  26002: "Schedule call id is required.",
  26003: "Schedule call remove failed.",
  26004: "Schedule call restore failed.",
  16000: "Buyer Leads creation failed.",
  16001: "Buyer Leads not found.",
};

export function getGraphqlErrorMessage(
  errorCode?: number | string | null,
  fallback?: string
): string {
  if (errorCode != null) {
    const code = typeof errorCode === "string" ? Number(errorCode) : errorCode;
    if (!Number.isNaN(code) && ERROR_MESSAGES[code]) {
      return ERROR_MESSAGES[code];
    }
  }
  return fallback ?? "Something went wrong. Please try again.";
}

type GraphQLErrorLike = {
  message?: string;
  errorCode?: number | string;
  extensions?: {
    errorCode?: number | string;
    [key: string]: unknown;
  };
};

function parseGraphQLErrorLike(
  gqlError?: GraphQLErrorLike | null
): { message: string; errorCode?: number | string } | null {
  if (!gqlError) return null;

  const errorCode = gqlError.errorCode ?? gqlError.extensions?.errorCode;

  return {
    message: getGraphqlErrorMessage(errorCode, gqlError.message),
    errorCode,
  };
}

export function getGraphqlResultErrorMessage(
  result: { errors?: ReadonlyArray<GraphQLErrorLike> } | null | undefined
): string | null {
  if (!result?.errors?.length) return null;
  return extractGraphqlError(result).message;
}

export function extractGraphqlError(error: unknown): {
  message: string;
  errorCode?: number | string;
} {
  if (error && typeof error === "object" && "errors" in error) {
    const parsed = parseGraphQLErrorLike(
      (error as { errors?: GraphQLErrorLike[] }).errors?.[0]
    );
    if (parsed) return parsed;
  }

  if (error && typeof error === "object" && "graphQLErrors" in error) {
    const parsed = parseGraphQLErrorLike(
      (error as { graphQLErrors?: GraphQLErrorLike[] }).graphQLErrors?.[0]
    );
    if (parsed) return parsed;
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: "Something went wrong. Please try again." };
}
