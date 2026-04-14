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

- **tech stack** /tɛk stæk/ (n) - main technologies used in a project  
  _Example 1:_ Our tech stack is React, Node.js, and PostgreSQL.  
  _Example 2:_ In retro, we linked tech stack to one real production issue.  
  _Example 3:_ After QA feedback, tech stack was added to our rollout checklist.

- **scalability** /ˌskeɪləˈbɪləti/ (n) - ability to handle growth  
  _Example 1:_ We chose this setup for better scalability during peak traffic.  
  _Example 2:_ For one customer case, scalability changed how we prioritized tasks.  
  _Example 3:_ We mentioned scalability in stand-up when blockers appeared.

- **consistency** /kənˈsɪstənsi/ (n) - data staying correct across operations  
  _Example 1:_ We needed strong consistency for payment records.  
  _Example 2:_ Our team used consistency to explain the trade-off to product.  
  _Example 3:_ I used consistency in a stakeholder update so everyone could follow.

- **time-to-market** /ˌtaɪm tə ˈmɑːrkɪt/ (n) - how fast a product can launch  
  _Example 1:_ We picked a simpler tool to improve time-to-market.  
  _Example 2:_ Our team used time-to-market to explain the trade-off to product.  
  _Example 3:_ I used time-to-market in a stakeholder update so everyone could follow.

- **maintenance** /ˈmeɪntənəns/ (n) - ongoing work to keep software healthy  
  _Example 1:_ This part is hard to maintain, so we planned a refactor.  
  _Example 2:_ In retro, we linked maintenance to one real production issue.  
  _Example 3:_ We mentioned maintenance in stand-up when blockers appeared.

- **technical debt** /ˈtɛknɪkəl dɛt/ (n) - shortcuts that create future problems  
  _Example 1:_ We accepted some technical debt to hit the deadline.  
  _Example 2:_ During release week, technical debt helped us make a safer decision.  
  _Example 3:_ I used technical debt in a stakeholder update so everyone could follow.

- **refactor** /ˌriːˈfæktər/ (v/n) - improve code structure without changing behavior  
  _Example 1:_ We did a small refactor before the next release.  
  _Example 2:_ In a recent sprint, refactor became a key point in our planning discussion.  
  _Example 3:_ In one incident review, refactor explained why the bug happened.

- **regression** /rɪˈɡrɛʃən/ (n) - old feature breaks after a new change  
  _Example 1:_ We added tests to avoid regression.  
  _Example 2:_ During release week, regression helped us make a safer decision.  
  _Example 3:_ In one incident review, regression explained why the bug happened.

- **deployment** /dɪˈplɔɪmənt/ (n) - process of releasing software  
  _Example 1:_ We improved deployment with automatic checks.  
  _Example 2:_ Our team used deployment to explain the trade-off to product.  
  _Example 3:_ After QA feedback, deployment was added to our rollout checklist.

- **vendor lock-in** /ˈvɛndər lɑːk ɪn/ (n) - hard to leave a tool once adopted  
  _Example 1:_ We avoided deep vendor lock-in by using open standards.  
  _Example 2:_ In retro, we linked vendor lock-in to one real production issue.  
  _Example 3:_ We mentioned vendor lock-in in stand-up when blockers appeared.

**Additional useful terms:**
- **boilerplate** /ˈbɔɪlərˌpleɪt/ (n) - repeated setup code
- **integration** /ˌɪntəˈɡreɪʃən/ (n) - connecting tools or systems
- **migration** /maɪˈɡreɪʃən/ (n) - moving to a new tool or system
- **benchmark** /ˈbɛntʃˌmɑːrk/ (n) - measured performance comparison
- **fallback** /ˈfɔːlbæk/ (n) - backup option when plan A fails

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

**Examples (real work):**
- In one release week, we had to choose the right stack while still trying to balance speed and quality.
- In retro, we agreed to reduce deployment risk earlier so the same issue would not repeat.

### Useful Chunking & Sentence Starters
- We picked this tool because...
- A key reason was...
- The downside was...
- To reduce risk, we...
- In practice, the team needed...
- For this project, good enough meant...
- We reviewed the decision after...
- The business impact was...

**Examples (using starters):**
- "A real issue we faced was repeated timeout errors, so we paused rollout and checked logs first."
- "To reduce risk, we shipped to 10% of users first, then expanded after QA sign-off."

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
