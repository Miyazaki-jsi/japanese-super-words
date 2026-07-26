/**
 * Quick sanity check for progress backup (no browser required).
 * Run: npx tsx scripts/verify-progress-backup.ts
 */
import {
  applyBackup,
  BACKUP_APP_ID,
  BACKUP_KEY_PREFIX,
  collectBackupData,
  parseBackupJson,
  serializeBackup,
} from '../src/lib/progressBackup';

class MemoryStorage implements Storage {
  private map = new Map<string, string>();

  get length() {
    return this.map.size;
  }

  clear() {
    this.map.clear();
  }

  getItem(key: string) {
    return this.map.has(key) ? this.map.get(key)! : null;
  }

  key(index: number) {
    return [...this.map.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.map.delete(key);
  }

  setItem(key: string, value: string) {
    this.map.set(key, String(value));
  }
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const storage = new MemoryStorage();
storage.setItem(`${BACKUP_KEY_PREFIX}progress`, JSON.stringify(['s1', 's2', 'a1']));
storage.setItem(`${BACKUP_KEY_PREFIX}favorites`, JSON.stringify(['s1']));
storage.setItem(`${BACKUP_KEY_PREFIX}username`, 'Miyazaki');
storage.setItem(`${BACKUP_KEY_PREFIX}intro-done`, 'true');
storage.setItem(`${BACKUP_KEY_PREFIX}pack-hatsumode-unlocked`, 'true');
storage.setItem('unrelated-key', 'should-not-backup');

const backup = collectBackupData(storage);
assert(backup.app === BACKUP_APP_ID, 'app id');
assert(backup.data[`${BACKUP_KEY_PREFIX}progress`]?.includes('s1'), 'progress collected');
assert(!('unrelated-key' in backup.data), 'non-jsw key excluded');
assert(Object.keys(backup.data).length === 5, `expected 5 keys, got ${Object.keys(backup.data).length}`);

const json = serializeBackup(backup);
const parsed = parseBackupJson(json);
assert(parsed.data[`${BACKUP_KEY_PREFIX}username`] === 'Miyazaki', 'round-trip username');

const empty = new MemoryStorage();
empty.setItem(`${BACKUP_KEY_PREFIX}progress`, JSON.stringify(['old']));
empty.setItem(`${BACKUP_KEY_PREFIX}orphan`, 'gone-after-restore');
const result = applyBackup(parsed, empty);
assert(result.written === 5, `written ${result.written}`);
assert(empty.getItem(`${BACKUP_KEY_PREFIX}progress`)?.includes('a1'), 'progress restored');
assert(empty.getItem(`${BACKUP_KEY_PREFIX}orphan`) === null, 'orphan removed');
assert(empty.getItem(`${BACKUP_KEY_PREFIX}username`) === 'Miyazaki', 'username restored');

let threw = false;
try {
  parseBackupJson('{"app":"other","version":1,"data":{}}');
} catch {
  threw = true;
}
assert(threw, 'rejects foreign app');

console.log('OK — progress backup export/import verified.');
