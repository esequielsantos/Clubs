import type { CookieOptions } from 'express';

export const authCookie = 'temp-cookie';

export function getOpcoesCookieAutenticacao(): CookieOptions {
  const expires = new Date(Date.now() + ( 1 * 60 * 60 * 1000));  //token time: 1 hour

  return {
    expires,
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/auth/',
  };
}
