import type { CSSProperties } from 'react';
import FadeIn from '../components/FadeIn';

type Tech = { name: string; color: string };

type Row = {
  label: string;
  speed: number;
  direction: 'left' | 'right';
  items: Tech[];
};

// Edit these three rows to match your real toolkit -- the layout adapts to any count.
const ROWS: Row[] = [
  {
    label: '01 — Design & 3D',
    speed: 48,
    direction: 'left',
    items: [
      { name: 'Blender', color: '#E87D0D' },
      { name: 'Cinema 4D', color: '#5B8DEF' },
      { name: 'ZBrush', color: '#D4A056' },
      { name: 'Substance', color: '#F26522' },
      { name: 'Octane', color: '#FF3B30' },
      { name: 'Redshift', color: '#E1352C' },
      { name: 'Houdini', color: '#FF6A3D' },
      { name: 'Spline', color: '#FF6B9A' },
    ],
  },
  {
    label: '02 — Web & Motion',
    speed: 38,
    direction: 'right',
    items: [
      { name: 'React', color: '#61DAFB' },
      { name: 'TypeScript', color: '#3178C6' },
      { name: 'Next.js', color: '#FFFFFF' },
      { name: 'Tailwind', color: '#38BDF8' },
      { name: 'Three.js', color: '#EDEDED' },
      { name: 'Framer Motion', color: '#FF4D8D' },
      { name: 'MongoDB', color: '#47A248' },
      { name: 'WebGL', color: '#FF5A5F' },
    ],
  },
  {
    label: '03 — Craft & Delivery',
    speed: 56,
    direction: 'left',
    items: [
      { name: 'Figma', color: '#F24E1E' },
      { name: 'After Effects', color: '#9999FF' },
      { name: 'Photoshop', color: '#31A8FF' },
      { name: 'Illustrator', color: '#FF9A00' },
      { name: 'Node.js', color: '#83CD29' },
      { name: 'Git', color: '#F05033' },
      { name: 'Vite', color: '#BD34FE' },
      { name: 'Cloudflare', color: '#F38020' },
      { name: 'Vercel', color: '#FFFFFF' },
    ],
  },
];

// The track holds two identical copies and travels exactly -50%, so the loop is seamless.
function MarqueeRow({ label, items, speed, direction }: Row) {
  const track = [...items, ...items];

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex items-center gap-4 sm:gap-6 px-5 sm:px-8 md:px-10">
        <span className="text-[#D7E2EA]/40 uppercase font-light whitespace-nowrap text-[0.6rem] sm:text-xs tracking-[0.3em]">
          {label}
        </span>
        <span className="h-px flex-1 bg-[#D7E2EA]/10" />
      </div>

      <div className="tech-marquee">
        <div
          className="tech-track"
          style={{
            animationName: `tech-scroll-${direction}`,
            animationDuration: `${speed}s`,
          }}
        >
          {track.map((tech, i) => (
            <span
              key={`${tech.name}-${i}`}
              className="tech-word font-black uppercase leading-none tracking-tight"
              style={
                {
                  '--tech-color': tech.color,
                  fontSize: 'clamp(2rem, 6.5vw, 6.5rem)',
                } as CSSProperties
              }
              // The second copy is a visual duplicate -- keep it out of the a11y tree.
              aria-hidden={i >= items.length}
            >
              {tech.name}
              <span className="tech-sep" aria-hidden>
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TechSection() {
  return (
    <section
      className="w-full rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-[2] py-20 sm:py-24 md:py-32 overflow-hidden"
      style={{ background: '#0C0C0C' }}
    >
      <div className="px-5 sm:px-8 md:px-10">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading font-black uppercase text-center leading-none tracking-tight"
            style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
          >
            Stack
          </h2>
        </FadeIn>

        <FadeIn delay={0.15} y={20}>
          <p
            className="text-[#D7E2EA]/50 font-light uppercase tracking-wide text-center mx-auto mt-5 sm:mt-6 max-w-[540px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.05rem)' }}
          >
            the tools i reach for — hover any one of them
          </p>
        </FadeIn>
      </div>

      <div className="flex flex-col gap-10 sm:gap-14 md:gap-16 mt-14 sm:mt-20 md:mt-24">
        {ROWS.map((row, i) => (
          <FadeIn key={row.label} delay={0.1 + i * 0.12} y={30}>
            <MarqueeRow {...row} />
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
