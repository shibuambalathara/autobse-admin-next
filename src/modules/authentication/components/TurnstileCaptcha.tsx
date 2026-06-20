"use client";

import { forwardRef } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { env } from "@/config/env";

interface TurnstileCaptchaProps {
  onSuccess: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
}

export const TurnstileCaptcha = forwardRef<
  TurnstileInstance | undefined,
  TurnstileCaptchaProps
>(function TurnstileCaptcha({ onSuccess, onExpire, onError }, ref) {
  if (!env.turnstileSiteKey) {
    if (env.isDev) {
      return (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Turnstile is not configured. Set{" "}
          <code className="font-mono">NEXT_PUBLIC_TURNSTILE_SITE_KEY</code> in
          production.
        </p>
      );
    }
    return null;
  }

  return (
    <div className="flex justify-center">
      <Turnstile
        ref={ref}
        siteKey={env.turnstileSiteKey}
        onSuccess={onSuccess}
        onExpire={onExpire}
        onError={onError}
        options={{ theme: "light", size: "flexible" }}
      />
    </div>
  );
});
