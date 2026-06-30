"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui";
import { AuthLayout } from "@/modules/authentication/components/AuthLayout";
import { AuthTabSwitcher } from "@/modules/authentication/components/AuthTabSwitcher";
import { PasswordLoginForm } from "@/modules/authentication/components/PasswordLoginForm";
import { OtpLoginForm } from "@/modules/authentication/components/OtpLoginForm";
import { AuthRedirectGuard } from "@/modules/authentication/components/AuthRedirectGuard";
import {
  AUTH_COPY,
} from "@/modules/authentication/forms/validation";
import type { AuthMethod } from "@/modules/authentication/types";

export function LoginView() {
  const [method, setMethod] = useState<AuthMethod>("password");

  return (
    <AuthRedirectGuard>
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
            <div className="space-y-1 text-center lg:text-left">
              <h2 className="text-xl font-semibold text-brand-900 sm:text-2xl">
                Welcome back
              </h2>
              <p className="text-sm text-brand-500">
                Sign in to access the auction management portal
              </p>
            </div>

            <AuthTabSwitcher active={method} onChange={setMethod} />

            <div className="space-y-1">
              <h3 className="text-sm font-medium text-brand-800">
                {method === "password"
                  ? AUTH_COPY.passwordTitle
                  : AUTH_COPY.otpTitle}
              </h3>
              <p className="text-xs text-brand-500 sm:text-sm">
                {method === "password"
                  ? AUTH_COPY.passwordDescription
                  : AUTH_COPY.otpDescription}
              </p>
            </div>

            <div role="tabpanel">
              {method === "password" ? (
                <PasswordLoginForm key="password" />
              ) : (
                <OtpLoginForm key="otp" />
              )}
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-brand-400 lg:hidden">
          &copy; {new Date().getFullYear()} AUTOBSe. All rights reserved.
        </p>
      </AuthLayout>
    </AuthRedirectGuard>
  );
}
