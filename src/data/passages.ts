import type { AnswerToken, HemingwayToken, PassageDoc } from './types';

/* -------------------------------------------------------------------------- */
/* Scene 1 — the closed-book problem                                           */
/* -------------------------------------------------------------------------- */

export const SCENE1_QUESTION = 'What is the middle ear?';

/**
 * BART's generation for the MS-MARCO input "define middle ear", reproduced from
 * Lewis et al. (2020), Table 4, where it is marked '?' — factually incorrect.
 */
export const SCENE1_ANSWER: AnswerToken[] = [
  { text: 'The' },
  { text: 'middle' },
  { text: 'ear' },
  { text: 'is' },
  { text: 'the' },
  { text: 'part' },
  { text: 'of' },
  { text: 'the' },
  { text: 'ear' },
  { text: 'between' },
  { text: 'the' },
  { text: 'middle', flag: 'repeat' },
  { text: 'ear', flag: 'repeat' },
  { text: 'and', flag: 'wrong' },
  { text: 'the', flag: 'wrong' },
  { text: 'nose', flag: 'wrong' },
  { text: '.' },
];

export const SCENE1_PROBLEMS = [
  {
    id: 'error',
    title: 'Potential factual error',
    body: 'The answer sounds fluent, but it is not correct.',
  },
  {
    id: 'evidence',
    title: 'No visible evidence',
    body: 'Nothing shows where the answer came from.',
  },
  {
    id: 'update',
    title: 'Knowledge is difficult to update',
    body: 'Changing a fact means retraining the model.',
  },
];

/* -------------------------------------------------------------------------- */
/* Scene 2 — the pipeline                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Simulated Wikipedia passages.
 *
 * Passages B and C deliberately do NOT contain the answer sentence. The answer
 * must be composed from two of them (tympanic cavity from B, ossicles from C).
 * This preserves the paper's central claim that RAG *generates* rather than
 * extracts: see §4.1, where RAG answers correctly 11.8% of the time on Natural
 * Questions even when no retrieved document contains the answer, "whereas an
 * extractive model would score 0%".
 */
export const SCENE2_DOCS: PassageDoc[] = [
  {
    id: 'A',
    title: 'Middle ear',
    text: 'The middle ear is the portion of the ear internal to the eardrum.',
    score: 0.94,
    topK: true,
  },
  {
    id: 'B',
    title: 'Middle ear — anatomy',
    text: 'The tympanic cavity is the air-filled space of the middle ear, behind the eardrum.',
    score: 0.91,
    topK: true,
  },
  {
    id: 'C',
    title: 'Ossicles',
    text: 'The middle ear contains three small bones, the ossicles: the malleus, incus and stapes.',
    score: 0.87,
    topK: true,
  },
  {
    id: 'D',
    title: 'Outer ear',
    text: 'The outer ear consists of the pinna and the ear canal.',
    score: 0.34,
    topK: false,
  },
  {
    id: 'E',
    title: 'Music',
    text: 'The Baroque period in European music lasted from about 1600 to 1750.',
    score: 0.11,
    topK: false,
  },
  {
    id: 'F',
    title: 'Geography',
    text: 'The Middle East lies at the junction of Africa, Asia and Europe.',
    score: 0.08,
    topK: false,
  },
];

/**
 * RAG-Sequence's generation from Table 4, and the answer shown in Figure 1.
 * "tympanic cavity" is supported by passage B; "three ossicles" by passage C.
 */
export const SCENE2_ANSWER: AnswerToken[] = [
  { text: 'The' },
  { text: 'middle' },
  { text: 'ear' },
  { text: 'includes' },
  { text: 'the' },
  { text: 'tympanic', evidence: 'B' },
  { text: 'cavity', evidence: 'B' },
  { text: 'and' },
  { text: 'the' },
  { text: 'three', evidence: 'C' },
  { text: 'ossicles', evidence: 'C' },
  { text: '.' },
];

/* -------------------------------------------------------------------------- */
/* Scene 4A — RAG-Sequence                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Simulated marginalisation. Each candidate answer is scored under *every*
 * document, then summed — mirroring the paper's "Thorough Decoding" (§2.5).
 * `parts` are the per-document contributions; they sum to `total`.
 * All totals sum to 1.00.
 */
export interface SequenceCandidate {
  id: string;
  /** Document the candidate was first generated from. */
  fromDoc: string;
  text: string;
  parts: number[];
  total: number;
  best: boolean;
}

