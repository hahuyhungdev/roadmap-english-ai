---
sessionNumber: 3
title: Tech Stack and Trade-offs
topic: Tools, Decisions, and Business Reasons
phase: PHASE 1 - TECH & BUSINESS
level: B1-B2
description: Explain stack choices with clear trade-offs around speed, stability, and maintainability.
---

# Session 3: Tech Stack and Trade-offs

**Level:** B1-B2
**Focus:** Justify technical choices with practical constraints, not trend-based opinions.

<details open>
<summary><strong>1) Vocabulary</strong></summary>

## 🔍 tech stack

> **Pronunciation:** /tɛk stæk/ — American English accent
> **Part of Speech:** noun phrase

**Definition:**
The main technologies used to build and run a product.

**Example Sentences:**

- Our tech stack includes Next.js and PostgreSQL.
- We reviewed the tech stack after scaling issues.
- In interviews, I explain stack decisions with clear reasons.

**Relationships:**

- **Synonyms:** technology stack, platform setup
- **Antonyms:** ad-hoc tooling, fragmented setup

**Usage Notes:**

- **Collocations:** choose a stack, stack decision, stack review
- **Register:** Neutral, Technical

## 🔍 maintainability

> **Pronunciation:** /meɪnˌteɪnəˈbɪləti/ — American English accent
> **Part of Speech:** noun

**Definition:**
How easy code is to update, debug, and extend over time.

**Example Sentences:**

- We improved maintainability by removing repeated logic.
- Maintainability was a key reason for framework choice.
- Better maintainability reduced weekend hotfixes.

**Relationships:**

- **Synonyms:** long-term code health, code sustainability
- **Antonyms:** fragile code, hard-to-change code

**Usage Notes:**

- **Collocations:** improve maintainability, maintainability cost, maintainable architecture
- **Register:** Professional

## 🔍 time-to-market

> **Pronunciation:** /ˌtaɪm tə ˈmɑːrkɪt/ — American English accent
> **Part of Speech:** noun phrase

**Definition:**
How quickly a team can ship a usable product.

**Example Sentences:**

- We chose managed auth to improve time-to-market.
- Faster time-to-market helped us validate demand early.
- Quick launch was useful, but we planned cleanup later.

**Relationships:**

- **Synonyms:** launch speed, delivery speed
- **Antonyms:** delayed release, slow delivery

**Usage Notes:**

- **Collocations:** reduce time-to-market, time-to-market goal, time pressure
- **Register:** Professional

## 🔍 scalability

> **Pronunciation:** /ˌskeɪləˈbɪləti/ — American English accent
> **Part of Speech:** noun

**Definition:**
The ability of a system to handle growing traffic and workload.

**Example Sentences:**

- Scalability became critical during campaign weeks.
- We selected queue processing for better scalability.
- Scalability planning prevented emergency fixes later.

**Relationships:**

- **Synonyms:** growth capacity, scale readiness
- **Antonyms:** limited capacity, bottleneck risk

**Usage Notes:**

- **Collocations:** improve scalability, scalability limit, scalability strategy
- **Register:** Technical

## 🔍 vendor lock-in

> **Pronunciation:** /ˈvɛndər lɑːk ɪn/ — American English accent
> **Part of Speech:** noun phrase

**Definition:**
Strong dependence on one provider that is costly to change later.

**Example Sentences:**

- We avoided vendor lock-in in our storage design.
- Fast setup was good, but vendor lock-in risk was real.
- I mention lock-in risk in architecture discussions.

**Relationships:**

- **Synonyms:** provider dependency, platform dependence
- **Antonyms:** portability, provider flexibility

**Usage Notes:**

- **Collocations:** avoid lock-in, lock-in risk, reduce lock-in
- **Register:** Professional

## 🔍 proof of concept

> **Pronunciation:** /pruːf əv ˈkɑːnsɛpt/ — American English accent
> **Part of Speech:** noun phrase

**Definition:**
A small test build to check if an idea works before full investment.

**Example Sentences:**

- We ran a proof of concept in two days.
- The proof of concept exposed one performance issue.
- Quick POCs saved us from expensive wrong choices.

