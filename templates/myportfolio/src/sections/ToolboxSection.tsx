import { useRef, useState } from 'react';
import type { CSSProperties, MouseEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  siBlender,
  siCinema4d,
  siDocker,
  siFigma,
  siCloudflare,
  siFramer,
  siGit,
  siLaravel,
  siMongodb,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siPhp,
  siPostgresql,
  siReact,
  siRedis,
  siSupabase,
  siTailwindcss,
  siThreedotjs,
  siTypescript,
  siVercel,
  siVite,
} from 'simple-icons';
import FadeIn from '../components/FadeIn';

type SimpleIcon = { title: string; hex: string; path: string };

type Category = 'Frontend' | 'Backend' | 'Design & 3D' | 'Infra';

type Tool = {
  icon: SimpleIcon;
  category: Category;
  /** Override for logos whose brand hex is black and would vanish on #0C0C0C. */
  color?: string;
};

const TOOLS: Tool[] = [
  { icon: siReact, category: 'Frontend' },
  { icon: siTypescript, category: 'Frontend' },
  { icon: siNextdotjs, category: 'Frontend', color: '#F2F6F9' },
  { icon: siTailwindcss, category: 'Frontend' },
  { icon: siThreedotjs, category: 'Frontend', color: '#D7E2EA' },
  { icon: siFramer, category: 'Frontend', color: '#4D7CFF' },
  { icon: siVite, category: 'Frontend' },

  { icon: siLaravel, category: 'Backend' },
  { icon: siPhp, category: 'Backend' },
  { icon: siNodedotjs, category: 'Backend' },
  { icon: siMysql, category: 'Backend' },
  { icon: siPostgresql, category: 'Backend' },
  { icon: siMongodb, category: 'Backend' },
  { icon: siRedis, category: 'Backend' },
  { icon: siSupabase, category: 'Backend' },

  { icon: siFigma, category: 'Design & 3D' },
  { icon: siBlender, category: 'Design & 3D' },
  // Cinema 4D's brand navy is near-black on this background, so it gets a lift.
  { icon: siCinema4d, category: 'Design & 3D', color: '#5B8DEF' },

  { icon: siGit, category: 'Infra' },
  { icon: siDocker, category: 'Infra' },
  { icon: siCloudflare, category: 'Infra' },
  { icon: siVercel, category: 'Infra', color: '#F2F6F9' },
];

const FILTERS: Array<'All' | Category> = [
  'All',
  'Frontend',
  'Backend',
  'Design & 3D',
  'Infra',
];

function ToolCell({ tool, index }: { tool: Tool; index: number }) {
  const color = tool.color ?? `#${tool.icon.hex}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative flex aspect-square flex-col items-center justify-center gap-3 overflow-hidden"
      style={{ '--c': color, background: '#0C0C0C' } as CSSProperties}
    >
      {/* Brand-coloured wash that rises from the bottom of the cell on hover. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-[0.16]"
        style={{
          background:
            'radial-gradient(130% 90% at 50% 115%, var(--c), transparent 70%)',
        }}
      />

      <span className="absolute left-3 top-3 text-[0.6rem] font-light tracking-[0.2em] text-[#D7E2EA]/20 transition-colors duration-300 group-hover:text-[#D7E2EA]/45">
        {String(index + 1).padStart(2, '0')}
      </span>

      <svg
        viewBox="0 0 24 24"
        role="img"
        aria-label={tool.icon.title}
        className="relative h-8 w-8 text-[#D7E2EA]/45 transition-all duration-300 group-hover:scale-110 group-hover:text-[var(--c)] sm:h-10 sm:w-10"
      >
        <path d={tool.icon.path} fill="currentColor" />
      </svg>

      <span className="relative px-2 text-center text-[0.65rem] font-light uppercase leading-tight tracking-[0.15em] text-[#D7E2EA]/40 transition-colors duration-300 group-hover:text-[#D7E2EA] sm:text-xs">
        {tool.icon.title}
      </span>
    </motion.div>
  );
}

export default function ToolboxSection() {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState<'All' | Category>('All');

  const visible =
    active === 'All' ? TOOLS : TOOLS.filter((t) => t.category === active);

  // Written straight to the node as CSS vars -- a cursor this fast should never
  // drive React state.
  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = boardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <section
      className="relative z-[3] w-full px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-32"
      style={{ background: '#0C0C0C' }}
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="hero-heading text-center font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Toolbox
        </h2>
      </FadeIn>

      <FadeIn delay={0.12} y={20}>
        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-2 sm:mt-10 sm:gap-3">
          {FILTERS.map((filter) => {
            const isActive = filter === active;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActive(filter)}
                aria-pressed={isActive}
                className={`rounded-full border px-4 py-2 text-[0.65rem] font-light uppercase tracking-[0.2em] transition-colors duration-300 sm:text-xs ${
                  isActive
                    ? 'border-[#D7E2EA] bg-[#D7E2EA] text-[#0C0C0C]'
                    : 'border-[#D7E2EA]/20 text-[#D7E2EA]/50 hover:border-[#D7E2EA]/50 hover:text-[#D7E2EA]'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </FadeIn>

      <FadeIn delay={0.2} y={30}>
        <div
          ref={boardRef}
          onMouseMove={handleMove}
          className="relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-[28px] border sm:mt-16 sm:rounded-[36px]"
          style={{ borderColor: 'rgba(215, 226, 234, 0.12)' }}
        >
          {/* Hairline dividers come from the 1px gap letting the board colour through. */}
          <motion.div
            layout
            className="grid grid-cols-2 gap-px sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            style={{ background: 'rgba(215, 226, 234, 0.12)' }}
          >
            <AnimatePresence mode="popLayout">
              {visible.map((tool, i) => (
                <ToolCell key={tool.icon.title} tool={tool} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Cursor spotlight, drawn over the grid so it lights the dividers too. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(340px circle at var(--mx, -999px) var(--my, -999px), rgba(215, 226, 234, 0.07), transparent 65%)',
            }}
          />
        </div>
      </FadeIn>
    </section>
  );
}
