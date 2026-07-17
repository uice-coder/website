import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { SCENES } from '../data/scenes';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { SceneStatus } from '../hooks/useSceneMachine';

export type Mode = 'guided' | 'explore';

/** The controls a scene exposes to the global keyboard layer. */
export interface SceneControls {
  toggle: () => void;
  /** R and the Replay button: restart the scene and play it again. */
  replay: () => void;
  status: SceneStatus;
}

interface PresentationValue {
  mode: Mode;
  setMode: (mode: Mode) => void;
  sceneIndex: number;
  goTo: (index: number) => void;
  next: () => void;
  prev: () => void;
  canPrev: boolean;
  canNext: boolean;
  notesOpen: boolean;
  toggleNotes: () => void;
  glossaryOpen: boolean;
  toggleGlossary: () => void;
  closePanels: () => void;
  reducedMotion: boolean;
  /** Registered by whichever scene is mounted. */
  registerScene: (controls: SceneControls | null) => void;
  sceneControls: SceneControls | null;
}

const PresentationContext = createContext<PresentationValue | null>(null);

export function PresentationProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>('guided');
  const [sceneIndex, setSceneIndex] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  // Held in state (not just a ref) so consumers re-render when a scene mounts.
  const [sceneControls, setSceneControls] = useState<SceneControls | null>(null);
  const controlsRef = useRef<SceneControls | null>(null);

  const registerScene = useCallback((controls: SceneControls | null) => {
    controlsRef.current = controls;
    setSceneControls(controls);
  }, []);

  const goTo = useCallback((index: number) => {
    setSceneIndex(() => Math.max(0, Math.min(SCENES.length - 1, index)));
  }, []);

  const next = useCallback(
    () => setSceneIndex((i) => Math.min(SCENES.length - 1, i + 1)),
    [],
  );
  const prev = useCallback(() => setSceneIndex((i) => Math.max(0, i - 1)), []);

  const setMode = useCallback((value: Mode) => setModeState(value), []);
  const toggleNotes = useCallback(() => setNotesOpen((v) => !v), []);
  const toggleGlossary = useCallback(() => setGlossaryOpen((v) => !v), []);
  const closePanels = useCallback(() => {
    setNotesOpen(false);
    setGlossaryOpen(false);
  }, []);

  const value = useMemo<PresentationValue>(
    () => ({
      mode,
      setMode,
      sceneIndex,
      goTo,
      next,
      prev,
      canPrev: sceneIndex > 0,
      canNext: sceneIndex < SCENES.length - 1,
      notesOpen,
      toggleNotes,
      glossaryOpen,
      toggleGlossary,
      closePanels,
      reducedMotion,
      registerScene,
      sceneControls,
    }),
    [
      mode,
      setMode,
      sceneIndex,
      goTo,
      next,
      prev,
      notesOpen,
      toggleNotes,
      glossaryOpen,
      toggleGlossary,
      closePanels,
      reducedMotion,
      registerScene,
      sceneControls,
    ],
  );

  return (
    <PresentationContext.Provider value={value}>
      {children}
    </PresentationContext.Provider>
  );
}

export function usePresentation(): PresentationValue {
  const ctx = useContext(PresentationContext);
  if (!ctx) {
    throw new Error('usePresentation must be used inside a PresentationProvider');
  }
  return ctx;
}
