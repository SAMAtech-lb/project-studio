import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { ReactNode, ElementType } from 'react';

type FadeInProps = {
  as?: ElementType;
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function FadeIn({
  as = 'div',
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
  style,
}: FadeInProps) {
  // Must be memoised: motion.create() returns a brand new component type each call,
  // and React unmounts/remounts the whole subtree when the type identity changes.
  const MotionTag = useMemo(() => motion.create(as as any), [as]);
  return (
    <MotionTag
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
      style={style}
    >
      {children}
    </MotionTag>
  );
}
