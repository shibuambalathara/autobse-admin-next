export interface NetworkErrorWithStatus extends Error {
  statusCode?: number;
}

export interface ApolloErrorContext {
  operationName?: string;
  graphQLErrors?: readonly {
    message: string;
    extensions?: Record<string, unknown>;
  }[];
  networkError?: NetworkErrorWithStatus | Error | null;
}

const AUTH_ERROR_CODES = new Set([
  "UNAUTHENTICATED",
  "FORBIDDEN",
  "JWT_EXPIRED",
  "TOKEN_EXPIRED",
]);

const AUTH_ERROR_MESSAGES = [
  "Unauthorized",
  "Authentication",
  "Token",
  "JWT",
];

/** Unauthenticated mutations where GraphQL errors are shown in the form UI. */
const QUIET_GRAPHQL_OPERATIONS = new Set([
  "Login",
  "SendOtp",
  "VerifyOtp",
  "ResetPassword",
]);

function shouldLogGraphqlError(operationName?: string): boolean {
  return !operationName || !QUIET_GRAPHQL_OPERATIONS.has(operationName);
}

export function isAuthenticationError(
  graphQLErrors?: readonly { message?: string; extensions?: { code?: string } }[],
  networkError?: NetworkErrorWithStatus | Error | null
): boolean {
  const hasGraphQLError = graphQLErrors?.some(
    (error) =>
      AUTH_ERROR_MESSAGES.some((msg) => error.message?.includes(msg)) ||
      AUTH_ERROR_CODES.has(error.extensions?.code ?? "")
  );

  const hasNetworkError = Boolean(
    networkError &&
      (("statusCode" in networkError &&
        (networkError.statusCode === 401 || networkError.statusCode === 403)) ||
        AUTH_ERROR_MESSAGES.some((msg) => networkError.message?.includes(msg)))
  );

  return Boolean(hasGraphQLError || hasNetworkError);
}

export function logApolloError({
  operationName,
  graphQLErrors,
  networkError,
}: ApolloErrorContext): void {
  if (process.env.NODE_ENV === "production") return;

  const label = operationName ?? "anonymous";
  const logGraphqlErrors = shouldLogGraphqlError(operationName);

  if (graphQLErrors?.length && logGraphqlErrors) {
    graphQLErrors.forEach((error) => {
      console.error(`[Apollo:${label}]`, error.message, error.extensions);
    });
  }

  if (networkError) {
    console.error(`[Apollo:${label}] Network error`, networkError);
  }
}
