import { NextResponse } from 'next/server';

export async function GET() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'INSTAGRAM_ACCESS_TOKEN not configured' },
      { status: 400 }
    );
  }

  try {
    const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status });
    }

    return NextResponse.json({ success: true, expiresIn: data.expires_in });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

