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
import { Button, Input } from "@/components/ui";
import { FormField } from "@/components/forms";
import { extractGraphqlError } from "@/lib/graphql-errors";
import { mapLoginUserToAuthUser } from "@/modules/authentication/utils/map-auth-user";
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
      router.replace(ROUTES.dashboard);
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
      <FormField
        label="Mobile number"
        htmlFor="password-login-mobile"
        required
        error={errors.mobile?.message}
      >
        <Input
          id="password-login-mobile"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="10-digit mobile number"
          {...register("mobile", mobileValidation)}
        />
      </FormField>

      <FormField
        label="Password"
        htmlFor="password-login-password"
        required
        error={errors.password?.message}
      >
        <Input
          id="password-login-password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          {...register("password", passwordValidation)}
        />
      </FormField>

      <div className="flex items-center justify-between text-sm">
        <Link
          href={ROUTES.accountRecovery}
          className="font-medium text-brand-600 transition-colors hover:text-brand-800"
        >
          Forgot password?
        </Link>
      </div>

      {showCaptcha && (
        <TurnstileCaptcha
          ref={turnstileRef}
          onSuccess={handleCaptchaSuccess}
          onExpire={resetCaptchaFlow}
          onError={resetCaptchaFlow}
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
        isLoading={isVerifying || loading}
        loadingText={isVerifying ? "Verifying…" : "Signing in…"}
      >
        Sign in
      </Button>
    </form>
  );
}
