# Product Requirements Document (PRD)

## Angles — Measuring, Relating & Reasoning About Angles | Grade 8 Math

### Intellia SG | Global Grade 8 Mathematics Curriculum

---

## 1. Executive Summary

This document defines the product requirements for **"Global Angle Architects — Angles"**, an interactive, gamified, simulation-based lesson module for **Grade 8 students (age 13–14)** worldwide. It teaches the full Grade 8 concept of **Angles**: classifying and measuring angles, angle relationships at a point and on a line, angles formed by parallel lines and a transversal, angle sums in triangles and polygons, exterior angles, and algebraic angle reasoning with justification.

The module is a standalone **React (Vite + JSX)** web application. It is designed to **strictly mirror the visual language, UX structure, phase flow, and interaction patterns** of the reference product:

- Reference site: **<https://grade5-time-intervals.vercel.app/>**
- Reference repository: **<https://github.com/p1pachare-cloud/Grade5-Time-Intervals>**

The module will be hosted inside the Intellia course catalogue, following the same URL family as `https://intelliasg.com/courses/grade-3-math`, restructured for Grade 8:

```
https://intelliasg.com/courses/grade-8-math/lessons/angles/
```

> The exact lesson slug must be confirmed with the Intellia site owner before launch (see Section 15).

Audio narration follows the **ElevenLabs pipeline** in `audio_generation_pipeline.md` (Voice: **Alice**, Voice ID `Xb7hH8MSUJpSbSDYk0k2`, Model `eleven_multilingual_v2`), including the per-style voice settings table and the strict rule that **only paragraph text and questions are narrated — never titles or headings**.

The lesson follows Intellia's proven **6-phase learner journey**: INTRO → WONDER → STORY → SIMULATE → PLAY → REFLECT. The story features a multicultural group of students (John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, Yuki, Priya, Fatima, Diego, Wei) who restore ten world landmarks using angle reasoning.

**What is different from the Grade 5 reference (by design):**

| Area | Grade 5 reference | This module (Grade 8) |
| --- | --- | --- |
| Concept | Time intervals | Angles (geometry) |
| Question source | 100 fixed questions, shuffled | **100 procedurally generated questions per session** — every question is random, not just the order |
| Simulation stations | 3 | **4** (Grade 8 breadth: lines/points, parallel lines, triangle/polygon sums, algebra) |
| Answer style | Value only | Value **plus reason** (e.g. "alternate angles") on selected questions, as Grade 8 syllabi expect justification |
| Audio for questions | Pre-generated or dynamic | Fixed scripts pre-generated; random questions use **dynamic generation with persistent caching** |

---

## 2. Product Vision & Goals

**Vision:** To make angles feel like real engineering. Grade 8 learners should *discover* angle rules by manipulating live diagrams first, then formalise them, then prove they can apply them, so that "angles on a straight line" and "alternate angles" become things they understand rather than phrases they memorise.

**Goals**

| Goal | Metric |
| --- | --- |
| Learning Completion | ≥85% of students complete all 6 phases |
| Practice Engagement | ≥90% attempt at least 20 practice questions |
| Score Achievement | Average Play-phase score ≥70% on first attempt |
| Session Duration | Average engagement ≥22 minutes per session |
| Curriculum Alignment | 100% aligned to the Angles strand of global Grade 8 standards (Section 4) |
| Phase Progression | ≥80% reach the Play phase in a single session |
| Simulation Interaction Rate | ≥95% complete all 4 simulation stations |
| Randomization Integrity | 100% of sessions use a unique seed; 0 duplicate questions within a session |
| Reasoning Uptake | ≥60% of "give the reason" prompts answered correctly by end of Play |
| Misconception Reduction | Repeat rate of the same misconception error falls ≥30% between World 1 and World 10 |

---

## 3. Target Users

**Primary: Grade 8 students (age 13–14), global classrooms**

- Can handle abstraction and simple algebra (one-step and two-step linear equations)
- Learn best when they can manipulate a diagram and *see* a rule hold before it is stated
- Motivated by progress maps, mastery, streaks, badges, and a story with stakes
- Come from different systems (US, UK, Singapore, India, Australia, IB), so vocabulary and notation vary (see Section 4.5)

**Secondary: Parents & Teachers**

- Assign as classwork, homework, flipped-classroom pre-work, or revision
- Expect alignment to recognised standards
- Monitor completion via in-lesson phase indicators

---

## 4. Curriculum Alignment — Global Grade 8 Mathematics

**Topic:** Angles
**Programme:** Intellia Grade 8 Math — Geometry
**Lesson URL:** `https://intelliasg.com/courses/grade-8-math/lessons/angles/` (to be confirmed)

**Source references (only the Angles-related content of each framework is used; all other strands are excluded):**

