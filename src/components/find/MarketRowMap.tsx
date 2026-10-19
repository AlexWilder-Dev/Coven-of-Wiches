import { motion } from 'framer-motion';
import { ESMES, ESMES_CENTRE, FRONT, MARKET_ROW, PASSAGES, ROUTES, STREETS, UNIT_14D, UNIT_14D_CENTRE, VIEWBOX } from './geometry';

export type RouteFrom = (typeof ROUTES)[number]['from'];

// Street label spots, taken from in-view segments of the generated geometry
const LABELS: { text: string; x: number; y: number; r: number }[] = [
  { text: 'Coldharbour Lane', x: 38, y: 29, r: -14.5 },
  { text: 'Electric Lane', x: -61.4, y: 12, r: -85 },
  { text: 'Atlantic Road', x: 45.2, y: -34.6, r: 42.4 },
  { text: 'Electric Avenue', x: -40, y: -21.8, r: 0 },
];

export function MarketRowMap({ route }: { route: RouteFrom }) {
  const { x, y, w, h } = VIEWBOX;
  const active = ROUTES.find((r) => r.from === route)!;
  return (
    <svg className="mrmap" viewBox={`${x} ${y} ${w} ${h}`} role="img" aria-labelledby="mrmap-title">
      <title id="mrmap-title">
        Map of Market Row: 14D is on the short arm off Coldharbour Lane, opposite Esme&rsquo;s. Route shown from {active.label},
        about {active.metres} metres.
      </title>
      <defs>
        <clipPath id="mrmap-clip">
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
      </defs>
      <g clipPath="url(#mrmap-clip)">
        <rect x={x} y={y} width={w} height={h} className="mrmap__ground" />
        {STREETS.map((s) => (
          <g key={s.name}>
            <path d={s.d} className="mrmap__street-case" />
            <path d={s.d} className="mrmap__street" />
          </g>
        ))}
        <path d={MARKET_ROW} className="mrmap__row" />
        {PASSAGES.map((d) => (
          <path key={d} d={d} className="mrmap__passage" />
        ))}
        <path d={ESMES} className="mrmap__esmes" />
        <path d={`M${ESMES_CENTRE[0] + 3} ${ESMES_CENTRE[1]}H${ESMES_CENTRE[0] + 10}`} className="mrmap__leader" />
        <text x={ESMES_CENTRE[0] + 11} y={ESMES_CENTRE[1]} className="mrmap__small">
          Esme&rsquo;s
        </text>

        <motion.path
          key={active.from}
          d={active.d}
          className="mrmap__route"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: Math.min(2.2, 0.6 + active.metres / 60), ease: 'easeInOut' }}
        />
        {ROUTES.map((r) => (
          <g key={r.from} className={`mrmap__door ${r.from === route ? 'is-on' : ''}`}>
            <circle cx={r.start[0]} cy={r.start[1]} r={2.6} />
          </g>
        ))}

        <path d={UNIT_14D} className="mrmap__unit" />
        <motion.circle
          cx={FRONT[0]}
          cy={FRONT[1]}
          r={4}
          className="mrmap__pulse"
          animate={{ r: [3, 9], opacity: [0.9, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
        />
        <path
          d={`M${UNIT_14D_CENTRE[0] - 9} ${UNIT_14D_CENTRE[1] - 5.5}L${UNIT_14D_CENTRE[0] - 3} ${UNIT_14D_CENTRE[1] - 1}`}
          className="mrmap__leader mrmap__leader--y"
        />
        <g transform={`translate(${UNIT_14D_CENTRE[0] - 26} ${UNIT_14D_CENTRE[1] - 4})`} className="mrmap__tag">
          <rect x={0} y={-6.5} width={17} height={10} rx={1.2} />
          <text x={8.5} y={1}>
            14D
          </text>
        </g>

        {LABELS.map((l) => (
          <text key={l.text} transform={`translate(${l.x} ${l.y}) rotate(${l.r})`} className="mrmap__label">
            {l.text}
          </text>
        ))}
        <text x={-34} y={-1.5} className="mrmap__row-label">
          Market Row
        </text>
      </g>
    </svg>
  );
}
