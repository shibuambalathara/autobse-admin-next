"use client";

import { ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { Observable } from "@apollo/client/utilities";
import {
  isAuthenticationError,
  logApolloError,
  type NetworkErrorWithStatus,
} from "@/lib/apollo/errors";
import { refreshAccessToken } from "@/lib/apollo/refresh-token";

export function createErrorLink(): ApolloLink {
  return onError(({ graphQLErrors, networkError, operation, forward }) => {
    logApolloError({
      operationName: operation.operationName,
      graphQLErrors,
      networkError: networkError as NetworkErrorWithStatus | null,
    });

    if (
      !isAuthenticationError(
        graphQLErrors,
        networkError as NetworkErrorWithStatus | null
      )
    ) {
      return;
    }

    return new Observable((observer) => {
      refreshAccessToken()
        .then((newToken) => {
          const oldHeaders = operation.getContext().headers;
          operation.setContext({
            headers: {
              ...oldHeaders,
              authorization: `Bearer ${newToken}`,
            },
          });
          forward(operation).subscribe(observer);
        })
        .catch(() => observer.complete());
    });
  });
}