- U.S. Common Core — Grade 7 (7.G.B.5: angle facts, supplementary, complementary, vertical, adjacent) and Grade 8 (8.G.A.5: angle sum and exterior angle of triangles, angles created when parallel lines are cut by a transversal)
- Singapore MOE — Lower Secondary Mathematics: Angles at a point, on a straight line, parallel lines, and angle properties of triangles and polygons
- UK National Curriculum — Key Stage 3: Geometry and measures (angles at a point, on a line, in triangles and quadrilaterals, interior and exterior angles of polygons, parallel line angle reasoning)
- CBSE/NCERT — Middle school Lines and Angles; Understanding Quadrilaterals (polygon angle-sum properties)
- Australian Curriculum — Year 7–8 Measurement and Geometry (angle relationships, parallel lines and transversals, angle sum of triangles and quadrilaterals)
- IB MYP — Geometry and trigonometry (angle relationships and justification)

> Framework codes and wording should be re-verified against the current published documents by the curriculum owner before launch. The list above is used for topic scoping, not as a certification claim.

### 4.1 Learning Objectives

| LO | Description |
| --- | --- |
| LO1 | Identify and classify angles: acute, right, obtuse, straight, reflex, full turn |
| LO2 | Estimate, measure and construct angles with a protractor (to the nearest degree) |
| LO3 | Use complementary (sum 90°), supplementary (sum 180°) and adjacent angle relationships |
| LO4 | Apply angles on a straight line (180°) and angles around a point (360°) |
| LO5 | Apply vertically opposite angles are equal |
| LO6 | Identify and use corresponding, alternate and co-interior angles with parallel lines; use the converse to show lines are parallel |
| LO7 | Use the triangle angle sum (180°), isosceles and equilateral properties, and the exterior angle theorem |
| LO8 | Use the angle sum of a quadrilateral (360°) |
| LO9 | Find the interior angle sum of any polygon, `(n − 2) × 180°`, the exterior angle sum (360°), and each angle of a regular polygon |
| LO10 | Form and solve linear equations from angle diagrams; give a valid geometric reason for each step in a multi-step problem |

### 4.2 Concrete → Pictorial → Abstract (CPA) Progression

- **Concrete:** Drag a ray to build angles on a live protractor; swing a transversal across parallel lines and watch angles change together; tear off triangle corners and line them up on a straight line
- **Pictorial:** Colour-coded angle pairs on diagrams; polygon split into triangles from one vertex
- **Abstract:** Rules and equations — `a + b = 180°`, `(n − 2) × 180°`, `(2x + 10) + (3x − 5) = 180`

### 4.3 Number Ranges by Difficulty

- **Easy:** Single-step, whole-number angles that are multiples of 5°; one rule per question; diagram fully labelled
- **Medium:** Any whole-number degree; two-step reasoning (e.g. vertically opposite *then* straight line); simple algebra with one unknown
- **Hard:** Multi-step diagrams combining parallel lines + triangles; polygon problems with `n` up to 20; algebraic expressions on both sides; reasoning chains of 3+ steps with justification

### 4.4 Vocabulary Focus

"acute", "right", "obtuse", "straight", "reflex", "protractor", "vertex", "arm/ray", "adjacent", "complementary", "supplementary", "vertically opposite", "transversal", "parallel", "corresponding", "alternate", "co-interior (allied)", "interior angle", "exterior angle", "regular polygon", "angle sum", "isosceles", "equilateral", "justify"

### 4.5 Global Notation & Terminology Toggle

Different school systems name the same facts differently. The module defaults to neutral wording and offers a **"Words I use at school"** toggle that swaps terms in the glossary and reason options (the geometry itself never changes):

| Neutral default | Also appears as |
| --- | --- |
| Angles on a straight line | Linear pair / adjacent angles on a line (US) |
| Angles around a point | Angles at a point (UK/SG) |
| Vertically opposite | Vertical angles (US) |
| Co-interior | Allied / same-side interior / supplementary interior |
| Alternate | Alternate interior (US/CBSE) |

Notation used: `∠ABC`, degree symbol `°`, parallel-line arrow marks `>`/`>>` on diagrams, equal-angle arcs, right-angle square marker. Angles are in degrees only. Radians are out of scope.

---

## 5. The 6-Phase Learner Journey (Intellia Model)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ INTRO SCREEN → Progress Map (6-step visual tracker, top bar)               │
│ Welcome: "Hello, Architect! Ready to master Angles? 📐🌍"                  │
│ Lesson badge shown (locked). 6 glowing phase dots visible.                 │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1 — WONDER (≈1–2 min)                                                │
│                                                                            │
│ Hook: Liam is repairing a model bridge. Two beams cross and one angle is   │
│ 110°. "Without a protractor, can you find the other three angles?"         │
│                                                                            │
│ Visual: two crossing beams, one angle glowing, three angles marked "?"     │
│ Student can tap a "?" to make a guess; mascot reacts either way            │
│ Narration (ElevenLabs): Alice reads the hook                               │
│ → Mascot "Vertex" (a protractor-headed robot) appears, puzzled             │
│ → "Let's discover the secret rules of angles!"                             │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 2 — STORY (≈3 min) — "The Global Angle Architects"                   │
│ 6 animated illustrated panels on a world map with city pins                │
│ (full story bible in Section 6)                                            │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 3 — SIMULATE (≈8–10 min)                                             │
│ 4 interactive stations — all 4 must be completed to advance                │
│  A. Angle Lab (Concrete)           B. Transversal Explorer (Concrete→Pict.)│
│  C. Sum Lab (Pictorial)            D. Equation Builder (Abstract)          │
│ → Mascot Vertex reacts to each station; ElevenLabs narrates instructions   │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 4 — PLAY (≈12–15 min)                                                │
│ IntelliPlay™ Level: 100 procedurally generated questions, 10 worlds        │
│ (each world = a real landmark + a focused angle skill)                     │
│ 10 questions per world; world unlocks at ≥6/10 correct                     │
│ Stars (1–3), XP, badges, streak fire counter                               │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ PHASE 5 — REFLECT (≈2 min)                                                 │
│ Journal prompt: "Pick one rule that surprised you. Explain it to Vertex    │
│ using a drawing or a sentence."                                            │
│ Summary of XP, stars, badges, and "rules mastered" checklist               │
│ Lesson complete badge unlocks. "Share with your teacher" export button.    │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Story Bible — "The Global Angle Architects"

