import { Link } from 'react-router-dom';
import { BAR, HOURS, THIS_WEEK } from '../data/coven';
import { clock, toMin, WEEK_ORDER, DAY_NAMES, hasEvening, DAYS } from '../lib/time';
import { Photo, Reveal, Splatter } from './bits';

// "Wed–Fri 5–9 · Sat till 10", worked out from HOURS
function barHours() {
  const evenings = WEEK_ORDER.filter((d) => hasEvening(DAYS.indexOf(d))).map((d) => {
    const s = HOURS[d];
    const last = s[s.length - 1];
    return { d, from: s.length > 1 ? toMin(last[0]) : null, to: toMin(last[1]) };
  });
  const groups: { days: string[]; from: number | null; to: number }[] = [];
  for (const e of evenings) {
    const g = groups[groups.length - 1];
    if (g && g.from === e.from && g.to === e.to) g.days.push(e.d);
    else groups.push({ days: [e.d], from: e.from, to: e.to });
  }
  return groups
    .map((g) => {
      const name = (d: string) => DAY_NAMES[d as keyof typeof DAY_NAMES].slice(0, 3);
      const days = g.days.length > 1 ? `${name(g.days[0])}–${name(g.days[g.days.length - 1])}` : name(g.days[0]);
      return g.from ? `${days} ${clock(g.from)}–${clock(g.to)}` : `${days} till ${clock(g.to)}`;
    })
    .join(' · ');
}

export function Bar() {
  return (
    <section id="bar" className="section bar">
      <div className="bench">
        <Splatter seed={7} count={70} className="bench__paint" />
        <div className="bench__inner">
          <Reveal className="bar__aboard">
            <h2 className="aboard">
              {BAR.aBoard.map((w) => (
                <span key={w}>{w}</span>
              ))}
            </h2>
            <p className="bar__hours">{barHours()}</p>
            <p className="bar__lede">
              Wednesday to Friday, lunch ends at 3. At 5 the doors open again and 14D does exactly what the A-board
              says.
            </p>
          </Reveal>

          <Reveal className="bar__feature" delay={0.05}>
            <Photo name={BAR.feature.photo} className="bar__can" sizes="(min-width: 960px) 420px, 88vw" />
            <div>
              <p className="bar__kicker">House pour</p>
              <h3 className="bar__name">{BAR.feature.name}</h3>
              <p>{BAR.feature.what}.</p>
              <p className="bar__how">{BAR.feature.how}. 666% vegan, obviously.</p>
            </div>
          </Reveal>

          <div className="pours">
            {BAR.pours.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.05} className={`pour ${p.photo ? 'pour--photo' : ''}`}>
                {p.photo && <Photo name={p.photo} className="pour__photo" sizes="(min-width: 960px) 300px, 60vw" />}
                <h3>{p.name}</h3>
                {p.note && <p>{p.note}</p>}
              </Reveal>
            ))}
            <Reveal delay={0.2} className="pour pour--late">
              <h3>Soda floats, too</h3>
              <p>
                {THIS_WEEK.floats.options.map((o) => o.label).join(' · ')}. <Link to="/menu">On the board</Link>.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
