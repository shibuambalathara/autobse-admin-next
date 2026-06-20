"use client";

import { setContext } from "@apollo/client/link/context";
import { getAccessToken } from "@/auth/auth-storage";

export function createAuthLink() {
  return setContext((_, { headers }) => {
    const token = getAccessToken();

    if (!token) {
      return { headers };
    }

    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      },
    };
  });
}
