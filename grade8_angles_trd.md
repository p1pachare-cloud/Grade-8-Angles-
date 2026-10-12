# Technical Requirements Document (TRD)

## Angles — Measuring, Relating & Reasoning About Angles | Grade 8 Math

### Intellia SG | Global Grade 8 Mathematics Curriculum

---

## 1. Technical Overview

This document specifies the architecture, component design, state management, data models, procedural question generation, simulation logic, gamification, audio pipeline, deployment and quality standards for the **"Global Angle Architects — Angles"** interactive lesson module (Grade 8 Math).

The module is a **React 18 application (Vite + JSX)**, structured to mirror the reference repository **<https://github.com/p1pachare-cloud/Grade5-Time-Intervals>** (same top-level layout: `public/assets`, `scripts`, `src`, `index.html`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`) and styled to strictly match **<https://grade5-time-intervals.vercel.app/>**. It is embedded at:

```
https://intelliasg.com/courses/grade-8-math/lessons/angles/    (slug to be confirmed)
```

Audio narration uses **ElevenLabs exclusively** (no Web Speech fallback), implementing `audio_generation_pipeline.md`, extended to support **randomised question text** via a server-side proxy and persistent caching.

**Key technical differences from the Grade 5 reference:**

| Topic | Reference | This module |
| --- | --- | --- |
| Questions | Static `questionBank.js`, shuffled | **Seeded procedural generators** — every question is generated, answer-computed and validated |
| Math core | Minutes-since-midnight arithmetic | Integer-degree arithmetic + transversal relation engine |
| Diagrams | Clock SVG + timeline | Declarative `AngleDiagram`, `Protractor`, `TransversalDiagram`, `TriangleDiagram`, `PolygonDiagram` |
| Stations | 3 | 4 |
| ElevenLabs key | `VITE_` key in browser | Key kept **server-side**; browser calls `/api/elevenlabs` |
| Resume | Persist state | Persist **seed** + progress; regenerate the same questions deterministically |

---

## 2. Technology Stack

| Layer | Technology | Rationale |
| --- | --- | --- |
| UI Framework | React 18 (JSX, Vite) | Matches reference repo |
| State Management | `useReducer` + context | Single-module complexity |
| Styling | Tailwind CSS + CSS (reference tokens) | Reference repo has `tailwind.config.js` / `postcss.config.js` |
| Icons | Lucide React | Lightweight, tree-shakable |
| Animation | CSS keyframes + transitions (+ `requestAnimationFrame` for drag) | No heavy dependency |
| SVG Diagrams | Inline React SVG | Crisp at any size, scriptable, accessible |
| Drag & Drop | Pointer Events API (custom hook `usePointerDrag`) | Unified mouse/touch/pen; no library |
| Persistence | `localStorage` (progress) + IndexedDB (audio cache) | No backend |
| Randomness | Custom seeded PRNG (mulberry32) | Reproducible sessions; testable |
| Audio (generation) | ElevenLabs REST API | Voice: Alice |
| Audio (playback) | HTML5 `Audio` | Native |
| Serverless | Vercel Serverless Function (`api/elevenlabs.js`) | Hides API key |
| Testing | Vitest + React Testing Library + (optional) fast-check | Unit/property tests |
| Build Tool | Vite | Matches reference |
| Hosting | Vercel | Matches reference |

---

## 3. Project Structure (mirrors reference repo)

```
grade8-angles/
├── public/
│   └── assets/
│       ├── audio/                          # Pre-generated .mp3 (fixed scripts only)
│       │   ├── audio_wonder_hook_0.mp3
│       │   ├── audio_story_panel1_0.mp3 … audio_story_panel6_0.mp3
│       │   ├── audio_station_a_instruction_0.mp3 … station_d
│       │   ├── audio_correct_0.mp3 … audio_hint_*.mp3
│       │   └── … (all fixed phrases)
│       └── images/
│           ├── vertex-idle.svg | vertex-happy.svg | vertex-thinking.svg
│           ├── vertex-celebrate.svg | vertex-encourage.svg
│           ├── world-map-bg.svg
│           └── landmarks/ (giza.svg, eiffel.svg, golden-gate.svg, opera.svg,
│                           tokyo.svg, taj.svg, pisa.svg, rio.svg, wall.svg, burj.svg)
├── src/
│   ├── main.jsx
│   ├── App.jsx                             # Root; global reducer
│   ├── App.css                             # Global styles (reference tokens)
│   ├── components/
│   │   ├── IntroScreen.jsx
│   │   ├── ProgressMap.jsx                 # 6-phase dot tracker (top bar)
│   │   ├── phases/
│   │   │   ├── WonderPhase.jsx
│   │   │   ├── StoryPhase.jsx
│   │   │   ├── SimulatePhase.jsx           # Station wrapper (4 stations)
│   │   │   ├── PlayPhase.jsx               # IntelliPlay quiz engine
│   │   │   └── ReflectPhase.jsx
│   │   ├── simulations/
│   │   │   ├── AngleLabStation.jsx         # Station A
│   │   │   ├── TransversalStation.jsx      # Station B
│   │   │   ├── SumLabStation.jsx           # Station C
│   │   │   └── EquationBuilderStation.jsx  # Station D
│   │   ├── quiz/
│   │   │   ├── QuestionRenderer.jsx        # Dispatches by answerFormat
│   │   │   ├── formats/
│   │   │   │   ├── McqFormat.jsx
│   │   │   │   ├── NumericFormat.jsx       # Degree pad
│   │   │   │   ├── TapAngleFormat.jsx      # Tap angle(s) on diagram
│   │   │   │   ├── TrueFalseFormat.jsx
│   │   │   │   └── SpotMistakeFormat.jsx
│   │   │   ├── ReasonPicker.jsx            # "Give the reason" step
│   │   │   └── HintOverlay.jsx
│   │   ├── gamification/
│   │   │   ├── XPTracker.jsx
│   │   │   ├── StarRating.jsx
│   │   │   ├── BadgePanel.jsx
│   │   │   ├── StreakCounter.jsx
│   │   │   └── WorldMap.jsx
│   │   └── shared/
│   │       ├── Mascot.jsx                  # "Vertex"
│   │       ├── diagrams/
│   │       │   ├── AngleDiagram.jsx        # Declarative figure renderer
│   │       │   ├── Protractor.jsx
│   │       │   ├── TransversalDiagram.jsx
│   │       │   ├── TriangleDiagram.jsx
│   │       │   └── PolygonDiagram.jsx
│   │       ├── EquationTray.jsx
│   │       ├── DegreePad.jsx
│   │       ├── GlossaryToggle.jsx          # "Words I use at school"
│   │       └── FeedbackOverlay.jsx
│   ├── data/
│   │   ├── storyContent.js                 # 6 panels (text + visuals)
│   │   ├── worlds.js                       # 10 world definitions
│   │   ├── names.js                        # global name & landmark pools
│   │   ├── reasons.js                      # reason options + glossary variants
│   │   └── misconceptions.js               # tag → hint message
│   ├── generators/
│   │   ├── index.js                        # registry + session builder
│   │   ├── q01_classify.js … q10_algebra.js
│   │   ├── distractors.js
│   │   └── validate.js                     # independent answer checker
│   ├── hooks/
│   │   ├── useAudio.js
│   │   ├── useGameState.js
│   │   ├── useLocalStorage.js
│   │   └── usePointerDrag.js
│   └── utils/
│       ├── audio.js                        # Engine per audio_generation_pipeline.md
│       ├── audioMap.js                     # AUTO-GENERATED
│       ├── toSpeech.js                     # on-screen text → spoken text
│       ├── narration.js                    # Fixed scripts per phase
│       ├── rng.js                          # Seeded PRNG
│       ├── angleMath.js                    # Core angle engine
│       ├── transversal.js                  # 8-angle relation engine
│       ├── scoring.js
│       └── badgeEngine.js
├── scripts/
│   ├── generate_audio.js
│   └── clean_audio.js
├── api/
│   └── elevenlabs.js                       # Serverless proxy
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .gitignore
```

---

## 4. Application State Architecture

### 4.1 Global State (`App.jsx` — `useReducer`)

