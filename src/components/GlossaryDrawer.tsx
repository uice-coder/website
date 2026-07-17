import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePresentation } from '../context/PresentationContext';
import { GLOSSARY } from '../data/glossary';
import { CITATION } from '../data/scenes';

export function GlossaryDrawer() {
  const { glossaryOpen, toggleGlossary, reducedMotion } = usePresentation();
  const closeRef = useRef<HTMLButtonElement>(null);

  // Move focus into the drawer so keyboard users land somewhere sensible.
  useEffect(() => {
    if (glossaryOpen) closeRef.current?.focus();
  }, [glossaryOpen]);

  return (
    <AnimatePresence>
      {glossaryOpen && (
        <>
          <motion.div
            className="glossary__scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={toggleGlossary}
            aria-hidden="true"
          />
          <motion.div
            className="glossary"
            role="dialog"
            aria-modal="true"
            aria-label="Glossary"
            initial={reducedMotion ? { opacity: 0 } : { x: '100%' }}
            animate={reducedMotion ? { opacity: 1 } : { x: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          >
            <div className="glossary__head">
              <h2 className="glossary__title">Glossary</h2>
              <button
                ref={closeRef}
                type="button"
                className="ghostbtn"
                onClick={toggleGlossary}
              >
                Close
                <span className="ghostbtn__key" aria-hidden="true">
                  Esc
                </span>
              </button>
            </div>

            <dl className="glossary__list">
              {GLOSSARY.map((entry) => (
                <div key={entry.term}>
                  <dt className="glossary__term">{entry.term}</dt>
                  <dd className="glossary__def">{entry.definition}</dd>
                </div>
              ))}
            </dl>

            <p className="glossary__foot">{CITATION}</p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
