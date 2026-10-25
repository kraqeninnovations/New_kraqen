import fs from 'fs';
import path from 'path';
import { contentSchemas, ContentName } from './schemas';
import { formatErrorMessage } from './content';

export interface VersionInfo {
  id: string;
  name: ContentName;
  timestamp: string;
  size: number;
}

const STORAGE_MODE = process.env.CONTENT_STORAGE || 'fs';
const VERSIONS_DIR = path.join(process.cwd(), '.content_versions');

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Saves content to disk or configured storage, validating with Zod first
 * Keeps last 10 versions for rollback
 */
export async function saveContent(
  name: ContentName,
  rawJsonString: string
): Promise<{ success: boolean; error?: string }> {
  // 1. JSON Syntax Check
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJsonString);
  } catch (syntaxErr) {
    return {
      success: false,
      error: formatErrorMessage(name, syntaxErr, rawJsonString),
    };
  }

  // 2. Schema Validation
  const schema = contentSchemas[name];
  const validation = schema.safeParse(parsed);
  if (!validation.success) {
    return {
      success: false,
      error: formatErrorMessage(name, validation.error),
    };
  }

  const filePath = path.join(process.cwd(), 'content', `${name}.json`);

  // 3. Backup current version if file exists
  try {
    if (fs.existsSync(filePath)) {
      const currentContent = await fs.promises.readFile(filePath, 'utf-8');
      const fileVersionsDir = path.join(VERSIONS_DIR, name);
      ensureDir(fileVersionsDir);

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const versionFile = path.join(fileVersionsDir, `${timestamp}.json`);
      await fs.promises.writeFile(versionFile, currentContent, 'utf-8');

      // Prune to keep last 10 versions
      const existing = (await fs.promises.readdir(fileVersionsDir))
        .filter((f) => f.endsWith('.json'))
        .sort()
        .reverse();

      if (existing.length > 10) {
        for (const fileToDelete of existing.slice(10)) {
          await fs.promises.unlink(path.join(fileVersionsDir, fileToDelete)).catch(() => {});
        }
      }
    }
  } catch (backupErr) {
    console.warn(`[Content Storage] Warning: Could not create version backup:`, backupErr);
  }

  // 4. Save file according to STORAGE_MODE
  if (STORAGE_MODE === 'github' && process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
    try {
      const repo = process.env.GITHUB_REPO;
      const branch = process.env.GITHUB_BRANCH || 'main';
      const fileRepoPath = `content/${name}.json`;

      // Fetch file SHA
      const getRes = await fetch(
        `https://api.github.com/repos/${repo}/contents/${fileRepoPath}?ref=${branch}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      let sha: string | undefined;
      if (getRes.ok) {
        const fileData = await getRes.json();
        sha = fileData.sha;
      }

      const putRes = await fetch(
        `https://api.github.com/repos/${repo}/contents/${fileRepoPath}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `chore: update content/${name}.json via Admin CMS`,
            content: Buffer.from(rawJsonString).toString('base64'),
            branch,
            sha,
          }),
        }
      );

      if (!putRes.ok) {
        throw new Error(`GitHub API error: ${await putRes.text()}`);
      }
    } catch (ghErr) {
      return {
        success: false,
        error: `Saved locally but GitHub sync failed: ${ghErr instanceof Error ? ghErr.message : String(ghErr)}`,
      };
    }
  }

  // Standard filesystem write (VPS / local)
  try {
    ensureDir(path.dirname(filePath));
    await fs.promises.writeFile(filePath, JSON.stringify(parsed, null, 2), 'utf-8');
  } catch (fsErr) {
    return {
      success: false,
      error: `Filesystem write error: ${fsErr instanceof Error ? fsErr.message : String(fsErr)}`,
    };
  }

  return { success: true };
}

/**
 * Lists the last 10 versions of a content file
 */
export async function listVersions(name: ContentName): Promise<VersionInfo[]> {
  const fileVersionsDir = path.join(VERSIONS_DIR, name);
  if (!fs.existsSync(fileVersionsDir)) return [];

  try {
    const files = (await fs.promises.readdir(fileVersionsDir))
      .filter((f) => f.endsWith('.json'))
      .sort()
      .reverse()
      .slice(0, 10);

    const versions: VersionInfo[] = [];
    for (const f of files) {
      const fullPath = path.join(fileVersionsDir, f);
      const stat = await fs.promises.stat(fullPath);
      const timeStr = f.replace('.json', '');
      versions.push({
        id: f,
        name,
        timestamp: timeStr,
        size: stat.size,
      });
    }
    return versions;
  } catch {
    return [];
  }
}

/**
 * Reverts to a previous saved version
 */
export async function revertVersion(
  name: ContentName,
  versionFile: string
): Promise<{ success: boolean; error?: string }> {
  const versionPath = path.join(VERSIONS_DIR, name, versionFile);
  if (!fs.existsSync(versionPath)) {
    return { success: false, error: 'Version file not found' };
  }

  try {
    const rawContent = await fs.promises.readFile(versionPath, 'utf-8');
    return await saveContent(name, rawContent);
  } catch (err) {
    return {
      success: false,
      error: `Failed to revert: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

/* ============================================================
   BOOKINGS STORAGE
   ============================================================ */
const BOOKINGS_DIR = path.join(process.cwd(), '.bookings');

export interface BookingRecord {
  id: string;
  date: string;
  time: string;
  timezone: string;
  name: string;
  email: string;
  phone: string;
  phoneCountry?: string;
  notes?: string;
  createdAt: string;
}

export async function getBookingsForDate(dateStr: string): Promise<BookingRecord[]> {
  try {
    ensureDir(BOOKINGS_DIR);
    const filePath = path.join(BOOKINGS_DIR, `${dateStr}.json`);
    if (!fs.existsSync(filePath)) return [];
    const raw = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as BookingRecord[];
  } catch (err) {
    console.warn('Could not read bookings for date:', dateStr, err);
    return [];
  }
}

export async function saveBookingRecord(
  booking: Omit<BookingRecord, 'id' | 'createdAt'>
): Promise<{ success: boolean; error?: string; booking?: BookingRecord }> {
  try {
    ensureDir(BOOKINGS_DIR);
    const filePath = path.join(BOOKINGS_DIR, `${booking.date}.json`);
    let existing: BookingRecord[] = [];
    if (fs.existsSync(filePath)) {
      const raw = await fs.promises.readFile(filePath, 'utf-8');
      existing = JSON.parse(raw);
    }

    const slotTaken = existing.some((b) => b.time === booking.time);
    if (slotTaken) {
      return { success: false, error: 'Slot already booked' };
    }

    const newRecord: BookingRecord = {
      ...booking,
      id: `bk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };

    existing.push(newRecord);
    await fs.promises.writeFile(filePath, JSON.stringify(existing, null, 2), 'utf-8');
    return { success: true, booking: newRecord };
  } catch (err) {
    console.error('Failed to save booking:', err);
    return { success: false, error: 'Failed to write booking' };
  }
}

