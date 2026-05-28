import type { Response } from 'express';

export const setRefreshCookie = (response: Response, token: string, expiresInMs: number): void => {
  response.cookie('upward_refresh_token', token, {
    httpOnly: true,
    secure: process.env['NODE_ENV'] === 'production',
    sameSite: 'lax',
    path: '/api/v1/auth',
    maxAge: expiresInMs
  });
};

export const clearRefreshCookie = (response: Response): void => {
  response.clearCookie('upward_refresh_token', {
    path: '/api/v1/auth'
  });
};