```js
const initialState = {
  // Session
  sessionId: crypto.randomUUID(),
  seed: (crypto.getRandomValues(new Uint32Array(1))[0]) >>> 0,   // drives ALL randomness

  // Navigation
  phase: 'intro',            // 'intro'|'wonder'|'story'|'simulate'|'play'|'reflect'|'results'
  storyPanel: 0,             // 0–5
  currentSimStation: 0,      // 0=AngleLab 1=Transversal 2=SumLab 3=Equation
  simStationsComplete: [false, false, false, false],
  simRound: 0,

  // Play phase
  questionSet: [],           // 100 generated Question objects (derived from seed)
  retryCounters: Array(10).fill(0),  // retry salt per world → fresh questions
  currentQuestion: 0,        // 0–99
  currentWorld: 0,           // 0–9
  worldScores: Array(10).fill(null),
  attemptCount: 0,           // attempts on current question (max 3)
  hintsUsed: 0,
  reasonStep: false,         // true while the "give the reason" step is showing
  reviewTray: [],            // questions missed 3×

  // Gamification
  xp: 0,
  totalStars: 0,
  streak: 0,
  maxStreak: 0,
  badges: [],
  reasonsCorrect: 0,
  stationBPerfect: null,     // null until station B finished

  // Phase completion
  phaseComplete: { wonder: false, story: false, simulate: false, play: false, reflect: false },

  // Settings
  audioEnabled: true,
  reducedMotion: false,
  glossary: 'neutral',       // 'neutral' | 'us' | 'uk' | 'sg' | 'in'
};
```

### 4.2 Reducer Action Types

```js
const ACTIONS = {
  SET_PHASE, NEXT_STORY_PANEL,
  ADVANCE_SIM_STATION, COMPLETE_SIM_STATION, NEXT_SIM_ROUND, SET_STATION_B_PERFECT,
  LOAD_QUESTIONS, ANSWER_CORRECT, ANSWER_INCORRECT, USE_HINT,
  SHOW_REASON_STEP, REASON_RESULT, NEXT_QUESTION,
  COMPLETE_WORLD, RETRY_WORLD,
  UNLOCK_BADGE, COMPLETE_PHASE,
  TOGGLE_AUDIO, TOGGLE_REDUCED_MOTION, SET_GLOSSARY,
  RESTORE_SESSION, RESET_SESSION,
};
```

### 4.3 Key Reducer Logic

```js
case ACTIONS.ANSWER_CORRECT: {
  const { reasonBonus = 0 } = action.payload || {};
  const xpEarned = calcXP(state.attemptCount + 1, state.hintsUsed, state.streak) + reasonBonus;
  const w = state.currentWorld;
  const scores = [...state.worldScores];
  scores[w] = (scores[w] ?? 0) + 1;
  const streak = state.streak + 1;
  return {
    ...state,
    xp: state.xp + xpEarned,
    streak, maxStreak: Math.max(state.maxStreak, streak),
    worldScores: scores,
    totalStars: calcTotalStars(scores),
    attemptCount: 0, hintsUsed: 0, reasonStep: false,
  };
}

case ACTIONS.ANSWER_INCORRECT: {
  const attempts = state.attemptCount + 1;
  const q = state.questionSet[state.currentQuestion];
  return {
    ...state,
    streak: 0,
    attemptCount: attempts,
    reviewTray: attempts >= 3 ? [...state.reviewTray, q.id] : state.reviewTray,
  };
}

case ACTIONS.RETRY_WORLD: {
  // fresh questions: bump the world's retry salt and regenerate that world's 10 slots
  const retryCounters = [...state.retryCounters];
  retryCounters[action.world] += 1;
  return { ...state, retryCounters, questionSet: rebuildWorld(state, action.world, retryCounters) };
}
```

---

## 5. Angle Math Engine (`utils/angleMath.js`)

All angle values are **integers in degrees**. Float arithmetic is never used for answers. (Rendering may use floats for coordinates only.)

```js
export const TOTALS = { LINE: 180, POINT: 360, RIGHT: 90, TRIANGLE: 180, QUAD: 360 };

export const complement = (a) => 90 - a;       // valid when 0 < a < 90
export const supplement = (a) => 180 - a;      // valid when 0 < a < 180

export function classifyAngle(deg) {
  if (deg > 0 && deg < 90) return 'acute';
  if (deg === 90) return 'right';
  if (deg > 90 && deg < 180) return 'obtuse';
  if (deg === 180) return 'straight';
  if (deg > 180 && deg < 360) return 'reflex';
  if (deg === 360) return 'full';
  throw new RangeError(`Angle out of range: ${deg}`);
}

export const polygonInteriorSum = (n) => (n - 2) * 180;
export const regularInterior = (n) => polygonInteriorSum(n) / n;   // integer only for allowed n
export const regularExterior = (n) => 360 / n;                      // integer only for allowed n

// n values whose regular interior/exterior angle is a whole number of degrees
export const REGULAR_N = [3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20];

export function exteriorOfTriangle(remoteA, remoteB) { return remoteA + remoteB; }

// Random partition of `total` into `n` parts, each >= minPart, multiples of `step`
export function randomPartition(rng, total, n, minPart = 15, step = 1) {
  const units = total / step;
  const minU = Math.ceil(minPart / step);
  const free = units - n * minU;
  if (free < 0) throw new Error('Partition impossible');
  const cuts = Array.from({ length: n - 1 }, () => rng.int(0, free)).sort((a, b) => a - b);
  const parts = [];
  let prev = 0;
  for (const c of [...cuts, free]) { parts.push((c - prev + minU) * step); prev = c; }
  return parts;                                    // sums exactly to `total`
}

export function snapAngle(deg, step = 1) { return Math.round(deg / step) * step; }
```

### 5.1 Transversal Relation Engine (`utils/transversal.js`)

Eight angles are named `LINE.QUAD`, where `LINE ∈ {T (top parallel), B (bottom parallel)}` and `QUAD ∈ {UL, UR, LL, LR}` (above/below the parallel line, left/right of the transversal). Because the lines are parallel, the two junctions are identical. With θ = the acute (or any) angle at `T.UR`:

```js
export const IDS = ['T.UL','T.UR','T.LL','T.LR','B.UL','B.UR','B.LL','B.LR'];

const QUAD_VALUE = { UL: (t) => 180 - t, UR: (t) => t, LL: (t) => t, LR: (t) => 180 - t };
export const angleValue = (id, theta) => QUAD_VALUE[id.split('.')[1]](theta);

const OPP = { UL: 'LR', LR: 'UL', UR: 'LL', LL: 'UR' };
const isInterior = (l, q) => (l === 'T' && (q === 'LL' || q === 'LR')) || (l === 'B' && (q === 'UL' || q === 'UR'));

export function relationBetween(a, b) {
  if (a === b) return 'same';
  const [la, qa] = a.split('.');
  const [lb, qb] = b.split('.');
  if (la === lb) return OPP[qa] === qb ? 'vertically-opposite' : 'linear-pair';
  if (qa === qb) return 'corresponding';
  const sameSide = qa[1] === qb[1];
  const ia = isInterior(la, qa), ib = isInterior(lb, qb);
  if (ia && ib) return sameSide ? 'co-interior' : 'alternate-interior';
  if (!ia && !ib) return sameSide ? 'co-exterior' : 'alternate-exterior';
  return 'derived';                       // two-step: e.g. T.UL vs B.UR
}

export const EQUAL_RELATIONS = new Set(['same','vertically-opposite','corresponding','alternate-interior','alternate-exterior']);
export const SUPPLEMENTARY_RELATIONS = new Set(['linear-pair','co-interior','co-exterior']);

// Ground truth used by tests AND by the explorer's colouring (never trust relation labels alone)
export function valueRelation(a, b, theta) {
  const x = angleValue(a, theta), y = angleValue(b, theta);
  if (x === y) return 'equal';
  if (x + y === 180) return 'supplementary';
  return 'neither';
}

export const REASON_FOR = {
  'vertically-opposite': 'vertically-opposite',
  'linear-pair': 'straight-line',
  'corresponding': 'corresponding',
  'alternate-interior': 'alternate',
  'alternate-exterior': 'alternate',
  'co-interior': 'co-interior',
  'co-exterior': 'co-interior',
};
```

Test invariant: for every ordered pair and every θ in 1…179, `relationBetween` ∈ EQUAL ⇒ `valueRelation === 'equal'` (or the pair is the same) and ∈ SUPPLEMENTARY ⇒ `'supplementary'` (or equal when θ = 90).

---

## 6. Seeded Randomness & Question Generation

### 6.1 PRNG (`utils/rng.js`)

```js
export function createRng(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (lo, hi) => lo + Math.floor(next() * (hi - lo + 1));
  const pick = (arr) => arr[Math.floor(next() * arr.length)];
  const shuffle = (arr) => {                       // Fisher–Yates
    const out = [...arr];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };
  const chance = (p) => next() < p;
  return { next, int, pick, shuffle, chance };
}

// Derive independent child streams so world retries don't disturb other worlds
export const childSeed = (seed, ...salts) =>
  salts.reduce((s, x) => (Math.imul(s ^ (x + 0x9E3779B9), 0x85EBCA6B) >>> 0), seed >>> 0);
```

### 6.2 Question Schema

