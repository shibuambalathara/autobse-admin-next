import type { ReactNode } from "react";
import { AuthBrandPanel } from "@/modules/authentication/components/AuthBrandPanel";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-surface-muted">
      <div className="grid min-h-screen lg:grid-cols-2">
        <AuthBrandPanel />
        <main className="flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8 xl:px-12">
          <div className="w-full max-w-md">{children}</div>
        </main>
      </div>
    </div>
  );
}
