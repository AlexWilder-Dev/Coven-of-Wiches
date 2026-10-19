import { AnimatePresence, motion } from 'framer-motion';
import { useClock } from '../lib/clock';
import { clock, wait, dayHours, DAY_NAMES, DAYS, type Status } from '../lib/time';

export function statusWords(s: Status, today: number) {
  switch (s.kind) {
    case 'open':
      if (s.part === 'lunch')
        return {
          word: 'Open',
          line: `Lunch till ${clock(s.closesAt)}.${s.peak ? ' Peak time.' : ''}`,
          next: s.breakAfter ? `Shut ${clock(s.breakAfter[0])}–${clock(s.breakAfter[1])}, then back for the bar.` : '',
          tick: `Closes for the break in ${wait(s.minsLeft)}`,
          short: `Open till ${clock(s.closesAt)}`,
        };
      if (s.part === 'evening' || s.late)
        return {
          word: 'Open',
          line: `Bar’s on till ${clock(s.closesAt, true)}.`,
          next: 'Wiccan Liquor on keg, frozen margs, pickleback shots.',
          tick: `Closes in ${wait(s.minsLeft)}`,
          short: `Open till ${clock(s.closesAt)}`,
        };
      return {
        word: 'Open',
        line: `Till ${clock(s.closesAt, true)} today.${s.peak ? ' Peak time.' : ''}`,
        next: '',
        tick: `Closes in ${wait(s.minsLeft)}`,
        short: `Open till ${clock(s.closesAt)}`,
      };
    case 'break':
      return {
        word: 'On a break',
        line: `Lunch is done. Back at ${clock(s.reopensAt)} for the bar.`,
        next: 'The 3–5 lull, Wednesday to Friday.',
        tick: `Doors back open in ${wait(s.minsLeft)}`,
        short: `Back at ${clock(s.reopensAt)}`,
      };
    case 'later':
      return {
        word: `Opens at ${clock(s.opensAt)}`,
        line: `Today: ${dayHours(DAYS[today])}.`,
        next: '',
        tick: `In ${wait(s.minsLeft)}`,
        short: `Opens at ${clock(s.opensAt)}`,
      };
    case 'closed': {
      const restDay = today === 1 || today === 2;
      const when = s.inDays === 1 ? 'tomorrow' : DAY_NAMES[DAYS[s.nextDay]];
      return {
        word: 'Closed',
        line: restDay ? 'The Coven rests Mondays and Tuesdays.' : 'That’s us done for today.',
        next: '',
        tick: `Back ${when} at ${clock(s.opensAt)}`,
        short: `Back ${s.inDays === 1 ? 'tmrw' : DAY_NAMES[DAYS[s.nextDay]].slice(0, 3)} ${clock(s.opensAt)}`,
      };
    }
  }
}

export function StatusSign() {
  const { status, now, previewing, setPreview } = useClock();
  const w = statusWords(status, now.day);
  const open = status.kind === 'open';
  return (
    <div className={`sign ${open ? 'sign--open' : 'sign--shut'}`} role="status" aria-live="polite">
      <div className="sign__meta">
        <span className="sign__dot" aria-hidden="true" />
        {previewing ? (
          <>
            <span>
              Previewing {DAY_NAMES[DAYS[now.day]]} {clock(now.minutes, true)}
            </span>
            <button type="button" className="sign__back" onClick={() => setPreview(null)}>
              Back to now
            </button>
          </>
        ) : (
          <span>
            Right now · {DAY_NAMES[DAYS[now.day]]} {clock(now.minutes, true)}
          </span>
        )}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={w.word}
          className="sign__word"
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          {w.word}
        </motion.p>
      </AnimatePresence>
      <p className="sign__line">{w.line}</p>
      {w.next && <p className="sign__next">{w.next}</p>}
      <p className="sign__tick">{w.tick}</p>
    </div>
  );
}
