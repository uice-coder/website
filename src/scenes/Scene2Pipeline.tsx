import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SceneFrame } from '../components/shared/SceneFrame';
import { DocumentCard } from '../components/shared/DocumentCard';
import { TokenStream } from '../components/shared/TokenStream';
import { PipelineRail } from '../components/shared/PipelineRail';
import { StageLabelRow } from '../components/shared/StageLabel';
import { Term } from '../components/shared/Term';
import { usePresentation } from '../context/PresentationContext';
import { useRegisterScene } from '../hooks/useRegisterScene';
import {
  revealCount,
  useSceneMachine,
  type TimelineStep,
} from '../hooks/useSceneMachine';
import { SCENES } from '../data/scenes';
import { SCENE1_QUESTION, SCENE2_ANSWER, SCENE2_DOCS } from '../data/passages';

const STEPS: TimelineStep[] = [
  { id: 'encoding', duration: 600 },
  { id: 'retrieving', duration: 700 },
  { id: 'scoring', duration: 900 },
  { id: 'filtering', duration: 500 },
  { id: 'promoting', duration: 700 },
  { id: 'reading', duration: 600 },
  { id: 'generating', duration: SCENE2_ANSWER.length * 110 },
];

const META = SCENES[1]!;

const NODES = [
  { id: 'q', label: 'Question', sub: 'Query Encoder q(x)' },
  { id: 'r', label: 'DPR Retriever', sub: 'Maximum Inner Product Search' },
  { id: 'k', label: 'Top-K Passages', sub: 'K = 3 shown' },
  { id: 'g', label: 'BART Generator', sub: 'reads question + passages' },
  { id: 'a', label: 'Answer', sub: 'generated, not copied' },
];

/** Deterministic query-vector cells. Fixed values — no randomness. */
const VECTOR = [0.42, -0.17, 0.88, 0.05, -0.63, 0.31, 0.74, -0.29];

function railIndex(machine: ReturnType<typeof useSceneMachine>): number {
  if (machine.reached('generating')) return 4;
  if (machine.reached('reading')) return 3;
  if (machine.reached('promoting')) return 2;
  if (machine.reached('retrieving')) return 1;
  if (machine.reached('encoding')) return 0;
  return -1;
}

function stage(machine: ReturnType<typeof useSceneMachine>): string | null {
  if (machine.reached('reading')) return 'Generate';
  if (machine.reached('filtering')) return 'Read';
  if (machine.reached('encoding')) return 'Search';
  return null;
}

