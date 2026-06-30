"use client";

import { useRef, useState } from "react";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { LOGIN_MUTATION } from "@/graphql/documents/auth";
import { useAuth } from "@/auth/use-auth";
import { ROUTES } from "@/constants/routes";
import { env } from "@/config/env";
import { AuthFormField } from "@/modules/authentication/components/AuthFormField";
import { AuthMobileInput } from "@/modules/authentication/components/AuthMobileInput";
import { AuthPasswordInput } from "@/modules/authentication/components/AuthPasswordInput";
import { AuthSubmitButton } from "@/modules/authentication/components/AuthSubmitButton";
import { extractGraphqlError, getGraphqlResultErrorMessage } from "@/lib/graphql-errors";
import { mapLoginUserToAuthUser } from "@/modules/authentication/utils/map-auth-user";
import { getPostLoginRoute } from "@/auth/default-route";
import {
  mobileValidation,
  passwordValidation,
} from "@/modules/authentication/forms/validation";
import { TurnstileCaptcha } from "@/modules/authentication/components/TurnstileCaptcha";
import type {
  LoginMutationResult,
  PasswordLoginInput,
} from "@/modules/authentication/types";

export function PasswordLoginForm() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [login, { loading }] = useMutation<LoginMutationResult>(LOGIN_MUTATION);

  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const pendingDataRef = useRef<PasswordLoginInput | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordLoginInput>();

  const resetCaptchaFlow = () => {
    setShowCaptcha(false);
    pendingDataRef.current = null;
    setIsVerifying(false);
    turnstileRef.current?.reset();
  };

  const submitWithCaptcha = async (
    token: string,
    credentials: PasswordLoginInput
  ) => {
    try {
      const result = await login({
        variables: {
          loginInput: {
            mobile: credentials.mobile,
            password: credentials.password,
            turnstileToken: token,
          },
        },
      });

      const graphqlError = getGraphqlResultErrorMessage(result);
      if (graphqlError) {
        setFormError(graphqlError);
        return;
      }

      const accessToken = result.data?.login?.access_token;
      const user = mapLoginUserToAuthUser(result.data?.login?.user ?? null);

      if (!accessToken) {
        setFormError("Login failed. No access token received.");
        return;
      }

      if (!user) {
        setFormError("Login failed. User profile could not be loaded.");
        return;
      }

      setSession({ token: accessToken, user });
      router.replace(getPostLoginRoute(user.role));
    } catch (error: unknown) {
      setFormError(extractGraphqlError(error).message);
    } finally {
      resetCaptchaFlow();
    }
  };

  const onSubmit = (data: PasswordLoginInput) => {
    setFormError(null);
    setIsVerifying(true);
    pendingDataRef.current = data;

    if (!env.turnstileSiteKey && env.isDev) {
      void submitWithCaptcha("dev-bypass-token", data);
      return;
    }

    if (!env.turnstileSiteKey) {
      setFormError(
        "Captcha is not configured. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY."
      );
      setIsVerifying(false);
      pendingDataRef.current = null;
      return;
    }

    setShowCaptcha(true);
  };

  const handleCaptchaSuccess = (token: string) => {
    const credentials = pendingDataRef.current;
    if (!credentials) {
      setFormError("Session expired. Please try signing in again.");
      resetCaptchaFlow();
      return;
    }
    void submitWithCaptcha(token, credentials);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <AuthFormField
        label="Mobile Number"
        htmlFor="password-login-mobile"
        required
        error={errors.mobile?.message}
      >
        <AuthMobileInput
          id="password-login-mobile"
          autoComplete="tel"
          placeholder="Enter 10-digit mobile number"
          error={Boolean(errors.mobile)}
          {...register("mobile", mobileValidation)}
        />
      </AuthFormField>

      <AuthFormField
        label="Password"
        htmlFor="password-login-password"
        required
        error={errors.password?.message}
      >
        <AuthPasswordInput
          id="password-login-password"
          autoComplete="current-password"
          placeholder="Enter your password"
          error={Boolean(errors.password)}
          {...register("password", passwordValidation)}
        />
      </AuthFormField>

      <div className="flex justify-end">
        <Link
          href={ROUTES.accountRecovery}
          className="text-sm font-medium text-[#FF6B00] transition-colors hover:text-[#ff8534]"
        >
          Forgot password?
        </Link>
      </div>

      {showCaptcha && (
        <TurnstileCaptcha
          ref={turnstileRef}
          action="password-login"
          onSuccess={handleCaptchaSuccess}
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
        isLoading={isVerifying || loading}
        loadingText={isVerifying ? "Verifying…" : "Signing in…"}
      >
        Sign in
      </AuthSubmitButton>
    </form>
  );
}
