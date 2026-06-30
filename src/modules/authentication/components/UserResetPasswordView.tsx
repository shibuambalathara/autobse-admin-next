"use client";

import { useRef, useState } from "react";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { RESET_PASSWORD_MUTATION } from "@/graphql/documents/auth";
import { useAuth } from "@/auth/use-auth";
import { getPostLoginRoute } from "@/auth/default-route";
import { env } from "@/config/env";
import { Button, Card, CardContent, Input } from "@/components/ui";
import { FormField } from "@/components/forms";
import { extractGraphqlError, getGraphqlResultErrorMessage } from "@/lib/graphql-errors";
import {
  AUTH_COPY,
  confirmPasswordValidation,
  passwordValidation,
} from "@/modules/authentication/forms/validation";
import { AuthLayout } from "@/modules/authentication/components/AuthLayout";
import { RequireAuthGuard } from "@/modules/authentication/components/RequireAuthGuard";
import { TurnstileCaptcha } from "@/modules/authentication/components/TurnstileCaptcha";
import type {
  ResetPasswordInput,
  ResetPasswordMutationResult,
} from "@/modules/authentication/types";

export function UserResetPasswordView() {
  const router = useRouter();
  const { user } = useAuth();
  const [resetPassword, { loading }] =
    useMutation<ResetPasswordMutationResult>(RESET_PASSWORD_MUTATION);

  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const pendingPasswordRef = useRef<string | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>();

  const resetCaptchaFlow = () => {
    setShowCaptcha(false);
    pendingPasswordRef.current = null;
    setIsVerifying(false);
    turnstileRef.current?.reset();
  };

  const submitReset = async (password: string) => {
    try {
      const result = await resetPassword({
        variables: {
          data: { password },
        },
      });

      const graphqlError = getGraphqlResultErrorMessage(result);
      if (graphqlError) {
        setFormError(graphqlError);
        return;
      }

      if (!result.data?.resetUserPassword?.id) {
        setFormError("Password reset failed. Please try again.");
        return;
      }

      router.replace(getPostLoginRoute(user?.role));
    } catch (error: unknown) {
      setFormError(extractGraphqlError(error).message);
    } finally {
      resetCaptchaFlow();
    }
  };

  const onSubmit = (data: ResetPasswordInput) => {
    setFormError(null);
    setIsVerifying(true);
    pendingPasswordRef.current = data.password;

    if (!env.turnstileSiteKey && env.isDev) {
      void submitReset(data.password);
      return;
    }

    if (!env.turnstileSiteKey) {
      setFormError(
        "Captcha is not configured. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY."
      );
      setIsVerifying(false);
      pendingPasswordRef.current = null;
      return;
    }

    setShowCaptcha(true);
  };

  const handleCaptchaSuccess = (token: string) => {
    void token;
    const password = pendingPasswordRef.current;
    if (!password) {
      setFormError("Session expired. Please try again.");
      resetCaptchaFlow();
      return;
    }
    void submitReset(password);
  };

  return (
    <RequireAuthGuard>
      <AuthLayout>
        <div className="mb-8 lg:hidden">
          <h1 className="text-center text-3xl font-bold text-brand-900">
            AUTO<span className="text-orange-500">BSe</span>
          </h1>
          <p className="mt-2 text-center text-sm text-brand-500">
            {AUTH_COPY.tagline}
          </p>
        </div>

        <Card className="border-surface-border shadow-card">
          <CardContent className="space-y-6 p-6 sm:p-8">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-brand-900 sm:text-2xl">
                {AUTH_COPY.resetPasswordTitle}
              </h2>
              <p className="text-sm text-brand-500">
                {AUTH_COPY.resetPasswordDescription}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                label="New password"
                htmlFor="reset-password"
                required
                error={errors.password?.message}
              >
                <Input
                  id="reset-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  {...register("password", passwordValidation)}
                />
              </FormField>

              <FormField
                label="Confirm password"
                htmlFor="reset-password-confirm"
                required
                error={errors.confirmPassword?.message}
              >
                <Input
                  id="reset-password-confirm"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm new password"
                  {...register(
                    "confirmPassword",
                    confirmPasswordValidation("password")
                  )}
                />
              </FormField>

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
                loadingText={isVerifying ? "Verifying…" : "Resetting…"}
              >
                Reset password
              </Button>
            </form>
          </CardContent>
        </Card>
      </AuthLayout>
    </RequireAuthGuard>
  );
}
