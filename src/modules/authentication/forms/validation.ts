import type { RegisterOptions } from "react-hook-form";

export const MOBILE_REGEX = /^[0-9]{10}$/;
export const OTP_REGEX = /^[0-9]{4}$/;

export const digitsOnly = (value: string, maxLength?: number) => {
  let digits = value.replace(/[^0-9]/g, "");
  if (maxLength) digits = digits.slice(0, maxLength);
  return digits;
};

export const mobileValidation = {
  required: "Please enter your mobile number",
  pattern: {
    value: MOBILE_REGEX,
    message: "Please enter a valid 10-digit mobile number",
  },
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = digitsOnly(e.target.value, 10);
  },
} satisfies RegisterOptions;

export const passwordValidation = {
  required: "Please enter your password",
} satisfies RegisterOptions;

export const otpValidation = {
  required: "Please enter the OTP",
  pattern: {
    value: OTP_REGEX,
    message: "Please enter a valid 4-digit OTP",
  },
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = digitsOnly(e.target.value, 4);
  },
} satisfies RegisterOptions;

export const AUTH_COPY = {
  brandName: "AutoBSE",
  tagline: "Vehicle auction platform admin",
  passwordTitle: "Sign in with password",
  passwordDescription: "Use your registered mobile number and password.",
  otpTitle: "Sign in with OTP",
  otpDescription: "We will send a one-time password to your mobile.",
  verifyTitle: "Verify OTP",
  verifyDescription: "Enter the 4-digit code sent to",
} as const;
