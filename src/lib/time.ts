import { HOURS, PEAK, EVENING_FROM, type DayKey } from '../data/coven';

export const DAYS: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
export const DAY_NAMES: Record<DayKey, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};
export const WEEK_ORDER: DayKey[] = ['wed', 'thu', 'fri', 'sat', 'sun', 'mon', 'tue'];

/** A moment on the shop's wall clock: weekday 0 (Sun) to 6, minutes since midnight */
export interface WallClock {
  day: number;
  minutes: number;
  /** London calendar date, YYYY-MM-DD */
  date: string;
}

export const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export function londonNow(d = new Date()): WallClock {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return {
    day,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
    date: `${get('year')}-${get('month')}-${get('day')}`,
  };
}

const sessions = (day: number) => HOURS[DAYS[day]].map(([a, b]) => [toMin(a), toMin(b)] as const);

/** "12", "3", "5:30", with "pm" only where asked */
export function clock(min: number, suffix = false) {
  const h24 = Math.floor(min / 60) % 24;
  const m = min % 60;
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  const s = m ? `${h}:${String(m).padStart(2, '0')}` : `${h}`;
  if (!suffix) return s;
  if (h24 === 12 && m === 0) return 'noon';
  return `${s}${h24 < 12 ? 'am' : 'pm'}`;
}

export function dayHours(day: DayKey) {
  const s = HOURS[day];
  if (!s.length) return 'Closed';
  return s.map(([a, b]) => `${clock(toMin(a))}–${clock(toMin(b))}`).join(' & ');
}

export function wait(mins: number) {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export type Status =
  | {
      kind: 'open';
      closesAt: number;
      part: 'lunch' | 'evening' | 'allday';
      peak: boolean;
      late: boolean;
      breakAfter?: [number, number];
      minsLeft: number;
    }
  | { kind: 'break'; reopensAt: number; minsLeft: number }
  | { kind: 'later'; opensAt: number; minsLeft: number }
  | { kind: 'closed'; nextDay: number; opensAt: number; inDays: number };

export function statusAt(now: WallClock): Status {
  const today = sessions(now.day);
  const t = now.minutes;
  for (let i = 0; i < today.length; i++) {
    const [a, b] = today[i];
    if (t >= a && t < b) {
      const next = today[i + 1];
      const part = today.length === 1 ? 'allday' : i === 0 ? 'lunch' : 'evening';
      return {
        kind: 'open',
        closesAt: b,
        part,
        peak: t >= toMin(PEAK[0]) && t < toMin(PEAK[1]),
        late: t >= toMin(EVENING_FROM),
        breakAfter: next ? [b, next[0]] : undefined,
        minsLeft: b - t,
      };
    }
    if (t < a) {
      return i === 0
        ? { kind: 'later', opensAt: a, minsLeft: a - t }
        : { kind: 'break', reopensAt: a, minsLeft: a - t };
    }
  }
  for (let k = 1; k <= 7; k++) {
    const d = (now.day + k) % 7;
    const s = sessions(d);
    if (s.length) return { kind: 'closed', nextDay: d, opensAt: s[0][0], inDays: k };
  }
  return { kind: 'closed', nextDay: now.day, opensAt: 0, inDays: 7 };
}

/** Evening look: from EVENING_FROM on a day that has an evening (Wed to Sat) */
export function isEvening(now: WallClock) {
  const s = sessions(now.day);
  const from = toMin(EVENING_FROM);
  const last = s[s.length - 1];
  return !!last && last[1] > from && now.minutes >= from;
}

export function hasEvening(day: number) {
  const s = sessions(day);
  const last = s[s.length - 1];
  return !!last && last[1] > toMin(EVENING_FROM);
}

export const sessionsFor = sessions;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function boardDates(from: string, to: string) {
  const [, fm, fd] = from.split('-').map(Number);
  const [, tm, td] = to.split('-').map(Number);
  return fm === tm ? `${fd}–${td} ${MONTHS[tm - 1]}` : `${fd} ${MONTHS[fm - 1]} – ${td} ${MONTHS[tm - 1]}`;
}
