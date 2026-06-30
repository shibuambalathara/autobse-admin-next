import type { ReactNode } from "react";
import { LOGIN_VEHICLE_BG } from "@/modules/authentication/constants";
import { AuthBrandPanel } from "@/modules/authentication/components/AuthBrandPanel";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B111B]">
      <div
        aria-hidden
        className="absolute inset-0 z-0 scale-105 bg-cover bg-[center_72%] bg-no-repeat"
        style={{ backgroundImage: `url("${LOGIN_VEHICLE_BG}")` }}
      />
      <div className="absolute inset-0 z-[1] bg-[#0B111B]/35" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#0B111B]/92 via-[#0B111B]/50 to-[#0B111B]/15" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#0B111B]/60 via-transparent to-[#0B111B]/25" />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[minmax(0,46%)_minmax(0,54%)]">
        <AuthBrandPanel />
        <main className="flex items-center justify-center px-4 py-10 sm:px-8 lg:px-12 xl:px-16">
          <div className="w-full max-w-[440px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