### 6.1 Premise

The **World Youth Skyline Festival** is opening in three days. Ten student teams built scale models of famous landmarks for the festival's model city, but **Storm Zigzag** knocked every model's blueprint cards out of order and bent the beams out of true. A club of friends from around the world, **the Global Angle Architects**, joins a video call to restore all ten landmarks before the gates open. Their guide is **Vertex**, a protractor-headed robot, who gives them one new "Angle Tool" at each landmark.

### 6.2 Characters (global names and places)

| Name | Home city | Role in story |
| --- | --- | --- |
| **Liam** | Dublin | Bridge repair lead; the Wonder-phase hook |
| **Sarah** | Sydney | Opera House sails; vertically opposite angles |
| **Yuki** | Tokyo | Crossing-lines expert; parallel lines and transversals |
| **Aisha** | Dubai | Skyscraper tower builder; reasoning and justification |
| **Carlos** | Mexico City | Pyramid and polygon specialist |
| **John** | Toronto | Team captain; keeps the tool log |
| **Mike** | Chicago | Triangle truss engineer |
| **Emma** | Cape Town | Table-mountain cable-car designer |
| **Sofia** | Madrid | Arches and curves; polygon tiles |
| **Noah** | Lagos | Maths-club mentor assistant; reads out rules |
| **Priya** | Mumbai | Taj Mahal symmetry designer; alternate angles |
| **Fatima** | Cairo | Pyramid surveyor; angle classification |
| **Diego** | Buenos Aires | Bridge cable angles; straight-line problems |
| **Wei** | Singapore | Festival host; the club's video-call organiser |
| **Ms. Okafor** | Lagos | Festival chief judge (appears in Reflect) |

*Characters are used for word problems, story panels and feedback lines. Names are a rotating pool: each generated question picks from this set and avoids using the same name twice in a row.*

### 6.3 The Six Story Panels

Panel text below is the **narrated paragraph text** (titles are never narrated).

1. **The Call.** "Wei in Singapore starts a video call. John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, and Yuki all join. The World Youth Skyline Festival opens in three days, and ten landmark models need fixing."
2. **The Storm.** "Storm Zigzag has bent the beams of every model. Vertex the robot beeps. Only perfect angles can make the landmarks stand tall again!"
3. **Sarah's Sails.** "Sarah in Sydney is rebuilding the Opera House. Two sails cross at the top, and one angle is sixty-five degrees. She spots a pattern. The angle opposite is exactly the same!"
4. **Yuki's Crossing.** "Yuki in Tokyo points at the busy crossing. Two straight roads run side by side, and a third road cuts across both. She notices that the angles at the two junctions match, like copies of each other."
5. **Aisha's Tower.** "Aisha in Dubai checks the tower frame. Three angles make a triangle. She adds them up: the total is always one hundred and eighty degrees, no matter how the triangle is shaped."
6. **The Mission.** "Vertex hands each architect an Angle Tool. Ten landmarks, ten skills. Together they can restore every angle and open the festival on time!"

**Visual treatment:** each panel slides in over a stylised world map with pins on each character's city; key vocabulary words highlight as they are spoken ("vertically opposite", "transversal", "angle sum"); a faint dashed angle arc animates over the relevant diagram.

---

## 7. Phase 3 — Simulation Design (Detailed)

All stations are built on live SVG diagrams. Each has **3–4 randomised rounds** (parameters drawn from the session seed). The student must finish all four stations to advance.

### 7.1 Station A — "Angle Lab" (Concrete) — LO1–LO5

**Visual:** A large protractor overlay on a vertex with two rays. Digital degree readout beside the diagram. A live "angle family" panel shows the angle's name (acute/right/obtuse/straight/reflex).

**Part 1 — Build the angle:** Prompt: "Build an angle of 135°." The student drags the movable ray; it snaps to whole degrees (and to 5° steps in easy rounds). Submit when within ±2°.

**Part 2 — Lines and points:** Three draggable rays at one vertex; a ring counter shows the total. The student drags rays until the three angles around the point fill 360°, then lays a ray along a straight line to see 180° split in two.

**Part 3 — Crossing lines:** Two crossing lines. Student sets one angle (slider); the other three update live and colour-match (vertically opposite pairs share a colour; adjacent pairs show they add to 180°). Student then answers: "What do you notice?" with a tap-to-pick rule card.

