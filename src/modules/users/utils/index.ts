import type { EmdAmountOperator } from "@/modules/users/types";
import type { UserEmdPaymentWhereInput } from "@/modules/users/types";

export function formatStateDisplay(state?: string | null): string {
  if (!state) return "—";
  return state.replace(/_/g, " ");
}

export function buildOpenToken(
  stateCode: string,
  tokenNumber: string | number | undefined,
  existingToken?: string | null
): string | undefined {
  const existingStateCode = existingToken?.slice(0, 2) ?? "";
  const existingNumber = existingToken?.slice(2) ?? "";

  const finalStateCode = stateCode || existingStateCode;
  const finalNumber =
    tokenNumber !== undefined && tokenNumber !== ""
      ? tokenNumber
      : existingNumber;

  if (!finalStateCode || finalNumber === "") return undefined;
  return `${finalStateCode}${String(finalNumber).padStart(4, "0")}`;
}

export function getUpdatedFields<
  TOriginal extends Record<string, unknown>,
  TUpdated extends Record<string, unknown>,
>(
  original: TOriginal,
  updated: TUpdated
): Partial<TUpdated> {
  const result: Partial<TUpdated> = {};

  (Object.keys(updated) as (keyof TUpdated)[]).forEach((key) => {
    const originalValue = original[key as keyof TOriginal];
    const updatedValue = updated[key];

    if (JSON.stringify(originalValue) !== JSON.stringify(updatedValue)) {
      result[key] = updatedValue;
    }
  });

  return result;
}

export function buildEmdExcelWhere(
  operator: EmdAmountOperator,
  amount: number,
  state: string,
  paymentFor = "emd",
  paymentStatus = "approved"
): UserEmdPaymentWhereInput {
  const where: UserEmdPaymentWhereInput = {
    payments: {
      some: {
        amount: { [operator]: amount },
        paymentFor,
        status: paymentStatus,
      },
    },
  };
  if (state) where.state = state;
  return where;
}

export function buildRegistrationExpiryMessage(
  firstName: string | null | undefined,
  expiryDate: string,
  contact: string
): string {
  const name = firstName ? `${firstName} Sir` : "Sir";
  const dateStr = expiryDate;
  return `Dear ${name},

This is a reminder that your registration expiry date is ${dateStr}.

Please renew your registration to avoid service interruption.

For support, please contact ${contact}.

Thank you for choosing our services.`;
}

export { useDebouncedValue, USERS_SEARCH_DEBOUNCE_MS } from "./useDebouncedValue";
export {
  downloadIdentityImage,
  previewIdentityImage,
  sendRegistrationExpiryWhatsapp,
  uploadUserDocuments,
  uploadUserProfileFiles,
} from "./user-api";
export type { AddUserDocumentPayload } from "./user-api";
