import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

/* -------------------------------------------------------------------------- */
/* Content (simple, accurate academic English — UCL Pre-sessional level)      */
/* -------------------------------------------------------------------------- */

const VIDEO_ID = 'T-D1OfcDW1M';
const VIDEO_WATCH_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`;
const VIDEO_EMBED_URL = `https://www.youtube.com/embed/${VIDEO_ID}`;

interface FlowStep {
  id: string;
  step: string;
  name: string;
  tag: string;
  body: string;
  example: string;
}

const FLOW_STEPS: FlowStep[] = [
  {
    id: 'question',
    step: 'Step 1',
    name: 'User Question',
    tag: 'The user asks something.',
    body: 'The user types a question. On its own, the language model would answer using only the knowledge stored inside its parameters.',
    example: 'Example: “What is the capital of Australia?”',
  },
  {
    id: 'retrieval',
    step: 'Step 2',
    name: 'Retrieval',
    tag: 'Search for documents.',
    body: 'A retriever searches an external source, such as a document database or the web, and returns the passages that are most relevant to the question.',
    example: 'Example: it finds a passage that says “Canberra is the capital of Australia.”',
  },
  {
    id: 'augmentation',
    step: 'Step 3',
    name: 'Augmentation',
    tag: 'Add evidence to the prompt.',
    body: 'The retrieved passages are added to the prompt, so the model now sees both the question and the supporting evidence together.',
    example: 'Example: the prompt becomes “Using this passage: [Canberra is the capital…], answer: What is the capital of Australia?”',
  },
  {
    id: 'generation',
    step: 'Step 4',
    name: 'Generation',
    tag: 'Write a grounded answer.',
    body: 'The model generates its answer based on both its internal knowledge and the retrieved evidence. This can make the answer more factual and easier to check.',
    example: 'Example: “The capital of Australia is Canberra.”',
  },
];

interface CompareMode {
  id: 'traditional' | 'rag';
  label: string;
  title: string;
  desc: string;
  points: string[];
}

const COMPARE: CompareMode[] = [
  {
    id: 'traditional',
    label: 'Traditional LLM',
    title: 'Traditional LLM',
    desc: 'A traditional large language model relies mainly on its parametric memory — the knowledge learned during training. It does not look anything up before answering.',
    points: [
      'It answers only from knowledge stored in its parameters.',
      'Its knowledge is fixed at training time, so it can become outdated.',
      'It may provide unsupported information, and you cannot easily see where the answer came from.',
    ],
  },
  {
    id: 'rag',
    label: 'RAG-enabled LLM',
    title: 'RAG-enabled LLM',
    desc: 'A RAG-enabled model retrieves relevant external documents before generating an answer, and then writes its response using that evidence.',
    points: [
      'It searches an external source for relevant, up-to-date documents.',
      'It grounds the answer in retrieved evidence, which can improve factual accuracy.',
      'The evidence can be inspected, so answers are easier to verify.',
    ],
  },
];

const LIMITATIONS = [
  'The retriever may find irrelevant information.',
  'External sources may be inaccurate or outdated.',
  'The generator may ignore or misinterpret retrieved evidence.',
];

const DISCUSSION = [
  'Why can an LLM give an outdated or incorrect answer?',
  'How does RAG differ from a traditional LLM?',
  'Can RAG completely eliminate hallucinations? Why or why not?',
];

/* -------------------------------------------------------------------------- */
/* Small hooks                                                                */
/* -------------------------------------------------------------------------- */

/** Adds `is-visible` once the element scrolls into view (once). */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // If IntersectionObserver is unavailable, just show it.
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    // Safety net: content must never be stranded invisible if the observer
    // fails to fire (e.g. an unusual browser or a background tab that never
    // paints). Reveal unconditionally after a short delay.
    const failsafe = window.setTimeout(() => el.classList.add('is-visible'), 1200);
    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);
  return ref;
}

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
}

