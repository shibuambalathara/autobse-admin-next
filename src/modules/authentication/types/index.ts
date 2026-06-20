export type AuthMethod = "password" | "otp";

export type OtpLoginStep = "mobile" | "verify";

export interface LoginUser {
  id: string;
  role: string;
  firstName: string;
}

export interface LoginMutationResult {
  login: {
    user: LoginUser | null;
    access_token: string;
    refresh_token?: string | null;
  };
}

export interface SendOtpMutationResult {
  sendOtp: {
    code?: string | null;
    status?: string | null;
    description?: string | null;
  };
}

export interface VerifyOtpMutationResult {
  verifyOtp: {
    access_token: string;
    user: LoginUser | null;
  };
}

export interface PasswordLoginInput {
  mobile: string;
  password: string;
}

export interface SendOtpInput {
  mobile: string;
}

export interface VerifyOtpInput {
  mobile: string;
  otp: string;
}