```ts
interface Question {
  id: string;                       // `${type}-${world}-${slot}-${hash}`
  type: 'classify' | 'comp_supp' | 'line_point' | 'vertical_adjacent'
      | 'parallel_name' | 'parallel_find' | 'triangle_sum'
      | 'exterior_angle' | 'polygon' | 'algebra';
  world: number;                    // 0–9
  slot: number;                     // 0–9 within the world
  isSpiral: boolean;
  difficulty: 1 | 2 | 3;

  questionText: string;             // exactly what is rendered and (via toSpeech) narrated
  figure: FigureSpec | null;        // declarative diagram description
  figureNotToScale: boolean;        // shows "Diagram not accurately drawn"

  answerFormat: 'mcq' | 'numeric' | 'tap_angle' | 'true_false' | 'spot_mistake';
  options?: { value: string | number; tag?: string }[];   // tag = misconception id, if any
  correctAnswer: number | string | string[];              // string[] for multi tap
  unit?: '°' | '';

  reason?: {                        // optional second step
    prompt: string;
    options: string[];              // reason ids from data/reasons.js
    correct: string;
  };

  hint1: string;                    // from misconception tag or generic rule reminder
  hint2: string;                    // rule + equation with known values filled in
  explanation: string;              // worked solution with reasons (narrated after 3 fails)

  context?: { name: string; city?: string; landmark?: string; object?: string };
  signature: string;                // for duplicate detection
  meta: Record<string, unknown>;    // raw parameters for the independent validator
}

interface FigureSpec {
  kind: 'angle' | 'cross' | 'point' | 'line' | 'transversal' | 'triangle'
      | 'polygon' | 'quad';
  rays?: number[];                  // ray directions, degrees from +x
  labels?: { at: string; text: string; unknown?: boolean }[];   // e.g. { at:'T.UR', text:'65°' }
  parallel?: boolean;               // draw parallel marks
  markEqual?: string[][];           // groups of equal angles
  extend?: string;                  // triangle side extended for exterior angle
  n?: number;                       // polygon side count
  rotation?: number;                // random orientation
}
```

### 6.3 Generator Contract

```js
// Every generator has the same signature and returns a complete Question
//   rng        — seeded PRNG (child stream for this exact slot)
//   difficulty — 1|2|3
//   ctx        — { world, slot, isSpiral, glossary }
type Generator = (rng, difficulty, ctx) => Question;

export const GENERATORS = {
  classify: genClassify,         // Q1
  comp_supp: genCompSupp,        // Q2
  line_point: genLinePoint,      // Q3
  vertical_adjacent: genVertical,// Q4
  parallel_name: genParallelName,// Q5
  parallel_find: genParallelFind,// Q6
  triangle_sum: genTriangle,     // Q7
  exterior_angle: genExterior,   // Q8
  polygon: genPolygon,           // Q9
  algebra: genAlgebra,           // Q10
};
```

### 6.4 Difficulty Parameter Tables

| Generator | Easy (1) | Medium (2) | Hard (3) |
| --- | --- | --- | --- |
| classify | angle multiple of 15°, MCQ of 5 names | any integer; includes 90°/180° edge cases; "estimate within ±10°" | reflex & near-boundary values (89°, 91°, 179°, 181°); sort three angles by size |
| comp_supp | multiples of 5°, one relation | any integer, mixed "find complement of x" / "supplement" | expressions: "supplement of the complement of 40°" |
| line_point | 1 unknown, 2 known angles, 180° or 360° | 2 unknown equal angles, 3 known | 4 known at a point; mixed right-angle marker |
| vertical_adjacent | one angle given, find the other three | two-step: given angle + adjacent relationship | embedded in multi-line figure (three lines through one point) |
| parallel_name | name one pair, corresponding only | alternate + corresponding | all 3 + "derived" two-step pairs |
| parallel_find | one step, reason chosen from 3 | one step, 4 reasons incl. near-misses | two- or three-step chain; reason for each step |
| triangle_sum | scalene, two known | isosceles with one known (base or apex) | equilateral + isosceles with algebra |
| exterior_angle | find exterior from remote interiors | find a remote interior | find an interior from exterior + ratio/algebra |
| polygon | quadrilateral missing angle; sum for n ≤ 8 | regular `n ∈ {5,6,8}` interior/exterior | `n ∈ REGULAR_N` up to 20; find `n` from exterior angle; irregular pentagon missing angle |
| algebra | one pair on a line; equation shown | choose rule + build equation + solve | expressions with two coefficients, ≥3 angles, or equality + sum chain |

### 6.5 Example Generators (full reference implementations)

#### Q3 — Angles on a straight line / around a point

```js
export function genLinePoint(rng, difficulty, ctx) {
  const total = difficulty === 1 ? rng.pick([180, 360]) : rng.pick([180, 360, 360]);
  const parts = total === 180
    ? (difficulty === 3 ? 3 : 2)
    : (difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5);
  const step = difficulty === 1 ? 5 : 1;
  const angles = randomPartition(rng, total, parts, 20, step);
  const hiddenIdx = rng.int(0, parts - 1);
  const known = angles.filter((_, i) => i !== hiddenIdx);
  const answer = angles[hiddenIdx];
  const who = pickContext(rng, ctx);

  const rule = total === 180 ? 'straight-line' : 'around-point';
  const shape = total === 180 ? 'on a straight line' : 'around a point';
  const knownText = known.map((k) => `${k}°`).join(', ');

  const wrongTotalAnswer = (total === 180 ? 360 : 180) - known.reduce((s, k) => s + k, 0);
  const forgotOne = total - (known.reduce((s, k) => s + k, 0) - Math.max(...known));

  const options = buildNumericOptions(rng, answer, [
    { value: wrongTotalAnswer, tag: 'wrong-total' },
    { value: forgotOne,        tag: 'forgot-angle' },
    { value: 90 - (known[0] % 90), tag: 'comp-vs-supp' },
  ]);

  return {
    id: makeId('line_point', ctx, angles),
    type: 'line_point', world: ctx.world, slot: ctx.slot, isSpiral: ctx.isSpiral, difficulty,
    questionText:
      `${who.name} is fixing a ${who.object} at the ${who.landmark}. ` +
      `${parts} angles ${shape} measure ${knownText} and x. Find x.`,
    figure: {
      kind: total === 180 ? 'line' : 'point',
      rays: raysFromAngles(angles, rng.int(0, 359)),
      labels: angles.map((a, i) => ({ at: `A${i}`, text: i === hiddenIdx ? 'x' : `${a}°`, unknown: i === hiddenIdx })),
    },
    figureNotToScale: true,
    answerFormat: 'mcq',
    options,
    correctAnswer: answer,
    unit: '°',
    hint1: hintForTags(options, 'Check the total: a full turn at a point is 360°, a straight line is 180°.'),
    hint2: `${known.join(' + ')} + x = ${total}`,
    explanation: `${shape[0].toUpperCase() + shape.slice(1)} the angles add up to ${total}°. ` +
                 `${known.join(' + ')} = ${total - answer}, so x = ${total} − ${total - answer} = ${answer}°.`,
    context: who,
    signature: `line_point|${total}|${angles.join('-')}|${hiddenIdx}`,
    meta: { total, angles, hiddenIdx },
  };
}
```

#### Q6 — Parallel lines: find the angle and give the reason

```js
export function genParallelFind(rng, difficulty, ctx) {
  const theta = difficulty === 1 ? rng.pick([40, 50, 60, 70, 110, 120, 130]) : rng.int(25, 155);
  const ids = IDS;
  const given = rng.pick(ids);
  let target = rng.pick(ids.filter((i) => i !== given));
  // easy/medium: keep to single-step relations (no 'derived')
  const maxTries = 30;
  for (let t = 0; t < maxTries && difficulty < 3 && relationBetween(given, target) === 'derived'; t++) {
    target = rng.pick(ids.filter((i) => i !== given));
  }
  const rel = relationBetween(given, target);
  const gv = angleValue(given, theta);
  const answer = angleValue(target, theta);
  const reasonId = REASON_FOR[rel] ?? 'derived-two-step';

  const options = buildNumericOptions(rng, answer, [
    { value: gv, tag: 'treated-as-equal' },                 // co-interior treated as equal
    { value: 180 - answer, tag: 'wrong-relation' },        // alternate ↔ co-interior mix-up
    { value: 90 - (gv % 90), tag: 'comp-vs-supp' },
  ]);

  return {
    id: makeId('parallel_find', ctx, [theta, given, target]),
    type: 'parallel_find', world: ctx.world, slot: ctx.slot, isSpiral: ctx.isSpiral, difficulty,
    questionText: `The two horizontal lines are parallel. Angle ${given} is ${gv}°. Find the angle marked x.`,
    figure: {
      kind: 'transversal', parallel: true,
      labels: [{ at: given, text: `${gv}°` }, { at: target, text: 'x', unknown: true }],
      rotation: rng.int(-15, 15),
    },
    figureNotToScale: true,
    answerFormat: 'numeric',
    correctAnswer: answer,
    unit: '°',
    reason: {
      prompt: 'Which rule gives you this angle?',
      options: buildReasonOptions(rng, reasonId),
      correct: reasonId,
    },
    hint1: 'Decide first: are the two angles equal, or do they add to 180°?',
    hint2: EQUAL_RELATIONS.has(rel)
      ? `These are ${rel.replace('-', ' ')} angles, so they are equal.`
      : `These angles add to 180°: x = 180 − ${gv}.`,
    explanation: `${REASON_TEXT[reasonId]} So x = ${answer}°.`,
    signature: `parallel_find|${theta}|${given}|${target}`,
    meta: { theta, given, target, rel },
  };
}
```