**Relationships:**

- **Synonyms:** pilot test, feasibility check
- **Antonyms:** full commitment, blind rollout

**Usage Notes:**

- **Collocations:** run a proof of concept, POC result, POC timeline
- **Register:** Neutral, Professional

## 🔍 backward compatibility

> **Pronunciation:** /ˈbækwərd kəmˌpætəˈbɪləti/ — American English accent
> **Part of Speech:** noun phrase

**Definition:**
Keeping new changes working with older clients or systems.

**Example Sentences:**

- We preserved backward compatibility for mobile users.
- Breaking compatibility caused login failures before.
- Now compatibility checks are part of our release plan.

**Relationships:**

- **Synonyms:** legacy support, version compatibility
- **Antonyms:** breaking change, incompatible release

**Usage Notes:**

- **Collocations:** maintain compatibility, compatibility check, compatibility issue
- **Register:** Technical

## 🔍 bundle size

> **Pronunciation:** /ˈbʌndəl saɪz/ — American English accent
> **Part of Speech:** noun phrase

**Definition:**
The total file size sent to users in a frontend application.

**Example Sentences:**

- We reduced bundle size with lazy loading.
- Bundle size affected low-end mobile experience.
- Smaller bundles improved first load performance.

**Relationships:**

- **Synonyms:** payload size, frontend package size
- **Antonyms:** lightweight bundle, minimal payload

**Usage Notes:**

- **Collocations:** reduce bundle size, bundle analysis, size budget
- **Register:** Technical

## 🔍 migration cost

> **Pronunciation:** /maɪˈɡreɪʃən kɔːst/ — American English accent
> **Part of Speech:** noun phrase

**Definition:**
The time and effort required to move from one tool or system to another.

**Example Sentences:**

- Migration cost was too high for a full rewrite.
- We estimated migration cost before approving the switch.
- Clear migration cost estimates improved planning trust.

**Relationships:**

- **Synonyms:** transition cost, switch cost
- **Antonyms:** low switch effort, minimal transition cost

**Usage Notes:**

- **Collocations:** estimate migration cost, migration plan, migration risk
- **Register:** Professional

## 🔍 architecture decision

> **Pronunciation:** /ˈɑːrkəˌtɛktʃər dɪˈsɪʒən/ — American English accent
> **Part of Speech:** noun phrase

**Definition:**
A deliberate technical choice with long-term impact on product delivery.

**Example Sentences:**

- The architecture decision favored speed for the first release.
- We documented each architecture decision with trade-offs.
- This habit helped new team members understand context.

**Relationships:**

- **Synonyms:** design choice, system decision
- **Antonyms:** random choice, undocumented decision

**Usage Notes:**

- **Collocations:** make decisions, decision log, architecture rationale
- **Register:** Professional

**Additional useful terms:**

**integration risk** _(noun phrase)_ — risk when systems may not work together.
Example: Integration risk increased after API format changes.
Collocations: integration risk review, mitigate integration risk

**benchmark** _(noun)_ — measured comparison for performance or quality.
Example: We used one benchmark before changing frameworks.
Collocations: run benchmark, benchmark result

**fallback option** _(noun phrase)_ — backup approach if first plan fails.
Example: Our fallback option was to keep the old endpoint.
Collocations: define fallback, fallback plan

**deployment pipeline** _(noun phrase)_ — automated steps from code to production.
Example: We improved deployment pipeline for safer releases.
Collocations: pipeline stage, pipeline check

**technical constraint** _(noun phrase)_ — engineering limit affecting decisions.
Example: Browser support was a technical constraint in our design.
Collocations: key constraint, constraint trade-off

</details>

<details open>
<summary><strong>2) Grammar & Useful Patterns (B2)</strong></summary>

- **Reason-giving language**
  We chose this stack because onboarding was faster.

- **Contrast language**
  The tool was powerful, but maintenance effort was high.

- **Conditionals for decision impact**
  If we optimize only for speed, long-term cost may increase.

- **Past narrative for choices**
  We tested two options and selected the simpler one.

- **Comparison language**
  Option A was cheaper, while Option B scaled better.

