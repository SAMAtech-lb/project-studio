import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import {
  siBlender,
  siCinema4d,
  siCloudflare,
  siDocker,
  siFigma,
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

type Tool = {
  icon: SimpleIcon;
  /** Drives bubble size: 3 = daily driver, 1 = occasional. */
  weight: 1 | 2 | 3;
  label?: string;
  color?: string;
};

const TOOLS: Tool[] = [
  { icon: siReact, weight: 3 },
  { icon: siLaravel, weight: 3 },
  { icon: siTypescript, weight: 3 },
  { icon: siTailwindcss, weight: 3, label: 'Tailwind' },
  { icon: siPhp, weight: 3 },
  { icon: siNextdotjs, weight: 2, color: '#F2F6F9' },
  { icon: siNodedotjs, weight: 2, label: 'Node' },
  { icon: siMysql, weight: 2 },
  { icon: siPostgresql, weight: 2, label: 'Postgres' },
  { icon: siMongodb, weight: 2 },
  { icon: siThreedotjs, weight: 2, label: 'Three.js', color: '#D7E2EA' },
  { icon: siFramer, weight: 2, label: 'Framer', color: '#4D7CFF' },
  { icon: siFigma, weight: 2 },
  { icon: siBlender, weight: 2 },
  { icon: siGit, weight: 2 },
  { icon: siDocker, weight: 1 },
  { icon: siCloudflare, weight: 1 },
  { icon: siVercel, weight: 1, color: '#F2F6F9' },
  { icon: siSupabase, weight: 1 },
  { icon: siRedis, weight: 1 },
  { icon: siVite, weight: 1 },
  { icon: siCinema4d, weight: 1, label: 'Cinema 4D', color: '#5B8DEF' },
];

const WEIGHT_SCALE: Record<Tool['weight'], number> = { 1: 0.76, 2: 0.94, 3: 1.18 };

const WALL_BOUNCE = 0.86;
const PAIR_BOUNCE = 0.9;
const DRIFT = 0.014; // random nudge per frame, keeps the float alive
const MIN_SPEED = 0.14;
const MAX_SPEED = 5;
const THROW_SPEED = 26; // ceiling for a flick, so nothing leaves orbit

type Body = { x: number; y: number; vx: number; vy: number; r: number };

export default function BubblesSection() {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const nodesRef = useRef<Array<HTMLDivElement | null>>([]);
  const bodiesRef = useRef<Body[]>([]);
  const dragRef = useRef<{ i: number; dx: number; dy: number } | null>(null);
  const visibleRef = useRef(true);
  const [box, setBox] = useState({ w: 0, h: 0, base: 0 });

  // No point simulating an arena nobody is looking at.
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { rootMargin: '150px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Measure the arena and keep radii proportional to it.
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;

    const measure = () => {
      // Read through the ref, never a captured node: a detached element reports
      // 0x0 and would blank the whole arena.
      const node = boxRef.current;
      if (!node) return;
      const { width, height } = node.getBoundingClientRect();
      if (!width || !height) return;

      const base = Math.max(30, Math.min(width / 13, 62));
      setBox((prev) =>
        prev.w === width && prev.h === height ? prev : { w: width, h: height, base },
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // (Re)seed bodies whenever the arena resizes, keeping relative positions.
  useEffect(() => {
    if (!box.w || !box.h) return;
    const bodies = bodiesRef.current;

    TOOLS.forEach((tool, i) => {
      const r = box.base * WEIGHT_SCALE[tool.weight];
      const existing = bodies[i];

      if (existing) {
        existing.r = r;
        existing.x = Math.min(Math.max(existing.x, r), box.w - r);
        existing.y = Math.min(Math.max(existing.y, r), box.h - r);
        return;
      }

      // Deterministic scatter -- a seeded angle beats Math.random() for a layout
      // that shouldn't reshuffle jarringly between renders.
      const angle = (i / TOOLS.length) * Math.PI * 2 * 3.3;
      const spread = 0.28 + ((i * 7) % 11) / 22;
      bodies[i] = {
        r,
        x: box.w / 2 + Math.cos(angle) * (box.w / 2 - r) * spread,
        y: box.h / 2 + Math.sin(angle) * (box.h / 2 - r) * spread,
        vx: Math.cos(angle * 2.1) * 0.9,
        vy: Math.sin(angle * 1.7) * 0.9,
      };
    });
  }, [box]);

  // Simulation loop. Writes transforms straight to the DOM -- 22 bodies at 60fps
  // through React state would be 1300 renders a second.
  useEffect(() => {
    if (!box.w || !box.h) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;

    const step = () => {
      const bodies = bodiesRef.current;
      const dragging = dragRef.current?.i ?? -1;

      if (!visibleRef.current) {
        frame = requestAnimationFrame(step);
        return;
      }

      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i];
        if (!b || i === dragging) continue;

        if (!reduced) {
          b.vx += (Math.random() - 0.5) * DRIFT;
          b.vy += (Math.random() - 0.5) * DRIFT;
          b.x += b.vx;
          b.y += b.vy;
        }

        if (b.x - b.r < 0) {
          b.x = b.r;
          b.vx = Math.abs(b.vx) * WALL_BOUNCE;
        } else if (b.x + b.r > box.w) {
          b.x = box.w - b.r;
          b.vx = -Math.abs(b.vx) * WALL_BOUNCE;
        }
        if (b.y - b.r < 0) {
          b.y = b.r;
          b.vy = Math.abs(b.vy) * WALL_BOUNCE;
        } else if (b.y + b.r > box.h) {
          b.y = box.h - b.r;
          b.vy = -Math.abs(b.vy) * WALL_BOUNCE;
        }

        // Never fully settle, never run away.
        const speed = Math.hypot(b.vx, b.vy);
        if (speed > MAX_SPEED) {
          b.vx = (b.vx / speed) * MAX_SPEED;
          b.vy = (b.vy / speed) * MAX_SPEED;
        } else if (!reduced && speed < MIN_SPEED) {
          const boost = MIN_SPEED / (speed || 1);
          b.vx *= boost;
          b.vy *= boost;
        }
      }

      // Equal-mass elastic response; a dragged bubble acts as immovable mass.
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i];
          const b = bodies[j];
          if (!a || !b) continue;

          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.0001;
          const overlap = a.r + b.r - dist;
          if (overlap <= 0) continue;

          const nx = dx / dist;
          const ny = dy / dist;
          const aFree = i !== dragging;
          const bFree = j !== dragging;
          const freeCount = (aFree ? 1 : 0) + (bFree ? 1 : 0);
          if (freeCount === 0) continue;

          const push = overlap / freeCount;
          if (aFree) {
            a.x -= nx * push;
            a.y -= ny * push;
          }
          if (bFree) {
            b.x += nx * push;
            b.y += ny * push;
          }

          const vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (vn >= 0) continue;
          const impulse = (-(1 + PAIR_BOUNCE) * vn) / freeCount;
          if (aFree) {
            a.vx -= impulse * nx;
            a.vy -= impulse * ny;
          }
          if (bFree) {
            b.vx += impulse * nx;
            b.vy += impulse * ny;
          }
        }
      }

      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i];
        const node = nodesRef.current[i];
        if (!b || !node) continue;
        node.style.transform = `translate3d(${b.x - b.r}px, ${b.y - b.r}px, 0)`;
      }

      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [box]);

  // Pointer drag. Velocity comes from the pointer delta, so releasing throws.
  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      const el = boxRef.current;
      const body = drag ? bodiesRef.current[drag.i] : null;
      if (!drag || !el || !body) return;

      const rect = el.getBoundingClientRect();
      const nx = e.clientX - rect.left - drag.dx;
      const ny = e.clientY - rect.top - drag.dy;
      const clampedX = Math.min(Math.max(nx, body.r), rect.width - body.r);
      const clampedY = Math.min(Math.max(ny, body.r), rect.height - body.r);

      body.vx = clampedX - body.x;
      body.vy = clampedY - body.y;
      body.x = clampedX;
      body.y = clampedY;
    };

    const handleUp = () => {
      const drag = dragRef.current;
      const body = drag ? bodiesRef.current[drag.i] : null;
      if (body) {
        const speed = Math.hypot(body.vx, body.vy);
        if (speed > THROW_SPEED) {
          body.vx = (body.vx / speed) * THROW_SPEED;
          body.vy = (body.vy / speed) * THROW_SPEED;
        }
      }
      dragRef.current = null;
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };
  }, []);

  const handleGrab = (i: number) => (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = boxRef.current;
    const body = bodiesRef.current[i];
    if (!el || !body) return;
    const rect = el.getBoundingClientRect();
    dragRef.current = {
      i,
      dx: e.clientX - rect.left - body.x,
      dy: e.clientY - rect.top - body.y,
    };
  };

  return (
    <section
      className="relative z-[4] w-full px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-32"
      style={{ background: '#0C0C0C' }}
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="hero-heading text-center font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Playground
        </h2>
      </FadeIn>

      <FadeIn delay={0.12} y={20}>
        <p
          className="mx-auto mt-5 max-w-[540px] text-center font-light uppercase tracking-wide text-[#D7E2EA]/50 sm:mt-6"
          style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.05rem)' }}
        >
          grab a bubble and throw it — bigger means i live in it
        </p>
      </FadeIn>

      <FadeIn delay={0.2} y={30}>
        <div
          ref={boxRef}
          className="relative mx-auto mt-12 h-[520px] max-w-5xl overflow-hidden rounded-[32px] border sm:mt-16 sm:h-[600px] sm:rounded-[44px] md:h-[680px]"
          style={{
            borderColor: 'rgba(215, 226, 234, 0.12)',
            background:
              'radial-gradient(120% 90% at 50% 0%, rgba(215, 226, 234, 0.05), transparent 60%)',
          }}
        >
          {TOOLS.map((tool, i) => {
            const color = tool.color ?? `#${tool.icon.hex}`;
            const size = box.base * WEIGHT_SCALE[tool.weight] * 2;
            return (
              <div
                key={tool.icon.title}
                ref={(node) => {
                  nodesRef.current[i] = node;
                }}
                onPointerDown={handleGrab(i)}
                className="absolute left-0 top-0 flex cursor-grab select-none flex-col items-center justify-center gap-1 rounded-full border active:cursor-grabbing"
                style={{
                  width: size,
                  height: size,
                  opacity: box.w ? 1 : 0,
                  borderColor: `${color}59`,
                  background: `radial-gradient(circle at 32% 26%, ${color}3d, ${color}0f 58%, rgba(12,12,12,0.72))`,
                  boxShadow: `inset 0 0 24px ${color}1f, 0 10px 34px -14px ${color}99`,
                  backdropFilter: 'blur(3px)',
                  touchAction: 'none',
                  willChange: 'transform',
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label={tool.icon.title}
                  style={{ width: size * 0.3, height: size * 0.3, color }}
                >
                  <path d={tool.icon.path} fill="currentColor" />
                </svg>
                <span
                  className="pointer-events-none px-1 text-center font-light uppercase leading-tight tracking-wider text-[#D7E2EA]/75"
                  style={{ fontSize: Math.max(8, size * 0.095) }}
                >
                  {tool.label ?? tool.icon.title}
                </span>
              </div>
            );
          })}
        </div>
      </FadeIn>
    </section>
  );
}
