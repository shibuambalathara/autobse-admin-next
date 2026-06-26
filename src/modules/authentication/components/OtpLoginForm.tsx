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
import { Button, Input } from "@/components/ui";
import { FormField } from "@/components/forms";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { mapLoginUserToAuthUser } from "@/modules/authentication/utils/map-auth-user";
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
      await sendOtp({
        variables: {
          sendOtpDto: {
            mobile: mobileNumber,
            forSignin: true,
            turnstileToken: token,
          },
        },
      });
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
      router.replace(ROUTES.dashboard);
    } catch (error: unknown) {
      setFormError(extractGraphqlError(error).message);
    }
  };

  if (step === "verify") {
    return (
      <div className="space-y-5">
        <div>
          <button
            type="button"
            onClick={() => {
              setStep("mobile");
              setFormError(null);
            }}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Change mobile number
          </button>
          <h2 className="text-lg font-semibold text-brand-900">
            {AUTH_COPY.verifyTitle}
          </h2>
          <p className="mt-1 text-sm text-brand-500">
            {AUTH_COPY.verifyDescription}{" "}
            <span className="font-medium text-brand-800">+91 {mobile}</span>
          </p>
        </div>

        <form
          onSubmit={verifyForm.handleSubmit(onVerifyOtp)}
          className="space-y-5"
        >
          <FormField
            label="One-time password"
            htmlFor="otp-code"
            required
            error={verifyForm.formState.errors.otp?.message}
          >
            <Input
              id="otp-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="4-digit OTP"
              className="tracking-[0.3em]"
              {...verifyForm.register("otp", otpValidation)}
            />
          </FormField>

          {formError && (
            <p
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              role="alert"
            >
              {formError}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={verifyingOtp}
            loadingText="Verifying…"
          >
            Verify &amp; sign in
          </Button>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={mobileForm.handleSubmit(onSendOtp)} className="space-y-5">
      <FormField
        label="Mobile number"
        htmlFor="otp-login-mobile"
        required
        error={mobileForm.formState.errors.mobile?.message}
      >
        <Input
          id="otp-login-mobile"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="10-digit mobile number"
          {...mobileForm.register("mobile", mobileValidation)}
        />
      </FormField>

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
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {formError}
        </p>
      )}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        isLoading={isVerifying || sendingOtp}
        loadingText={isVerifying ? "Verifying…" : "Sending OTP…"}
      >
        Send OTP
      </Button>
    </form>
  );
}