#### Q9 — Quadrilaterals & polygons

```js
export function genPolygon(rng, difficulty, ctx) {
  const variants = {
    1: ['quad-missing', 'sum-n'],
    2: ['regular-interior', 'regular-exterior', 'sum-n'],
    3: ['regular-interior', 'find-n-from-exterior', 'pentagon-missing'],
  }[difficulty];
  const variant = rng.pick(variants);
  const nPool = difficulty === 1 ? [5, 6, 8] : difficulty === 2 ? [5, 6, 8, 9, 10, 12] : REGULAR_N.filter((n) => n >= 5);

  let q;
  if (variant === 'quad-missing') {
    const [a, b, c, d] = randomPartition(rng, 360, 4, 40, 5);
    q = { text: `A quadrilateral has angles ${a}°, ${b}° and ${c}°. Find the fourth angle.`, ans: d,
          reasonId: 'quad-sum', fig: { kind: 'quad', labels: [a, b, c, d] }, tags: [
            { value: 180 - (a + b + c) > 0 ? 180 - (a + b + c) : a + b, tag: 'wrong-total' },
            { value: 360 - (a + b), tag: 'forgot-angle' }] };
  } else if (variant === 'sum-n') {
    const n = rng.pick(nPool);
    q = { text: `Find the sum of the interior angles of a polygon with ${n} sides.`, ans: polygonInteriorSum(n),
          reasonId: 'polygon-sum', fig: { kind: 'polygon', n }, tags: [
            { value: n * 180, tag: 'n-times-180' }, { value: (n - 1) * 180, tag: 'n-minus-1' }, { value: (n - 2) * 360, tag: 'wrong-total' }] };
  } else if (variant === 'regular-interior') {
    const n = rng.pick(nPool);
    q = { text: `Find each interior angle of a regular polygon with ${n} sides.`, ans: regularInterior(n),
          reasonId: 'polygon-sum', fig: { kind: 'polygon', n }, tags: [
            { value: regularExterior(n), tag: 'interior-vs-exterior' }, { value: (n * 180) / n, tag: 'n-times-180' }, { value: polygonInteriorSum(n), tag: 'forgot-divide' }] };
  } else if (variant === 'regular-exterior') {
    const n = rng.pick(nPool);
    q = { text: `Find each exterior angle of a regular polygon with ${n} sides.`, ans: regularExterior(n),
          reasonId: 'exterior-sum', fig: { kind: 'polygon', n }, tags: [
            { value: regularInterior(n), tag: 'interior-vs-exterior' }, { value: 180 / n, tag: 'wrong-total' }] };
  } else if (variant === 'find-n-from-exterior') {
    const n = rng.pick(nPool);
    const e = regularExterior(n);
    q = { text: `Each exterior angle of a regular polygon is ${e}°. How many sides does it have?`, ans: n,
          reasonId: 'exterior-sum', fig: null, tags: [
            { value: 180 / e, tag: 'wrong-total' }, { value: n + 2, tag: 'n-minus-1' }], unit: '' };
  } else {                                   // pentagon-missing
    const parts = randomPartition(rng, 540, 5, 60, 1);
    q = { text: `A pentagon has angles ${parts.slice(0, 4).map((p) => p + '°').join(', ')}. Find the fifth angle.`, ans: parts[4],
          reasonId: 'polygon-sum', fig: { kind: 'polygon', n: 5, labels: parts }, tags: [
            { value: 360 - parts.slice(0, 4).reduce((s, p) => s + p, 0), tag: 'wrong-total' }] };
  }

  const who = pickContext(rng, ctx);
  return finalise({ type: 'polygon', ctx, difficulty, who, base: q, rng });
}
```

#### Q10 — Multi-step algebra with justification

```js
export function genAlgebra(rng, difficulty, ctx) {
  const kind = difficulty === 1 ? 'line' : rng.pick(['line', 'point-3', 'vertical-equal', 'triangle']);
  for (let attempt = 0; attempt < 80; attempt++) {
    const x = rng.int(8, 32);
    const total = { line: 180, 'point-3': 360, triangle: 180, 'vertical-equal': null }[kind];
    const n = { line: 2, 'point-3': 3, triangle: 3, 'vertical-equal': 2 }[kind];

    // Build target angle values first, then derive coefficients/constants from x
    const values = kind === 'vertical-equal'
      ? (() => { const v = rng.int(40, 140); return [v, v]; })()
      : randomPartition(rng, total, n, 25, 1);

    const coefs = values.map(() => rng.int(1, difficulty === 3 ? 5 : 3));
    const consts = values.map((v, i) => v - coefs[i] * x);
    if (consts.some((c) => Math.abs(c) > 45)) continue;                          // keep expressions tidy
    if (new Set(values.map((v, i) => `${coefs[i]}|${consts[i]}`)).size < n && kind !== 'vertical-equal') continue;
    if (kind === 'vertical-equal' && coefs[0] === coefs[1] && consts[0] === consts[1]) continue;

    const exprs = values.map((_, i) => fmtExpr(coefs[i], consts[i]));
    const equation = kind === 'vertical-equal'
      ? `${exprs[0]} = ${exprs[1]}`
      : `${exprs.map((e) => `(${e})`).join(' + ')} = ${total}`;
    const askLargest = difficulty >= 2 && rng.chance(0.5);
    const answer = askLargest ? Math.max(...values) : x;

    const rule = { line: 'straight-line', 'point-3': 'around-point', triangle: 'triangle-sum', 'vertical-equal': 'vertically-opposite' }[kind];
    return {
      id: makeId('algebra', ctx, [kind, x, ...coefs, ...consts]),
      type: 'algebra', world: ctx.world, slot: ctx.slot, isSpiral: ctx.isSpiral, difficulty,
      questionText: `The angles are marked ${exprs.map((e) => `(${e})°`).join(' and ')}. ` +
                    `${askLargest ? 'Find x, then give the size of the largest angle.' : 'Find x.'}`,
      figure: { kind: kind === 'line' ? 'line' : kind === 'point-3' ? 'point' : kind === 'triangle' ? 'triangle' : 'cross',
                labels: exprs.map((e, i) => ({ at: `A${i}`, text: `(${e})°` })) },
      figureNotToScale: true,
      answerFormat: 'numeric',
      correctAnswer: answer,
      unit: askLargest ? '°' : '',
      reason: { prompt: 'Which rule did you use to write the equation?', options: buildReasonOptions(rng, rule), correct: rule },
      hint1: `Which rule connects these angles? Write an equation first.`,
      hint2: equation,
      explanation: `${REASON_TEXT[rule]} ${equation}. Solving gives x = ${x}.` + (askLargest ? ` The largest angle is ${answer}°.` : ''),
      signature: `algebra|${kind}|${x}|${coefs.join(',')}|${consts.join(',')}|${askLargest}`,
      meta: { kind, x, coefs, consts, values, total },
    };
  }
  throw new Error('genAlgebra: could not build a valid question');
}
```

The remaining generators (`genClassify`, `genCompSupp`, `genVertical`, `genParallelName`, `genTriangle`, `genExterior`) follow the same contract and the parameter table in 6.4. Each **must** also provide `meta` that the independent validator can use to recompute the answer.

### 6.6 Distractors (`generators/distractors.js`)

```js
// candidates: [{ value, tag }] from named misconceptions. Fills with ±5/±10/±15 offsets if needed.
export function buildNumericOptions(rng, correct, candidates, count = 4) {
  const seen = new Set([correct]);
  const out = [{ value: correct }];
  for (const c of rng.shuffle(candidates)) {
    if (c.value > 0 && c.value < 360 && Number.isInteger(c.value) && !seen.has(c.value)) {
      seen.add(c.value); out.push(c);
    }
    if (out.length === count) break;
  }
  const offsets = rng.shuffle([-15, -10, -5, 5, 10, 15, 20]);
  for (const o of offsets) {
    const v = correct + o;
    if (out.length === count) break;
    if (v > 0 && v < 360 && !seen.has(v)) { seen.add(v); out.push({ value: v }); }
  }
  return rng.shuffle(out);
}

export const hintForTags = (options, fallback) => {
  const tag = options.find((o) => o.tag)?.tag;
  return MISCONCEPTION_HINTS[tag] ?? fallback;     // overridden at answer time by the *chosen* option's tag
};
```

