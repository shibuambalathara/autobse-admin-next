import { APP_ROLES, type AppRole } from "@/auth/roles";

interface StatusOption {
  value: string;
  label: string;
}

const STATUS_OPTIONS: Record<
  string,
  Record<string, StatusOption[]>
> = {
  [APP_ROLES.STAFF]: {
    pending: [{ value: "staffApproval", label: "Staff Approval" }],
  },
  [APP_ROLES.ADMIN]: {
    pending: [{ value: "staffApproval", label: "Staff Approval" }],
    staffApproval: [
      { value: "adminApproval", label: "Admin Approval" },
      { value: "declined", label: "Declined" },
    ],
    adminApproval: [
      {
        value: "notFullFilled",
        label: "Not Fullfilled (Buyer Not Interested)",
      },
      { value: "fullFilled", label: "Fullfilled (Success)" },
      { value: "declined", label: "Declined (Seller Denied)" },
    ],
  },
};

export function getVehicleStatusOptions(
  role: AppRole | null | undefined,
  status: string
): StatusOption[] {
  const normalizedRole = role?.toLowerCase() ?? "";
  return STATUS_OPTIONS[normalizedRole]?.[status] ?? [];
}
