"use client";

import { Input } from "@/components/ui";
import { FormField } from "@/components/forms";

interface VehicleImageSearchFieldsProps {
  loanAgreementNo: string;
  registrationNumber: string;
  onLoanChange: (value: string) => void;
  onRegChange: (value: string) => void;
}

export function VehicleImageSearchFields({
  loanAgreementNo,
  registrationNumber,
  onLoanChange,
  onRegChange,
}: VehicleImageSearchFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField label="Loan Agreement Number" htmlFor="vehicle-image-loan">
        <Input
          id="vehicle-image-loan"
          value={loanAgreementNo}
          onChange={(e) => onLoanChange(e.target.value.toUpperCase())}
        />
      </FormField>

      <FormField label="Registration Number" htmlFor="vehicle-image-reg">
        <Input
          id="vehicle-image-reg"
          value={registrationNumber}
          onChange={(e) =>
            onRegChange(e.target.value.replace(/\s+/g, "").toUpperCase())
          }
        />
      </FormField>
    </div>
  );
}