export const SCENE4_CANDIDATES: SequenceCandidate[] = [
  {
    id: 'c1',
    fromDoc: 'A',
    text: 'The middle ear is the portion of the ear internal to the eardrum.',
    parts: [0.19, 0.08, 0.04],
    total: 0.31,
    best: false,
  },
  {
    id: 'c2',
    fromDoc: 'B',
    text: 'The middle ear includes the tympanic cavity and the three ossicles.',
    parts: [0.1, 0.26, 0.08],
    total: 0.44,
    best: true,
  },
  {
    id: 'c3',
    fromDoc: 'C',
    text: 'The middle ear contains the malleus, incus and stapes.',
    parts: [0.03, 0.06, 0.16],
    total: 0.25,
    best: false,
  },
];

export const SCENE4_SEQUENCE_DOCS = SCENE2_DOCS.filter((d) => d.topK);

/* -------------------------------------------------------------------------- */
/* Scene 4B — RAG-Token, the Hemingway example                                 */
/* -------------------------------------------------------------------------- */

export const HEMINGWAY_INPUT = 'Hemingway';

export const HEMINGWAY_DOC1 =
  'His wartime experiences formed the basis for his novel "A Farewell to Arms".';
export const HEMINGWAY_DOC2 =
  'His debut novel, "The Sun Also Rises," was published in 1926.';

/**
 * Reproduces the shape of Figure 2's document posterior.
 *
 * Note the flattening: the weight spikes on the *first* content word of each
 * title ("Sun" → document 2, "Farewell" → document 1) and then returns towards
 * 0.5, because — as the paper puts it — "the model's parametric knowledge is
 * sufficient to complete the titles" (§4.3).
 */
export const HEMINGWAY_TOKENS: HemingwayToken[] = [
  { text: '"', tint: 'neutral', w1: 0.5 },
  { text: 'The', tint: 'doc2', w1: 0.35 },
  { text: 'Sun', tint: 'doc2', w1: 0.06 },
  { text: 'Also', tint: 'doc2', w1: 0.44 },
  { text: 'Rises', tint: 'doc2', w1: 0.48 },
  { text: '"', tint: 'neutral', w1: 0.5 },
  { text: 'is', tint: 'neutral', w1: 0.52 },
  { text: 'a', tint: 'neutral', w1: 0.5 },
  { text: 'novel', tint: 'neutral', w1: 0.49 },
  { text: 'by', tint: 'neutral', w1: 0.51 },
  { text: 'this', tint: 'neutral', w1: 0.5 },
  { text: 'author', tint: 'neutral', w1: 0.53 },
  { text: 'of', tint: 'neutral', w1: 0.55 },
  { text: '"', tint: 'neutral', w1: 0.58 },
  { text: 'A', tint: 'doc1', w1: 0.7 },
  { text: 'Farewell', tint: 'doc1', w1: 0.93 },
  { text: 'to', tint: 'doc1', w1: 0.56 },
  { text: 'Arms', tint: 'doc1', w1: 0.52 },
  { text: '"', tint: 'neutral', w1: 0.5 },
  { text: '.', tint: 'neutral', w1: 0.5 },
];

/* -------------------------------------------------------------------------- */
/* Scene 6 — the failure simulation                                            */
/* -------------------------------------------------------------------------- */

export const SCENE6_CORRECT_DOC = {
  id: 'correct',
  title: 'Correct evidence',
  text: 'The middle ear contains three small bones, the ossicles: the malleus, incus and stapes.',
};

export const SCENE6_MISLEADING_DOC = {
  id: 'misleading',
  title: 'Misleading evidence',
  text: 'The middle ear contains four bones connected to the nasal cavity.',
};

export const SCENE6_ANSWER_CORRECT: AnswerToken[] = [
  { text: 'The' },
  { text: 'middle' },
  { text: 'ear' },
  { text: 'contains' },
  { text: 'three' },
  { text: 'ossicles' },
  { text: ':' },
  { text: 'the' },
  { text: 'malleus' },
  { text: ',' },
  { text: 'incus' },
  { text: 'and' },
  { text: 'stapes' },
  { text: '.' },
];

export const SCENE6_ANSWER_MISLEADING: AnswerToken[] = [
  { text: 'The' },
  { text: 'middle' },
  { text: 'ear' },
  { text: 'contains' },
  { text: 'four', flag: 'wrong' },
  { text: 'bones', flag: 'wrong' },
  { text: 'connected' },
  { text: 'to' },
  { text: 'the' },
  { text: 'nasal', flag: 'wrong' },
  { text: 'cavity', flag: 'wrong' },
  { text: '.' },
];

export const SCENE6_FAILURES = [
  {
    id: 'retrieval',
    title: 'Wrong or irrelevant retrieval',
    body: 'The retriever returns passages that do not answer the question.',
    stage: 'Search',
  },
  {
    id: 'source',
    title: 'Outdated or incorrect knowledge source',
    body: 'The index itself can be wrong or out of date.',
    stage: 'Read',
  },
  {
    id: 'generation',
    title: 'Generator produces a claim not supported by the evidence',
    body: 'The answer can go beyond what the passages actually say.',
    stage: 'Generate',
  },
];
