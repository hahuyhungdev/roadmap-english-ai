---
sessionNumber: 3
title: Tech Stack and Trade-offs
topic: Tools, Decisions, and Business Reasons
phase: PHASE 1 - TECH & BUSINESS
level: B1-B2
description: Explain your stack choices and the trade-offs behind technical decisions in simple business language.
---

# Session 3: Tech Stack and Trade-offs

**Level:** B1-B2  
**Focus:** Describe what tools you use and why, with practical trade-offs linked to cost, speed, and reliability.

<details open>
<summary><strong>1) Vocabulary </strong></summary>

- **tech stack** (n) - main technologies used in a project  
  _Example:_ Our tech stack is React, Node.js, and PostgreSQL.

- **scalability** (n) - ability to handle growth  
  _Example:_ We chose this setup for better scalability.

- **consistency** (n) - data staying correct across operations  
  _Example:_ We needed strong consistency for payment records.

- **time-to-market** (n) - how fast a product can launch  
  _Example:_ We picked a simpler tool to improve time-to-market.

- **maintenance** (n) - ongoing work to keep software healthy  
  _Example:_ This part is hard to maintain, so we planned a refactor.

- **technical debt** (n) - shortcuts that create future problems  
  _Example:_ We accepted some technical debt to hit the deadline.

- **refactor** (v/n) - improve code structure without changing behavior  
  _Example:_ We did a small refactor before the next release.

- **regression** (n) - old feature breaks after a new change  
  _Example:_ We added tests to avoid regression.

- **deployment** (n) - process of releasing software  
  _Example:_ We improved deployment with automatic checks.

- **vendor lock-in** (n) - hard to leave a tool once adopted  
  _Example:_ We avoided deep vendor lock-in by using open standards.

**Additional useful terms:**
- **boilerplate** (n) - repeated setup code
- **integration** (n) - connecting tools or systems
- **migration** (n) - moving to a new tool or system
- **benchmark** (n) - measured performance comparison
- **fallback** (n) - backup option when plan A fails

</details>

<details open>
<summary><strong>2) Grammar & Useful Patterns (B2)</strong></summary>

- **Reason language (because / since)**  
  We chose PostgreSQL because we needed reliable transactions.

- **Comparison language (better than / more than)**  
  This framework was better than our old one for team speed.

- **Concession (although / even though)**  
  Although the tool is powerful, setup takes longer.

- **Conditionals for trade-offs**  
  If we choose speed now, we may pay with more bugs later.

- **Passive voice for decisions**  
  The final stack was selected after a short proof of concept.

- **Past Simple for case explanation**  
  We switched libraries after two failed deployments.

### Useful Sentence Patterns
- We chose... over... because...
- The main trade-off was... versus...
- It helped us..., but it also...
- For this release, we prioritized...
- In the long term, this decision...
- If I did it again, I would...

</details>

<details open>
<summary><strong>3) Collocations, Chunking & Phrasal Verbs</strong></summary>

### Strong Collocations
- choose the right stack
- balance speed and quality
- reduce deployment risk
- handle scaling needs
- improve code maintainability
- plan a gradual migration
- avoid vendor lock-in
- run performance benchmarks
- reduce regression risk
- clean up technical debt
- support fast onboarding
- match tools to business goals

### Useful Chunking & Sentence Starters
- We picked this tool because...
- A key reason was...
- The downside was...
- To reduce risk, we...
- In practice, the team needed...
- For this project, good enough meant...
- We reviewed the decision after...
- The business impact was...

### Useful Phrasal Verbs
- **go with** -> We went with a simple caching layer first.
- **switch to** -> We switched to a managed database service.
- **break down** -> We broke down the migration into small steps.
- **set up** -> I set up CI checks for each pull request.
- **phase out** -> We phased out the old library after stable release.

</details>

<details open>
<summary><strong>4) Typical Dialogues</strong></summary>

### Dialogue 1 - Stack Choice

**Interviewer:** Why did your team choose your current stack?

**You:**  
We chose React and TypeScript because our team needed fast development with fewer runtime mistakes. For data, we chose PostgreSQL because consistency was important for billing.

It was not the easiest setup, but it reduced bugs in release week.

### Dialogue 2 - Real Trade-off

**Interviewer:** Tell me about a technical trade-off.

**You:**  
We had to choose between a full rewrite and a smaller refactor. A rewrite looked cleaner, but it would delay new features for months.

We did a focused refactor instead. We moved faster, but we accepted some old code for now.

### Dialogue 3 - Decision Review

**Interviewer:** Have you ever changed a stack decision later?

**You:**  
Yes. We used a logging tool that was cheap at first, but search was slow when traffic grew. On-call response became harder.

We migrated to a better tool. It cost more, but incident handling improved a lot.

</details>

<details open>
<summary><strong>5) Reading Text</strong></summary>

Good engineers do not choose tools only because they are popular. They choose tools that fit team size, product goals, and risk level. A strong answer in interviews explains both the benefit and the cost.

In real projects, there is no perfect choice. One option may be faster now but harder to maintain later. Another may be stable but slower to build. Clear trade-off language helps non-technical stakeholders understand why a decision makes sense.

When possible, show one real case from your team. That sounds natural and credible.

</details>

<details open>
<summary><strong>6) List of Questions + Ideas</strong></summary>

### Core Questions (must-practice)
1. What is your current tech stack and why?
2. Which tool choice gave your team the biggest benefit?
3. What trade-off did you accept in a recent release?
4. How do you avoid regressions when changing core tools?

### High-Value Case Questions
5. Describe a refactor decision you made under deadline pressure.
6. Tell me about a migration that was harder than expected.
7. Share a case where a simple tool was better than a powerful one.

### Critical Discussion Questions
8. Is it better to use proven tools or new tools?
9. When is technical debt acceptable?
10. Should every team optimize for speed first?

**Tips for speaking practice:**
- Use before/after comparison.
- Name one risk and how you handled it.
- Keep technical terms, but explain them simply.

---

</details>
