import { motion } from 'framer-motion';
import { usePresentation } from '../context/PresentationContext';
import { SCENES } from '../data/scenes';
import { Scene1ClosedBook } from '../scenes/Scene1ClosedBook';
import { Scene2Pipeline } from '../scenes/Scene2Pipeline';
import { Scene3Memory } from '../scenes/Scene3Memory';
import { Scene4SequenceVsToken } from '../scenes/Scene4SequenceVsToken';
import { Scene5Findings } from '../scenes/Scene5Findings';
import { Scene6Limits } from '../scenes/Scene6Limits';

const SCENE_COMPONENTS = [
  Scene1ClosedBook,
  Scene2Pipeline,
  Scene3Memory,
  Scene4SequenceVsToken,
  Scene5Findings,
  Scene6Limits,
];

export function SceneViewport() {
  const { sceneIndex, reducedMotion } = usePresentation();
  const Scene = SCENE_COMPONENTS[sceneIndex] ?? Scene1ClosedBook;
  const meta = SCENES[sceneIndex];

  return (
    <main className="viewport" id="main">
      {/* Announce chapter changes to screen readers. */}
      <p className="sr-only" role="status" aria-live="polite">
        {meta ? `Chapter ${meta.number} of ${SCENES.length}: ${meta.title}` : ''}
      </p>

      {/*
        A keyed entry animation rather than AnimatePresence with an exit:
        `mode="wait"` makes mounting the next scene depend on the previous
        scene's exit animation finishing, so if the compositor stalls (a
        backgrounded tab, a throttled projector session) navigation stops
        working entirely. Swapping immediately keeps Previous/Next reliable.
      */}
      <motion.div
        key={sceneIndex}
        className="viewport__inner"
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: reducedMotion ? 0.001 : 0.28, ease: 'easeOut' }}
      >
        <Scene />
      </motion.div>
    </main>
  );
}
