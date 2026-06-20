"use client";

import { AuthProvider } from "@/auth/auth-provider";
import { ApolloProviderWrapper } from "@/providers";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
    </AuthProvider>
  );
}
