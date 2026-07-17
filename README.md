# Inside RAG: From Memory to Evidence

An interactive, classroom-ready visualiser for:

> Lewis et al. (2020), *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks.*
> [arXiv:2005.11401](https://arxiv.org/abs/2005.11401)

Built as a presentation aid for a university talk. The central analogy: **a
parametric-only language model takes a closed-book exam; RAG takes an open-book
exam — it searches for evidence, reads it, and then answers.**

Everything is simulated and deterministic. There is no backend, no AI model call,
no Wikipedia API and no network request of any kind at runtime, so the demo
behaves identically every time you present it.

---

## Setup

```bash
npm install
npm run dev
```

Then open <http://localhost:5173>.

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server on port 5173 |
| `npm run build` | Typecheck (`tsc --noEmit`) and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Typecheck only |

Requires Node 18+ (developed on Node 22).

### URL options

| URL | Effect |
| --- | --- |
| `/` | Normal animated presentation |
| `/?static=1` | Disables all animation; every scene renders in its finished state |

Use `?static=1` on an underpowered projector laptop, or if you simply want the
final state of each scene on screen immediately. The site also honours the
operating system's **prefers-reduced-motion** setting automatically.

---

## Presenting

1. Open the page and press **F11** (fullscreen) on the projector display.
2. Leave the mode switch on **Guided**.
3. Press **N** to bring up the presenter notes if you want the script.
4. Move with **→** / **←**. Each chapter is roughly 20–40 seconds of speaking.

Total runtime is about **3 minutes** of narration across six chapters, plus
however long you spend on the interactive parts.

### The two modes

| | **Guided** (default) | **Explore** |
| --- | --- | --- |
| Navigation | Previous / Next, linear | Jump to any chapter from the rail, or press `1`–`6` |
| Animations | You drive them (`Space`, `R`) | Scenes play on arrival |
| Intended for | Presenting to a room | Someone reading it alone afterwards |

### Chapter-by-chapter

| # | Chapter | The one idea | Interaction |
| --- | --- | --- | --- |
| 1 | The Closed-Book Problem | A parametric-only model is fluent and can still be wrong, with no evidence to check | **Ask BART** |
| 2 | How RAG Works | Search → Read → Generate, with visible evidence | **Try RAG**; hover the answer to see its source |
| 3 | Two Types of Memory | Parametric vs non-parametric knowledge | **Brain only** / **Library only** / **Brain + Library** |
| 4 | RAG-Sequence vs RAG-Token | Whole answer vs each word | Segmented toggle |
| 5 | What the Paper Found | It works, across four task types | Charts animate on arrival |
| 6 | Limitations and Takeaway | RAG does **not** eliminate hallucination | Reorder the evidence and watch the answer change |

### Keyboard controls

| Key | Action |
| --- | --- |
| `→` | Next chapter |
| `←` | Previous chapter |
| `Space` | Play / pause the current scene (replays it if it has finished) |
| `R` | Replay the current scene from the start |
| `N` | Show / hide presenter notes |
| `G` | Open / close the glossary |
| `Esc` | Close any open panel |
| `1`–`6` | Jump straight to a chapter (**Explore** mode only) |
| `Tab` / `Shift+Tab` | Move focus |

Shortcuts are ignored while focus is in a text field.

---

## Architecture

```
src/
├── main.tsx                  entry; imports the five stylesheets in order
├── App.tsx                   provider + shell + panels
├── context/
│   └── PresentationContext   mode · sceneIndex · panels · reducedMotion · scene registry
├── hooks/
│   ├── useSceneMachine       the animation timeline (see below)
│   ├── useReducedMotion      OS preference + ?static=1
│   └── useRegisterScene      exposes the mounted scene's machine to the keyboard layer
├── components/
│   ├── KeyboardManager       one global keydown handler
│   ├── TopBar · ChapterProgress · SceneViewport · SceneControls
│   ├── PresenterNotesPanel · GlossaryDrawer
│   └── shared/               SceneFrame, DocumentCard, TokenStream, PipelineRail,
│                             Charts, SegmentedToggle, Term, StageLabel, BrainSvg
├── scenes/                   Scene1…Scene6, one file each
├── data/                     every user-facing string and number
└── styles/                   tokens → base → shell → components → scenes
```

### Three ideas worth knowing

**1. Scenes are a pure function of elapsed time.**
`useSceneMachine` takes a list of `{ id, duration }` steps and tracks a single
`elapsed` value, advanced by `requestAnimationFrame`. Components ask it
questions — `reached('scoring')`, `progressOf('generating')` — and render
accordingly. This makes pause, replay and reduced-motion trivial: reduced motion
just sets `elapsed` to the total and skips the loop entirely. There is no
per-scene animation state to get out of sync.

**2. One scene owns the keyboard at a time.**
Each scene registers its machine via `useRegisterScene`, so `Space` and `R`
always have exactly one unambiguous target, and the Play/Pause label always
reflects the real status.

**3. Content lives in `src/data`, not in components.**
Every number shown on screen is transcribed from the paper in `data/findings.ts`,
and every passage and generated answer is in `data/passages.ts`. To check the
site against the paper you only need to read those two files.

### Dependencies

`react`, `react-dom`, `framer-motion`. That is the entire runtime dependency
list. The charts are hand-written SVG/CSS rather than a chart library, and the
scene state machine is a ~60-line hook rather than a state-machine library.

---

## Content accuracy

Content was checked line by line against the original paper.

**Taken directly from the paper**

- Retriever **DPR**; generator **BART-large**; knowledge source the **December
  2018 Wikipedia dump**, split into **21,015,324** 100-word passages (§3).
- Scene 1's answer is BART's real generation for the MS-MARCO input *"define
  middle ear"* (Table 4), where the paper marks it as factually incorrect.
- Scene 2's answer is RAG-Sequence's generation for the same input (Table 4, and
  the answer shown in Figure 1).
- Scene 4's Hemingway documents and the resulting clue are from Figure 2.
- Chapter 5, chart 1: Natural Questions Exact Match — T5-11B **34.5**, DPR
  **41.5**, RAG-Token **44.1**, RAG-Sequence **44.5** (Table 1).
- Chapter 5, chart 2: human factuality assessment — **7.1 / 42.7 / 11.7 / 17.7 /
  20.8 %** (Table 3), from 452 judged pairs.

**Deliberate teaching decisions, all disclosed on screen**

- **Scene 2's passages are invented.** Crucially, *no single passage contains the
  answer* — "tympanic cavity" comes from one and "the ossicles" from another, so
  the generator must combine them. This protects the paper's central claim that
  RAG **generates** rather than extracts: §4.1 reports RAG answering correctly
  11.8 % of the time on Natural Questions even when *no* retrieved document
  contains the answer, "whereas an extractive model would score 0 %".
- **K is shown as 3.** The paper retrieved 5 or 10.
- **Scene 4 shows 2 of Figure 2's 5 documents**, and the probabilities in both
  Scene 4 modes are simulated illustrations of the real mechanism.
- **"Library only" (Scene 3) is not a system from the paper.** The nearest real
  baseline is DPR, which retrieves and then *extracts*.
- **Scene 6's reranking demo is an illustration, not an experiment from the
  paper.**

**Claims deliberately avoided**

- The site never says RAG eliminates hallucination — Chapter 6 exists to say the
  opposite, in the paper's own spirit.
- 42.7 % is never described as "hallucination reduction". It is a pairwise human
  preference judgement on one task, and is labelled as such.
- Retrieved passages are never described as guaranteed evidence; retrieval
  relevance and factual correctness are distinguished explicitly in Chapter 6.

**A note on the paper's own numbers.** Table 3 gives *Both good* = **11.7 %** and
the five values sum to exactly 100 %. §4.3's prose instead says "both RAG and
BART were factual in a further 17 % of cases". The table is used here and the
prose is treated as an erratum. This is flagged on screen in Chapter 5.

---

## Accessibility

- Full keyboard operation; a visible focus ring on every control; a skip link.
- The scene viewport announces chapter changes via an `aria-live` region, and
  generated answers are announced as a settled sentence rather than token by
  token.
- Technical terms are buttons with tooltips that open on **hover and on keyboard
  focus**, backed by the same glossary the drawer renders.
- Charts expose their values through `role="img"` labels, so the numbers are
  available without reading the bars.
- `prefers-reduced-motion` is honoured: scenes render in their finished state
  with no tweens and no typewriter effect. Content is never gated behind an
  animation.
- Body text is 18 px or larger. Captions, provenance lines and small UI labels
  are deliberately smaller. On 768 px-tall laptops the quoted passage excerpts in
  Chapter 2 step down to 16 px, which is the one place the layout cannot hold the
  floor; every primary teaching line stays at 18 px or above at every size.

---

## Verified at

1440×900, 1920×1080 and 1366×768 — no clipped text, no overlap, no page
scrolling in any of the six chapters.