- **Reflection language**
  If we repeated it, we would run a longer proof of concept.

### Useful Sentence Patterns

- We selected this tool because...
- The biggest trade-off was... versus...
- A key technical constraint was...
- We validated this decision by...
- The long-term risk was...
- In hindsight, I would...

</details>

<details open>
<summary><strong>3) Collocations, Chunking & Phrasal Verbs</strong></summary>

### Strong Collocations

- choose the right stack
- evaluate trade-offs clearly
- reduce migration cost
- improve code maintainability
- protect backward compatibility
- optimize bundle size
- validate with benchmarks
- manage integration risk
- speed up delivery
- document architecture decisions
- plan fallback options
- balance short and long term

### Useful Chunking & Sentence Starters

- We had two main options...
- From a delivery view, this helped...
- From a maintenance view, this hurt...
- The most realistic choice was...
- We accepted this trade-off because...
- To reduce risk, we kept...
- The hidden cost was...
- The final outcome was...

### Useful Phrasal Verbs

- **phase in** -> We phased in the new tool gradually.
- **stick with** -> We stuck with the current framework for stability.
- **rule out** -> We ruled out one option due to migration cost.
- **build on** -> We built on existing components to save time.
- **weigh up** -> We weighed up cost and reliability before deciding.

</details>

<details open>
<summary><strong>4) Dialogues</strong></summary>

### Dialogue 1

**Interviewer:** How do you choose tools in your stack?

**You:**
I start with constraints: team skill, delivery timeline, and maintenance load. Then I compare two or three realistic options.

I choose the one that balances speed now and stability later.

### Dialogue 2

**Interviewer:** Tell me about one trade-off in a recent stack decision.

**You:**
We chose a managed auth provider to launch faster. The trade-off was higher vendor dependency later.

To reduce that risk, we separated business logic from provider-specific code.

### Dialogue 3

**Interviewer:** What if leadership wants a trendy tool quickly?

**You:**
I suggest a small proof of concept first. It gives evidence without full commitment.

If results are weak, we avoid expensive migration mistakes.

</details>

<details open>
<summary><strong>5) Debate Prompt</strong></summary>

**When choosing a tech stack, should teams prioritize fast launch or long-term maintainability?**

**Side A:** Fast launch is critical in competitive markets. Early delivery gives feedback, revenue, and momentum. Teams can improve architecture later.

**Side B:** Poor maintainability creates repeated bugs and high stress. Slower but cleaner technical decisions often save more time over a year.

_Your turn: Which side do you agree with more? Why?_

</details>

<details open>
<summary><strong>6) Reading Text</strong></summary>

A good stack decision is not about using the newest tool. It is about choosing what your team can deliver and maintain under real constraints. Many failures come from unclear trade-offs, not from bad engineers.

Strong teams compare options with evidence. They run small tests, estimate migration cost, and document why they choose one path. This keeps decisions practical and easier to explain later.

In interviews, clear trade-off language is powerful. It shows you think beyond code and understand long-term delivery.

</details>

<details open>
<summary><strong>7) Questions & Practice Ideas</strong></summary>

### Core Questions (must-practice)

1. What is one recent stack decision your team made, and why?
2. Which trade-off was hardest in that decision?
3. How do you evaluate maintainability before choosing a tool?
4. What fallback option do you prepare for risky migrations?

### High-Value Discussion Questions

5. What are the benefits and limits of choosing managed services for speed?
6. How do tool choices differ for beginner teams versus experienced teams?
7. When is technical debt acceptable in stack decisions?

### Follow-up Questions (Challenge Assumptions)

8. You said launch speed is critical. What if quality drops after launch?
9. You said maintainability matters most. What if market timing is urgent?
10. If benchmark results are mixed, how do you make the final call?

### Reflection Questions

11. Which stack term is hardest for you to explain in spoken English?
12. What decision habit from this lesson can improve your real work now?
13. In your future career, will you value technical elegance or delivery reliability more?

**Tips for speaking practice:**

- Use one real decision and one concrete trade-off.
- Explain both short-term gain and long-term cost.
- Practice one 60-90 second answer on a stack choice.

</details>
