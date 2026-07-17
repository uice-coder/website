/**
 * Every number in this file is transcribed directly from Lewis et al. (2020).
 * Do not edit without re-checking the source tables.
 */

export interface BarDatum {
  label: string;
  value: number;
  kind: 'parametric' | 'retrieval' | 'rag';
  note: string;
}

/** Table 1, Natural Questions column. Exact Match. */
export const NQ_EXACT_MATCH: BarDatum[] = [
  {
    label: 'T5-11B',
    value: 34.5,
    kind: 'parametric',
    note: 'Closed-book: parametric-only generation',
  },
  {
    label: 'DPR',
    value: 41.5,
    kind: 'retrieval',
    note: 'Open-book: retrieval and extraction',
  },
  {
    label: 'RAG-Token',
    value: 44.1,
    kind: 'rag',
    note: 'Open-book: retrieval and generation',
  },
  {
    label: 'RAG-Sequence',
    value: 44.5,
    kind: 'rag',
    note: 'Open-book: retrieval and generation',
  },
];

export const NQ_CHART_HEADING = 'Natural Questions — Exact Match';
export const NQ_CHART_SOURCE = 'Lewis et al. (2020), Table 1.';
export const NQ_LEGEND = [
  { kind: 'parametric' as const, text: 'T5-11B: parametric-only generation' },
  { kind: 'retrieval' as const, text: 'DPR: retrieval and extraction' },
  { kind: 'rag' as const, text: 'RAG: retrieval and generation' },
];

export interface StackDatum {
  label: string;
  value: number;
  tone: 'bart' | 'rag' | 'bothGood' | 'bothPoor' | 'none';
}

/**
 * Table 3, Factuality row. Values sum to exactly 100.0%.
 *
 * Note: §4.3's prose says "both RAG and BART were factual in a further 17% of
 * cases", which disagrees with the table's 11.7%. The table values sum to 100,
 * so the table is used here and the prose is treated as an erratum.
 */
export const FACTUALITY: StackDatum[] = [
  { label: 'BART better', value: 7.1, tone: 'bart' },
  { label: 'RAG-Token better', value: 42.7, tone: 'rag' },
  { label: 'Both good', value: 11.7, tone: 'bothGood' },
  { label: 'Both poor', value: 17.7, tone: 'bothPoor' },
  { label: 'No majority', value: 20.8, tone: 'none' },
];

export const FACTUALITY_HEADING = 'Human factuality assessment';
export const FACTUALITY_SUB =
  'Jeopardy question generation — RAG-Token compared with BART, 452 pairs';
export const FACTUALITY_INTERPRETATION =
  'Evaluators judged RAG-Token to be more factual than BART much more often than the reverse.';
export const FACTUALITY_SOURCE = 'Lewis et al. (2020), Table 3.';

export const TASK_CARDS = [
  {
    id: 'odqa',
    title: 'Open-domain question answering',
    body: 'Natural Questions, TriviaQA, WebQuestions, CuratedTrec',
  },
  {
    id: 'abstractive',
    title: 'Abstractive question answering',
    body: 'MS-MARCO, treated as open-domain',
  },
  {
    id: 'jeopardy',
    title: 'Jeopardy question generation',
    body: 'Generating a clue from an answer entity',
  },
  {
    id: 'fever',
    title: 'Fact verification',
    body: 'FEVER, 3-way and 2-way classification',
  },
];

export const TASKS_CLOSING =
  'The paper demonstrated RAG as a general approach for knowledge-intensive NLP tasks.';