At answer time, `PlayPhase` looks up the **chosen** option's `tag` and shows `MISCONCEPTION_HINTS[tag]` as the first hint, falling back to `hint1`. Chosen tags are also counted (`state.misconceptionCounts`) to support the "Misconception Reduction" metric.

### 6.7 Session Builder (`generators/index.js`)

```js
const TYPES = ['classify','comp_supp','line_point','vertical_adjacent','parallel_name',
               'parallel_find','triangle_sum','exterior_angle','polygon','algebra'];

// Difficulty plan for the 8 FOCUS questions of each type (sums: 26 easy / 30 medium / 24 hard; spiral adds 10 easy + 10 medium)
const FOCUS_PLAN = {
  classify:          [1,1,1,1,2,2,2,3],
  comp_supp:         [1,1,1,2,2,2,3,3],
  line_point:        [1,1,1,2,2,2,3,3],
  vertical_adjacent: [1,1,1,2,2,2,3,3],
  parallel_name:     [1,1,1,2,2,2,3,3],
  parallel_find:     [1,1,2,2,2,3,3,3],
  triangle_sum:      [1,1,1,2,2,2,3,3],
  exterior_angle:    [1,1,2,2,2,3,3,3],
  polygon:           [1,1,2,2,2,3,3,3],
  algebra:           [1,2,2,2,3,3,3,3],
};
// Spiral slots (2 per world): difficulty 1 or 2; types drawn from earlier worlds
const SPIRAL_DIFFICULTY = [1, 2];

export function buildWorldQuestions(seed, world, retry = 0, glossary = 'neutral') {
  const rng = createRng(childSeed(seed, world, retry));
  const type = TYPES[world];
  const focus = rng.shuffle(FOCUS_PLAN[type]).map((d) => ({ type, d, spiral: false }));
  const spiralTypes = world === 0 ? ['classify', 'classify'] : [rng.pick(TYPES.slice(0, world)), rng.pick(TYPES.slice(0, world))];
  const spiral = spiralTypes.map((t, i) => ({ type: t, d: SPIRAL_DIFFICULTY[i], spiral: true }));

  // Interleave: spiral at positions 3 and 7 so review appears mid-world, not clumped at the end
  const plan = [...focus];
  plan.splice(3, 0, spiral[0]);
  plan.splice(7, 0, spiral[1]);

  const seen = new Set();
  return plan.map((p, slot) => {
    for (let attempt = 0; attempt < 60; attempt++) {
      const slotRng = createRng(childSeed(seed, world, retry, slot, attempt));
      const q = GENERATORS[p.type](slotRng, p.d, { world, slot, isSpiral: p.spiral, glossary });
      if (seen.has(q.signature)) continue;
      assertValid(q);                                       // independent check (dev + prod)
      seen.add(q.signature);
      return q;
    }
    throw new Error(`Could not generate unique question for world ${world} slot ${slot}`);
  });
}

export function buildSessionQuestions(seed, retryCounters = Array(10).fill(0), glossary = 'neutral') {
  return Array.from({ length: 10 }, (_, w) => buildWorldQuestions(seed, w, retryCounters[w], glossary)).flat();
}
```

Because every stream is derived from `(seed, world, retry, slot, attempt)`, a resumed session regenerates the **identical** questions, and a world retry regenerates only that world with new content.

### 6.8 Independent Validator (`generators/validate.js`)

The validator recomputes each answer from `meta` using a **different code path** from the generator and throws on any mismatch or invalid diagram.

```js
export function assertValid(q) {
  const expected = recompute(q);                        // switch(q.type) using only q.meta
  if (!deepEqual(expected, q.correctAnswer)) throw new Error(`Answer mismatch in ${q.id}`);
  if (q.options) {
    const values = q.options.map((o) => o.value);
    if (new Set(values).size !== values.length) throw new Error(`Duplicate options in ${q.id}`);
    if (!values.includes(q.correctAnswer)) throw new Error(`Correct answer missing in ${q.id}`);
  }
  for (const a of collectAngles(q)) if (!(a > 0 && a < 360)) throw new Error(`Invalid angle in ${q.id}`);
}
```

---

## 7. Diagram Components

### 7.1 `AngleDiagram.jsx` — Declarative figure renderer

```jsx
// Renders any FigureSpec. Angles are drawn as arcs; labels are positioned on arc bisectors.
export default function AngleDiagram({ figure, notToScale, highlight = [], animate = true, size = 'md' }) {
  const { kind, rays = [], labels = [] } = figure;
  // 1. Compute vertex and ray end-points from `rays` (polar → cartesian)
  // 2. Draw arcs: arcPath(cx, cy, r, startDeg, endDeg)
  // 3. Place label at bisector: (cx + (r+14)cos(mid), cy − (r+14)sin(mid))
  // 4. Add right-angle square when |angle − 90| < 0.5; parallel marks ">" when figure.parallel
  // 5. Colour by role: equal=green | supplementary=amber | highlight=blue | unknown=coral
  // 6. Add pattern fill (hatching) alongside colour for colour-blind support
  // 7. aria-label summarises the diagram for screen readers
}

export const arcPath = (cx, cy, r, a0, a1) => {
  const rad = (d) => (d * Math.PI) / 180;
  const x0 = cx + r * Math.cos(rad(a0)), y0 = cy - r * Math.sin(rad(a0));
  const x1 = cx + r * Math.cos(rad(a1)), y1 = cy - r * Math.sin(rad(a1));
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  const sweep = a1 > a0 ? 0 : 1;
  return `M ${x0} ${y0} A ${r} ${r} 0 ${large} ${sweep} ${x1} ${y1}`;
};
```

- If `notToScale` → footer text "Diagram not accurately drawn" (matches exam conventions)
- On mount or `figure` change: arcs grow with `stroke-dashoffset` animation (600 ms, respects `reducedMotion`)

### 7.2 `Protractor.jsx` — Interactive measuring tool

```jsx
const Protractor = ({ angle, onChange, step = 1, snap = true, showScale = true, readOnly = false }) => {
  // Pointer events on the movable ray's handle:
  //   θ = atan2(vertex.y − p.y, p.x − vertex.x) (deg), normalised to 0–360
  //   onChange(snapAngle(θ, step))
  // Keyboard: ArrowLeft/Right = ±1°, Shift+Arrow = ±5°, Home/End = 0°/180°
  // Dual scale (0–180 and 180–0) drawn with 10°/5°/1° ticks
};
```

### 7.3 `TransversalDiagram.jsx`

Props: `{ theta, transversalAngle, onChangeTransversal, selected, onSelect, mode }`. Modes:

- `explore` — tap an angle; equal angles go green, supplementary go amber (colouring comes from `valueRelation`, **never** from relation labels, so it cannot disagree with the maths)
- `pick` — multi-select; submit compares with `IDS.filter(id => valueRelation(target, id, theta) === 'equal')`
- `identify` — show a pair; the student names the relationship
- `converse` — draw lines with a chosen pair of marked angles; student decides whether lines are parallel

Dragging the transversal changes `theta` (its angle to the lines); both junctions update together.

### 7.4 `TriangleDiagram.jsx` and `PolygonDiagram.jsx`

- **Triangle:** three draggable vertices (constraint: minimum interior angle ≥ 10°). Interior angles are recomputed from coordinates and **rounded for display only**. "Tear corners" animates three sector wedges to a straight line and shows 180°. "Extend side" draws the exterior angle.
- **Polygon:** `n` slider (3–12) and diagonal splitter from vertex 0. A running total animates as each triangle is added. A "walk the perimeter" mode rotates a pointer by each exterior angle to show 360°.

---

## 8. Simulation Station Component Specs

### 8.1 `AngleLabStation.jsx` — Station A (Concrete)

```js
const [round, setRound] = useState(() => getAngleLabRound(seed, state.simRound));
// round: { part: 'build'|'point'|'cross', target?: number, step: 5|1, seedAngle?: number }
const [angle, setAngle] = useState(0);
```

- **build:** `onChange(snapAngle(θ, round.step))`; success when `|angle − target| ≤ 2`
- **point:** three rays; angles recomputed each drag; success when all three are ≥ 15° and the total ring is full (360° by construction) and the student has tapped "lock in"; then shows the straight-line case
- **cross:** slider sets `α ∈ [25, 155]` (not 90°); the other three update as `180 − α`, `α`, `180 − α`; after the student has seen 3 distinct α values, the "What do you notice?" rule cards unlock

**Round targets** are drawn from seeded categories: `{ acute: [20..80], obtuse: [100..170], reflex: [190..340] }`.

### 8.2 `TransversalStation.jsx` — Station B

- Round 1 (`explore`): free exploration; the "Done exploring" button enables after the student has tapped ≥ 4 distinct angles and moved the transversal ≥ 3 times
- Round 2 (`pick`): target angle chosen at random; student multi-selects all equal angles
- Round 3 (`pick`, supplementary): "tap all angles that add to 180° with this one"
- Round 4 (`converse`): `parallel` is a random boolean; the figure shows two lines and a transversal with marked angles; student answers "Parallel?" and chooses the reason