export function Scene2Pipeline() {
  const { reducedMotion, mode } = usePresentation();
  const machine = useSceneMachine(STEPS, {
    reducedMotion,
    autoPlay: mode === 'explore',
  });
  useRegisterScene(machine);

  const [hovered, setHovered] = useState<string | null>(null);

  const started = machine.status !== 'idle';
  const showScores = machine.reached('scoring');
  const scoreProgress = Math.min(1, machine.progressOf('scoring') * 1.15);
  const filtered = machine.reached('filtering');
  const promoted = machine.reached('promoting');
  const reading = machine.reached('reading');
  const answerVisible = revealCount(
    machine.progressOf('generating'),
    SCENE2_ANSWER.length,
  );
  const finished = machine.done('generating');

  return (
    <SceneFrame
      meta={META}
      footnote={
        <>
          Passages are <strong>simulated for teaching</strong> and are not
          verbatim Wikipedia text. K is shown as 3 for clarity; the paper
          retrieved 5 or 10. Note that the answer is{' '}
          <strong>composed from two passages</strong> — no single passage
          contains it.
        </>
      }
    >
      <div className="s2">
        <div className="s2__railrow">
          <PipelineRail nodes={NODES} activeIndex={railIndex(machine)} />
        </div>

        <div className="s2__railrow s2__railrow--controls">
          <StageLabelRow active={stage(machine)} />
          <button
            type="button"
            className="action"
            onClick={machine.status === 'idle' ? machine.play : machine.replay}
          >
            {machine.status === 'idle' ? 'Try RAG' : 'Run again'}
          </button>
        </div>

        <div className="s2__work">
          {/* Search ---------------------------------------------------- */}
          <div className="s2__col">
            <div className="s2__colhead">
              <span className="s2__coltitle">1 · Search</span>
            </div>

            <div className="s2__qcard">{SCENE1_QUESTION}</div>

            <AnimatePresence>
              {started && (
                <motion.div
                  className="s2__vector"
                  initial={reducedMotion ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  aria-label="The question encoded as a query vector"
                >
                  {VECTOR.map((v, i) => (
                    <span className="s2__cell" key={i}>
                      {v.toFixed(2)}
                    </span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="s2__index">
              <p className="s2__indexlabel">Wikipedia Passage Index</p>
              <p className="s2__indexsub">
                ≈21 million 100-word passages · December 2018 Wikipedia dump
              </p>
            </div>

            {/* Supplementary: dropped on short screens to protect the diagram. */}
            <p className="s2__hint s2__hint--aside">
              The <Term name="Retriever">retriever</Term> compares the query
              vector with every passage vector.
            </p>
          </div>

          {/* Read ------------------------------------------------------ */}
          <div className="s2__col">
            <div className="s2__colhead">
              <span className="s2__coltitle">2 · Read</span>
              {showScores && (
                <span className="s2__coltitle" style={{ color: 'var(--green-ink)' }}>
                  {promoted ? 'Top-3 selected' : 'Scoring…'}
                </span>
              )}
            </div>

            <div className="s2__docs">
              {SCENE2_DOCS.map((doc, i) => {
                const state = !showScores
                  ? 'neutral'
                  : filtered && !doc.topK
                    ? 'dropped'
                    : promoted && doc.topK
                      ? 'topk'
                      : 'scored';
                const rank = promoted && doc.topK ? i + 1 : undefined;
                return (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    showScore={showScores}
                    scoreProgress={scoreProgress}
                    state={state}
                    rank={rank}
                    isEvidence={finished && hovered === doc.id}
                  />
                );
              })}
            </div>
          </div>

          {/* Generate -------------------------------------------------- */}
          <div className="s2__col">
            <div className="s2__colhead">
              <span className="s2__coltitle">3 · Generate</span>
            </div>

            <div className={`s2__gen${reading ? ' s2__gen--active' : ''}`}>
              <div className="s2__genhead">
                <span className="s2__gentitle">
                  <Term name="Generator">BART Generator</Term>
                </span>
              </div>
              <div className="s2__inputs">
                <span
                  className={`s2__chip${reading ? ' s2__chip--lit-q' : ''}`}
                >
                  Question
                </span>
                <span
                  className={`s2__chip${reading ? ' s2__chip--lit-e' : ''}`}
                >
                  3 passages
                </span>
              </div>
            </div>

            <div className="s2__answerbox">
              <p className="s1__answerlabel">Generated answer</p>
              {machine.reached('generating') ? (
                <TokenStream
                  tokens={SCENE2_ANSWER}
                  visible={answerVisible}
                  activeEvidence={hovered}
                  onEvidenceEnter={setHovered}
                  onEvidenceLeave={() => setHovered(null)}
                  generating={machine.status === 'running'}
                  aria-label="RAG's generated answer"
                />
              ) : (
                <p className="s2__hint">
                  {started
                    ? 'Waiting for evidence…'
                    : 'Press “Try RAG” to search, read and generate.'}
                </p>
              )}
            </div>

            {/* One status line: the invitation, replaced by the answer on hover. */}
            <p
              className={`s2__evidencenote${
                finished && hovered ? ' s2__evidencenote--lit' : ''
              }`}
              role="status"
              aria-live="polite"
            >
              {!finished
                ? ''
                : hovered
                  ? `Supported by Document ${hovered}`
                  : 'Hover “tympanic cavity” or “three ossicles” to see the passage behind it.'}
            </p>
          </div>
        </div>
      </div>
    </SceneFrame>
  );
}