**Feedback:** correct build → Vertex spins and celebrates; wrong → gentle shake with message "Not quite — check the protractor reading!" The tap-to-pick rule cards appear as a reward when the student has seen the rule hold on at least 3 different angle values.

**Randomised rounds:** target angles drawn from {acute, obtuse, reflex} categories; crossing-line seed angle drawn from 25°–155° excluding 90°.

### 7.2 Station B — "Transversal Explorer" (Concrete → Pictorial) — LO6

**Visual:** Two parallel lines (with arrow marks) and a draggable transversal whose slope the student changes. All eight angles are shown with arcs. Tapping an angle highlights it, then automatically colours every angle that is **equal** to it in green and every angle that is **supplementary** to it in amber.

**Part 1 — Discover:** "Tap an angle. Drag the transversal. What stays the same?" A pair of toggles lets the student reveal the name of each relationship (corresponding / alternate / co-interior) only after finding it.

**Part 2 — Pick the pairs:** A target angle glows. The student taps **all** angles equal to it (multi-select). Round 2: tap the angle that is supplementary and name the relationship. Round 3 (hard): a *non-parallel* pair of lines is shown; the student must decide whether the lines are parallel using the converse rule, and explain why.

**Teaching goal:** Equal pairs and supplementary pairs are experienced as *consequences of parallelism*, not as three separate facts to memorise.

**Distractor design:** vertically opposite angles within one junction are shown as legitimate equal pairs, so students learn that "equal" has more than one source.

### 7.3 Station C — "Sum Lab" (Pictorial) — LO7–LO9

**Part 1 — Tear-and-line-up:** A triangle with draggable vertices. The student taps "tear corners"; the three corners detach and line up on a straight line, revealing 180°. The triangle can be dragged into acute, right, obtuse, isosceles, and equilateral shapes; the sum display never changes.

**Part 2 — Exterior angle:** Extend one side of the triangle; a coloured exterior angle appears. The student drags the two remote interior angles into place and watches them combine into the exterior angle.

**Part 3 — Polygon splitter:** Pick a polygon (n = 4 to 10). The student draws diagonals from one vertex; the polygon splits into `n − 2` triangles; a running total builds `(n − 2) × 180°`. A "regular polygon" toggle shows each angle equal and the exterior angles adding to 360° when walked around the shape.

**Round variants:** triangle types (scalene / isosceles / equilateral), quadrilaterals (360°), n-gons for n ∈ {5, 6, 8, 10, 12}.

### 7.4 Station D — "Equation Builder" (Abstract) — LO10

**Visual:** A diagram with algebraic angle labels (e.g. `(2x + 10)°` and `(3x − 5)°` on a straight line) and a three-slot equation tray.

**Interaction (three steps per round):**

1. **Choose the rule:** Pick the rule that connects the angles from a deck of rule cards (e.g. "angles on a straight line sum to 180°"). The wrong choices are plausible (360° vs 180°).
2. **Build the equation:** Drag expression chips into the tray: `(2x + 10) + (3x − 5) = 180`.
3. **Solve and check:** Enter `x`, then the requested angle. A "check" button substitutes `x` back into the diagram and the angles visibly fill the correct shape.

**Hint ladder:** "Show me the rule" → "Show me the equation" → animated step-through.

**Variants (random per round):** straight line, around a point, vertically opposite equality, triangle sum, co-interior on parallel lines.

ElevenLabs narrates each instruction and each feedback line (never the labels or heading text).

---

## 8. Phase 4 — Randomised Question System (100 Questions)

### 8.1 Principle: Every Question Is Random

Unlike the reference module (which shuffles a fixed bank), each session builds all 100 questions from **parameterised generators** seeded by a per-session random seed. Angle values, diagram orientation, character names, landmark context, expression coefficients, and distractors all vary, so no two students (and no two sessions) see the same set. Each generated question carries its own computed correct answer, hints and explanation.

Guarantees:

- Every question's answer is **computed**, never hand-typed, and re-verified by an independent checker in tests
- No duplicate question signature within a session
- Diagrams are always valid (no angle ≤ 0°, no impossible triangles, no angle sums above their limits)
- Difficulty parameters, not hand-picked questions, control challenge level

### 8.2 Question Types (10 types → 80 focus questions + 20 spiral-review = 100)

| Type | Description | Example (generated) |
| --- | --- | --- |
| Q1 | Classify / estimate an angle | "Which type of angle is 148°?" or "Estimate the angle shown." |
| Q2 | Complementary & supplementary | "An angle is 37°. Find its complement." / "Find its supplement." |
| Q3 | Straight line & around a point | "Three angles at a point are 95°, 120° and x. Find x." |
| Q4 | Vertically opposite & adjacent | "Two lines cross. One angle is 72°. Find the angle next to it, and the one opposite." |
| Q5 | Parallel lines — name the relationship | "Which pair are alternate angles?" (tap angle pair on diagram) |
| Q6 | Parallel lines — find the angle **and** give the reason | "Find angle b and choose the reason." |
| Q7 | Triangle angle sum (scalene / isosceles / equilateral) | "A triangle has angles 48° and 67°. Find the third." |
| Q8 | Exterior angle of a triangle | "The exterior angle is 118° and one remote interior angle is 54°. Find the other." |
| Q9 | Quadrilaterals & polygon angles | "Find each interior angle of a regular 12-sided polygon." |
| Q10 | Multi-step algebra + justification | "Angles `(3x + 10)°` and `(2x − 5)°` lie on a straight line. Find x and the larger angle." |

