import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

const SECRET_TOKEN = process.env.REVALIDATE_TOKEN || 'kraqen-secret-revalidate-token';

export async function POST(request: Request) {
  try {
    const token =
      request.headers.get('x-revalidate-token') ||
      new URL(request.url).searchParams.get('token');

    if (token !== SECRET_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized: Invalid revalidation token' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const tag = body.tag || (body.file ? `content-${body.file}` : null);

    if (!tag) {
      return NextResponse.json(
        { error: 'Missing tag or file in request body. Example: { "file": "home" } or { "tag": "content-home" }' },
        { status: 400 }
      );
    }

    revalidateTag(tag);

    return NextResponse.json({
      revalidated: true,
      tag,
      now: Date.now(),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'Revalidation error', message: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

