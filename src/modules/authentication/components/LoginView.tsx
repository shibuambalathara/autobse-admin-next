"use client";

import { useState } from "react";
import { AuthLayout } from "@/modules/authentication/components/AuthLayout";
import { AuthTabSwitcher } from "@/modules/authentication/components/AuthTabSwitcher";
import { PasswordLoginForm } from "@/modules/authentication/components/PasswordLoginForm";
import { OtpLoginForm } from "@/modules/authentication/components/OtpLoginForm";
import { AuthRedirectGuard } from "@/modules/authentication/components/AuthRedirectGuard";
import { AUTH_COPY } from "@/modules/authentication/forms/validation";
import type { AuthMethod } from "@/modules/authentication/types";

export function LoginView() {
  const [method, setMethod] = useState<AuthMethod>("password");

  return (
    <AuthRedirectGuard>
      <AuthLayout>
        <div className="mb-6 lg:hidden">
          <p className="text-xl font-bold text-white">
            AUTO<span className="text-[#FF6B00]">BSE</span>
          </p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
            Management Portal
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0B111B]/75 p-7 backdrop-blur-sm sm:p-9">
          <div className="space-y-1.5">
            <h1 className="text-[1.75rem] font-bold leading-tight text-white sm:text-3xl">
              {AUTH_COPY.welcomeTitle}
            </h1>
            <p className="text-sm text-white/45">{AUTH_COPY.welcomeDescription}</p>
          </div>

          <div className="mt-7">
            <AuthTabSwitcher active={method} onChange={setMethod} />
          </div>

          <div className="mt-7 space-y-1">
            <h2 className="text-[15px] font-semibold text-white">
              {method === "password"
                ? AUTH_COPY.passwordTitle
                : AUTH_COPY.otpTitle}
            </h2>
            <p className="text-sm text-white/40">
              {method === "password"
                ? AUTH_COPY.passwordDescription
                : AUTH_COPY.otpDescription}
            </p>
          </div>

          <div className="mt-6" role="tabpanel">
            {method === "password" ? (
              <PasswordLoginForm key="password" />
            ) : (
              <OtpLoginForm key="otp" />
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-white/30 lg:hidden">
          &copy; {new Date().getFullYear()} AUTOBSE. All rights reserved.
        </p>
      </AuthLayout>
    </AuthRedirectGuard>
  );
}
