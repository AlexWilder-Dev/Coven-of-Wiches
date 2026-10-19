import { LayoutGroup, MotionConfig, motion } from 'framer-motion';
import { useEffect, type ReactNode } from 'react';
import { HashRouter, Route, Routes, useParams } from 'react-router-dom';
import { Bar } from './components/Bar';
import { Board } from './components/Board';
import { BottomBar, Fascia, Footer } from './components/Chrome';
import { FindUs } from './components/find/FindUs';
import { Hours } from './components/Hours';
import { Now } from './components/Now';
import { Chef, Contact, Story } from './components/Story';
import { ClockProvider, useClock } from './lib/clock';

const SECTIONS = ['menu', 'bar', 'find-us', 'hours', 'the-coven', 'annabelle', 'contact'];

function Slot({ id, children }: { id: string; children: ReactNode }) {
  return (
    <motion.div layout="position" transition={{ type: 'spring', stiffness: 180, damping: 28 }} data-slot={id}>
      {children}
    </motion.div>
  );
}

function Page() {
  const { section } = useParams();
  const { mode } = useClock();

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  useEffect(() => {
    if (!section || !SECTIONS.includes(section)) {
      window.scrollTo({ top: 0 });
      return;
    }
    const el = document.getElementById(section);
    if (!el) return;
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  }, [section]);

  // After 5 the bar leads; at lunch the board does
  const order = mode === 'evening' ? ['bar', 'menu', 'find'] : ['menu', 'find', 'bar'];
  const blocks: Record<string, ReactNode> = { menu: <Board />, bar: <Bar />, find: <FindUs /> };

  return (
    <>
      <Fascia />
      <main id="main">
        <Now />
        <LayoutGroup>
          {order.map((k) => (
            <Slot key={k} id={k}>
              {blocks[k]}
            </Slot>
          ))}
        </LayoutGroup>
        <Hours />
        <Story />
        <Chef />
        <Contact />
      </main>
      <Footer />
      <BottomBar />
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ClockProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Page />} />
            <Route path="/:section" element={<Page />} />
          </Routes>
        </HashRouter>
      </ClockProvider>
    </MotionConfig>
  );
}
