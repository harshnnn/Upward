import type { AuthResponse, LogoutInput, RefreshInput, SignInInput, SignUpInput } from '@upward/types';

import { apiClient } from '@/shared/lib/http-client';

export const authApi = {
  async signUp(input: SignUpInput): Promise<AuthResponse> {
    const { data } = await apiClient.post('/auth/sign-up', input);
    return data.data;
  },
  async signIn(input: SignInInput): Promise<AuthResponse> {
    const { data } = await apiClient.post('/auth/sign-in', input);
    return data.data;
  },
  async refresh(input: RefreshInput): Promise<AuthResponse> {
    const { data } = await apiClient.post('/auth/refresh', input);
    return data.data;
  },
  async logout(input: LogoutInput): Promise<{ success: true }> {
    const { data } = await apiClient.post('/auth/logout', input);
    return data.data;
  },
  async me(): Promise<{ id: string; email: string; displayName: string | null; role: 'USER' | 'ADMIN' }> {
    const { data } = await apiClient.get('/auth/me');
    return data.data;
  }
};
