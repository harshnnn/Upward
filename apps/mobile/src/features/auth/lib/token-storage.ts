import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'upward_access_token';
const REFRESH_TOKEN_KEY = 'upward_refresh_token';

export type StoredTokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

export const tokenStorage = {
  async getTokens(): Promise<StoredTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.getItemAsync(REFRESH_TOKEN_KEY)
    ]);

    return { accessToken, refreshToken };
  },
  async setTokens(tokens: StoredTokens): Promise<void> {
    const tasks: Array<Promise<void>> = [];
    if (tokens.accessToken) {
      tasks.push(SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken));
    } else {
      tasks.push(SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY));
    }
    if (tokens.refreshToken) {
      tasks.push(SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken));
    } else {
      tasks.push(SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY));
    }
    await Promise.all(tasks);
  },
  async clearTokens(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY)
    ]);
  }
};
