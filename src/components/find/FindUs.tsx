import { motion } from 'framer-motion';
import { useState } from 'react';
import { CONTACT } from '../../data/coven';
import { MARKET_FACTS } from '../../data/words';
import { useClock } from '../../lib/clock';
import { Photo, Reveal } from '../bits';
import { ROUTES } from './geometry';
import { MarketRowMap, type RouteFrom } from './MarketRowMap';

export function FindUs() {
  const [route, setRoute] = useState<RouteFrom>('coldharbour');
  const { mode } = useClock();
  const { address } = CONTACT;
  return (
    <section id="find-us" className="section find">
      <Reveal>
        <h2 className="section__title">Finding 14D</h2>
        <p className="find__address">
          {address.unit}
          <span>
            {address.market}, {address.city} {address.postcode}
          </span>
        </p>
        <p className="find__lede">
          Market Row is the covered arcade between Electric Lane, Coldharbour Lane and Atlantic Road. We&rsquo;re on its short
          arm off Coldharbour Lane, opposite Esme&rsquo;s. Look for the yellow.
        </p>
      </Reveal>

      <Reveal className="find__mapcard" delay={0.05}>
        <div className="routes" role="group" aria-label="Show the way in from">
          <span className="routes__label">Coming in from</span>
          {ROUTES.map((r) => (
            <button key={r.from} type="button" aria-pressed={route === r.from} onClick={() => setRoute(r.from)}>
              {route === r.from && <motion.span layoutId="route-pill" className="routes__pill" />}
              <span className="routes__name">{r.label}</span>
              <span className="routes__m">{r.metres} m</span>
            </button>
          ))}
        </div>
        <MarketRowMap route={route} />
        <p className="find__credit">
          Drawn from OpenStreetMap (&copy; OpenStreetMap contributors) and Brixton Village&rsquo;s trader map. Distances are
          walking distances inside the arcade.
        </p>
        <div className="find__btns">
          <a className="btn btn--ink" href={CONTACT.mapsUrl} target="_blank" rel="noreferrer">
            Open in Google Maps
          </a>
          <a className="btn btn--line" href={CONTACT.brixtonVillageMapUrl} target="_blank" rel="noreferrer">
            Brixton Village map
          </a>
        </div>
      </Reveal>

      <div className="find__fronts">
        <Reveal>
          <Photo
            name={mode === 'evening' ? 'shopfront-night' : 'shopfront-day'}
            className="find__front find__front--main"
            sizes="(min-width: 960px) 520px, 92vw"
            caption={mode === 'evening' ? 'At night, under the arcade lights.' : 'By day, A-board out front.'}
          />
        </Reveal>
        <Reveal delay={0.05}>
          <Photo
            name={mode === 'evening' ? 'shopfront-day' : 'shopfront-night'}
            className="find__front"
            sizes="(min-width: 960px) 360px, 60vw"
            caption={mode === 'evening' ? 'By day, A-board out front.' : 'At night, under the arcade lights.'}
          />
        </Reveal>
      </div>

      <ul className="find__facts">
        <li>{MARKET_FACTS.history}</li>
        <li>{MARKET_FACTS.access}</li>
      </ul>
    </section>
  );
}
