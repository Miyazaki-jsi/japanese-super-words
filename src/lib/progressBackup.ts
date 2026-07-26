/** Device progress backup (localStorage → JSON file → restore). */

export const BACKUP_APP_ID = 'japanese-super-words';
export const BACKUP_VERSION = 1;
export const BACKUP_KEY_PREFIX = 'japanese-super-words-';

export type ProgressBackup = {
  app: typeof BACKUP_APP_ID;
  version: number;
  exportedAt: string;
  data: Record<string, string>;
};

export type BackupApplyResult = {
  written: number;
  removed: number;
};

export class BackupParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BackupParseError';
  }
}

/** Collect all JSW keys from a Storage-like object. */
export function collectBackupData(storage: Storage): ProgressBackup {
  const data: Record<string, string> = {};
  for (let i = 0; i < storage.length; i += 1) {
    const key = storage.key(i);
    if (!key || !key.startsWith(BACKUP_KEY_PREFIX)) continue;
    const value = storage.getItem(key);
    if (value != null) data[key] = value;
  }
  return {
    app: BACKUP_APP_ID,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  };
}

export function backupFilename(exportedAt = new Date()): string {
  const y = exportedAt.getFullYear();
  const m = String(exportedAt.getMonth() + 1).padStart(2, '0');
  const d = String(exportedAt.getDate()).padStart(2, '0');
  return `japanese-super-words-backup-${y}-${m}-${d}.json`;
}

export function serializeBackup(backup: ProgressBackup): string {
  return `${JSON.stringify(backup, null, 2)}\n`;
}

export function parseBackupJson(raw: string): ProgressBackup {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new BackupParseError('Invalid JSON file.');
  }
  if (!parsed || typeof parsed !== 'object') {
    throw new BackupParseError('Backup file is empty or invalid.');
  }
  const obj = parsed as Record<string, unknown>;
  if (obj.app !== BACKUP_APP_ID) {
    throw new BackupParseError('This file is not a Japanese super Words backup.');
  }
  if (typeof obj.version !== 'number' || obj.version < 1) {
    throw new BackupParseError('Unsupported backup version.');
  }
  if (!obj.data || typeof obj.data !== 'object' || Array.isArray(obj.data)) {
    throw new BackupParseError('Backup data is missing.');
  }
  const data: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj.data as Record<string, unknown>)) {
    if (!key.startsWith(BACKUP_KEY_PREFIX)) continue;
    if (typeof value !== 'string') {
      throw new BackupParseError(`Invalid value for ${key}.`);
    }
    data[key] = value;
  }
  if (Object.keys(data).length === 0) {
    throw new BackupParseError('Backup contains no progress data.');
  }
  return {
    app: BACKUP_APP_ID,
    version: obj.version,
    exportedAt: typeof obj.exportedAt === 'string' ? obj.exportedAt : new Date().toISOString(),
    data,
  };
}

/** Replace all current JSW keys with the backup contents. */
export function applyBackup(backup: ProgressBackup, storage: Storage): BackupApplyResult {
  const existing: string[] = [];
  for (let i = 0; i < storage.length; i += 1) {
    const key = storage.key(i);
    if (key?.startsWith(BACKUP_KEY_PREFIX)) existing.push(key);
  }
  for (const key of existing) storage.removeItem(key);

  let written = 0;
  for (const [key, value] of Object.entries(backup.data)) {
    storage.setItem(key, value);
    written += 1;
  }
  return { written, removed: existing.length };
}

export type BackupShareResult = 'shared' | 'downloaded' | 'copied';

/** Prefer iOS share sheet; fall back to download, then clipboard. */
export async function shareOrDownloadBackup(backup: ProgressBackup): Promise<BackupShareResult> {
  const json = serializeBackup(backup);
  const name = backupFilename(new Date(backup.exportedAt));
  const blob = new Blob([json], { type: 'application/json' });
  const file = new File([blob], name, { type: 'application/json' });

  const nav = typeof navigator !== 'undefined' ? navigator : null;
  if (nav && typeof nav.canShare === 'function' && nav.canShare({ files: [file] })) {
    try {
      await nav.share({
        files: [file],
        title: 'Japanese super Words backup',
        text: 'Progress backup for Japanese super Words',
      });
      return 'shared';
    } catch (error) {
      // User cancelled share — don't fall through to download noise.
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error;
      }
    }
  }

  const url = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = name;
    anchor.rel = 'noopener';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    return 'downloaded';
  } catch {
    if (nav?.clipboard?.writeText) {
      await nav.clipboard.writeText(json);
      return 'copied';
    }
    throw new Error('Could not save backup on this device.');
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(url), 2_000);
  }
}
