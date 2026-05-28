import { create } from 'zustand';

import type { AuthResponse, AuthSession, AuthUser, RefreshInput, SignInInput, SignUpInput } from '@upward/types';

import { authApi } from './auth-api';
import { setAccessTokenProvider, setRefreshHandler } from '@/shared/lib/http-client';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

type AuthState = {
  status: AuthStatus;
  user: AuthUser | null;
  session: AuthSession | null;
  accessToken: string | null;
  error: string | null;
  bootstrap: () => Promise<void>;
  signIn: (input: SignInInput) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  refresh: (input?: Partial<RefreshInput>) => Promise<string | null>;
  logout: () => Promise<void>;
  setAuthResponse: (response: AuthResponse) => void;
  clear: () => void;
};

const applyAuthResponse = (set: (partial: Partial<AuthState>) => void, response: AuthResponse): void => {
  set({
    status: 'authenticated',
    user: response.user,
    session: response.session,
    accessToken: response.tokens.accessToken,
    error: null
  });
};

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'idle',
  user: null,
  session: null,
  accessToken: null,
  error: null,
  bootstrap: async () => {
    set({ status: 'loading' });
    try {
      const response = await authApi.refresh({ clientType: 'web' });
      applyAuthResponse(set, response);
    } catch {
      set({ status: 'unauthenticated', user: null, session: null, accessToken: null });
    }
  },
  signIn: async (input) => {
    set({ status: 'loading', error: null });
    const response = await authApi.signIn(input);
    applyAuthResponse(set, response);
  },
  signUp: async (input) => {
    set({ status: 'loading', error: null });
    const response = await authApi.signUp(input);
    applyAuthResponse(set, response);
  },
  refresh: async (input) => {
    const response = await authApi.refresh({
      ...input,
      clientType: 'web'
    });
    applyAuthResponse(set, response);
    return response.tokens.accessToken;
  },
  logout: async () => {
    const state = get();
    if (state.session) {
      await authApi.logout({ sessionId: state.session.id, clientType: 'web' });
    }
    set({ status: 'unauthenticated', user: null, session: null, accessToken: null, error: null });
  },
  setAuthResponse: (response) => applyAuthResponse(set, response),
  clear: () => set({ status: 'unauthenticated', user: null, session: null, accessToken: null, error: null })
}));

setAccessTokenProvider(() => useAuthStore.getState().accessToken);
setRefreshHandler(async () => {
  try {
    const response = await authApi.refresh({ clientType: 'web' });
    useAuthStore.getState().setAuthResponse(response);
    return response.tokens.accessToken;
  } catch {
    useAuthStore.getState().clear();
    return null;
  }
});
