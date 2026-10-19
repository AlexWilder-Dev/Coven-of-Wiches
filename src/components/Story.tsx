import { motion } from 'framer-motion';
import { ANNABELLE, MOVE, PRESS, SIGNS, STATEMENT } from '../data/words';
import { CONTACT } from '../data/coven';
import { Photo, Reveal } from './bits';

export function Story() {
  return (
    <section id="the-coven" className="section story">
      <div className="story__grid">
        <Reveal className="story__door">
          <Photo name="door" sizes="(min-width: 960px) 380px, 80vw" caption="14D, just before opening day." />
        </Reveal>
        <div>
          <Reveal>
            <h2 className="section__title story__title">{SIGNS.door}</h2>
          </Reveal>
          <ol className="move">
            {MOVE.map((m, i) => (
              <motion.li
                key={m.when}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <span className="move__when">{m.when}</span>
                <span className="move__what">{m.what}</span>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>

      <Reveal className="statement">
        <p className="statement__lead">{STATEMENT.lead}</p>
        <p className="statement__body">{STATEMENT.body}</p>
        <p className="statement__kicker">{STATEMENT.kicker}</p>
      </Reveal>

      <div className="window">
        <p>{SIGNS.window}</p>
      </div>

      <div className="press">
        {PRESS.map((p) => (
          <Reveal key={p.who} className="press__item">
            <blockquote>&ldquo;{p.quote}&rdquo;</blockquote>
            <a href={p.url} target="_blank" rel="noreferrer">
              {p.who}, {p.when}
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Chef() {
  return (
    <section id="annabelle" className="section chef">
      <Reveal>
        <p className="chef__kicker">Chef</p>
        <h2 className="section__title chef__name">{ANNABELLE.name}</h2>
        <p className="chef__cv">
          {ANNABELLE.cv.map((c, i) => (
            <span key={c}>
              {i > 0 && <i aria-hidden="true"> · </i>}
              {c}
            </span>
          ))}
        </p>
      </Reveal>
      <div className="chef__quotes">
        <Reveal className="chef__q chef__q--big">
          <blockquote>&ldquo;{ANNABELLE.why}&rdquo;</blockquote>
        </Reveal>
        <Reveal className="chef__q" delay={0.05}>
          <blockquote>&ldquo;{ANNABELLE.flavour}&rdquo;</blockquote>
        </Reveal>
        <Reveal className="chef__q chef__q--rule" delay={0.1}>
          <p className="chef__rule-head">Her kitchen tip</p>
          <blockquote>&ldquo;{ANNABELLE.tip}&rdquo;</blockquote>
        </Reveal>
      </div>
      <p className="chef__src">
        <a href={ANNABELLE.sourceUrl} target="_blank" rel="noreferrer">
          {ANNABELLE.source}
        </a>
        . Also heard on{' '}
        <a href={ANNABELLE.radio.url} target="_blank" rel="noreferrer">
          {ANNABELLE.radio.label}
        </a>
        .
      </p>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="section contact">
      <Reveal>
        <h2 className="section__title">Bitchin&rsquo; &rsquo;wiches, made by witches?</h2>
        <p className="contact__lede">
          The board changes every week. Questions, collabs, or a love letter to the Reuben: email or DM.
        </p>
      </Reveal>
      <div className="contact__links">
        <a className="contact__big" href={CONTACT.instagram.url} target="_blank" rel="noreferrer">
          <span>Instagram</span>
          {CONTACT.instagram.handle}
        </a>
        <a className="contact__big" href={`mailto:${CONTACT.email}`}>
          <span>Email</span>
          {CONTACT.email}
        </a>
      </div>
    </section>
  );
}
