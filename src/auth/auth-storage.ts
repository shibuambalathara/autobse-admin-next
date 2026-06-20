import type { AuthCredentials, AuthUser } from "@/types/auth";

/** Persisted session shape — compatible with legacy zustand persist key. */
export interface PersistedAuthSession {
  token: string | null;
  user: AuthUser | null;
}

const STORAGE_KEY = "autobse-auth";
const STORAGE_VERSION = 0;

interface ZustandPersistEnvelope {
  state: PersistedAuthSession;
  version: number;
}

const EMPTY_SESSION: PersistedAuthSession = {
  token: null,
  user: null,
};

export { EMPTY_SESSION };

type SessionListener = (session: PersistedAuthSession) => void;
const listeners = new Set<SessionListener>();

let memoryCache: PersistedAuthSession | null = null;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function parseEnvelope(raw: string | null): PersistedAuthSession {
  if (!raw) return EMPTY_SESSION;

  try {
    const parsed = JSON.parse(raw) as
      | ZustandPersistEnvelope
      | PersistedAuthSession;

    if ("state" in parsed && parsed.state) {
      return {
        token: parsed.state.token ?? null,
        user: parsed.state.user ?? null,
      };
    }

    return {
      token: (parsed as PersistedAuthSession).token ?? null,
      user: (parsed as PersistedAuthSession).user ?? null,
    };
  } catch {
    return EMPTY_SESSION;
  }
}

function writeEnvelope(session: PersistedAuthSession): void {
  if (!isBrowser()) return;

  const envelope: ZustandPersistEnvelope = {
    state: session,
    version: STORAGE_VERSION,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
  memoryCache = session;
  listeners.forEach((listener) => listener(session));
}

export function subscribeAuthSession(listener: SessionListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getAuthSession(): PersistedAuthSession {
  if (!isBrowser()) return EMPTY_SESSION;
  if (memoryCache) return memoryCache;

  const session = parseEnvelope(localStorage.getItem(STORAGE_KEY));
  memoryCache = session;
  return session;
}

export function getAccessToken(): string | null {
  return getAuthSession().token;
}

export function getAuthUser(): AuthUser | null {
  return getAuthSession().user;
}

export function setAuthSession(credentials: AuthCredentials): void {
  writeEnvelope({
    token: credentials.token,
    user: credentials.user,
  });
}

export function setAccessToken(token: string): void {
  const current = getAuthSession();
  writeEnvelope({ ...current, token });
}

export function updateAuthUser(partial: Partial<AuthUser>): void {
  const current = getAuthSession();
  if (!current.user) return;

  writeEnvelope({
    ...current,
    user: { ...current.user, ...partial },
  });
}

export function clearAuthSession(): void {
  if (isBrowser()) {
    localStorage.removeItem(STORAGE_KEY);
  }
  memoryCache = EMPTY_SESSION;
  listeners.forEach((listener) => listener(EMPTY_SESSION));
}

/** @deprecated Use getAccessToken — kept for Apollo / legacy imports. */
export const getAuthToken = getAccessToken;