`stationBPerfect = (wrongSelectionsTotal === 0)` powers the **Sharp Eye** badge.

### 8.3 `SumLabStation.jsx` — Station C

- Part 1 (triangle tear): requires the student to reshape the triangle into ≥ 3 different types (acute, obtuse, right/isosceles) and tear each time
- Part 2 (exterior angle): student drags the two remote interior wedges onto the exterior angle; completion at overlap tolerance < 3°
- Part 3 (polygon splitter): student completes `n ∈ {5, 6, 8}`, each drawn from a seeded shuffle; completion when the running total equals `polygonInteriorSum(n)`

### 8.4 `EquationBuilderStation.jsx` — Station D

```js
// Round data generated with genAlgebra(rng, 1|2, ctx) so it shares the validated engine
const steps = ['rule', 'equation', 'solve'];
```

- `rule`: choose among 3 rule cards (one correct)
- `equation`: drag chips (`(2x + 10)`, `+`, `(3x − 5)`, `=`, `180`) into the tray; accept any **algebraically equivalent** arrangement (the tray evaluates both sides symbolically as `a·x + c` and compares)
- `solve`: `DegreePad` for `x`, then for the requested angle; "check" substitutes `x` back and fills the diagram

```js
// Expression parser for simple linear terms only: ax + c
export const parseLinear = (s) => { /* returns { a, c } or null */ };
export const equivalentEquation = (lhsTray, rhsTray, expected) =>
  sameLinear(sub(parseLinear(lhsTray), parseLinear(rhsTray)), sub(expected.lhs, expected.rhs))
  || sameLinear(sub(parseLinear(lhsTray), parseLinear(rhsTray)), neg(sub(expected.lhs, expected.rhs)));
```

All four stations call `COMPLETE_SIM_STATION` when finished; **Lab Technician** badge fires when all four are complete.

---

## 9. Audio Pipeline (ElevenLabs — Matching `audio_generation_pipeline.md`)

### 9.1 Voice Configuration

- **Voice name:** Alice
- **Voice ID:** `Xb7hH8MSUJpSbSDYk0k2`
- **Model:** `eleven_multilingual_v2`
- **Offline script key:** `.env.local` → `ELEVENLABS_API_KEY` (the script also accepts `VITE_ELEVENLABS_API_KEY` for compatibility with the existing pipeline doc)
- **Production key:** Vercel environment variable `ELEVENLABS_API_KEY` (server-side only; **never** `VITE_`-prefixed in production, because `VITE_` variables are bundled into the browser)

### 9.2 Speech Style Settings

| Style | Stability | Similarity Boost | Style | Speaker Boost |
| --- | --- | --- | --- | --- |
| `celebration` | 0.12 | 0.45 | 0.75 | ✅ |
| `encouragement` | 0.16 | 0.50 | 0.65 | ✅ |
| `question` | 0.20 | 0.55 | 0.55 | ✅ |
| `emphasis` | 0.16 | 0.50 | 0.60 | ✅ |
| `thinking` | 0.24 | 0.60 | 0.35 | ✅ |
| `statement` / `instruction` | 0.20 | 0.55 | 0.50 | ✅ |

```js
export const STYLE_SETTINGS = {
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction:   { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};
```

### 9.3 Offline Pre-generation (`scripts/generate_audio.js`) — Fixed Scripts Only

Pre-generated phrases cover Wonder, Story, station instructions, generic feedback, hints, badges and Reflect. **Titles are never added.**

```js
const phrases = [
  // Phase 1 — Wonder
  { text: "Liam is repairing a model bridge. Two beams cross each other, and one angle measures one hundred and ten degrees.", style: 'thinking' },
  { text: "Without a protractor, can you figure out the other three angles?", style: 'question' },
  { text: "Let's discover the secret rules of angles!", style: 'encouragement' },

  // Phase 2 — Story
  { text: "Wei in Singapore starts a video call. John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, and Yuki all join. The World Youth Skyline Festival opens in three days, and ten landmark models need fixing.", style: 'statement' },
  { text: "Storm Zigzag has bent the beams of every model. Vertex the robot beeps. Only perfect angles can make the landmarks stand tall again!", style: 'emphasis' },
  { text: "Sarah in Sydney is rebuilding the Opera House. Two sails cross at the top, and one angle is sixty-five degrees. She spots a pattern. The angle opposite is exactly the same!", style: 'statement' },
  { text: "Yuki in Tokyo points at the busy crossing. Two straight roads run side by side, and a third road cuts across both. She notices that the angles at the two junctions match, like copies of each other.", style: 'statement' },
  { text: "Aisha in Dubai checks the tower frame. Three angles make a triangle. She adds them up: the total is always one hundred and eighty degrees, no matter how the triangle is shaped.", style: 'emphasis' },
  { text: "Vertex hands each architect an Angle Tool. Ten landmarks, ten skills. Together they can restore every angle and open the festival on time!", style: 'encouragement' },

  // Phase 3 — Station instructions
  { text: "Drag the ray to build the angle. Watch the protractor and stop when it matches the target!", style: 'instruction' },
  { text: "Drag the crossing line and watch the angles. Which ones always stay equal?", style: 'question' },
  { text: "Tear off the corners of the triangle and line them up. What do you notice about the total?", style: 'question' },
  { text: "Choose the rule, build the equation, then solve for x.", style: 'instruction' },

  // Phase 4 — Feedback & hints
  { text: "Perfect! You restored that angle like a true architect!", style: 'celebration' },
  { text: "Not quite! Let's look at the diagram again.", style: 'encouragement' },
  { text: "Let's look at the rule together. Angles on a straight line add up to one hundred and eighty degrees.", style: 'thinking' },
  { text: "Angles around a point add up to three hundred and sixty degrees.", style: 'thinking' },
  { text: "Watch the angles move. Can you spot which ones are equal?", style: 'thinking' },
  { text: "Which rule gives you this angle?", style: 'question' },

  // Badges
  { text: "Badge unlocked! You are an Angle Scout!", style: 'celebration' },
  { text: "Badge unlocked! Lab Technician! You completed all four stations!", style: 'celebration' },
  { text: "Badge unlocked! Angle Champion! You scored over eighty percent!", style: 'celebration' },

  // Phase 5 — Reflect
  { text: "What an adventure! Can you explain one angle rule to me in your own words?", style: 'thinking' },
  { text: "Lesson complete! You are a Global Architect Champion!", style: 'celebration' },
];
// Per audio_generation_pipeline.md: applies STYLE_SETTINGS, saves slugified .mp3 into public/assets/audio/,
// writes src/utils/audioMap.js, and waits 500 ms between API calls.
```

### 9.4 Dynamic Audio for Randomised Questions

```js
// src/utils/toSpeech.js — on-screen text → ElevenLabs-friendly text
const ONES = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve',
              'thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const TENS = ['', '', 'twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];

export function numberToWords(n) {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '');
  if (n < 1000) return ONES[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' and ' + numberToWords(n % 100) : '');
  return String(n);
}

export function toSpeech(text) {
  return text
    .replace(/∠\s?([A-Z]{3})/g, (_, l) => 'angle ' + l.split('').join(' '))
    .replace(/(\d+)x/g, (_, n) => `${numberToWords(+n)} x`)
    .replace(/(\d+)\s?°/g, (_, n) => `${numberToWords(+n)} degrees`)
    .replace(/°/g, ' degrees')
    .replace(/\s\+\s/g, ' plus ')
    .replace(/\s[−-]\s/g, ' minus ')
    .replace(/\s=\s/g, ' equals ')
    .replace(/\b(\d+)\b/g, (_, n) => numberToWords(+n))
    .replace(/[()]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
```

Add unit tests for `toSpeech` using real generated strings (e.g. `"(3x + 10)°"` → `"three x plus ten degrees"`).

### 9.5 Serverless Proxy (`api/elevenlabs.js`)

```js
// Vercel serverless function — keeps the API key out of the browser
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const ALLOWED_ORIGINS = ['https://grade8-angles.vercel.app', 'https://intelliasg.com', 'http://localhost:5173'];
const MAX_CHARS = 450;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const origin = req.headers.origin || '';
  if (!ALLOWED_ORIGINS.includes(origin)) return res.status(403).end();

  const { text, style = 'statement' } = req.body || {};
  if (typeof text !== 'string' || !text.trim() || text.length > MAX_CHARS) return res.status(400).end();

  const settings = STYLE_SETTINGS[style] ?? STYLE_SETTINGS.statement;
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
    body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2', voice_settings: settings }),
  });
  if (!r.ok) return res.status(502).end();
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  return res.status(200).send(Buffer.from(await r.arrayBuffer()));
}
```

