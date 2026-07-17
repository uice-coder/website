import { useEffect } from 'react';
import { usePresentation } from '../context/PresentationContext';
import type { SceneMachine } from './useSceneMachine';

/**
 * Exposes the mounted scene's machine to the global keyboard layer, so that
 * Space and R always act on exactly one, unambiguous target.
 */
export function useRegisterScene(machine: SceneMachine): void {
  const { registerScene } = usePresentation();

  useEffect(() => {
    registerScene({
      toggle: machine.toggle,
      replay: machine.replay,
      status: machine.status,
    });
    return () => registerScene(null);
  }, [registerScene, machine.toggle, machine.replay, machine.status]);
}
