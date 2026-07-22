import { usePresentation } from '../context/PresentationContext';
import { SITE_SUBTITLE } from '../data/scenes';

export function TopBar() {
  const {
    mode,
    setMode,
    notesOpen,
    toggleNotes,
    glossaryOpen,
    toggleGlossary,
  } = usePresentation();

  return (
    <header className="topbar">
      <div className="topbar__brand">
        <h1 className="topbar__title">
          Inside <em>RAG</em>: From Memory to Evidence
        </h1>
        <p className="topbar__subtitle">{SITE_SUBTITLE}</p>
      </div>

      <div className="topbar__actions">
        <div className="modetoggle" role="group" aria-label="Presentation mode">
          <button
            type="button"
            className="modetoggle__btn"
            aria-pressed={mode === 'guided'}
            onClick={() => setMode('guided')}
          >
            Guided
          </button>
          <button
            type="button"
            className="modetoggle__btn"
            aria-pressed={mode === 'explore'}
            onClick={() => setMode('explore')}
          >
            Explore
          </button>
        </div>

        <button
          type="button"
          className="ghostbtn"
          aria-pressed={notesOpen}
          onClick={toggleNotes}
        >
          Presenter Notes
          <span className="ghostbtn__key" aria-hidden="true">
            N
          </span>
        </button>

        <button
          type="button"
          className="ghostbtn"
          aria-expanded={glossaryOpen}
          onClick={toggleGlossary}
        >
          Glossary
          <span className="ghostbtn__key" aria-hidden="true">
            G
          </span>
        </button>

        {/* Link out to the standalone classroom video lesson page. */}
        <a className="ghostbtn ghostbtn--link" href="/lesson.html">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            aria-hidden="true"
          >
            <rect
              x="0.75"
              y="2.25"
              width="13.5"
              height="10.5"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.4"
            />
            <path d="M6 5.5l3.5 2L6 9.5V5.5z" fill="currentColor" />
          </svg>
          Video Lesson
        </a>
      </div>
    </header>
  );
}
