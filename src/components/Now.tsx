import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BAR, CONTACT, STALWARTS, THIS_WEEK } from '../data/coven';
import { useClock } from '../lib/clock';
import { boardDates } from '../lib/time';
import { Money, Photo } from './bits';
import { StatusSign } from './StatusSign';

function ModeSwitch() {
  const { mode, autoMode, setMode } = useClock();
  const pick = (m: 'lunch' | 'evening') => setMode(m === autoMode ? null : m);
  return (
    <div className="modes" role="group" aria-label="Lunch or evening view">
      {(['lunch', 'evening'] as const).map((m) => (
        <button key={m} type="button" aria-pressed={mode === m} onClick={() => pick(m)} className="modes__btn">
          {mode === m && <motion.span layoutId="mode-pill" className="modes__pill" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
          <span className="modes__label">{m === 'lunch' ? 'Lunch' : 'After 5'}</span>
        </button>
      ))}
    </div>
  );
}

function CompactBoard() {
  const wiches = [...STALWARTS, ...THIS_WEEK.specials, ...THIS_WEEK.cauldron];
  return (
    <div className="mini-board">
      <p className="mini-board__head">
        On the board <span>{boardDates(THIS_WEEK.from, THIS_WEEK.to)}</span>
      </p>
      <ul>
        {wiches.map((w) => (
          <li key={w.name}>
            <span className="mini-board__name">
              {w.name}
              {STALWARTS.includes(w) && <em>always on</em>}
            </span>
            <span className="mini-board__dots" aria-hidden="true" />
            <span className="mini-board__price">
              {typeof w.price === 'number' ? (
                <Money value={w.price} />
              ) : (
                <>
                  <Money value={w.price.reg} /> / <Money value={w.price.sml} />
                </>
              )}
            </span>
          </li>
        ))}
      </ul>
      <Link to="/menu" className="arrow-link">
        Full board, sides &amp; floats
      </Link>
    </div>
  );
}

function Tonight() {
  return (
    <div className="tonight">
      <p className="tonight__head">At the bar tonight</p>
      <ul>
        <li>
          <strong>{BAR.feature.name}</strong> <span>on keg, with Gravity Well</span>
        </li>
        <li>
          <strong>Frozen margaritas</strong>
        </li>
        <li>
          <strong>Pickleback &amp; kimchiback</strong> <span>shots</span>
        </li>
      </ul>
      <Link to="/bar" className="arrow-link">
        The whole bar
      </Link>
    </div>
  );
}

export function Now() {
  const { mode } = useClock();
  return (
    <section className="now" aria-label="Open now, this week's board and where to find us">
      <div className="now__sign">
        <StatusSign />
        <ModeSwitch />
      </div>
      <div className="now__what">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {mode === 'evening' && <Tonight />}
            <CompactBoard />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="now__pic">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <Photo
              name={mode === 'evening' ? 'marg' : 'spread'}
              sizes="320px"
              eager
              caption={mode === 'evening' ? 'Frozen marg, chilli rim.' : 'On the splattered benches outside 14D.'}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="now__where">
        <p className="now__unit">
          14D Market Row
          <span>Brixton Village</span>
        </p>
        <p className="now__how">Off Coldharbour Lane, opposite Esme&rsquo;s. Look for the yellow.</p>
        <div className="now__btns">
          <a className="btn btn--ink" href={CONTACT.mapsUrl} target="_blank" rel="noreferrer">
            Directions
          </a>
          <Link className="btn btn--line" to="/find-us">
            Market Row map
          </Link>
        </div>
      </div>
    </section>
  );
}
