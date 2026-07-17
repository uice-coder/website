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
      </div>
    </header>
  );
}
