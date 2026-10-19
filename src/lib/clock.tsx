import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { londonNow, statusAt, isEvening, DAYS, type WallClock, type Status } from './time';

type Mode = 'lunch' | 'evening';

interface Clock {
  now: WallClock;
  previewing: boolean;
  setPreview: (w: WallClock | null) => void;
  status: Status;
  mode: Mode;
  autoMode: Mode;
  setMode: (m: Mode | null) => void;
}

const Ctx = createContext<Clock | null>(null);

// ?at=fri-19:30 opens the site as if it were that time
function fromQuery(): WallClock | null {
  try {
    const at = new URLSearchParams(window.location.search).get('at');
    const m = at?.match(/^(mon|tue|wed|thu|fri|sat|sun)-(\d{1,2}):(\d{2})$/i);
    if (!m) return null;
    return { day: DAYS.indexOf(m[1].toLowerCase() as never), minutes: Number(m[2]) * 60 + Number(m[3]), date: '' };
  } catch {
    return null;
  }
}

export function ClockProvider({ children }: { children: ReactNode }) {
  const [real, setReal] = useState(() => londonNow());
  const [preview, setPreview] = useState<WallClock | null>(fromQuery);
  const [override, setOverride] = useState<Mode | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => setReal(londonNow()), 20_000);
    return () => window.clearInterval(id);
  }, []);

  const value = useMemo<Clock>(() => {
    const now = preview ?? real;
    const autoMode: Mode = isEvening(now) ? 'evening' : 'lunch';
    return {
      now,
      previewing: !!preview,
      setPreview: (w) => {
        setPreview(w);
        setOverride(null);
      },
      status: statusAt(now),
      autoMode,
      mode: override ?? autoMode,
      setMode: setOverride,
    };
  }, [real, preview, override]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useClock() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useClock outside ClockProvider');
  return c;
}
