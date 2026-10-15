import { NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'kraqen2026';

// In-memory rate limiting for login attempts (max 5 tries per 15 mins per IP)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const ATTEMPT_LIMIT = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'anonymous';

  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (record && now < record.resetAt && record.count >= ATTEMPT_LIMIT) {
    const minutesLeft = Math.ceil((record.resetAt - now) / 60000);
    return NextResponse.json(
      { error: `Too many login attempts. Locked out for ${minutesLeft} minute(s).` },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const password = body.password;

  if (!password || password !== ADMIN_PASSWORD) {
    const current = record && now < record.resetAt ? record.count + 1 : 1;
    loginAttempts.set(ip, { count: current, resetAt: now + LOCKOUT_MS });
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  // Clear attempts on success
  loginAttempts.delete(ip);

  const response = NextResponse.json({ success: true, message: 'Authenticated' });

  // Set httpOnly session cookie
  response.cookies.set('admin_session', 'authenticated_kraqen_admin', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return response;
}

