/**
 * Shared content types. All user-facing copy and every number shown on screen
 * lives in `src/data` so that it can be checked against the paper in one place.
 */

export type DocumentState = 'neutral' | 'scored' | 'dropped' | 'topk';

export interface PassageDoc {
  /** Display letter, e.g. "A". */
  id: string;
  title: string;
  text: string;
  /** Simulated retriever score in [0, 1]. Deterministic. */
  score: number;
  /** Whether this passage is one of the Top-K for the demo question. */
  topK: boolean;
}

/** A token in a generated answer, plus any teaching annotations. */
export interface AnswerToken {
  text: string;
  /** Id of the passage that supports this token (Scene 2 hover-to-evidence). */
  evidence?: string;
  /** Highlight class for Scene 1's error flags. */
  flag?: 'repeat' | 'wrong';
}

/** Scene 4B token: which document tinted it, and the weight on document 1. */
export interface HemingwayToken {
  text: string;
  tint: 'doc1' | 'doc2' | 'neutral';
  /** p(z = doc1) for this generation step. Document 2 weight is 1 - w1. */
  w1: number;
}

export interface SceneMeta {
  id: string;
  /** 1-based chapter number. */
  number: number;
  title: string;
  /** Short label for the progress rail. */
  shortTitle: string;
  subtitle: string;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
}
