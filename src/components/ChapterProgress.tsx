import { usePresentation } from '../context/PresentationContext';
import { SCENES } from '../data/scenes';

export function ChapterProgress() {
  const { sceneIndex, goTo, mode } = usePresentation();
  const current = SCENES[sceneIndex];
  const interactive = mode === 'explore';

  return (
    <nav
      className="progress"
      aria-label="Chapters"
      // The rail is the primary nav in Explore; in Guided it is a readout.
    >
      <p className="progress__readout">
        Chapter <strong>{sceneIndex + 1}</strong> of {SCENES.length} —{' '}
        <strong>{current?.title ?? ''}</strong>
      </p>

      <ol
        className={`progress__rail${
          interactive ? ' progress__rail--interactive' : ''
        }`}
      >
        {SCENES.map((scene, i) => {
          const state =
            i === sceneIndex ? 'current' : i < sceneIndex ? 'done' : 'todo';
          return (
            <li className="progress__item" key={scene.id}>
              <button
                type="button"
                className={`progress__step progress__step--${state}`}
                onClick={() => interactive && goTo(i)}
                disabled={!interactive}
                aria-current={i === sceneIndex ? 'step' : undefined}
                aria-label={
                  interactive
                    ? `Go to chapter ${scene.number}: ${scene.title}`
                    : `Chapter ${scene.number}: ${scene.title}`
                }
                title={interactive ? `Jump to ${scene.title}` : undefined}
              >
                {scene.number}. {scene.shortTitle}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
