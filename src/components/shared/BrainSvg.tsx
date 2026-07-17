import { motion } from 'framer-motion';

interface Props {
  /** Pulse while the model is "thinking". */
  active: boolean;
  size?: number;
  reducedMotion?: boolean;
}

/**
 * An abstract parametric-memory node. Deliberately not a robot: the point is
 * "sealed store of weights", not "AI is a machine".
 */
export function BrainSvg({ active, size = 190, reducedMotion = false }: Props) {
  return (
    <motion.svg
      width={size}
      height={size * 0.86}
      viewBox="0 0 200 172"
      aria-hidden="true"
      animate={
        active && !reducedMotion
          ? { scale: [1, 1.02, 1] }
          : { scale: 1 }
      }
      transition={
        active && !reducedMotion
          ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 0.3 }
      }
    >
      <defs>
        <radialGradient id="brainGlow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#7656D6" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#7656D6" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="100" cy="82" rx="95" ry="82" fill="url(#brainGlow)" />

      {/* Two hemispheres */}
      <path
        className="brain__shell"
        d="M100 22c-14-14-38-14-50 2-16-4-30 8-30 24 0 6 2 11 5 15-7 6-11 15-11 25 0 14 8 26 20 31 1 16 14 28 30 28 14 0 26-9 30-21 2 1 4 1 6 1V22z"
      />
      <path
        className="brain__shell"
        d="M100 22c14-14 38-14 50 2 16-4 30 8 30 24 0 6-2 11-5 15 7 6 11 15 11 25 0 14-8 26-20 31-1 16-14 28-30 28-14 0-26-9-30-21-2 1-4 1-6 1V22z"
      />

      {/* Folds — suggest stored structure without pretending to be anatomical */}
      <path className="brain__fold" d="M100 40c-10 0-18 6-18 14s8 12 18 12" />
      <path className="brain__fold" d="M100 40c10 0 18 6 18 14s-8 12-18 12" />
      <path className="brain__fold" d="M100 84c-12 0-22 7-22 16s10 14 22 14" />
      <path className="brain__fold" d="M100 84c12 0 22 7 22 16s-10 14-22 14" />
      <path className="brain__fold" d="M52 52c8 2 14 8 16 16" />
      <path className="brain__fold" d="M148 52c-8 2-14 8-16 16" />
      <path className="brain__fold" d="M44 104c8-2 16 2 20 10" />
      <path className="brain__fold" d="M156 104c-8-2-16 2-20 10" />

      {/* Centre line */}
      <path
        d="M100 22v128"
        fill="none"
        stroke="#7656D6"
        strokeWidth="1.5"
        opacity="0.55"
      />
    </motion.svg>
  );
}
