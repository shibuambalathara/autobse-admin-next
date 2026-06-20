"use client";

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  from,
  split,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient as createWsClient } from "graphql-ws";
import { graphqlEnv } from "@/config/env";
import { getAccessToken } from "@/auth/auth-storage";
import { createAuthLink } from "@/lib/apollo/auth-link";
import { createErrorLink } from "@/lib/apollo/error-link";
import { refreshAccessToken } from "@/lib/apollo/refresh-token";

function createHttpLink(): HttpLink {
  return new HttpLink({
    uri: graphqlEnv.httpUri,
    credentials: graphqlEnv.credentials,
  });
}

function createWsLink(): GraphQLWsLink | null {
  if (!graphqlEnv.wsUri) return null;

  return new GraphQLWsLink(
    createWsClient({
      url: graphqlEnv.wsUri,
      connectionParams: async () => {
        let token = getAccessToken();

        if (!token) {
          try {
            token = await refreshAccessToken();
          } catch {
            return { authorization: "" };
          }
        }

        return { authorization: token ? `Bearer ${token}` : "" };
      },
    })
  );
}

function createApolloLink() {
  const httpAuthLink = from([
    createErrorLink(),
    createAuthLink(),
    createHttpLink(),
  ]);

  const wsLink = createWsLink();

  if (!wsLink) return httpAuthLink;

  return split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpAuthLink
  );
}

let apolloClient: ApolloClient<object> | null = null;

export function getApolloClient(): ApolloClient<object> {
  if (apolloClient) return apolloClient;

  apolloClient = new ApolloClient({
    link: createApolloLink(),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        errorPolicy: "all",
        fetchPolicy: "cache-and-network",
      },
      query: { errorPolicy: "all" },
      mutate: { errorPolicy: "all" },
    },
  });

  return apolloClient;
}

export function resetApolloClient(): void {
  apolloClient = null;
}
