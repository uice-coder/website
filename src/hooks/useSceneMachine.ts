import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type SceneStatus = 'idle' | 'running' | 'paused' | 'complete';

export interface TimelineStep {
  id: string;
  /** Duration in milliseconds. */
  duration: number;
}

export interface SceneMachine {
  status: SceneStatus;
  /** Milliseconds elapsed along the timeline. */
  elapsed: number;
  /** Id of the step currently playing (or the last one when complete). */
  phase: string;
  /** True once the timeline has reached the start of `id`. */
  reached: (id: string) => boolean;
  /** True once the timeline has passed the end of `id`. */
  done: (id: string) => boolean;
  /** Progress within step `id`, clamped to [0, 1]. */
  progressOf: (id: string) => number;
  play: () => void;
  pause: () => void;
  /** Space: play / pause, and replay from the start when already complete. */
  toggle: () => void;
  /** Return to the start and hold there. */
  reset: () => void;
  /** Return to the start and play again. What R and "Replay" do. */
  replay: () => void;
  /** Jump straight to the finished state with no animation. */
  finish: () => void;
}

/**
 * Drives a linear animation timeline.
 *
 * The whole scene is a pure function of `elapsed`, which makes pause, reset and
 * reduced-motion trivial: reduced motion simply sets `elapsed` to the total.
 */
export function useSceneMachine(
  steps: TimelineStep[],
  options: { reducedMotion: boolean; autoPlay?: boolean },
): SceneMachine {
  const { reducedMotion, autoPlay = false } = options;

  const bounds = useMemo(() => {
    let acc = 0;
    const map = new Map<string, { start: number; end: number }>();
    for (const step of steps) {
      map.set(step.id, { start: acc, end: acc + step.duration });
      acc += step.duration;
    }
    return { map, total: acc };
  }, [steps]);

  const [status, setStatus] = useState<SceneStatus>('idle');
  const [elapsed, setElapsed] = useState(0);

  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastTickRef.current = null;
  }, []);

  const finish = useCallback(() => {
    stop();
    setElapsed(bounds.total);
    setStatus('complete');
  }, [bounds.total, stop]);

  const play = useCallback(() => {
    if (reducedMotion) {
      finish();
      return;
    }
    setStatus((prev) => (prev === 'complete' ? prev : 'running'));
  }, [finish, reducedMotion]);

  const pause = useCallback(() => {
    setStatus((prev) => (prev === 'running' ? 'paused' : prev));
  }, []);

  const reset = useCallback(() => {
    stop();
    setElapsed(0);
    setStatus('idle');
  }, [stop]);

  const replay = useCallback(() => {
    stop();
    setElapsed(0);
    setStatus(reducedMotion ? 'complete' : 'running');
    if (reducedMotion) setElapsed(bounds.total);
  }, [bounds.total, reducedMotion, stop]);

  const toggle = useCallback(() => {
    setStatus((prev) => {
      if (prev === 'running') return 'paused';
      if (prev === 'complete') {
        // Replay rather than dead-ending on a finished scene.
        setElapsed(0);
        return reducedMotion ? 'complete' : 'running';
      }
      if (reducedMotion) {
        setElapsed(bounds.total);
        return 'complete';
      }
      return 'running';
    });
  }, [bounds.total, reducedMotion]);

  // The animation loop. Only active while `status === 'running'`.
  useEffect(() => {
    if (status !== 'running') {
      stop();
      return;
    }

    const tick = (now: number) => {
      const last = lastTickRef.current;
      lastTickRef.current = now;
      const delta = last === null ? 0 : now - last;

      setElapsed((prev) => {
        const next = prev + delta;
        if (next >= bounds.total) {
          setStatus('complete');
          return bounds.total;
        }
        return next;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return stop;
  }, [status, bounds.total, stop]);

  // Auto-play on mount (Explore mode), or settle immediately under reduced motion.
  useEffect(() => {
    if (!autoPlay) return;
    if (reducedMotion) {
      finish();
      return;
    }
    const id = window.setTimeout(() => play(), 250);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reached = useCallback(
    (id: string) => {
      const b = bounds.map.get(id);
      return b ? elapsed >= b.start : false;
    },
    [bounds, elapsed],
  );

  const done = useCallback(
    (id: string) => {
      const b = bounds.map.get(id);
      return b ? elapsed >= b.end : false;
    },
    [bounds, elapsed],
  );

  const progressOf = useCallback(
    (id: string) => {
      const b = bounds.map.get(id);
      if (!b) return 0;
      if (elapsed <= b.start) return 0;
      if (elapsed >= b.end) return 1;
      return (elapsed - b.start) / (b.end - b.start);
    },
    [bounds, elapsed],
  );

  const phase = useMemo(() => {
    let current = steps[0]?.id ?? '';
    for (const step of steps) {
      const b = bounds.map.get(step.id);
      if (b && elapsed >= b.start) current = step.id;
    }
    return current;
  }, [bounds, elapsed, steps]);

  return {
    status,
    elapsed,
    phase,
    reached,
    done,
    progressOf,
    play,
    pause,
    toggle,
    reset,
    replay,
    finish,
  };
}

/** Number of items revealed so far, given progress through a step. */
export function revealCount(progress: number, total: number): number {
  return Math.min(total, Math.floor(progress * total + 0.0001));
}
