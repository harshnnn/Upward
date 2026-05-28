import { create } from 'zustand';

import type { AuthResponse, AuthSession, AuthUser, RefreshInput, SignInInput, SignUpInput } from '@upward/types';

import { authApi } from './auth-api';
import { setAccessTokenProvider, setRefreshHandler } from '../../../shared/lib/http-client';
import { tokenStorage } from './token-storage';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

type AuthState = {
  status: AuthStatus;
  user: AuthUser | null;
  session: AuthSession | null;
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
  bootstrap: () => Promise<void>;
  signIn: (input: SignInInput) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  refresh: (input?: Partial<RefreshInput>) => Promise<string | null>;
  logout: () => Promise<void>;
  setAuthResponse: (response: AuthResponse) => Promise<void>;
  clear: () => Promise<void>;
};

const applyAuthResponse = async (set: (partial: Partial<AuthState>) => void, response: AuthResponse): Promise<void> => {
  set({
    status: 'authenticated',
    user: response.user,
    session: response.session,
    accessToken: response.tokens.accessToken,
    refreshToken: response.tokens.refreshToken ?? null,
    error: null
  });
  await tokenStorage.setTokens({
    accessToken: response.tokens.accessToken,
    refreshToken: response.tokens.refreshToken ?? null
  });
};

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'idle',
  user: null,
  session: null,
  accessToken: null,
  refreshToken: null,
  error: null,
  bootstrap: async () => {
    set({ status: 'loading' });
    const storedTokens = await tokenStorage.getTokens();
    if (!storedTokens.refreshToken) {
      set({ status: 'unauthenticated' });
      return;
    }

    try {
      const response = await authApi.refresh({ clientType: 'mobile', refreshToken: storedTokens.refreshToken });
      await applyAuthResponse(set, response);
    } catch {
      await tokenStorage.clearTokens();
      set({ status: 'unauthenticated', user: null, session: null, accessToken: null, refreshToken: null });
    }
  },
  signIn: async (input) => {
    set({ status: 'loading', error: null });
    const response = await authApi.signIn({ ...input, clientType: 'mobile' });
    await applyAuthResponse(set, response);
  },
  signUp: async (input) => {
    set({ status: 'loading', error: null });
    const response = await authApi.signUp({ ...input, clientType: 'mobile' });
    await applyAuthResponse(set, response);
  },
  refresh: async (input) => {
    const currentRefreshToken = input?.refreshToken ?? get().refreshToken ?? (await tokenStorage.getTokens()).refreshToken;
    if (!currentRefreshToken) {
      set({ status: 'unauthenticated' });
      return null;
    }

    const response = await authApi.refresh({ clientType: 'mobile', refreshToken: currentRefreshToken });
    await applyAuthResponse(set, response);
    return response.tokens.accessToken;
  },
  logout: async () => {
    const state = get();
    if (state.session) {
      await authApi.logout({
        sessionId: state.session.id,
        clientType: 'mobile',
        refreshToken: state.refreshToken ?? undefined
      });
    }
    await tokenStorage.clearTokens();
    set({ status: 'unauthenticated', user: null, session: null, accessToken: null, refreshToken: null, error: null });
  },
  setAuthResponse: async (response) => {
    await applyAuthResponse(set, response);
  },
  clear: async () => {
    await tokenStorage.clearTokens();
    set({ status: 'unauthenticated', user: null, session: null, accessToken: null, refreshToken: null, error: null });
  }
}));

setAccessTokenProvider(() => useAuthStore.getState().accessToken);
setRefreshHandler(async () => {
  try {
    const refreshToken = useAuthStore.getState().refreshToken ?? (await tokenStorage.getTokens()).refreshToken;
    if (!refreshToken) {
      return null;
    }

    const response = await authApi.refresh({ clientType: 'mobile', refreshToken });
    await useAuthStore.getState().setAuthResponse(response);
    return response.tokens.accessToken;
  } catch {
    await useAuthStore.getState().clear();
    return null;
  }
});
