import { NextRequest } from 'next/server';

export function getToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  return authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
}

export function isAdmin(role: string): boolean {
  return role === 'ADMIN';
}