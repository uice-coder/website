import { useEffect } from 'react';
import { usePresentation } from '../context/PresentationContext';
import { SCENES } from '../data/scenes';

/** True when the user is typing into a field — shortcuts must not hijack that. */
function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return (
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    target.isContentEditable
  );
}

/**
 * Global keyboard layer. Mounted once.
 *
 * Space and R are forwarded to whichever scene is currently registered.
 */
export function KeyboardManager() {
  const {
    next,
    prev,
    goTo,
    mode,
    toggleNotes,
    toggleGlossary,
    closePanels,
    sceneControls,
  } = usePresentation();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      switch (event.key) {
        case 'ArrowRight':
          event.preventDefault();
          next();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          prev();
          break;
        case ' ':
        case 'Spacebar':
          event.preventDefault();
          sceneControls?.toggle();
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          sceneControls?.replay();
          break;
        case 'n':
        case 'N':
          event.preventDefault();
          toggleNotes();
          break;
        case 'g':
        case 'G':
          event.preventDefault();
          toggleGlossary();
          break;
        case 'Escape':
          event.preventDefault();
          closePanels();
          break;
        default: {
          if (mode !== 'explore') break;
          const digit = Number.parseInt(event.key, 10);
          if (!Number.isNaN(digit) && digit >= 1 && digit <= SCENES.length) {
            event.preventDefault();
            goTo(digit - 1);
          }
          break;
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    next,
    prev,
    goTo,
    mode,
    toggleNotes,
    toggleGlossary,
    closePanels,
    sceneControls,
  ]);

  return null;
}
