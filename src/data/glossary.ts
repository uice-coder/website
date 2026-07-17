import type { GlossaryEntry } from './types';

export const GLOSSARY: GlossaryEntry[] = [
  {
    term: 'Parametric memory',
    definition:
      "Knowledge stored inside a model's trained weights. It is used without any lookup, and cannot easily be inspected or edited.",
  },
  {
    term: 'Non-parametric memory',
    definition:
      'Knowledge kept outside the model, as documents you can search. It can be read, checked and replaced.',
  },
  {
    term: 'Retriever',
    definition:
      'The component that searches the index and returns passages likely to be relevant. Here: DPR.',
  },
  {
    term: 'Generator',
    definition:
      'The component that writes the answer in natural language, using the question and the retrieved passages. Here: BART-large.',
  },
  {
    term: 'Latent document',
    definition:
      'A retrieved passage the model treats as a hidden choice: not observed in the training data, but inferred as part of producing the answer.',
  },
  {
    term: 'Top-K',
    definition:
      'The K highest-scoring passages the retriever returns. The paper used 5 or 10.',
  },
  {
    term: 'Marginalisation',
    definition:
      "Combining predictions across all K passages, weighted by each passage's score, instead of committing to one.",
  },
];

/** Lookup used by the <Term> tooltip component. */
export const GLOSSARY_MAP = new Map(
  GLOSSARY.map((entry) => [entry.term.toLowerCase(), entry]),
);