Plus formats rotated inside each type: multiple choice, numeric input (with a degree-pad), tap-the-angle on diagram, true/false with correction, and "spot the mistake" (a worked solution with one wrong step the student must find).

### 8.3 Difficulty Distribution

Each world has **8 focus questions** from its own type plus **2 spiral-review questions** (one easy, one medium) drawn from types the student has already unlocked. World 1 has no earlier types, so its two review slots are extra Classify questions in different formats (estimate, measure).

| Type | Focus Qs | Easy | Medium | Hard |
| --- | --- | --- | --- | --- |
| Q1 Classify | 8 | 4 | 3 | 1 |
| Q2 Complementary / supplementary | 8 | 3 | 3 | 2 |
| Q3 Straight line / around a point | 8 | 3 | 3 | 2 |
| Q4 Vertically opposite / adjacent | 8 | 3 | 3 | 2 |
| Q5 Parallel lines — name the pair | 8 | 3 | 3 | 2 |
| Q6 Parallel lines — find + reason | 8 | 2 | 3 | 3 |
| Q7 Triangle angle sum | 8 | 3 | 3 | 2 |
| Q8 Exterior angle | 8 | 2 | 3 | 3 |
| Q9 Quadrilaterals & polygons | 8 | 2 | 3 | 3 |
| Q10 Algebra + justification | 8 | 1 | 3 | 4 |
| **Focus subtotal** | **80** | **26** | **30** | **24** |
| Spiral review (2 per world) | 20 | 10 | 10 | 0 |
| **TOTAL** | **100** | **36** | **40** | **24** |

### 8.4 Misconception-Targeted Distractors

Wrong options are **not** random. Each is generated from a known student error, and choosing it triggers a specific, kind hint:

| Misconception | Distractor produced | Hint message |
| --- | --- | --- |
| Uses 180 when 360 is needed (or vice versa) | Answer computed with the wrong total | "Check the total: a full turn at a point is 360°, a straight line is 180°." |
| Mixes complement and supplement | `90 − a` instead of `180 − a` | "Complementary adds to 90°. Supplementary adds to 180°." |
| Treats co-interior as equal | Repeats the given angle | "Co-interior angles are on the same side and add to 180°, not equal." |
| Confuses alternate with co-interior | Gives `180 − a` for alternate | "Alternate angles are on opposite sides of the transversal and are equal." |
| Forgets one angle in the sum | Sum of fewer angles | "Count every angle at the point. Did you include them all?" |
| Uses `n × 180` for polygon sum | `n × 180` | "A polygon splits into `n − 2` triangles." |
| Exterior ≠ sum of remote interiors | Adds all three interiors | "The exterior angle equals the two remote interior angles added together." |
| Algebra slip (forgets to divide / wrong sign) | Intermediate value | "You found `5x`. Now divide to get x." |

### 8.5 Reasoning ("Give the Reason") Prompts

Selected questions (all of Q6, half of Q4, Q8, and Q10) have a second step: after the numeric answer, the student picks the correct reason from 3–4 options (e.g. "alternate angles are equal", "angles on a straight line sum to 180°"). Reasons are correct-or-not only; there is no partial credit for the number alone in "justification mode" worlds (Worlds 6, 9, 10). In other worlds the reason is a bonus: +3 XP.

### 8.6 Global Context for Word Problems

**Names:** John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, Yuki, Priya, Fatima, Diego, Wei, Chloe, Ravi

**Landmarks and objects:** Pyramids of Giza, Eiffel Tower, Golden Gate Bridge, Sydney Opera House, Tokyo crossing, Taj Mahal, Leaning Tower of Pisa, Christ the Redeemer, Great Wall, Burj Khalifa; truss bridges, kite frames, roof rafters, solar panels, road junctions, floor tiles, skate ramps, cable cars

**Word-problem formats:**

> "[Name] is [fixing/designing] [object] at [landmark]. Two beams cross and one angle is [a]°. What is the angle next to it?"

> "[Name] cuts a regular [n]-sided tile for the [landmark] floor. Find each interior angle."

> "[Name] measures the exterior angle of a roof truss as [e]° and one inside angle as [a]°. What is the other inside angle?"

### 8.7 Language & Notation Requirements

- Degrees written with `°`; angle names with `∠` (e.g. `∠ABC`); variables lowercase
- Diagrams always include angle arcs and, where relevant, parallel marks (`>`), equal-length ticks, and right-angle squares
- Diagrams are **not drawn to scale for angle-finding questions** ("Diagram not accurately drawn" label shown), matching exam conventions, but **are** to scale for measurement questions in Station A
- Algebraic expressions use implicit multiplication: `3x + 10`

