import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { CONTACT, PAST_SPECIALS, STALWARTS, THIS_WEEK, type Wich } from '../data/coven';
import { boardDates, londonNow } from '../lib/time';
import { BoardWatermark, Money, Photo, Reveal } from './bits';

type Size = 'reg' | 'sml';

function Flip({ value }: { value: number }) {
  return (
    <span className="flip">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: '-70%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '70%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
        >
          <Money value={value} />
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function WichPrice({ w, size }: { w: Wich; size: Size }) {
  if (typeof w.price === 'number') {
    return (
      <span className={`wich__price ${size === 'sml' ? 'is-muted' : ''}`}>
        <Money value={w.price} />
        {size === 'sml' && <small>reg only this week</small>}
      </span>
    );
  }
  return (
    <span className="wich__price">
      <Flip value={w.price[size]} />
      <small>{size === 'reg' ? 'reg' : 'sml'}</small>
    </span>
  );
}

function SizeToggle({ size, setSize }: { size: Size; setSize: (s: Size) => void }) {
  return (
    <div className="size" role="group" aria-label="Regular or smaller">
      {(['reg', 'sml'] as const).map((s) => (
        <button key={s} type="button" aria-pressed={size === s} onClick={() => setSize(s)}>
          {size === s && <motion.span layoutId="size-pill" className="size__pill" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
          <span>{s === 'reg' ? 'Reg' : 'Sml'}</span>
        </button>
      ))}
    </div>
  );
}

function WichRow({ w, size }: { w: Wich; size: Size }) {
  return (
    <div className="wich">
      <div className="wich__head">
        <h4 className="wich__name">{w.name}</h4>
        <WichPrice w={w} size={size} />
      </div>
      <p className="wich__line">{w.line}</p>
      {w.fillings && <p className="wich__fill">{w.fillings.join(', ')}</p>}
    </div>
  );
}

export function Board() {
  const [size, setSize] = useState<Size>('reg');
  const stale = londonNow().date > THIS_WEEK.to;
  const reuben = STALWARTS[0];

  return (
    <section id="menu" className="section">
      <Reveal>
        <div className="board">
          <BoardWatermark />
          <header className="board__top">
            <p className="board__dates">{boardDates(THIS_WEEK.from, THIS_WEEK.to)}</p>
            <h2 className="board__title">This week&rsquo;s &rsquo;wiches</h2>
            <p className="board__sub">
              Vegan sandwiches from Chef Annabelle
              <br />
              Craft beers, pickles, spirits &amp; more
            </p>
            {stale && (
              <p className="board__stale">
                That&rsquo;s the latest board. The next one lands on{' '}
                <a href={CONTACT.instagram.url} target="_blank" rel="noreferrer">
                  {CONTACT.instagram.handle}
                </a>{' '}
                first.
              </p>
            )}
            <SizeToggle size={size} setSize={setSize} />
          </header>

          <div className="stalwart">
            <span className="stamp">Always on</span>
            <Photo name="reuben" className="stalwart__photo" sizes="(min-width: 960px) 360px, 80vw" />
            <div className="stalwart__text">
              <WichRow w={reuben} size={size} />
              <blockquote className="stalwart__quote">
                &ldquo;The only sandwich we keep on the menu while the others rotate as specials &hellip; Crowd pleaser,
                always.&rdquo;
                <cite>Annabelle Clarke</cite>
              </blockquote>
            </div>
          </div>

          <div className="specials">
            <h3 className="specials__head">
              <span className="stamp stamp--small">This week only</span>
            </h3>
            {THIS_WEEK.specials.map((w) => (
              <WichRow key={w.name} w={w} size={size} />
            ))}
          </div>

          <p className="board__rule" aria-hidden="true">
            - - - - - - - - - - - - -
          </p>

          <div className="cauldron">
            {THIS_WEEK.cauldron.map((w) => (
              <WichRow key={w.name} w={w} size={size} />
            ))}
          </div>

          <div className="sides">
            <h3 className="sides__head">Sides, dips &amp; floats</h3>
            <ul className="sides__list">
              {THIS_WEEK.sides.map((s) => (
                <li key={s.name} className={typeof s.price === 'number' ? '' : 'is-wide'}>
                  <span className="sides__name">
                    {s.name}
                    {s.note && <small>{s.note}</small>}
                  </span>
                  <span className="sides__price">
                    {typeof s.price === 'number' ? (
                      <Money value={s.price} />
                    ) : (
                      s.price.map((p, i) => (
                        <span key={p.label}>
                          {i > 0 && ' or '}
                          <Money value={p.price} /> <small>{p.label}</small>
                        </span>
                      ))
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <div className="floats">
              <p className="floats__name">
                {THIS_WEEK.floats.name}
                <small>{THIS_WEEK.floats.note}</small>
              </p>
              <ul>
                {THIS_WEEK.floats.options.map((o) => (
                  <li key={o.label}>
                    {o.label} <Money value={o.price} />
                  </li>
                ))}
              </ul>
            </div>
            <Photo name="mr-bang" className="sides__bang" sizes="(min-width: 960px) 240px, 40vw" />
          </div>

          <p className="board__foot">Specials rotate every week. The Reuben never leaves.</p>
        </div>
      </Reveal>

      <details className="past">
        <summary>Previously on the board</summary>
        <div className="past__inner">
          <Photo name="agatha" className="past__photo" sizes="(min-width: 960px) 260px, 50vw" />
          <ul>
            {PAST_SPECIALS.map((p) => (
              <li key={p.name}>
                <strong>{p.name}</strong> {p.line}
              </li>
            ))}
          </ul>
          <p className="past__note">Laid to rest. For now.</p>
        </div>
      </details>
    </section>
  );
}
