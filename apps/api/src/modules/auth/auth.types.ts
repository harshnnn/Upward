export type AuthClientType = 'web' | 'mobile';

export type JwtPayload = {
  sub: string;
  email: string;
  role: 'USER' | 'ADMIN';
  sessionId: string;
};

export type AuthenticatedUser = {
  id: string;
  email: string;
  displayName: string | null;
  role: 'USER' | 'ADMIN';
};
