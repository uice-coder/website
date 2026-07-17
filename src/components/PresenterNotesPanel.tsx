import { AnimatePresence, motion } from 'framer-motion';
import { usePresentation } from '../context/PresentationContext';
import { SCENES } from '../data/scenes';
import { PRESENTER_NOTES } from '../data/notes';

export function PresenterNotesPanel() {
  const { notesOpen, toggleNotes, sceneIndex, reducedMotion } = usePresentation();
  const scene = SCENES[sceneIndex];
  if (!scene) return null;
  const script = PRESENTER_NOTES[scene.id] ?? '';

  return (
    <AnimatePresence>
      {notesOpen && (
        <motion.aside
          className="notes"
          aria-label="Presenter notes"
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.2 }}
        >
          <div className="notes__head">
            <span className="notes__label">Presenter notes</span>
            <span className="notes__scene">
              Chapter {scene.number} — {scene.title} · ~30 seconds
            </span>
            <button type="button" className="notes__close" onClick={toggleNotes}>
              Hide (N)
            </button>
          </div>
          <p className="notes__script">{script}</p>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
