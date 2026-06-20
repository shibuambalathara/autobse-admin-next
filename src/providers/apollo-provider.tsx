"use client";

import { ApolloProvider } from "@apollo/client";
import { useMemo } from "react";
import { assertEnvConfigured } from "@/config/env";
import { getApolloClient } from "@/lib/apollo-client";

assertEnvConfigured();

export function ApolloProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = useMemo(() => getApolloClient(), []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
