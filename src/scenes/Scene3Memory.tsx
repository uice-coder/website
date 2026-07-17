import { useState } from 'react';
import { motion } from 'framer-motion';
import { SceneFrame } from '../components/shared/SceneFrame';
import { Term } from '../components/shared/Term';
import { usePresentation } from '../context/PresentationContext';
import { useRegisterScene } from '../hooks/useRegisterScene';
import { useSceneMachine, type TimelineStep } from '../hooks/useSceneMachine';
import { SCENES } from '../data/scenes';
import { SCENE1_QUESTION } from '../data/passages';

type Mode = 'brain' | 'library' | 'both';

const STEPS: TimelineStep[] = [
  { id: 'switching', duration: 250 },
  { id: 'settled', duration: 600 },
];

const META = SCENES[2]!;

const PARAMETRIC_PROPS = [
  'Stored in model parameters',
  'Learned during training',
  'Difficult to directly edit',
];

const NONPARAMETRIC_PROPS = [
  'External document index',
  'Searchable',
  'Inspectable',
  'Replaceable',
];

const OUTPUTS: Record<Mode, { label: string; text: string; tone: string }> = {
  brain: {
    label: 'Brain only',
    text: 'Brain only: the model generates fluent language, but there is no evidence to check.',
    tone: 'var(--purple-ink)',
  },
  library: {
    label: 'Library only',
    text: 'Library only: you can find relevant passages, but nothing writes them into an answer.',
    tone: 'var(--green-ink)',
  },
  both: {
    label: 'Brain + Library',
    text: 'Brain + Library: evidence is retrieved, and the model writes an answer using it.',
    tone: 'var(--blue-ink)',
  },
};

const SAMPLE: Record<Mode, string> = {
  brain: 'The middle ear is the part of the ear between the middle ear and the nose.',
  library:
    '“The tympanic cavity is the air-filled space of the middle ear…” · “The middle ear contains three small bones, the ossicles…”',
  both: 'The middle ear includes the tympanic cavity and the three ossicles.',
};

function Tick({ colour }: { colour: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="none" stroke={colour} strokeWidth="1.5" opacity="0.5" />
      <path
        d="M4.5 8.2l2.3 2.3 4.7-4.9"
        fill="none"
        stroke={colour}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Scene3Memory() {
  const { reducedMotion, mode: appMode } = usePresentation();
  const [mode, setMode] = useState<Mode>('both');
  const machine = useSceneMachine(STEPS, {
    reducedMotion,
    autoPlay: appMode === 'explore',
  });
  useRegisterScene(machine);

  const brainOn = mode === 'brain' || mode === 'both';
  const libraryOn = mode === 'library' || mode === 'both';

  const select = (next: Mode) => {
    setMode(next);
    machine.replay();
  };

  return (
    <SceneFrame
      meta={META}
      footnote={
        <>
          “Library only” is a teaching device, not a system from the paper — the
          nearest real baseline is DPR, which retrieves and then{' '}
          <em>extracts</em> a span rather than writing an answer.
        </>
      }
    >
      <div className="s3">
        <div className="s3__buttons" role="group" aria-label="Memory configuration">
          {(Object.keys(OUTPUTS) as Mode[]).map((key) => (
            <button
              key={key}
              type="button"
              className={`ghostbtn${mode === key ? '' : ''}`}
              aria-pressed={mode === key}
              onClick={() => select(key)}
              style={{
                fontSize: 'var(--fs-sm)',
                padding: 'var(--space-3) var(--space-5)',
              }}
            >
              {OUTPUTS[key].label}
            </button>
          ))}
        </div>

        <div className="s3__stage">
          {/* Parametric */}
          <motion.div
            className={`s3__panel s3__panel--brain${brainOn ? '' : ' s3__panel--off'}`}
            animate={{ opacity: brainOn ? 1 : 0.28 }}
            transition={{ duration: reducedMotion ? 0 : 0.3 }}
          >
            <div className="s3__panelhead">
              <h3 className="s3__paneltitle">
                <Term name="Parametric memory">Parametric Memory</Term>
              </h3>
            </div>
            <ul className="s3__props">
              {PARAMETRIC_PROPS.map((prop) => (
                <li className="s3__prop" key={prop}>
                  <Tick colour="var(--purple)" />
                  {prop}
                </li>
              ))}
            </ul>
            <p className="s3__example">
              Example: <span style={{ color: 'var(--purple-ink)' }}>BART</span>
            </p>
          </motion.div>

          {/* DPR between the question and the library */}
          <div className="s3__middle">
            <p className="s3__qpill">{SCENE1_QUESTION}</p>
            <svg width="16" height="26" viewBox="0 0 16 26" aria-hidden="true">
              <path
                d="M8 0v18M4 14l4 4 4-4"
                fill="none"
                stroke="var(--line-strong)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className={`s3__dpr${libraryOn ? '' : ' s3__dpr--off'}`}>
              <Term name="Retriever">DPR Retriever</Term>
            </p>
            <svg width="16" height="26" viewBox="0 0 16 26" aria-hidden="true">
              <path
                d="M8 0v18M4 14l4 4 4-4"
                fill="none"
                stroke={libraryOn ? 'var(--green)' : 'var(--line-strong)'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Non-parametric */}
          <motion.div
            className={`s3__panel s3__panel--library${libraryOn ? '' : ' s3__panel--off'}`}
            animate={{ opacity: libraryOn ? 1 : 0.28 }}
            transition={{ duration: reducedMotion ? 0 : 0.3 }}
          >
            <div className="s3__panelhead">
              <h3 className="s3__paneltitle">
                <Term name="Non-parametric memory">Non-parametric Memory</Term>
              </h3>
            </div>
            <ul className="s3__props">
              {NONPARAMETRIC_PROPS.map((prop) => (
                <li className="s3__prop" key={prop}>
                  <Tick colour="var(--green)" />
                  {prop}
                </li>
              ))}
            </ul>
            <p className="s3__example">
              Example: <span style={{ color: 'var(--green-ink)' }}>Wikipedia</span>
            </p>
          </motion.div>
        </div>

        {/* Output + equation */}
        <div className="s3__output">
          <div>
            <p className="s3__outputlabel" style={{ color: OUTPUTS[mode].tone }}>
              {OUTPUTS[mode].label}
            </p>
            <motion.p
              key={mode}
              className="s3__outputtext"
              initial={reducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {SAMPLE[mode]}
            </motion.p>
            <p className="s3__eqcaption">{OUTPUTS[mode].text}</p>
          </div>

          <div>
            <div className="s3__equation">
              <span className="s3__eqterm s3__eqterm--rag">RAG</span>
              <span className="s3__eqop">=</span>
              <span className="s3__eqterm s3__eqterm--param">
                Parametric Memory
              </span>
              <span className="s3__eqop">+</span>
              <span className="s3__eqterm s3__eqterm--nonparam">
                Non-parametric Memory
              </span>
            </div>
            <p className="s3__eqcaption">
              A teaching summary, not a mathematical definition.
            </p>
          </div>
        </div>
      </div>
    </SceneFrame>
  );
}
