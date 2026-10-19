import { motion } from 'framer-motion';
import { useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { HOURS, PEAK } from '../data/coven';
import { useClock } from '../lib/clock';
import { clock, dayHours, sessionsFor, toMin, DAYS, DAY_NAMES, WEEK_ORDER, type WallClock } from '../lib/time';
import { statusWords } from './StatusSign';
import { Reveal } from './bits';

const START = 11 * 60;
const END = 23 * 60;
const SPAN = END - START;
const pct = (m: number) => `${((m - START) / SPAN) * 100}%`;
const TICKS = [12, 15, 17, 21];

function Track({ day }: { day: number }) {
  const { now, setPreview, previewing } = useClock();
  const ref = useRef<HTMLDivElement>(null);
  const sessions = sessionsFor(day);
  const peak = [toMin(PEAK[0]), toMin(PEAK[1])];
  const here = now.day === day;
  const minutes = here ? now.minutes : 12 * 60;

  const set = (m: number) => {
    const snapped = Math.round(Math.min(END - 15, Math.max(START, m)) / 15) * 15;
    const w: WallClock = { day, minutes: snapped, date: '' };
    setPreview(w);
  };
  const fromPointer = (e: PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    set(START + ((e.clientX - r.left) / r.width) * SPAN);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') set(minutes + 30);
    else if (e.key === 'ArrowLeft') set(minutes - 30);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={ref}
      className={`track ${here ? 'is-today' : ''}`}
      role="slider"
      tabIndex={0}
      aria-label={`${DAY_NAMES[DAYS[day]]}: drag to preview a time`}
      aria-valuemin={START}
      aria-valuemax={END}
      aria-valuenow={minutes}
      aria-valuetext={`${DAY_NAMES[DAYS[day]]} ${clock(minutes, true)}`}
      onKeyDown={onKey}
      onPointerDown={(e) => {
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        fromPointer(e);
      }}
      onPointerMove={(e) => e.buttons && fromPointer(e)}
    >
      {sessions.map(([a, b]) => (
        <span key={a} className="track__open" style={{ left: pct(a), width: `calc(${pct(b)} - ${pct(a)})` }}>
          <span
            className="track__peak"
            style={{
              left: `${((Math.max(a, peak[0]) - a) / (b - a)) * 100}%`,
              width: `${(Math.max(0, Math.min(b, peak[1]) - Math.max(a, peak[0])) / (b - a)) * 100}%`,
            }}
          />
        </span>
      ))}
      {here && (
        <motion.span
          className={`track__needle ${previewing ? 'is-preview' : ''}`}
          animate={{ left: pct(Math.min(END, Math.max(START, now.minutes))) }}
          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
        />
      )}
    </div>
  );
}

export function Hours() {
  const { now, status, previewing } = useClock();
  const w = statusWords(status, now.day);
  return (
    <section id="hours" className="section hours">
      <Reveal>
        <h2 className="section__title">Hours</h2>
        <p className="hours__lede">
          Lunch, a break, then the bar. Tap or drag along a day to see what you&rsquo;d find.
        </p>
      </Reveal>

      <Reveal className="timeline" delay={0.05}>
        <div className="timeline__scale" aria-hidden="true">
          {TICKS.map((t) => (
            <span key={t} style={{ left: pct(t * 60) }}>
              {clock(t * 60)}
            </span>
          ))}
        </div>
        {WEEK_ORDER.map((d) => {
          const i = DAYS.indexOf(d);
          return (
            <div key={d} className={`timeline__row ${now.day === i ? 'is-today' : ''}`}>
              <span className="timeline__day">{DAY_NAMES[d].slice(0, 3)}</span>
              <Track day={i} />
              <span className="timeline__hrs">{dayHours(d)}</span>
            </div>
          );
        })}
        <p className="timeline__readout" aria-live="polite">
          <strong>
            {DAY_NAMES[DAYS[now.day]]} {clock(now.minutes, true)}
          </strong>{' '}
          {w.word}. {w.line}
          {previewing ? '' : ' (that’s now)'}
        </p>
        <p className="timeline__key">
          <span className="key key--open" /> Open <span className="key key--peak" /> Peak time, 12&ndash;3
        </p>
      </Reveal>

      <dl className="hours__list">
        {WEEK_ORDER.map((d) => (
          <div key={d} className={HOURS[d].length ? '' : 'is-shut'}>
            <dt>{DAY_NAMES[d]}</dt>
            <dd>{dayHours(d)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
