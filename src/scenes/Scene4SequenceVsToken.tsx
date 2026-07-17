import { useState } from 'react';
import { motion } from 'framer-motion';
import { SceneFrame } from '../components/shared/SceneFrame';
import { SegmentedToggle } from '../components/shared/SegmentedToggle';
import { HemingwayStream } from '../components/shared/TokenStream';
import { Term } from '../components/shared/Term';
import { usePresentation } from '../context/PresentationContext';
import { useRegisterScene } from '../hooks/useRegisterScene';
import {
  revealCount,
  useSceneMachine,
  type TimelineStep,
} from '../hooks/useSceneMachine';
import { SCENES } from '../data/scenes';
import {
  HEMINGWAY_DOC1,
  HEMINGWAY_DOC2,
  HEMINGWAY_INPUT,
  HEMINGWAY_TOKENS,
  SCENE1_QUESTION,
  SCENE4_CANDIDATES,
  SCENE4_SEQUENCE_DOCS,
} from '../data/passages';

type Variant = 'sequence' | 'token';

const SEQ_STEPS: TimelineStep[] = [
  { id: 'docs', duration: 500 },
  { id: 'candidates', duration: 900 },
  { id: 'scoring', duration: 700 },
  { id: 'aggregating', duration: 1000 },
];

const TOK_STEPS: TimelineStep[] = [
  { id: 'docs', duration: 400 },
  { id: 'generating', duration: HEMINGWAY_TOKENS.length * 200 },
];

const META = SCENES[3]!;

export function Scene4SequenceVsToken() {
  const [variant, setVariant] = useState<Variant>('sequence');

  return (
    <SceneFrame
      meta={META}
      footnote={
        variant === 'sequence' ? (
          <>
            Every candidate answer is scored under <strong>every</strong>{' '}
            document, then the scores are summed —{' '}
            <strong>no document is discarded</strong>. Scores are simulated;
            they illustrate the paper’s “Thorough Decoding” (§2.5).
          </>
        ) : (
          <>
            After the first word of each title, the weights{' '}
            <strong>flatten</strong> — the model completes the title from its own
            parametric memory (§4.3). Based on Figure 2, shown with 2 of the
            paper’s 5 documents. Weights are simulated.
          </>
        )
      }
    >
      {/* Remounting on variant change gives each region a clean machine. */}
      {variant === 'sequence' ? (
        <SequenceView variant={variant} onVariant={setVariant} />
      ) : (
        <TokenView variant={variant} onVariant={setVariant} />
      )}
    </SceneFrame>
  );
}

interface ViewProps {
  variant: Variant;
  onVariant: (v: Variant) => void;
}

