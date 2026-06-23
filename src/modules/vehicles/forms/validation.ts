export const addVehicleValidation = {
  registrationNumber: { required: "Registration number is required" },
  loanAgreementNo: { required: "Loan agreement number is required" },
} as const;

export const editVehicleValidation = {
  regNo: { required: "Registration number is required" },
  loanANum: { required: "Loan agreement number is required" },
} as const;
