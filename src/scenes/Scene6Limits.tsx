import { useState } from 'react';
import { motion } from 'framer-motion';
import { SceneFrame } from '../components/shared/SceneFrame';
import { TokenStream } from '../components/shared/TokenStream';
import { usePresentation } from '../context/PresentationContext';
import { useRegisterScene } from '../hooks/useRegisterScene';
import {
  revealCount,
  useSceneMachine,
  type TimelineStep,
} from '../hooks/useSceneMachine';
import { CITATION, SCENES } from '../data/scenes';
import {
  SCENE6_ANSWER_CORRECT,
  SCENE6_ANSWER_MISLEADING,
  SCENE6_CORRECT_DOC,
  SCENE6_FAILURES,
  SCENE6_MISLEADING_DOC,
} from '../data/passages';

type Ranking = 'correctFirst' | 'misleadingFirst';

const STEPS: TimelineStep[] = [
  { id: 'verdict', duration: 400 },
  { id: 'failures', duration: 2100 },
  { id: 'takeaway', duration: 1200 },
];

const META = SCENES[5]!;
const FLOW = ['Search', 'Read', 'Generate'];

export function Scene6Limits() {
  const { reducedMotion } = usePresentation();
  // No trigger button in this scene; it plays on entry like Scene 5.
  const machine = useSceneMachine(STEPS, { reducedMotion, autoPlay: true });
  useRegisterScene(machine);

  const [ranking, setRanking] = useState<Ranking>('correctFirst');
  const misleading = ranking === 'misleadingFirst';
  const answer = misleading ? SCENE6_ANSWER_MISLEADING : SCENE6_ANSWER_CORRECT;

  const showVerdict = machine.reached('verdict');
  const failuresVisible = revealCount(
    Math.min(1, machine.progressOf('failures') * 1.2),
    SCENE6_FAILURES.length,
  );
  const showTakeaway = machine.reached('takeaway');
  const flowVisible = revealCount(
    Math.min(1, machine.progressOf('takeaway') * 2),
    FLOW.length,
  );

  return (
    <SceneFrame
      meta={META}
      footnote={
        <>
          The reranking demonstration is an{' '}
          <strong>illustration of a failure mode, not an experiment from the
          paper</strong>. The paper does report that retrieval quality matters,
          but it did not run this specific test.
        </>
      }
    >
      <div className="s6">
        {/* Left — the honest answer and the three failure points */}
        <div className="s6__left">
          <h3 className="s6__q">Does RAG completely solve hallucination?</h3>
          <motion.p
            className="s6__no"
            initial={false}
            animate={{ opacity: showVerdict ? 1 : 0, scale: showVerdict ? 1 : 0.9 }}
            transition={{ duration: reducedMotion ? 0 : 0.3 }}
          >
            No.
          </motion.p>

          <div className="s6__failures">
            {SCENE6_FAILURES.map((failure, i) => (
              <motion.div
                key={failure.id}
                className="s6__failure"
                initial={false}
                animate={{
                  opacity: i < failuresVisible ? 1 : 0,
                  x: i < failuresVisible ? 0 : -10,
                }}
                transition={{ duration: reducedMotion ? 0 : 0.35 }}
                aria-hidden={i >= failuresVisible}
              >
                <span className="s6__failnum">{i + 1}</span>
                <div>
                  <p className="s6__failtitle">{failure.title}</p>
                  <p className="s6__failbody">{failure.body}</p>
                  <span className="s6__failstage">
                    Fails at: {failure.stage}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right — the interactive failure simulation, then the takeaway */}
        <div className="s6__right">
          <p className="s6__simhead">Change which document is ranked first</p>

          <div className="s6__simbtns" role="group" aria-label="Retrieval ranking">
            <button
              type="button"
              className="s6__simbtn s6__simbtn--correct"
              aria-pressed={!misleading}
              onClick={() => setRanking('correctFirst')}
            >
              Rank correct evidence first
            </button>
            <button
              type="button"
              className="s6__simbtn s6__simbtn--misleading"
              aria-pressed={misleading}
              onClick={() => setRanking('misleadingFirst')}
            >
              Rank misleading evidence first
            </button>
          </div>

          <div className="s6__simdocs">
            {(misleading
              ? [SCENE6_MISLEADING_DOC, SCENE6_CORRECT_DOC]
              : [SCENE6_CORRECT_DOC, SCENE6_MISLEADING_DOC]
            ).map((doc, i) => (
              <motion.div
                key={doc.id}
                layout={!reducedMotion}
                transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                className={`s6__simdoc s6__simdoc--${doc.id}`}
              >
                <span
                  className={`s6__simrank${i === 0 ? ' s6__simrank--first' : ''}`}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="s6__simtitle">{doc.title}</p>
                  <p className="s6__simtext">{doc.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="s6__simanswer">
            <p className="s6__simlabel">Generated answer</p>
            <TokenStream
              key={ranking}
              tokens={answer}
              visible={answer.length}
              showFlags
              aria-label="Answer generated from the top-ranked evidence"
            />
          </div>

          <p className="s6__simcaption">
            The retriever ranked this passage first. The generator followed it.
            Retrieval relevance is not the same as factual correctness.
          </p>
        </div>

        {/* Full-width takeaway band */}
        <motion.div
          className="s6__takeaway"
          initial={false}
          animate={{ opacity: showTakeaway ? 1 : 0.25 }}
          transition={{ duration: reducedMotion ? 0 : 0.4 }}
        >
          <div className="s6__flow">
            {FLOW.map((step, i) => (
              <span key={step} style={{ display: 'contents' }}>
                <motion.span
                  className="s6__flowstep"
                  initial={false}
                  animate={{ opacity: i < flowVisible ? 1 : 0.15 }}
                  transition={{ duration: reducedMotion ? 0 : 0.3 }}
                >
                  {step}
                </motion.span>
                {i < FLOW.length - 1 && (
                  <motion.span
                    className="s6__flowarrow"
                    aria-hidden="true"
                    initial={false}
                    animate={{ opacity: i < flowVisible - 1 ? 1 : 0.15 }}
                    transition={{ duration: reducedMotion ? 0 : 0.3 }}
                  >
                    →
                  </motion.span>
                )}
              </span>
            ))}
          </div>

          <div>
            <p className="s6__final">
              RAG combines external evidence with a language model’s internal
              knowledge, producing answers that are often more{' '}
              <strong>specific, diverse and factual</strong> than a
              parametric-only baseline.
            </p>
            <p className="s6__cite">{CITATION}</p>
          </div>
        </motion.div>
      </div>
    </SceneFrame>
  );
}
