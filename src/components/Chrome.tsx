import { motion } from 'framer-motion';
import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/brand/logo.png';
import { CONTACT, HOURS } from '../data/coven';
import { SIGNS } from '../data/words';
import { useClock } from '../lib/clock';
import { dayHours, DAY_NAMES, WEEK_ORDER } from '../lib/time';
import { statusWords } from './StatusSign';

export const NAV = [
  { to: '/menu', label: 'Board' },
  { to: '/bar', label: 'Bar' },
  { to: '/find-us', label: 'Find 14D' },
  { to: '/hours', label: 'Hours' },
  { to: '/the-coven', label: 'The Coven' },
];

export function Fascia() {
  return (
    <header className="fascia">
      <div className="fascia__inner">
        <Link to="/" className="fascia__logo" aria-label="THE COVEN of WICHES, home">
          <motion.img
            src={logo}
            alt="THE COVEN of WICHES"
            width={720}
            height={400}
            initial={{ scale: 1.15, rotate: -4, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
          />
        </Link>
        <Link to="/find-us" className="fascia__where">
          <span className="fascia__unit">{CONTACT.address.unit}</span>
          <span>{CONTACT.address.market}</span>
          <span>Off Coldharbour Lane</span>
        </Link>
        <p className="fascia__tag">{SIGNS.fascia}</p>
      </div>
      <nav className="strip" aria-label="Sections">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} className="strip__link">
            {n.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export function BottomBar() {
  const { status, now } = useClock();
  const w = statusWords(status, now.day);
  return (
    <div className="bottombar">
      <Link to="/hours" className={`bottombar__status ${status.kind === 'open' ? 'is-open' : ''}`}>
        <span className="bottombar__dot" aria-hidden="true" />
        {w.short}
      </Link>
      <Link to="/menu" className="bottombar__btn">
        Board
      </Link>
      <a href={CONTACT.mapsUrl} target="_blank" rel="noreferrer" className="bottombar__btn bottombar__btn--go">
        Directions
      </a>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div>
          <img src={logo} alt="THE COVEN of WICHES" className="footer__logo" width={720} height={400} loading="lazy" />
          <p className="footer__addr">
            {CONTACT.address.unit}, {CONTACT.address.market}
            <br />
            {CONTACT.address.city} {CONTACT.address.postcode}
          </p>
        </div>
        <dl className="footer__hours">
          {WEEK_ORDER.map((d) => (
            <div key={d} className={HOURS[d].length ? '' : 'is-shut'}>
              <dt>{DAY_NAMES[d].slice(0, 3)}</dt>
              <dd>{dayHours(d)}</dd>
            </div>
          ))}
        </dl>
        <div className="footer__links">
          <a href={CONTACT.instagram.url} target="_blank" rel="noreferrer">
            {CONTACT.instagram.handle}
          </a>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </div>
      </div>
      <p className="footer__small">Photos: THE COVEN of WICHES. Map data &copy; OpenStreetMap contributors.</p>
      <p className="footer__credit">Site by AlexWilder-Dev</p>
    </footer>
  );
}