function Header({
  variant,
  onVariant,
  heading,
  plain,
  onReplay,
}: ViewProps & { heading: string; plain: string; onReplay: () => void }) {
  return (
    <div className="s4__head">
      <SegmentedToggle
        options={[
          { value: 'sequence' as const, label: 'RAG-Sequence' },
          { value: 'token' as const, label: 'RAG-Token' },
        ]}
        value={variant}
        onChange={onVariant}
        ariaLabel="RAG formulation"
      />
      <div className="s4__headings">
        <h3>{heading}</h3>
        <p className="s4__plain">{plain}</p>
      </div>
      <button type="button" className="navbtn" onClick={onReplay}>
        Replay
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Mode A — RAG-Sequence                                                       */
/* -------------------------------------------------------------------------- */

function SequenceView({ variant, onVariant }: ViewProps) {
  const { reducedMotion, mode } = usePresentation();
  const machine = useSceneMachine(SEQ_STEPS, {
    reducedMotion,
    autoPlay: mode === 'explore',
  });
  useRegisterScene(machine);

  const showDocs = machine.reached('docs');
  const candProgress = machine.progressOf('candidates');
  const showScores = machine.reached('scoring');
  const aggProgress = machine.progressOf('aggregating');
  const aggregating = machine.reached('aggregating');

  const runningTotal = SCENE4_CANDIDATES.reduce(
    (sum, c) => sum + c.total * aggProgress,
    0,
  );

  return (
    <div className="s4">
      <Header
        variant={variant}
        onVariant={onVariant}
        heading="One document for the whole answer"
        plain="Which document best supports this whole answer?"
        onReplay={machine.replay}
      />

      <p className="callout">
        RAG-Sequence treats the retrieved document as a{' '}
        <Term name="Latent document">latent variable</Term> for the whole output
        sequence and combines probabilities across candidate documents.
      </p>

      <div className="s4__body">
        <div className="s4a">
          <div className="s4a__lanes">
            <p className="s2__coltitle">
              Question: “{SCENE1_QUESTION}” · {SCENE4_SEQUENCE_DOCS.length}{' '}
              candidate documents
            </p>
            {SCENE4_CANDIDATES.map((candidate, i) => {
              const slice = 1 / SCENE4_CANDIDATES.length;
              const local = Math.max(
                0,
                Math.min(1, (candProgress - i * slice * 0.5) / (slice * 1.5)),
              );
              return (
                <motion.div
                  key={candidate.id}
                  className={`s4a__lane${
                    aggregating && candidate.best ? ' s4a__lane--best' : ''
                  }`}
                  initial={false}
                  animate={{
                    opacity: showDocs ? 1 : 0,
                    x: showDocs ? 0 : -10,
                  }}
                  transition={{ duration: reducedMotion ? 0 : 0.3, delay: i * 0.08 }}
                >
                  <span className="s4a__lanedoc">{candidate.fromDoc}</span>
                  <div>
                    <p className="s4a__lanetext">
                      {local > 0.05 ? candidate.text : '…'}
                    </p>
                    <div className="s4a__lanemeta">
                      <div
                        className="s4a__parts"
                        role="img"
                        aria-label={`Candidate from document ${candidate.fromDoc}: scored under each of the three documents, total probability ${candidate.total}`}
                      >
                        {candidate.parts.map((part, p) => (
                          <span
                            key={p}
                            className={`s4a__part s4a__part--${p}`}
                            style={{
                              width: showScores
                                ? `${(part / candidate.total) * 100}%`
                                : '0%',
                            }}
                          />
                        ))}
                      </div>
                      <span className="s4a__total">
                        {showScores ? candidate.total.toFixed(2) : '—'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <p className="s2__hint">
              Each bar is split by which document contributed the probability.
            </p>
          </div>

          <div className="s4a__arrow" aria-hidden="true">
            <svg width="34" height="16" viewBox="0 0 34 16">
              <path
                d="M0 8h28M24 3l5 5-5 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <motion.div
            className="s4a__agg"
            initial={false}
            animate={{ opacity: aggregating ? 1 : 0.35 }}
            transition={{ duration: reducedMotion ? 0 : 0.3 }}
          >
            <p className="s4a__aggtitle">
              Combine across documents (<Term>Marginalisation</Term>)
            </p>
            <p className="s4a__aggnote">
              Sum of all routes:{' '}
              <strong style={{ color: 'var(--text)' }}>
                {runningTotal.toFixed(2)}
              </strong>
            </p>
            <p className="s4a__aggnote">
              No document is discarded. The winning answer is the one with the
              highest <em>combined</em> probability, not the one from the
              single best-scoring passage.
            </p>
            {aggProgress > 0.6 && (
              <motion.p
                className="s4a__final"
                initial={reducedMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <strong style={{ color: 'var(--green-ink)' }}>Final answer · </strong>
                {SCENE4_CANDIDATES.find((c) => c.best)?.text}
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Mode B — RAG-Token                                                          */
/* -------------------------------------------------------------------------- */

function TokenView({ variant, onVariant }: ViewProps) {
  const { reducedMotion, mode } = usePresentation();
  const machine = useSceneMachine(TOK_STEPS, {
    reducedMotion,
    autoPlay: mode === 'explore',
  });
  useRegisterScene(machine);

  const visible = revealCount(
    machine.progressOf('generating'),
    HEMINGWAY_TOKENS.length,
  );
  const currentIndex = Math.max(0, Math.min(HEMINGWAY_TOKENS.length - 1, visible - 1));
  const current = HEMINGWAY_TOKENS[currentIndex]!;
  const started = machine.reached('generating');
  const w1 = started ? current.w1 : 0.5;
  const w2 = 1 - w1;

  const hot1 = started && w1 > 0.7;
  const hot2 = started && w2 > 0.7;

  return (
    <div className="s4">
      <Header
        variant={variant}
        onVariant={onVariant}
        heading="A different document for each word"
        plain="Which document best supports this word right now?"
        onReplay={machine.replay}
      />

      <p className="callout">
        RAG-Token can assign different document weights at each generation step.
      </p>

      <div className="s4__body">
        <div className="s4b">
          <div className="s4b__docs">
            <div
              className={`s4b__doc s4b__doc--doc1${hot1 ? ' s4b__doc--hot' : ''}`}
            >
              <p className="s4b__doclabel">Document 1</p>
              <p className="s4b__doctext">{HEMINGWAY_DOC1}</p>
            </div>
            <div
              className={`s4b__doc s4b__doc--doc2${hot2 ? ' s4b__doc--hot' : ''}`}
            >
              <p className="s4b__doclabel">Document 2</p>
              <p className="s4b__doctext">{HEMINGWAY_DOC2}</p>
            </div>
            <p className="s2__hint">
              Jeopardy clues often combine two facts about one entity — which is
              why RAG-Token does well here.
            </p>
          </div>

          <div className="s4b__right">
            <p className="s4b__input">
              Input: <span className="s4b__inputpill">{HEMINGWAY_INPUT}</span>
            </p>

            <div className="s4b__dist">
              <p className="s4b__distlabel">
                <span>Document weights for this token</span>
                <span className="s4b__disttoken">
                  {started ? `“${current.text}”` : '—'}
                </span>
              </p>
              <div className="s4b__distrow">
                <span className="s4b__distname s4b__distname--doc1">
                  Document 1
                </span>
                <div className="s4b__disttrack">
                  <div
                    className="s4b__distfill s4b__distfill--doc1"
                    style={{ width: `${w1 * 100}%` }}
                  />
                </div>
                <span className="s4b__distval">{w1.toFixed(2)}</span>
              </div>
              <div className="s4b__distrow">
                <span className="s4b__distname s4b__distname--doc2">
                  Document 2
                </span>
                <div className="s4b__disttrack">
                  <div
                    className="s4b__distfill s4b__distfill--doc2"
                    style={{ width: `${w2 * 100}%` }}
                  />
                </div>
                <span className="s4b__distval">{w2.toFixed(2)}</span>
              </div>
            </div>

            <div className="s4b__clue">
              {started ? (
                <HemingwayStream
                  tokens={HEMINGWAY_TOKENS}
                  visible={visible}
                  generating={machine.status === 'running'}
                />
              ) : (
                <p className="s2__hint">
                  Press Play or Replay to generate the Jeopardy clue.
                </p>
              )}
            </div>

            <div className="s4b__legend">
              <span className="s4b__legenditem">
                <span className="s4b__swatch s4b__swatch--doc1" />
                Document 1 — A Farewell to Arms
              </span>
              <span className="s4b__legenditem">
                <span className="s4b__swatch s4b__swatch--doc2" />
                Document 2 — The Sun Also Rises
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
