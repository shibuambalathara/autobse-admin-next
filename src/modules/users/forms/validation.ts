import type { RegisterOptions } from "react-hook-form";
import type { EditUserFormValues, SelectOption } from "@/modules/users/types";

export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export const lettersOnly = (value: string) =>
  value.replace(/[^A-Za-z ]/g, "");

export const digitsOnly = (value: string, maxLength?: number) => {
  let digits = value.replace(/[^0-9]/g, "");
  if (maxLength) digits = digits.slice(0, maxLength);
  return digits;
};

export const addUserValidation = {
  firstName: {
    required: "First Name is required",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = lettersOnly(e.target.value);
    },
  } satisfies RegisterOptions,
  lastName: {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = lettersOnly(e.target.value);
    },
  } satisfies RegisterOptions,
  mobile: {
    required: "Mobile number is required",
    minLength: { value: 10, message: "Mobile must be 10 digits" },
    maxLength: { value: 10, message: "Mobile must be 10 digits" },
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = digitsOnly(e.target.value, 10);
    },
  } satisfies RegisterOptions,
  pancardNo: {
    required: "Pancard number is required",
    pattern: {
      value: PAN_REGEX,
      message: "Enter a valid PAN number",
    },
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = e.target.value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 10);
    },
  } satisfies RegisterOptions,
  state: {
    required: "State is required",
  } satisfies RegisterOptions,
  idNumber: {
    minLength: { value: 12, message: "ID must be at least 12 characters" },
  } satisfies RegisterOptions,
  pancardImage: {
    required: "Pancard image is required",
    validate: (files: FileList | undefined) => {
      if (!files?.[0]) return "Pancard image is required";
      if (files[0].size > 1 * 1024 * 1024) {
        return "File size must not exceed 1 MB";
      }
      return true;
    },
  } satisfies RegisterOptions,
  optionalImage: {
    validate: (files: FileList | undefined) => {
      if (files?.[0] && files[0].size > 1 * 1024 * 1024) {
        return "File size must not exceed 1 MB";
      }
      return true;
    },
  } satisfies RegisterOptions,
} as const;

export const editUserValidation = {
  firstName: {
    required: "First Name is required",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = lettersOnly(e.target.value);
    },
  } satisfies RegisterOptions,
  lastName: {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = lettersOnly(e.target.value);
    },
  } satisfies RegisterOptions,
  mobile: {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = digitsOnly(e.target.value, 10);
    },
  } satisfies RegisterOptions,
  idProofNo: {
    pattern: {
      value: /^[0-9]{12}$/,
      message: "Please enter a valid 12-digit number",
    },
  } satisfies RegisterOptions,
  state: {
    required: "State is required",
  } satisfies RegisterOptions,
  pancardNo: {
    required: "Pancard number is required",
    pattern: {
      value: PAN_REGEX,
      message: "Enter a valid PAN number",
    },
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      e.target.value = e.target.value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 10);
    },
  } satisfies RegisterOptions,
  openTokenNumber: {
    pattern: {
      value: /^[0-9]{1,6}$/,
      message: "Enter numbers only",
    },
  } satisfies RegisterOptions,
  states: {
    validate: (value: SelectOption[] | undefined) =>
      (value && value.length > 0) || "At least one state must be selected",
  } satisfies RegisterOptions<EditUserFormValues, "states">,
} as const;
