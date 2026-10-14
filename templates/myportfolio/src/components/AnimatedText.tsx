import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

type AnimatedTextProps = {
  text: string;
  className?: string;
  style?: React.CSSProperties;
};

type CharProps = {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
};

function Char({ char, index, total, progress }: CharProps) {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ opacity: 0 }}>{char === ' ' ? ' ' : char}</span>
      <motion.span
        style={{
          opacity,
          position: 'absolute',
          left: 0,
          top: 0,
        }}
      >
        {char === ' ' ? ' ' : char}
      </motion.span>
    </span>
  );
}

export default function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const chars = Array.from(text);
  const total = chars.length;

  return (
    <p ref={ref} className={className} style={style}>
      {chars.map((c, i) => (
        <Char key={i} char={c} index={i} total={total} progress={scrollYProgress} />
      ))}
    </p>
  );
}
