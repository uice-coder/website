import { usePresentation } from '../context/PresentationContext';

export function SceneControls() {
  const { prev, next, canPrev, canNext, sceneControls, mode } = usePresentation();
  const status = sceneControls?.status ?? 'idle';
  const playLabel = status === 'running' ? 'Pause' : 'Play';

  return (
    <div className="controls">
      <div className="controls__group">
        <button
          type="button"
          className="navbtn"
          onClick={prev}
          disabled={!canPrev}
          aria-label="Previous chapter"
        >
          <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true">
            <path
              d="M16 6H2M6 2L2 6l4 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Previous
        </button>
        <button
          type="button"
          className="navbtn navbtn--primary"
          onClick={next}
          disabled={!canNext}
          aria-label="Next chapter"
        >
          Next
          <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true">
            <path
              d="M0 6h14M10 2l4 4-4 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <p className="controls__hint">
        <kbd>←</kbd> <kbd>→</kbd> chapter · <kbd>Space</kbd> play/pause ·{' '}
        <kbd>R</kbd> replay · <kbd>N</kbd> notes · <kbd>G</kbd> glossary
        {mode === 'explore' && (
          <>
            {' '}
            · <kbd>1</kbd>–<kbd>6</kbd> jump
          </>
        )}
      </p>

      <div className="controls__group">
        <button
          type="button"
          className="navbtn"
          onClick={() => sceneControls?.replay()}
          disabled={!sceneControls}
          aria-label="Replay this scene's animation"
        >
          Replay
        </button>
        <button
          type="button"
          className="navbtn"
          onClick={() => sceneControls?.toggle()}
          disabled={!sceneControls}
          aria-label={`${playLabel} this scene's animation`}
        >
          {playLabel}
        </button>
      </div>
    </div>
  );
}
