import { motion } from 'framer-motion';
import type { AnswerToken, HemingwayToken } from '../../data/types';

/** Punctuation should hug the previous word rather than take a space. */
function isTight(text: string): boolean {
  return /^[.,;:!?)"']$/.test(text) || text === '"';
}

interface Props {
  tokens: AnswerToken[];
  /** How many tokens are revealed. */
  visible: number;
  /** Show flags only after the generation has settled. */
  showFlags?: boolean;
  /** Currently hovered evidence id, for the hover-to-evidence link. */
  activeEvidence?: string | null;
  onEvidenceEnter?: (id: string) => void;
  onEvidenceLeave?: () => void;
  size?: 'md' | 'lg';
  /** Blinking caret while generating. */
  generating?: boolean;
  'aria-label'?: string;
}

export function TokenStream({
  tokens,
  visible,
  showFlags = false,
  activeEvidence = null,
  onEvidenceEnter,
  onEvidenceLeave,
  size = 'md',
  generating = false,
  'aria-label': ariaLabel,
}: Props) {
  const shown = tokens.slice(0, visible);
  const full = tokens.map((t) => t.text).join(' ');

  return (
    <p
      className={`tokens${size === 'lg' ? ' tokens--lg' : ''}`}
      aria-label={ariaLabel}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Screen readers get the settled sentence, not a token-by-token stutter. */}
      <span className="sr-only">{visible >= tokens.length ? full : ''}</span>

      {shown.map((token, i) => {
        const flagged = showFlags && token.flag;
        const isEvidence = Boolean(token.evidence);
        const evidenceActive =
          isEvidence && activeEvidence === token.evidence && visible >= tokens.length;

        const classes = [
          'token',
          flagged ? `token--flag-${token.flag}` : '',
          isEvidence && visible >= tokens.length ? 'token--evidence' : '',
          evidenceActive ? 'token--evidence-active' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <motion.span
            key={`${token.text}-${i}`}
            className={classes}
            aria-hidden="true"
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            style={isTight(token.text) ? { marginLeft: '-0.32em' } : undefined}
            onMouseEnter={
              isEvidence && token.evidence && onEvidenceEnter
                ? () => onEvidenceEnter(token.evidence as string)
                : undefined
            }
            onMouseLeave={isEvidence ? onEvidenceLeave : undefined}
          >
            {token.text}
          </motion.span>
        );
      })}

      {generating && visible < tokens.length && (
        <span className="token__caret" aria-hidden="true" />
      )}
    </p>
  );
}

interface HemingwayProps {
  tokens: HemingwayToken[];
  visible: number;
  generating?: boolean;
}

/** Scene 4B: tokens tinted by the document that dominates their distribution. */
export function HemingwayStream({
  tokens,
  visible,
  generating = false,
}: HemingwayProps) {
  const shown = tokens.slice(0, visible);
  const full = tokens.map((t) => t.text).join(' ');

  return (
    <p className="tokens tokens--lg" role="status" aria-live="polite" aria-atomic="true">
      <span className="sr-only">{visible >= tokens.length ? full : ''}</span>
      {shown.map((token, i) => (
        <motion.span
          key={`${token.text}-${i}`}
          className={`token token--${token.tint}`}
          aria-hidden="true"
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          style={isTight(token.text) ? { marginLeft: '-0.32em' } : undefined}
        >
          {token.text}
        </motion.span>
      ))}
      {generating && visible < tokens.length && (
        <span className="token__caret" aria-hidden="true" />
      )}
    </p>
  );
}
