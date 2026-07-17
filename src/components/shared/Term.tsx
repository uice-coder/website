import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GLOSSARY_MAP } from '../../data/glossary';

interface Props {
  /** Glossary key. Falls back to the visible text. */
  name?: string;
  children: string;
}

/**
 * A technical term with a tooltip, on hover and on keyboard focus.
 * Definitions come from the same list the glossary drawer renders.
 */
export function Term({ name, children }: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const entry = GLOSSARY_MAP.get((name ?? children).toLowerCase());

  if (!entry) return <>{children}</>;

  return (
    <button
      type="button"
      className="term"
      aria-describedby={open ? id : undefined}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={(e) => {
        e.preventDefault();
        setOpen((v) => !v);
      }}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.span
            className="term__pop"
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
          >
            <strong>{entry.term}</strong>
            {entry.definition}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