---

## 9. Gamification Design

### 9.1 Reward System

- **Stars (⭐):** Earned per 10-question world (1–3 stars by score)
- **XP Points:** 10 XP correct first try | 7 XP second try | 5 XP with hint used | +3 XP for a correct reason
- **Streak 🔥:** Fire counter for consecutive correct answers
- **Streak Bonus:** +5 XP per correct answer when streak ≥ 5

### 9.2 Badges (Unlockable)

| Badge | Condition |
| --- | --- |
| 🏅 **Angle Scout** | Complete Wonder + Story phases |
| 🔬 **Lab Technician** | Complete all 4 Simulation stations |
| 🧭 **Parallel Pro** | Score ≥ 8/10 in World 5 or World 6 |
| 🥇 **Angle Champion** | Score ≥ 80% across the Play phase |
| 💎 **Perfect Blueprint** | Score 10/10 in any world |
| 🔥 **Streak Star** | Streak of 10 consecutive correct answers |
| 🎯 **Sharp Eye** | Station B completed with no wrong selection |
| 🧠 **Reasoning Master** | Give 10 correct reasons in "give the reason" prompts |
| 🌍 **Global Architect** | Complete all 6 phases (lesson complete badge) |

### 9.3 Feedback Mechanics

**✅ Correct**
- Bounce animation + Vertex happy mood
- ElevenLabs celebration line (e.g. "Perfect! You restored that angle!")
- XP floats up (+10 / +7 / +5, +3 reason bonus)
- Diagram "locks in": the unknown angle is revealed and its arc turns green

**❌ Incorrect (attempt 1)**
- Gentle shake + misconception-specific hint (Section 8.4)
- Relevant part of the diagram is highlighted

**❌ Incorrect (attempt 2)**
- Stronger hint: the rule is shown as an equation with the known values filled in
- Animated step-through highlights each angle in order

**❌ Incorrect (attempt 3)**
- Full worked solution with reasons, narrated by Vertex
- No score penalty. Question is added to a "review later" tray and one similar question is re-queued at the end of the world.

No negative scoring. Encouragement-first approach always.

### 9.4 World Map (IntelliPlay™ Level Progression — Global Landmarks)

Each world has **8 focus questions + 2 spiral-review questions** from earlier worlds, so skills are revisited.

| # | World | Qs | Focus skill | Type focus |
| --- | --- | --- | --- | --- |
| 1 | **Giza Desert Camp** (Cairo) | 1–10 | Classify and measure angles | Q1 |
| 2 | **Eiffel Iron Workshop** (Paris) | 11–20 | Complementary & supplementary | Q2 |
| 3 | **Golden Gate Cable Yard** (San Francisco) | 21–30 | Straight line & around a point | Q3 |
| 4 | **Sydney Opera Sails** (Sydney) | 31–40 | Vertically opposite & adjacent | Q4 |
| 5 | **Tokyo Crossing Control** (Tokyo) | 41–50 | Parallel lines: name the pairs | Q5 |
| 6 | **Taj Mahal Garden Grid** (Agra) | 51–60 | Parallel lines: find angle + reason | Q6 |
| 7 | **Pisa Leaning Tower** (Pisa) | 61–70 | Triangle angle sum | Q7 |
| 8 | **Rio Mountain Statue** (Rio de Janeiro) | 71–80 | Exterior angles of triangles | Q8 |
| 9 | **Great Wall Watchtowers** (Beijing) | 81–90 | Quadrilaterals & polygons | Q9 |
| 10 | **Burj Khalifa Summit** (Dubai) | 91–100 | Multi-step algebra + justification | Q10 |

**Unlock gate:** ≥ 6/10 correct (1-star minimum) to advance. Fewer than 6 → "Try this world again" with a **fresh set of generated questions** (not the same ones).
**Bonus Challenge:** 3 stars in a world unlocks 3 extra generated questions from the next world's skill (stretch).

### 9.5 Mascot (Vertex — Angle Architect Companion)

- **Character:** A friendly robot with a protractor-shaped head and compass-leg feet, named **"Vertex"**
- **Mood states:** idle | curious | happy | thinking | celebrating | encouraging
- **Appearances:** Wonder hook, Story narration, Simulation feedback, Play hints, Reflect phase
- **Reactions:** correct answer, badge unlock, streak milestone, world completion
- **Audio:** All mascot speech via the ElevenLabs Alice voice

---

## 10. Audio & Narration Design

Fully aligned with `audio_generation_pipeline.md`.

### 10.1 Pipeline Summary

- **Voice provider:** ElevenLabs only (no browser Web Speech fallback)
- **Voice:** Alice (Clear, Engaging Educator)
- **Voice ID:** `Xb7hH8MSUJpSbSDYk0k2`
- **Model:** `eleven_multilingual_v2`
- **Pre-generation:** `scripts/generate_audio.js` → static `.mp3` files in `public/assets/audio/`
- **Mapping:** auto-generated `src/utils/audioMap.js` (exact text → file path)
- **Cleanup:** `scripts/clean_audio.js` removes orphaned files
- **Playback:** `src/utils/audio.js` with `narrate()` / `stopNarration()`, a `currentQueue` symbol to prevent overlap, and eager preload of the next segment

