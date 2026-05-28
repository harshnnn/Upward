import type { AuthSession, AuthUser } from '@upward/types';

import { useAuthStore } from '../lib/auth-store';

export type MobileAuthState = {
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  user: AuthUser | null;
  session: AuthSession | null;
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
  bootstrap: () => Promise<void>;
  signIn: (input: { email: string; password: string; clientType: 'mobile' }) => Promise<void>;
  signUp: (input: { email: string; password: string; displayName?: string; clientType: 'mobile' }) => Promise<void>;
  refresh: (input?: { clientType?: 'mobile'; refreshToken?: string }) => Promise<string | null>;
  logout: () => Promise<void>;
  clear: () => Promise<void>;
};

type AuthSelector<T> = (state: MobileAuthState) => T;

export function useAuth(): MobileAuthState;
export function useAuth<T>(selector: AuthSelector<T>): T;
export function useAuth<T>(selector?: AuthSelector<T>) {
  if (selector) {
    return useAuthStore(selector);
  }

  return useAuthStore((state) => ({
    status: state.status,
    user: state.user,
    session: state.session,
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
    error: state.error,
    bootstrap: state.bootstrap,
    signIn: state.signIn,
    signUp: state.signUp,
    refresh: state.refresh,
    logout: state.logout,
    clear: state.clear
  }));
};
