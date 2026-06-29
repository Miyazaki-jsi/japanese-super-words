export const SRS_STORAGE_KEY = 'japanese-super-words-srs';
export const STREAK_STORAGE_KEY = 'japanese-super-words-streak';

export type SrsEntry = {
  wordId: string;
  intervalDays: number;
  dueAt: string;
  stage: number;
};

export type StreakData = {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
};

const REVIEW_INTERVALS_DAYS = [1, 3, 7, 14, 30];

const DEFAULT_STREAK: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: null,
};

function getTodayISO(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(dateISO: string, days: number): string {
  const [year, month, day] = dateISO.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return formatDateISO(date);
}

function readSrsMap(): Record<string, SrsEntry> {
  if (typeof window === 'undefined') return {};
  const raw = localStorage.getItem(SRS_STORAGE_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, SrsEntry>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeSrsMap(map: Record<string, SrsEntry>): void {
  localStorage.setItem(SRS_STORAGE_KEY, JSON.stringify(map));
}

function normalizeStreak(data: StreakData): StreakData {
  if (!data.lastStudyDate) {
    return { ...data, currentStreak: 0 };
  }
  const today = getTodayISO();
  const yesterday = addDays(today, -1);
  if (data.lastStudyDate === today || data.lastStudyDate === yesterday) {
    return data;
  }
  return { ...data, currentStreak: 0 };
}

export function readStreak(): StreakData {
  if (typeof window === 'undefined') return DEFAULT_STREAK;
  const raw = localStorage.getItem(STREAK_STORAGE_KEY);
  if (!raw) return DEFAULT_STREAK;
  try {
    const parsed = JSON.parse(raw) as StreakData;
    if (
      typeof parsed.currentStreak === 'number' &&
      typeof parsed.longestStreak === 'number' &&
      (parsed.lastStudyDate === null || typeof parsed.lastStudyDate === 'string')
    ) {
      const normalized = normalizeStreak(parsed);
      if (normalized.currentStreak !== parsed.currentStreak) {
        writeStreak(normalized);
      }
      return normalized;
    }
  } catch {
    // fall through
  }
  return DEFAULT_STREAK;
}

function writeStreak(data: StreakData): void {
  localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data));
}

export function recordStudyDay(): StreakData {
  const today = getTodayISO();
  const streak = readStreak();
  if (streak.lastStudyDate === today) {
    return streak;
  }

  let currentStreak = 1;
  if (streak.lastStudyDate) {
    const yesterday = addDays(today, -1);
    if (streak.lastStudyDate === yesterday) {
      currentStreak = streak.currentStreak + 1;
    }
  }

  const updated: StreakData = {
    currentStreak,
    longestStreak: Math.max(streak.longestStreak, currentStreak),
    lastStudyDate: today,
  };
  writeStreak(updated);
  return updated;
}

export function syncSrsWithLearned(learnedIds: string[]): void {
  const map = readSrsMap();
  let changed = false;

  for (const id of learnedIds) {
    if (!map[id]) {
      map[id] = {
        wordId: id,
        intervalDays: REVIEW_INTERVALS_DAYS[0],
        dueAt: getTodayISO(),
        stage: 0,
      };
      changed = true;
    }
  }

  for (const id of Object.keys(map)) {
    if (!learnedIds.includes(id)) {
      delete map[id];
      changed = true;
    }
  }

  if (changed) {
    writeSrsMap(map);
  }
}

export function scheduleSrsEntry(wordId: string): void {
  const map = readSrsMap();
  map[wordId] = {
    wordId,
    intervalDays: REVIEW_INTERVALS_DAYS[0],
    dueAt: addDays(getTodayISO(), REVIEW_INTERVALS_DAYS[0]),
    stage: 0,
  };
  writeSrsMap(map);
}

export function removeSrsEntry(wordId: string): void {
  const map = readSrsMap();
  if (!map[wordId]) return;
  delete map[wordId];
  writeSrsMap(map);
}

export function getDueWordIds(learnedIds: string[]): string[] {
  syncSrsWithLearned(learnedIds);
  const map = readSrsMap();
  const today = getTodayISO();
  return learnedIds.filter((id) => {
    const entry = map[id];
    return entry && entry.dueAt <= today;
  });
}

export function getUpcomingReviewCount(learnedIds: string[]): number {
  return getDueWordIds(learnedIds).length;
}

export function recordSrsSuccess(wordId: string): void {
  const map = readSrsMap();
  const entry = map[wordId];
  if (!entry) return;

  const nextStage = Math.min(entry.stage + 1, REVIEW_INTERVALS_DAYS.length - 1);
  const intervalDays = REVIEW_INTERVALS_DAYS[nextStage];
  map[wordId] = {
    wordId,
    intervalDays,
    dueAt: addDays(getTodayISO(), intervalDays),
    stage: nextStage,
  };
  writeSrsMap(map);
}

export function recordSrsAgain(wordId: string): void {
  const map = readSrsMap();
  map[wordId] = {
    wordId,
    intervalDays: REVIEW_INTERVALS_DAYS[0],
    dueAt: addDays(getTodayISO(), REVIEW_INTERVALS_DAYS[0]),
    stage: 0,
  };
  writeSrsMap(map);
}

export function clearStudyHabits(): void {
  localStorage.removeItem(SRS_STORAGE_KEY);
  localStorage.removeItem(STREAK_STORAGE_KEY);
}

export function hasStudiedToday(): boolean {
  return readStreak().lastStudyDate === getTodayISO();
}