function RevealSection({ id, children, className }: SectionProps) {
  const ref = useReveal<HTMLElement>();
  return (
    <section
      id={id}
      ref={ref}
      className={`lp-section lp-reveal${className ? ' ' + className : ''}`}
    >
      <div className="lp-wrap">{children}</div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export function LessonPage() {
  const [openCard, setOpenCard] = useState<string | null>('question');
  const [mode, setMode] = useState<CompareMode['id']>('traditional');

  const scrollToVideo = useCallback(() => {
    const el = document.getElementById('video');
    if (!el) return;
    const reduce = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    el.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'start',
    });
  }, []);

  const activeCompare = COMPARE.find((c) => c.id === mode) ?? COMPARE[0]!;

  return (
    <>
      {/* Header */}
      <header className="lp-header">
        <div className="lp-wrap lp-header__inner">
          <a className="lp-wordmark" href="/index.html">
            Inside <em>RAG</em>
          </a>
          <a className="lp-header__link" href="/index.html">
            ← Guided presentation
          </a>
        </div>
      </header>

      {/* 1 — Hero */}
      <section className="lp-hero">
        <div className="lp-wrap">
          <h1 className="lp-hero__title">
            How Can RAG Reduce <span>AI Hallucinations?</span>
          </h1>
          <p className="lp-hero__intro">
            RAG allows an LLM to retrieve external information before generating
            an answer, which can improve factual accuracy.
          </p>
          <button type="button" className="lp-btn" onClick={scrollToVideo}>
            Watch the video
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9 3v10M4.5 8.5L9 13l4.5-4.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* 2 — Video */}
      <RevealSection id="video">
        <p className="lp-kicker">Watch first</p>
        <h2 className="lp-h2">A short introduction to RAG</h2>
        <p className="lp-lead">
          Watch this overview from IBM Technology, then explore the interactive
          sections below.
        </p>
        <div className="lp-video__frame">
          <iframe
            src={VIDEO_EMBED_URL}
            title="What is Retrieval-Augmented Generation (RAG)? — IBM Technology"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <div className="lp-video__meta">
          <span>Source: IBM Technology (YouTube)</span>
          <a href={VIDEO_WATCH_URL} target="_blank" rel="noopener noreferrer">
            Watch on YouTube ↗
          </a>
        </div>
      </RevealSection>

      {/* 3 — Interactive RAG flow */}
      <RevealSection>
        <p className="lp-kicker">The RAG pipeline</p>
        <h2 className="lp-h2">Four steps, from question to grounded answer</h2>
        <p className="lp-lead">
          Click each step to see what happens and a short example.
        </p>
        <ol className="lp-flow">
          {FLOW_STEPS.map((s) => {
            const open = openCard === s.id;
            return (
              <li className="lp-card" key={s.id}>
                <button
                  type="button"
                  className="lp-card__toggle"
                  aria-expanded={open}
                  aria-controls={`panel-${s.id}`}
                  onClick={() => setOpenCard(open ? null : s.id)}
                >
                  <span className="lp-card__step">{s.step}</span>
                  <span className="lp-card__name">
                    {s.name}
                    <svg
                      className="lp-card__chev"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4.5 6.5L9 11l4.5-4.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="lp-card__tag">{s.tag}</span>
                </button>
                <div
                  className={`lp-card__panel${open ? ' open' : ''}`}
                  id={`panel-${s.id}`}
                  role="region"
                  aria-label={`${s.name} details`}
                >
                  <div className="lp-card__panelinner">
                    <div className="lp-card__body">
                      {s.body}
                      <span className="lp-card__example">{s.example}</span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </RevealSection>

      {/* 4 — Comparison */}
      <RevealSection>
        <p className="lp-kicker">Compare</p>
        <h2 className="lp-h2">Traditional LLM vs. RAG-enabled LLM</h2>
        <p className="lp-lead">
          Switch between the two approaches to see how they answer differently.
        </p>
        <div
          className="lp-compare__tabs"
          role="group"
          aria-label="Choose an approach to compare"
        >
          {COMPARE.map((c) => (
            <button
              key={c.id}
              type="button"
              className="lp-compare__tab"
              aria-pressed={mode === c.id}
              onClick={() => setMode(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div
          className={`lp-compare__panel lp-compare__panel--${activeCompare.id}`}
          key={activeCompare.id}
          role="region"
          aria-live="polite"
          aria-label={activeCompare.title}
        >
          <h3 className="lp-compare__title">{activeCompare.title}</h3>
          <p className="lp-compare__desc">{activeCompare.desc}</p>
          <ul className="lp-compare__list">
            {activeCompare.points.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      </RevealSection>

      {/* 5 — Limitations */}
      <RevealSection>
        <div className="lp-limits">
          <p className="lp-kicker">An honest limitation</p>
          <p className="lp-limits__claim">
            RAG can reduce hallucinations, but it{' '}
            <strong>cannot completely eliminate them</strong>.
          </p>
          <div className="lp-limits__grid">
            {LIMITATIONS.map((text, i) => (
              <div className="lp-limits__item" key={i}>
                <span className="lp-limits__num">{i + 1}</span>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* 6 — Discussion */}
      <RevealSection>
        <p className="lp-kicker">After the video</p>
        <h2 className="lp-h2">Discussion questions</h2>
        <p className="lp-lead">
          Talk about these questions with a partner or in a small group.
        </p>
        <ol className="lp-discuss__list">
          {DISCUSSION.map((q, i) => (
            <li className="lp-discuss__item" key={i}>
              {q}
            </li>
          ))}
        </ol>
      </RevealSection>

      {/* Footer */}
      <footer className="lp-footer">
        <div className="lp-wrap">
          Classroom lesson page · Video © IBM Technology, embedded from YouTube.
        </div>
      </footer>
    </>
  );
}