### 10.2 Content Policy — Paragraphs & Questions ONLY

> **IMPORTANT:** Audio is generated ONLY for paragraph/story text and question text. Titles, headings, world names, and section labels are **never** narrated.

### 10.3 Speech Styles Mapped to ElevenLabs Settings

| Style | Stability | Similarity Boost | Style | Speaker Boost | Use case |
| --- | --- | --- | --- | --- | --- |
| `celebration` | 0.12 | 0.45 | 0.75 | ✅ | Badge unlock, world complete |
| `encouragement` | 0.16 | 0.50 | 0.65 | ✅ | Correct answer feedback |
| `question` | 0.20 | 0.55 | 0.55 | ✅ | Practice question read-aloud |
| `emphasis` | 0.16 | 0.50 | 0.60 | ✅ | Key rule / vocabulary highlight |
| `thinking` | 0.24 | 0.60 | 0.35 | ✅ | Mascot thinking, hint moments |
| `statement` / `instruction` | 0.20 | 0.55 | 0.50 | ✅ | Story narration, instructions |

### 10.4 Narration Script Examples

**Phase 1 (Wonder) — style: thinking**
> "Liam is repairing a model bridge. Two beams cross each other, and one angle measures one hundred and ten degrees."
> "Without a protractor, can you figure out the other three angles?"
> "Let's discover the secret rules of angles!"

**Phase 2 (Story, Panel 3) — style: statement**
> "Sarah in Sydney is rebuilding the Opera House. Two sails cross at the top, and one angle is sixty-five degrees."

**Phase 3 (Station B) — style: instruction**
> "Drag the crossing line and watch the angles. Which ones always stay equal?"

**Phase 4 (Correct feedback) — style: celebration**
> "Perfect! You restored that angle like a true architect!"

**Phase 4 (Hint) — style: thinking**
> "Let's look at the rule together. Angles on a straight line add up to one hundred and eighty degrees."

**Phase 5 (Reflect) — style: thinking**
> "What an adventure! Can you explain one angle rule to me in your own words?"

### 10.5 Audio for Randomised Questions (Important Difference)

Fixed scripts (Wonder, Story, station instructions, feedback lines, badge lines, reflect) are **pre-generated** as static `.mp3` assets. Randomised question text **cannot** be fully pre-generated because values change every session. Approach:

1. **Question stem is converted to speech text** (`toSpeech()`): numbers are spelled out ("one hundred and ten degrees"), variables read naturally ("x"), and symbols expanded ("angle A B C").
2. **Dynamic generation** through the server-side proxy on first play; the result is cached in memory and persisted in the browser (IndexedDB, keyed by a hash of text + style).
3. **Look-ahead preload:** while the student answers question *n*, audio for *n + 1* and *n + 2* is fetched in the background, so playback feels instant.
4. **Graceful degradation:** if the audio request fails or the student is offline, the question is shown in full on screen and a silent skip occurs. Audio never blocks progress.
5. **Cost control:** audio is requested only when audio is enabled; in-session repeats are served from cache.

### 10.6 Strict Parity Rule

Every narrated string must be a faithful spoken form of the on-screen text. For fixed scripts, the `audioMap` key equals the exact on-screen string (same words, punctuation, capitalisation). For generated questions, the spoken text is derived from the same data object that renders the screen text, so the two can never drift.

---

## 11. UX & Visual Design Requirements

### 11.1 Visual Theme

- **Brand:** Intellia — Think. Explore. Become.
- **Reference UI (strict match):** <https://grade5-time-intervals.vercel.app/> and the layout in the reference repo `src/`
- **Colours, typography, spacing, cards, buttons, shadows, progress dots, bottom bar:** reuse the reference's design tokens and CSS variables directly rather than approximating. The only new colours are diagram accents: angle-pair colours (green = equal, amber = supplementary, blue = highlighted, coral = unknown)
- **Typography:** same rounded, playful family as the reference
- **Illustrations:** cartoon-style, globally inclusive character art; landmark backdrops (Pyramids, Eiffel Tower, Golden Gate Bridge, Sydney Opera House, Tokyo crossing, Taj Mahal, Pisa tower, Christ the Redeemer, Great Wall, Burj Khalifa)
- **Diagrams:** clean SVG angle diagrams with arcs, value labels, parallel marks and right-angle squares

### 11.2 Layout Structure (mirrors reference)

- **Top bar:** Intellia logo | Lesson title "Angles" | 6-phase dot tracker
- **Main area:** Phase content (fills screen, responsive, smooth phase transitions)
- **Bottom bar:** XP counter | Star count | Streak fire | Phase navigation arrows
- **Sidebar:** Hidden on mobile; shown on tablet+ as vertical phase map

### 11.3 Primary Visual Components

- **AngleDiagram:** a declarative SVG renderer for rays, arcs, labels, parallel marks and right-angle squares
- **Protractor:** an interactive protractor overlay (drag a ray, snap to degrees)
- **TransversalDiagram:** two parallel lines and a transversal with eight clickable angles
- **TriangleDiagram / PolygonDiagram:** draggable vertices, tear-off corners, diagonal splitter
- **EquationTray:** drag-and-drop chips for building and solving angle equations

