"use client";

import { useRef, useState } from "react";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import {
  SEND_OTP_MUTATION,
  VERIFY_OTP_MUTATION,
} from "@/graphql/documents/auth";
import { useAuth } from "@/auth/use-auth";
import { ROUTES } from "@/constants/routes";
import { env } from "@/config/env";
import { AuthFormField } from "@/modules/authentication/components/AuthFormField";
import { AuthMobileInput } from "@/modules/authentication/components/AuthMobileInput";
import { AuthTextInput } from "@/modules/authentication/components/AuthTextInput";
import { AuthSubmitButton } from "@/modules/authentication/components/AuthSubmitButton";
import { extractGraphqlError, getGraphqlResultErrorMessage } from "@/lib/graphql-errors";
import { mapLoginUserToAuthUser } from "@/modules/authentication/utils/map-auth-user";
import { getPostLoginRoute } from "@/auth/default-route";
import {
  AUTH_COPY,
  mobileValidation,
  otpValidation,
} from "@/modules/authentication/forms/validation";
import { TurnstileCaptcha } from "@/modules/authentication/components/TurnstileCaptcha";
import type {
  SendOtpInput,
  SendOtpMutationResult,
  VerifyOtpMutationResult,
} from "@/modules/authentication/types";

export function OtpLoginForm() {
  const router = useRouter();
  const { setSession } = useAuth();

  const [step, setStep] = useState<"mobile" | "verify">("mobile");
  const [mobile, setMobile] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const [sendOtp, { loading: sendingOtp }] =
    useMutation<SendOtpMutationResult>(SEND_OTP_MUTATION);
  const [verifyOtp, { loading: verifyingOtp }] =
    useMutation<VerifyOtpMutationResult>(VERIFY_OTP_MUTATION);

  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const pendingMobileRef = useRef<string | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const mobileForm = useForm<SendOtpInput>();
  const verifyForm = useForm<{ otp: string }>();

  const resetCaptchaFlow = () => {
    setShowCaptcha(false);
    pendingMobileRef.current = null;
    setIsVerifying(false);
    turnstileRef.current?.reset();
  };

  const sendOtpWithCaptcha = async (token: string, mobileNumber: string) => {
    try {
      const result = await sendOtp({
        variables: {
          sendOtpDto: {
            mobile: mobileNumber,
            forSignin: true,
            turnstileToken: token,
          },
        },
      });

      const graphqlError = getGraphqlResultErrorMessage(result);
      if (graphqlError) {
        setFormError(graphqlError);
        return;
      }

      setMobile(mobileNumber);
      setStep("verify");
      setFormError(null);
    } catch (error: unknown) {
      setFormError(extractGraphqlError(error).message);
    } finally {
      resetCaptchaFlow();
    }
  };

  const onSendOtp = (data: SendOtpInput) => {
    setFormError(null);
    setIsVerifying(true);
    pendingMobileRef.current = data.mobile;

    if (!env.turnstileSiteKey && env.isDev) {
      void sendOtpWithCaptcha("dev-bypass-token", data.mobile);
      return;
    }

    if (!env.turnstileSiteKey) {
      setFormError(
        "Captcha is not configured. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY."
      );
      setIsVerifying(false);
      pendingMobileRef.current = null;
      return;
    }

    setShowCaptcha(true);
  };

  const onVerifyOtp = async (data: { otp: string }) => {
    setFormError(null);

    try {
      const result = await verifyOtp({
        variables: {
          verfiyOtpDto: {
            mobile,
            otp: data.otp,
          },
        },
      });

      const graphqlError = getGraphqlResultErrorMessage(result);
      if (graphqlError) {
        setFormError(graphqlError);
        return;
      }

      const accessToken = result.data?.verifyOtp?.access_token;
      const user = mapLoginUserToAuthUser(
        result.data?.verifyOtp?.user ?? null
      );

      if (!accessToken) {
        setFormError("Verification failed. No access token received.");
        return;
      }

      if (!user) {
        setFormError("Verification failed. User profile could not be loaded.");
        return;
      }

      setSession({ token: accessToken, user });
      router.replace(getPostLoginRoute(user.role));
    } catch (error: unknown) {
      setFormError(extractGraphqlError(error).message);
    }
  };

  if (step === "verify") {
    return (
      <div className="space-y-5">
        <button
          type="button"
          onClick={() => {
            setStep("mobile");
            setFormError(null);
          }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#FF6B00] transition-colors hover:text-[#ff8534]"
        >
          <ArrowLeft className="h-4 w-4" />
          Change mobile number
        </button>

        <div className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3">
          <h2 className="text-sm font-semibold text-white">
            {AUTH_COPY.verifyTitle}
          </h2>
          <p className="mt-1 text-sm text-white/50">
            {AUTH_COPY.verifyDescription}{" "}
            <span className="font-medium text-white">+91 {mobile}</span>
          </p>
        </div>

        <form
          onSubmit={verifyForm.handleSubmit(onVerifyOtp)}
          className="space-y-5"
        >
          <AuthFormField
            label="One-time password"
            htmlFor="otp-code"
            required
            error={verifyForm.formState.errors.otp?.message}
          >
            <AuthTextInput
              id="otp-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="4-digit OTP"
              className="tracking-[0.35em]"
              error={Boolean(verifyForm.formState.errors.otp)}
              {...verifyForm.register("otp", otpValidation)}
            />
          </AuthFormField>

          {formError && (
            <p
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
              role="alert"
            >
              {formError}
            </p>
          )}

          <AuthSubmitButton isLoading={verifyingOtp} loadingText="Verifying…">
            Verify &amp; sign in
          </AuthSubmitButton>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={mobileForm.handleSubmit(onSendOtp)} className="space-y-5">
      <AuthFormField
        label="Mobile Number"
        htmlFor="otp-login-mobile"
        required
        error={mobileForm.formState.errors.mobile?.message}
      >
        <AuthMobileInput
          id="otp-login-mobile"
          autoComplete="tel"
          placeholder="Enter 10-digit mobile number"
          error={Boolean(mobileForm.formState.errors.mobile)}
          {...mobileForm.register("mobile", mobileValidation)}
        />
      </AuthFormField>

      {showCaptcha && (
        <TurnstileCaptcha
          ref={turnstileRef}
          action="otp-login"
          onSuccess={(token) => {
            const mobileNumber = pendingMobileRef.current;
            if (!mobileNumber) {
              setFormError("Session expired. Please try again.");
              resetCaptchaFlow();
              return;
            }
            void sendOtpWithCaptcha(token, mobileNumber);
          }}
          onExpire={resetCaptchaFlow}
          onError={() => {
            setFormError(
              "Security check failed. Refresh the page and try again, or disable ad blockers."
            );
            resetCaptchaFlow();
          }}
        />
      )}

      {formError && (
        <p
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
          role="alert"
        >
          {formError}
        </p>
      )}

      <AuthSubmitButton
        isLoading={isVerifying || sendingOtp}
        loadingText={isVerifying ? "Verifying…" : "Sending OTP…"}
      >
        Send OTP
      </AuthSubmitButton>
    </form>
  );
}