Add basic rate limiting (e.g. per-IP token bucket via Vercel KV or an edge middleware) before launch to prevent API-credit abuse.

### 9.6 Frontend Audio Engine (`src/utils/audio.js`)

Implements the structure described in `audio_generation_pipeline.md`: segment helpers, `getAudioUrl()` with static-first lookup, queue symbol, preloading, `stopNarration()`.

```js
import { audioMap } from './audioMap';
import { toSpeech } from './toSpeech';

// Segment helpers
export const say        = (text) => ({ text, style: 'statement' });
export const ask        = (text) => ({ text, style: 'question' });
export const cheer      = (text) => ({ text, style: 'encouragement' });
export const emphasize  = (text) => ({ text, style: 'emphasis' });
export const think      = (text) => ({ text, style: 'thinking' });
export const celebrate  = (text) => ({ text, style: 'celebration' });
export const instruct   = (text) => ({ text, style: 'instruction' });

const memCache = new Map();
let currentQueue = null;
let currentAudio = null;

async function sha1(s) {
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function getAudioUrl(text, style = 'statement') {
  // 1. Pre-generated static asset (exact match on on-screen text)
  if (audioMap[text]) return audioMap[text];

  // 2. Memory cache
  const key = await sha1(`${style}::${text}`);
  if (memCache.has(key)) return memCache.get(key);

  // 3. IndexedDB persistent cache
  const stored = await idbGet(key);
  if (stored) { const url = URL.createObjectURL(stored); memCache.set(key, url); return url; }

  // 4. Dynamic generation via proxy (spoken form derived from the same text)
  try {
    const r = await fetch('/api/elevenlabs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: toSpeech(text), style }),
    });
    if (!r.ok) return null;
    const blob = await r.blob();
    await idbPut(key, blob);
    const url = URL.createObjectURL(blob);
    memCache.set(key, url);
    return url;
  } catch { return null; }                       // never block UX
}

export async function narrate(segments, isFirst = true) {
  stopNarration();
  const queue = Symbol('queue');
  currentQueue = queue;
  for (let i = 0; i < segments.length; i++) {
    if (currentQueue !== queue) return;          // superseded
    const url = await getAudioUrl(segments[i].text, segments[i].style);
    if (currentQueue !== queue) return;
    if (i + 1 < segments.length) getAudioUrl(segments[i + 1].text, segments[i + 1].style);   // eager preload
    if (url) await play(url, queue);
  }
}

function play(url, queue) {
  return new Promise((resolve) => {
    currentAudio = new Audio(url);
    currentAudio.onended = resolve;
    currentAudio.onerror = resolve;
    currentAudio.play().catch(resolve);
  });
}

export function stopNarration() {
  currentQueue = null;
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
}

// Call from PlayPhase when question n is shown: warm the next two
export function prefetchQuestions(questions, fromIndex) {
  questions.slice(fromIndex + 1, fromIndex + 3).forEach((q) => getAudioUrl(q.questionText, 'question'));
}
```

> **Note on the static-map key:** For fixed scripts the map key is the exact on-screen string. For generated questions the key is a hash of `style::text`, and the proxy receives `toSpeech(text)` so numbers and symbols are read correctly.

### 9.7 Narration Scripts (`src/utils/narration.js`)

```js
export const wonderNarration = () => [
  think("Liam is repairing a model bridge. Two beams cross each other, and one angle measures one hundred and ten degrees."),
  ask("Without a protractor, can you figure out the other three angles?"),
  cheer("Let's discover the secret rules of angles!"),
];

export const questionNarration = (q) => [ask(q.questionText)];                         // dynamic
export const hintNarration = (text) => [think(text)];                                  // dynamic or fixed
export const explanationNarration = (q) => [think(q.explanation)];                     // dynamic
```

Only paragraph text and questions are included. **Titles, headings and world names are never narrated.**

### 9.8 Audio Parity Check

A CI script diffs every string passed to `say/ask/cheer/emphasize/think/celebrate/instruct` in `narration.js` against `generate_audio.js`'s `phrases` to catch drift in fixed scripts. Randomised question text is exempt by design (it is generated from the same object that renders the screen).

### 9.9 Cleanup

`scripts/clean_audio.js` (unchanged from the pipeline doc): imports `audioMap.js`, scans `public/assets/audio/`, deletes unreferenced `.mp3` files.

---

## 10. Persistence, Resume & Randomisation Integrity

```js
const SESSION_KEY = 'intellia_angles_g8_v1';

// Persist progress AND the seed — questions are regenerated from the seed on resume.
useEffect(() => {
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    seed: state.seed, retryCounters: state.retryCounters, glossary: state.glossary,
    phase: state.phase, storyPanel: state.storyPanel, simStationsComplete: state.simStationsComplete,
    currentQuestion: state.currentQuestion, currentWorld: state.currentWorld, worldScores: state.worldScores,
    xp: state.xp, streak: state.streak, maxStreak: state.maxStreak, badges: state.badges,
    reasonsCorrect: state.reasonsCorrect, stationBPerfect: state.stationBPerfect,
    phaseComplete: state.phaseComplete, timestamp: Date.now(),
  }));
}, [state]);

// On mount: restore within 24 hours; regenerate questions deterministically
const saved = safeParse(localStorage.getItem(SESSION_KEY));
if (saved && Date.now() - saved.timestamp < 86_400_000) {
  dispatch({ type: ACTIONS.RESTORE_SESSION, payload: saved });
  dispatch({ type: ACTIONS.LOAD_QUESTIONS, payload: buildSessionQuestions(saved.seed, saved.retryCounters, saved.glossary) });
}
```

- Storage is wrapped in `try/catch`; if unavailable (private mode) the lesson works without resume
- Seeds come from `crypto.getRandomValues`, not `Math.random`
- **Randomization integrity metric** = no duplicate signature within a session, and distinct seeds across sessions (tested in Section 15)

---

## 11. Gamification Implementation

### 11.1 XP and Stars (`utils/scoring.js`)

```js
export function calcXP(attemptNumber, hintsUsed, streak) {
  const base = attemptNumber === 1 ? 10 : hintsUsed > 0 ? 5 : 7;
  const streakBonus = streak >= 5 ? 5 : 0;
  return base + streakBonus;
}
export const REASON_BONUS = 3;

export function calcStars(correct) {
  if (correct >= 9) return 3;
  if (correct >= 7) return 2;
  if (correct >= 6) return 1;     // world unlock gate: ≥ 6/10 (PRD §9.4)
  return 0;
}
export const canUnlockWorld = (score) => score !== null && score >= 6;
export const calcTotalStars = (scores) => scores.reduce((s, x) => s + (x == null ? 0 : calcStars(x)), 0);
```

### 11.2 Badge Engine (`utils/badgeEngine.js`)

```js
export const BADGES = [
  { id: 'angle_scout', label: '🏅 Angle Scout',
    condition: (s) => s.phaseComplete.wonder && s.phaseComplete.story },
  { id: 'lab_technician', label: '🔬 Lab Technician',
    condition: (s) => s.simStationsComplete.every(Boolean) },
  { id: 'parallel_pro', label: '🧭 Parallel Pro',
    condition: (s) => (s.worldScores[4] ?? 0) >= 8 || (s.worldScores[5] ?? 0) >= 8 },
  { id: 'angle_champion', label: '🥇 Angle Champion',
    condition: (s) => s.worldScores.reduce((t, x) => t + (x || 0), 0) >= 80 },
  { id: 'perfect_blueprint', label: '💎 Perfect Blueprint',
    condition: (s) => s.worldScores.some((x) => x === 10) },
  { id: 'streak_star', label: '🔥 Streak Star', condition: (s) => s.maxStreak >= 10 },
  { id: 'sharp_eye', label: '🎯 Sharp Eye', condition: (s) => s.stationBPerfect === true },
  { id: 'reasoning_master', label: '🧠 Reasoning Master', condition: (s) => s.reasonsCorrect >= 10 },
  { id: 'global_architect', label: '🌍 Global Architect',
    condition: (s) => Object.values(s.phaseComplete).every(Boolean) },
];

export const checkBadges = (state) =>
  BADGES.filter((b) => !state.badges.includes(b.id) && b.condition(state)).map((b) => b.id);
```

> The **Angle Champion** badge threshold (≥ 80 correct of 100) is only reachable after completing all 10 worlds; it is awarded on the results screen.

---

## 12. CSS Animation Keyframes (reuse reference + additions)

Reuse from the reference repo: `bounceIn`, `shake`, `floatUp`, `pulseGlow`, `celebrate`, `slideInUp`. Additions for diagrams:

