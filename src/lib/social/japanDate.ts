export function todayJapanDate(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/** 0=Sun … 6=Sat in Asia/Tokyo */
export function japanWeekday(date: Date = new Date()): number {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Tokyo',
    weekday: 'short',
  }).format(date);
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[weekday] ?? 0;
}

/** Auto-post days: Mon / Wed / Fri (Japan time) */
const AUTO_POST_WEEKDAYS = new Set([1, 3, 5]);

export function isAutoPostDayJapan(date: Date = new Date()): boolean {
  return AUTO_POST_WEEKDAYS.has(japanWeekday(date));
}
