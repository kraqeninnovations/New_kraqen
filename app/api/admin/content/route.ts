import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { revalidateTag } from 'next/cache';
import { ContentName } from '@/lib/schemas';
import { getContentHealth } from '@/lib/content';
import { saveContent, listVersions, revertVersion } from '@/lib/storage';

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === 'authenticated_kraqen_admin';
}

export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const name = searchParams.get('file') as ContentName | null;

  if (searchParams.get('health') === 'true') {
    return NextResponse.json({ health: getContentHealth() });
  }

  if (searchParams.get('versions') === 'true' && name) {
    const versions = await listVersions(name);
    return NextResponse.json({ versions });
  }

  if (!name) {
    return NextResponse.json({ error: 'Missing file parameter' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'content', `${name}.json`);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  try {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const versions = await listVersions(name);
    return NextResponse.json({ file: name, content, versions });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'Failed to read file', message: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { file, content, action, versionId } = body;

  if (!file) {
    return NextResponse.json({ error: 'Missing file name' }, { status: 400 });
  }

  if (action === 'revert') {
    if (!versionId) {
      return NextResponse.json({ error: 'Missing versionId for revert' }, { status: 400 });
    }
    const revertResult = await revertVersion(file, versionId);
    if (!revertResult.success) {
      return NextResponse.json({ error: revertResult.error }, { status: 400 });
    }

    try {
      revalidateTag(`content-${file}`);
    } catch (tagErr) {
      console.warn('Revalidation warning:', tagErr);
    }

    return NextResponse.json({ success: true, message: `Reverted to version ${versionId}` });
  }

  if (typeof content !== 'string') {
    return NextResponse.json({ error: 'Missing content string' }, { status: 400 });
  }

  const result = await saveContent(file, content);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  // Trigger on-demand ISR revalidation
  try {
    revalidateTag(`content-${file}`);
  } catch (revalidateErr) {
    return NextResponse.json({
      success: true,
      warning: `Saved but live update failed: ${revalidateErr instanceof Error ? revalidateErr.message : String(revalidateErr)}. Retry.`,
    });
  }

  return NextResponse.json({
    success: true,
    message: `Saved and revalidated content/${file}.json successfully.`,
  });
}

