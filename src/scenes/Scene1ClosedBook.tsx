import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SceneFrame } from '../components/shared/SceneFrame';
import { TokenStream } from '../components/shared/TokenStream';
import { BrainSvg } from '../components/shared/BrainSvg';
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
  SCENE1_ANSWER,
  SCENE1_PROBLEMS,
  SCENE1_QUESTION,
} from '../data/passages';

const STEPS: TimelineStep[] = [
  { id: 'travel', duration: 900 },
  { id: 'thinking', duration: 700 },
  { id: 'generating', duration: SCENE1_ANSWER.length * 110 },
  { id: 'flagging', duration: 600 },
  { id: 'problems', duration: 700 },
];

const META = SCENES[0]!;

export function Scene1ClosedBook() {
  const { reducedMotion, mode } = usePresentation();
  const machine = useSceneMachine(STEPS, {
    reducedMotion,
    autoPlay: mode === 'explore',
  });
  useRegisterScene(machine);

  const visible = revealCount(
    machine.progressOf('generating'),
    SCENE1_ANSWER.length,
  );
  const showFlags = machine.reached('flagging');
  const showProblems = machine.reached('problems');
  const thinking = machine.reached('thinking') && !machine.done('generating');
  const questionSent = machine.reached('travel') && machine.status !== 'idle';

  const problemsVisible = useMemo(() => {
    if (!showProblems) return 0;
    return revealCount(
      Math.min(1, machine.progressOf('problems') * 1.6),
      SCENE1_PROBLEMS.length,
    );
  }, [showProblems, machine]);

  return (
    <SceneFrame
      meta={META}
      footnote={
        <>
          <strong>Example generation from Lewis et al. (2020), Table 4</strong>{' '}
          (MS-MARCO, input “define middle ear”), where the paper marks it as
          factually incorrect. Parametric-only models are not always wrong — this
          example shows what can go wrong when there is no evidence to check.
        </>
      }
    >
      <div className="s1">
        {/* Left — the question and the missing library */}
        <div className="s1__left">
          <div className="s1__qcard">
            <p className="s1__qlabel">Question</p>
            <p className="s1__question">{SCENE1_QUESTION}</p>
          </div>

          <button
            type="button"
            className="action action--purple"
            onClick={machine.status === 'idle' ? machine.play : machine.replay}
          >
            {machine.status === 'idle' ? 'Ask BART' : 'Ask again'}
          </button>

          <AnimatePresence>
            {questionSent && (
              <motion.p
                className="s1__shelf"
                initial={reducedMotion ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: reducedMotion ? 0 : 0.3 }}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
                  <rect
                    x="2"
                    y="3"
                    width="18"
                    height="16"
                    rx="2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M6 3v16M11 3v16M16 3v16M3 21L19 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                No external documents available
              </motion.p>
            )}
          </AnimatePresence>

          <p className="callout callout--muted">
            A parametric-only model answers using knowledge stored in its{' '}
            <Term name="Parametric memory">parameters</Term>.
          </p>
        </div>

        {/* Middle — the brain, with the question travelling into it */}
        <div className="s1__middle">
          <div className="s1__brainwrap">
            <BrainSvg active={thinking} reducedMotion={reducedMotion} />
            <p className="s1__brainlabel">
              Parametric Memory — <Term name="Generator">BART</Term>
            </p>
            <AnimatePresence>
              {questionSent && !reducedMotion && (
                <motion.span
                  key="travel"
                  style={{
                    position: 'absolute',
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: 'var(--surface)',
                    border: '1px solid var(--blue)',
                    color: 'var(--blue-ink)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    pointerEvents: 'none',
                    boxShadow: 'var(--shadow-card)',
                  }}
                  initial={{ opacity: 0, x: -180, y: -40, scale: 0.9 }}
                  animate={{ opacity: [0, 1, 1, 0], x: 0, y: -10, scale: 0.6 }}
                  transition={{ duration: 0.9, times: [0, 0.2, 0.7, 1] }}
                  aria-hidden="true"
                >
                  {SCENE1_QUESTION}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right — the answer and its problems */}
        <div className="s1__right">
          <div className="s1__answerbox">
            <p className="s1__answerlabel">
              Generated answer
              {showFlags && (
                <span className="tokens__flagnote">
                  2 problems highlighted
                </span>
              )}
            </p>
            {machine.status === 'idle' ? (
              <p className="s2__hint">
                Press “Ask BART” to generate an answer from memory alone.
              </p>
            ) : (
              <TokenStream
                tokens={SCENE1_ANSWER}
                visible={visible}
                showFlags={showFlags}
                generating={machine.status === 'running'}
                size="lg"
                aria-label="BART's generated answer"
              />
            )}
          </div>

          <div className="s1__problems">
            {SCENE1_PROBLEMS.map((problem, i) => (
              <motion.div
                key={problem.id}
                className="s1__problem"
                initial={false}
                animate={{
                  opacity: i < problemsVisible ? 1 : 0,
                  y: i < problemsVisible ? 0 : 12,
                }}
                transition={{ duration: reducedMotion ? 0 : 0.35 }}
                aria-hidden={i >= problemsVisible}
              >
                <p className="s1__problemtitle">{problem.title}</p>
                <p className="s1__problembody">{problem.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SceneFrame>
  );
}
