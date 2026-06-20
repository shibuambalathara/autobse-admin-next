export const BID_STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Fulfilled", value: "fulfilled" },
  { label: "Declined", value: "declined" },
] as const;

export const ADD_VEHICLE_FIELDS = [
  { name: "registrationNumber", label: "Registration Number", type: "text", required: true },
  { name: "loanAgreementNo", label: "Loan Agreement No", type: "text", required: true },
  { name: "make", label: "Make", type: "text" },
  { name: "model", label: "Model", type: "text" },
  { name: "varient", label: "Varient", type: "text" },
  { name: "startPrice", label: "Start Price", type: "number" },
  { name: "inspectionLink", label: "Inspection Link", type: "text" },
  { name: "image", label: "Image URL", type: "text" },
  { name: "repoDt", label: "Repo Date", type: "text" },
  { name: "reservePrice", label: "Reserve Price", type: "number" },
  { name: "kmReading", label: "KM Reading", type: "number" },
  { name: "ownership", label: "Ownership", type: "number" },
  { name: "YOM", label: "Year Of Manufacture (YOM)", type: "number" },
  { name: "rcStatus", label: "RC Status", type: "text" },
  { name: "quoteIncreament", label: "Quote Increament", type: "number" },
] as const;

export const EDIT_VEHICLE_FIELDS = [
  { name: "regNo", label: "Registration", type: "text", required: true },
  { name: "loanANum", label: "Loan Agreement Number", type: "text", required: true },
  { name: "make", label: "Make", type: "text" },
  { name: "model", label: "Model", type: "text" },
  { name: "varient", label: "Varient", type: "text" },
  { name: "rcStatus", label: "RC Status", type: "text" },
  { name: "yearOfManuFacture", label: "Year Of Manufacture", type: "number" },
  { name: "Ownership", label: "Ownership", type: "number" },
  { name: "quoteInc", label: "Quote Increament", type: "number" },
  { name: "kmReading", label: "KM Reading", type: "number" },
  { name: "startPrice", label: "Start Price", type: "number" },
  { name: "reservePrice", label: "Reserve Price", type: "number" },
  { name: "repoDate", label: "Repo Date", type: "text" },
  { name: "inspectionLink", label: "Inspection Link", type: "text" },
] as const;
