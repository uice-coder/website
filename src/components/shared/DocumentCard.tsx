import { motion } from 'framer-motion';
import type { PassageDoc } from '../../data/types';

interface Props {
  doc: PassageDoc;
  /** Reveal the score and the score bar. */
  showScore: boolean;
  /** Animate the score counting up: 0..1. */
  scoreProgress?: number;
  state: 'neutral' | 'scored' | 'dropped' | 'topk';
  /** Rank badge for Top-K cards. */
  rank?: number;
  /** Lit because the viewer is hovering the token it supports. */
  isEvidence?: boolean;
}

export function DocumentCard({
  doc,
  showScore,
  scoreProgress = 1,
  state,
  rank,
  isEvidence = false,
}: Props) {
  const displayed = doc.score * scoreProgress;

  const classes = [
    'doccard',
    state === 'topk' ? 'doccard--topk' : '',
    state === 'dropped' ? 'doccard--dropped' : '',
    isEvidence ? 'doccard--evidence' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.article
      className={classes}
      animate={{
        opacity: state === 'dropped' ? 0.3 : 1,
        filter: state === 'dropped' ? 'saturate(0.2)' : 'saturate(1)',
      }}
      transition={{ duration: 0.45 }}
      aria-label={`Passage ${doc.id}: ${doc.title}. ${
        showScore ? `Relevance score ${doc.score.toFixed(2)}.` : ''
      } ${doc.text}`}
    >
      {rank !== undefined && (
        <motion.span
          className="doccard__rank"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          aria-hidden="true"
        >
          {rank}
        </motion.span>
      )}

      <div className="doccard__head" aria-hidden="true">
        <span className="doccard__id">{doc.id}</span>
        <h4 className="doccard__title">{doc.title}</h4>
        {showScore && (
          <span className="doccard__score">{displayed.toFixed(2)}</span>
        )}
      </div>

      <p className="doccard__text" aria-hidden="true">
        {doc.text}
      </p>
    </motion.article>
  );
}
