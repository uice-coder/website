import type { SceneMeta } from './types';

export const SCENES: SceneMeta[] = [
  {
    id: 'closed-book',
    number: 1,
    title: 'The Closed-Book Problem',
    shortTitle: 'Closed book',
    subtitle: 'What happens when a model answers from memory alone',
  },
  {
    id: 'how-rag-works',
    number: 2,
    title: 'How RAG Works',
    shortTitle: 'How RAG works',
    subtitle: 'Search, read, generate',
  },
  {
    id: 'two-memories',
    number: 3,
    title: 'Two Types of Memory',
    shortTitle: 'Two memories',
    subtitle: 'Parametric and non-parametric knowledge',
  },
  {
    id: 'sequence-vs-token',
    number: 4,
    title: 'RAG-Sequence vs RAG-Token',
    shortTitle: 'Sequence vs Token',
    subtitle: 'Two ways to use the retrieved documents',
  },
  {
    id: 'findings',
    number: 5,
    title: 'What the Paper Found',
    shortTitle: 'Findings',
    subtitle: 'Results across knowledge-intensive tasks',
  },
  {
    id: 'limits',
    number: 6,
    title: 'Limitations and Takeaway',
    shortTitle: 'Limitations',
    subtitle: 'What RAG does not solve',
  },
];

export const SITE_TITLE = 'Inside RAG: From Memory to Evidence';
export const SITE_SUBTITLE = 'A visual walkthrough of Lewis et al. (2020)';
export const CITATION =
  'Lewis et al. (2020), Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks.';