```css
@keyframes arcGrow {
  from { stroke-dashoffset: var(--arc-length); }
  to   { stroke-dashoffset: 0; }
}
@keyframes raySweep {
  from { transform: rotate(var(--from-angle)); }
  to   { transform: rotate(var(--to-angle)); }
}
@keyframes tearApart {
  from { transform: translate(0, 0) rotate(0); }
  to   { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)); }
}
@keyframes pairPulse {
  0%, 100% { filter: drop-shadow(0 0 0 transparent); }
  50%      { filter: drop-shadow(0 0 6px var(--pair-color)); }
}

@media (prefers-reduced-motion: reduce), [data-reduced-motion="true"] {
  .arc, .ray, .wedge { animation: none !important; transition: none !important; }
}
```

---

## 13. Component Prop Contracts

| Component | Props | Returns |
| --- | --- | --- |
| `AngleDiagram` | `{ figure, notToScale?, highlight?, animate?, size? }` | SVG diagram with `aria-label` |
| `Protractor` | `{ angle, onChange, step?, snap?, readOnly? }` | Interactive protractor + readout |
| `TransversalDiagram` | `{ theta, transversalAngle?, onChangeTransversal?, selected, onSelect, mode }` | Two parallels + 8 clickable angles |
| `TriangleDiagram` | `{ vertices, onChange, mode: 'free'|'tear'|'exterior' }` | Draggable triangle with live angles |
| `PolygonDiagram` | `{ n, showDiagonals?, walk?, labels? }` | Polygon with splitter |
| `EquationTray` | `{ chips, expected, onSubmit }` | Drag-and-drop equation builder |
| `DegreePad` | `{ value, onChange, onSubmit, max? }` | Large numeric keypad (min 44×44 px keys) |
| `QuestionRenderer` | `{ question, onAnswer, hintsShown, onReason }` | Format-specific question UI |
| `ReasonPicker` | `{ reason, onPick }` | 3–4 reason cards |
| `FeedbackOverlay` | `{ isCorrect, explanation?, xpEarned, onContinue }` | Animated overlay |
| `Mascot` | `{ mood: 'idle'|'curious'|'happy'|'thinking'|'celebrating'|'encouraging' }` | Vertex SVG + animation class |
| `WorldMap` | `{ worldScores, currentWorld, onSelectWorld }` | Horizontal world list with stars and locks |
| `BadgePanel` | `{ badges, newBadgeId? }` | Badge grid + unlock toast |
| `GlossaryToggle` | `{ value, onChange }` | "Words I use at school" selector |

---

## 14. Performance, Browser Support & Hosting

### 14.1 Performance Requirements

| Metric | Target |
| --- | --- |
| Initial load | < 2 s (Vite production build) |
| First meaningful paint | < 1 s |
| Diagram animation | 60 fps during drag (SVG updates batched with `requestAnimationFrame`) |
| Session question generation (100 questions) | < 150 ms |
| Memory | < 80 MB |
| Bundle (gzipped) | < 600 KB (lazy-load stations and landmark art) |
| Lighthouse Performance / Accessibility | ≥ 90 / ≥ 90 |
| Static audio TTFB | 0 ms (preloaded asset) |
| Dynamic audio TTFB | < 2 s; look-ahead hides latency |

### 14.2 Browser & Device Support

| Environment | Support |
| --- | --- |
| Chrome 110+ (desktop & Android) | Full |
| Safari 15+ (Mac / iPad / iPhone) | Full |
| Firefox 110+ | Full |
| Edge 110+ | Full |
| IE 11 | Not supported |

Primary test devices: desktop Chrome (1280px+) and tablet (768px, touch, Pointer Events).

### 14.3 Hosting, Embedding & Security

- **Build/host:** Vercel static build + `api/` functions
- **Embedding:** The lesson is embedded in the Intellia page by iframe. Set `Content-Security-Policy: frame-ancestors 'self' https://intelliasg.com https://*.intelliasg.com` in `vercel.json` headers
- **Optional parent messaging (if Intellia wants completion tracking):**

```js
window.parent.postMessage({ source: 'intellia-lesson', lesson: 'grade8-angles', event: 'phase-complete', phase }, 'https://intelliasg.com');
window.parent.postMessage({ source: 'intellia-lesson', lesson: 'grade8-angles', event: 'lesson-complete', xp, stars, badges }, 'https://intelliasg.com');
```
- **No personal data collected.** Only local progress is stored in the browser; the optional voice-note feature keeps recordings on device only
- **Secrets:** `.env.local` is in `.gitignore`; the API key is set only in Vercel project settings

---

## 15. Quality & Testing Standards

**Unit tests**

- `angleMath.js`: classification at every boundary (0<a<90, 90, 180, 181, 359, 360), `randomPartition` (sum exact, minimum respected, step respected), polygon formulas for all `REGULAR_N`
- `transversal.js`: for all θ ∈ 1…179 and all ordered pairs, the relation sets agree with `valueRelation` (Section 5.1)
- `toSpeech.js`: snapshot tests on representative strings

**Generator property tests (most important)**

For **each generator × each difficulty × 5,000 random seeds**, assert:
1. `assertValid(q)` passes (independent recomputation matches `correctAnswer`)
2. All angles in the figure are in (0, 360); triangle angles sum to 180; polygon sums match `(n − 2) × 180`
3. MCQ options are unique, include the correct answer, and no tagged distractor equals the correct answer
4. `questionText` contains no unresolved placeholders (`/\{|\}|undefined|NaN/`)
5. Generation is deterministic: same `(seed, world, retry, slot, attempt)` ⇒ identical question

**Session-level tests**

- `buildSessionQuestions(seed)` returns exactly 100 questions, with 8 focus questions per world plus 2 spiral questions, and difficulty totals matching the PRD (focus 26/30/24 + spiral 10/10 = 36/40/24)
- No duplicate `signature` within a session
- Across 1,000 distinct seeds, no two sessions yield an identical ordered list of signatures
- Retrying a world changes that world's signatures and leaves other worlds unchanged

**Component / interaction tests**

- Station A: snapping, tolerance ±2°, keyboard control
- Station B: multi-select correctness, converse round
- Station C: tear animation completion, polygon splitter totals
- Station D: equation tray accepts equivalent forms (`3x + 5 = 180 − 2x` ≡ `5x + 5 = 180`)
- Reducer: XP, streak, world gating (≥ 6), retry regenerates only the chosen world

**Accessibility**

- Lighthouse + axe automated checks; manual keyboard-only pass of all 6 phases
- Screen-reader pass on each diagram type
- Contrast checks including the angle-pair colours; pattern fills verified for colour-blind simulation

**Audio**

- Parity script (Section 9.8) in CI
- Manual check that 20 generated questions read correctly aloud (numbers, `x`, degrees, `∠ABC`)
- Offline/proxy-failure test: lesson remains fully usable silently

**Cross-device**

- Touch drag on iPad Safari and Android Chrome; no accidental page scroll while dragging (`touch-action: none` on draggable handles)

---

## 16. Delivery Plan (suggested)

| Milestone | Scope |
| --- | --- |
| M1 — Foundations | Repo scaffold from reference layout, tokens/CSS copied from reference, reducer, phase shell, progress map, bottom bar |
| M2 — Math & generation | `angleMath`, `transversal`, `rng`, 10 generators, validator, property tests green |
| M3 — Diagrams | `AngleDiagram`, `Protractor`, `TransversalDiagram`, `TriangleDiagram`, `PolygonDiagram` |
| M4 — Phases 1–3 | Wonder, Story, four stations |
| M5 — Phase 4 | Question renderer, reason step, misconception hints, world map, gamification |
| M6 — Audio | Fixed-script pre-generation, proxy, dynamic audio + cache + look-ahead |
| M7 — Polish & QA | Accessibility, performance, cross-device, parity checks, Intellia embedding test |
| M8 — Launch | Confirm lesson URL, set env vars, `frame-ancestors`, final smoke test |

---

## 17. Known Differences From the Grade 5 Reference (for reviewers)

1. Questions are generated, not banked. Random order is not enough for the "every question is random" requirement.
2. The unlock gate is standardised at **≥ 6/10** (the reference PRD and TRD disagree: 6 vs 5).
3. The reference `formatTo12h` helper contains a convoluted expression and should not be copied; this module has no time-formatting code, but any shared utilities should be reviewed before reuse.
4. The ElevenLabs key is no longer exposed to the browser in production.
5. Four stations instead of three (breadth of Grade 8 Angles).
6. World retry produces fresh content instead of repeating the same questions.
7. Reference UI fidelity is to be verified against the live site and the reference repo's `src/` CSS during M1; this document was written from the reference repo's PRD/TRD and file tree.

---

**Document Version:** 1.0 | October 2026
**Product:** Intellia — Grade 8 Math, Angles
**Reference UI:** <https://grade5-time-intervals.vercel.app/>
**Reference Repo:** <https://github.com/p1pachare-cloud/Grade5-Time-Intervals>
**Audio Pipeline:** ElevenLabs (Alice, `Xb7hH8MSUJpSbSDYk0k2`, `eleven_multilingual_v2`) — per `audio_generation_pipeline.md`
