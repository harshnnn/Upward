export type AuthProvider = 'PASSWORD' | 'GOOGLE' | 'APPLE' | 'GITHUB';

export type UserRole = 'USER' | 'ADMIN';

export type AuthClientType = 'web' | 'mobile';

export type AuthUser = {
  id: string;
  email: string;
  displayName: string | null;
  role: UserRole;
  emailVerifiedAt: string | null;
};

export type AuthSession = {
  id: string;
  deviceId: string | null;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  expiresAt: string;
  lastSeenAt: string | null;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
  expiresInSeconds: number;
};

export type AuthResponse = {
  user: AuthUser;
  session: AuthSession;
  tokens: AuthTokens;
};

export type SignUpInput = {
  email: string;
  password: string;
  displayName?: string;
  clientType: AuthClientType;
  deviceName?: string;
  deviceFingerprint?: string;
};

export type SignInInput = {
  email: string;
  password: string;
  clientType: AuthClientType;
  deviceName?: string;
  deviceFingerprint?: string;
};

export type RefreshInput = {
  refreshToken?: string;
  clientType: AuthClientType;
};

export type LogoutInput = {
  sessionId: string;
  refreshToken?: string;
  clientType: AuthClientType;
};