Every diagram animates on first render and on update (hands/rays sweep, arcs grow).

### 11.4 Accessibility

- Large tap targets (≥ 44×44 px) and drag alternatives (tap-to-select, keyboard arrow keys rotate a ray 1° / 5° with Shift)
- WCAG AA colour contrast; angle pairs are distinguished by **pattern and label as well as colour** (colour-blind safe)
- Screen-reader text for each diagram: "Angle A, 65 degrees, opposite angle C, unknown"
- Keyboard navigable (Tab + Enter) for all interactions
- No mandatory time pressure (optional timer toggle in challenge mode only)
- Reduced-motion setting disables sweeping animation but keeps all information

### 11.5 Responsive Design

- Primary: Desktop browser (1024px+) and tablet (768px+) for classroom use
- Secondary: iPad / tablet with touch drag
- Tertiary: Mobile (375px+): stacked single-column layout; diagrams scale to width

---

## 12. Content Requirements

### 12.1 Simulation Visuals

- Protractor and ray manipulation with live degree readout
- Transversal diagram with eight highlightable angles and an equal/supplementary colour mode
- Triangle tear-and-line-up animation; polygon-to-triangles splitter
- Equation tray with chips and a substitute-back check

### 12.2 Question Bank Coverage

- 10 generator functions, each with easy/medium/hard parameter sets (see TRD)
- All 100 session questions generated at session start from a seed; stored/regenerated on resume
- MCQ distractors built from named misconceptions

### 12.3 Reflect Content

- Rules-mastered checklist (one tick per skill the student scored ≥ 6/10 on)
- Free-text or drawing journal, optional "explain to Vertex" voice note (browser recording, kept local, never uploaded)

---

## 13. Success Criteria (v1.0)

| Criterion | Target |
| --- | --- |
| All 100 questions generated randomly and validated correct | ✅ Required |
| All 4 simulation stations functional (touch + mouse + keyboard) | ✅ Required |
| All 6 phases navigable end-to-end | ✅ Required |
| Gamification (XP, stars, 9 badges) working | ✅ Required |
| 10-world progression logic correct, including retry with fresh questions | ✅ Required |
| ElevenLabs audio plays for all fixed narration | ✅ Required |
| Dynamic audio for random questions works with caching and look-ahead | ✅ Required |
| Mobile / tablet / desktop responsive layout | ✅ Required |
| Global Grade 8 Angles syllabus coverage confirmed by curriculum owner | ✅ Required |
| Loads in < 3 seconds (Vite production build) | ✅ Required |
| WCAG AA accessible | ✅ Required |
| UI matches grade5-time-intervals.vercel.app structure | ✅ Required |
| Hosted correctly at the Intellia Grade 8 lesson URL | ✅ Required |

---

## 14. Out of Scope (v1.0)

- Teacher dashboard / backend analytics
- Student login / cross-device persistence
- Multiplayer or class competition
- Parent progress emails and printable worksheets
- Trigonometry, circle theorems, radians
- Bearings and compass directions (candidate **v1.1 bonus world**)
- Formal two-column geometric proofs beyond reason selection
- Full-curriculum assessment engine

---

## 15. Assumptions & Open Questions

1. **Lesson URL slug:** The upload target given was the Grade 3 course page. This PRD assumes the Grade 8 equivalent is `/courses/grade-8-math/lessons/angles/`. Confirm.
2. **Embedding method:** Assumed iframe embed of the Vercel build. If Intellia needs a different integration (e.g. a LMS package), the TRD's hosting section changes.
3. **Reference UI fidelity:** This PRD was written from the reference repo's documents and file structure. Exact colours, spacing and component styling must be taken from the reference repo's CSS and verified against the live site during build.
4. **Unlock gate:** The Grade 5 documents disagree (PRD says ≥ 6/10, TRD code says ≥ 5). This PRD standardises on **≥ 6/10**.
5. **Standards references:** The framework list in Section 4 is a scoping aid and should be checked against current official documents.
6. **ElevenLabs cost:** Dynamic audio for random questions has a per-session usage cost. Confirm budget and plan tier.
7. **Station count:** This module uses 4 stations (the reference uses 3) to cover Grade 8 breadth. Confirm this is acceptable.

---

**Document Version:** 1.0 | October 2026
**Product:** Intellia — Grade 8 Math, Angles
**Lesson Title:** Global Angle Architects — Angles
**Curriculum:** Global Grade 8 Mathematics (Common Core, Singapore MOE, UK NC, CBSE, Australian Curriculum, IB MYP — Angles strand only)
**Reference UI:** <https://grade5-time-intervals.vercel.app/>
**Reference Repo:** <https://github.com/p1pachare-cloud/Grade5-Time-Intervals>
**Audio Pipeline:** ElevenLabs (Alice, `Xb7hH8MSUJpSbSDYk0k2`, `eleven_multilingual_v2`) — per `audio_generation_pipeline.md`
**Lesson URL (to confirm):** <https://intelliasg.com/courses/grade-8-math/lessons/angles/>
