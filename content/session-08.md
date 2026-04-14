---
sessionNumber: 8
title: Trade-offs and Technical Debt - When Good Enough Is Right
topic: Strategic Decisions Under Constraints
phase: PHASE 2 - ANALYTICAL THINKING IN IT
level: B1-B2
description: Explain how to make practical trade-offs under time, budget, and quality constraints.
---

# Session 8: Trade-offs and Technical Debt - When Good Enough Is Right

**Level:** B1-B2  
**Focus:** Discuss real decisions like rewrite vs refactor and speed vs quality with clear business reasoning.

<details open>
<summary><strong>1) Vocabulary </strong></summary>

- **rewrite** /rirˈaɪt/ (n/v) - building a system part again from zero  
  _Example 1:_ A full rewrite looked clean but too risky for our timeline.  
  _Example 2:_ For a customer-facing bug, rewrite guided what we fixed first.  
  _Example 3:_ Later, rewrite became part of our standard way of reporting issues.

- **refactor** /ˌriːˈfæktər/ (n/v) - improve existing code structure  
  _Example 1:_ We chose refactor to keep shipping features.  
  _Example 2:_ During planning, we used refactor to make a safer release decision.  
  _Example 3:_ That experience showed how refactor affects both speed and stability.

- **technical debt** /tˈɛknɪkəl dˈɛt/ (n) - future cost from current shortcuts  
  _Example 1:_ We accepted some technical debt to meet contract deadline.  
  _Example 2:_ In one sprint, technical debt came up when we investigated a production issue.  
  _Example 3:_ That experience showed how technical debt affects both speed and stability.

- **good enough** /ɡˈʊd ɪnˈʌf/ (adj phrase) - acceptable quality for current goal  
  _Example 1:_ The first version was good enough for pilot users.  
  _Example 2:_ Under deadline pressure, we avoided choices that were good enough.  
  _Example 3:_ I now flag it early when a solution seems good enough.

- **scope cut** /skˈoʊp kˈʌt/ (n) - removing low-priority items  
  _Example 1:_ We made a scope cut to protect release stability.  
  _Example 2:_ In our weekly review, scope cut was tied to delivery quality and risk.  
  _Example 3:_ That experience showed how scope cut affects both speed and stability.

- **timeline pressure** /tˈaɪmlaɪn prˈɛʃɚ/ (n) - pressure from short deadlines  
  _Example 1:_ Timeline pressure pushed us to simplify implementation.  
  _Example 2:_ In our weekly review, timeline pressure was tied to delivery quality and risk.  
  _Example 3:_ After that case, we added timeline pressure to our checklist for future releases.

- **risk appetite** /rˈɪsk ˈæpətˌaɪt/ (n) - level of risk a team can accept  
  _Example 1:_ Our risk appetite was low because of enterprise clients.  
  _Example 2:_ On a real project, risk appetite helped us explain the trade-off to product.  
  _Example 3:_ I used risk appetite in a stakeholder update so non-technical teams could follow.

- **cost of delay** /kˈɑst ˈʌv dɪlˈeɪ/ (n) - business loss when release is late  
  _Example 1:_ Cost of delay was high, so we avoided a full rewrite.  
  _Example 2:_ On a real project, cost of delay helped us explain the trade-off to product.  
  _Example 3:_ I used cost of delay in a stakeholder update so non-technical teams could follow.

- **workaround** /wˈɝkɚˈaʊnd/ (n) - temporary solution  
  _Example 1:_ We used a workaround and planned cleanup in backlog.  
  _Example 2:_ On a real project, workaround helped us explain the trade-off to product.  
  _Example 3:_ In retro, we connected workaround with one clear lesson learned.

- **quality gate** /kwˈɑləti ɡˈeɪt/ (n) - required checks before release  
  _Example 1:_ We kept quality gates even under deadline pressure.  
  _Example 2:_ For a customer-facing bug, quality gate guided what we fixed first.  
  _Example 3:_ In retro, we connected quality gate with one clear lesson learned.

**Additional useful terms:**
- **trade-off analysis** /trˈeɪd ˈɔf ənˈæləsəs/ (n) - structured comparison of options
- **constraint** /kənstrˈeɪnt/ (n) - limit such as budget or time
- **MVP** /ɛm vi pi/ (n) - minimum viable product
- **rollback plan** /rˈoʊlbˌæk plˈæn/ (n) - safe recovery if release fails
- **follow-up task** /fˈɑloʊ ˈʌp tˈæsk/ (n) - action planned after release

</details>

<details open>
<summary><strong>2) Grammar & Useful Patterns (B2)</strong></summary>

- **Option comparison**  
  We could rewrite the module, or we could refactor the critical path first.

- **Reasoning with because / due to**  
  We chose the smaller change due to strict timeline pressure.

- **Concession language**  
  Although the solution was not perfect, it met release needs.

- **Conditional trade-off language**  
  If we had rewritten everything, delivery would have slipped by two months.

- **Decision language in past tense**  
  We decided to ship in phases and monitor quality closely.

- **Future commitment language**  
  We plan to clean it up in the next cycle.

### Useful Sentence Patterns
- We considered two options: ...
- We chose ... because ...
- The trade-off was ...
- It solved the short-term need, but ...
- We accepted this risk because ...
- We tracked cleanup work in backlog.

</details>

<details open>
<summary><strong>3) Collocations, Chunking & Phrasal Verbs</strong></summary>

### Strong Collocations
- evaluate technical options
- balance speed and quality
- accept short-term debt
- protect release stability
- reduce delivery risk
- cut low-impact scope
- ship in phases
- monitor post-release metrics
- schedule follow-up cleanup
- align with business goals
- estimate cost of delay
- keep quality gates

**Examples (real work):**
- In one release week, we had to evaluate technical options while still trying to balance speed and quality.
- In retro, we agreed to accept short-term debt earlier so the same issue would not repeat.

### Useful Chunking & Sentence Starters
- We had to decide between...
- The business goal was...
- A full rewrite would have...
- So we went with...
- The risk we accepted was...
- To control that risk, we...
- This was good enough for now because...
- Later, we plan to...

**Examples (using starters):**
- "A real issue we faced was repeated timeout errors, so we paused rollout and checked logs first."
- "To reduce risk, we shipped to 10% of users first, then expanded after QA sign-off."

### Useful Phrasal Verbs
- **cut back** -> We cut back non-essential features for this release.
- **hold off** -> We held off the rewrite until after peak season.
- **ship out** -> We shipped out a smaller but stable version.
- **clean up** -> We cleaned up technical debt in the next sprint.
- **line up** -> We lined up QA support before deployment.

</details>

<details open>
<summary><strong>4) Typical Dialogues</strong></summary>

### Dialogue 1 - Rewrite vs Refactor

**Interviewer:** Tell me about a major technical trade-off.

**You:**  
We debated rewrite versus refactor for an old reporting module. Rewrite was attractive, but it would block feature delivery for too long.

We refactored only high-risk parts first. It was not perfect, but release stayed on track.

### Dialogue 2 - Cutting Corners Professionally

**Interviewer:** When is cutting corners acceptable?

**You:**  
It can be acceptable when impact is low and risk is controlled. In one release, we used a simple workaround to meet a contract deadline.

But we documented the debt clearly and scheduled cleanup in backlog.

### Dialogue 3 - Defending Good Enough

**Interviewer:** How do you explain "good enough" to your team?

**You:**  
I define minimum quality clearly: no critical bugs, stable deployment, and passing tests. If those are met, we can ship and improve later.

It helps speed, but only if we keep follow-up commitments.

</details>

<details open>
<summary><strong>5) Reading Text</strong></summary>

In software projects, teams often choose between ideal architecture and practical delivery. A smart decision is not always the most elegant one. It is the one that fits current constraints without creating unacceptable risk.

"Good enough" should not mean careless. It means clear quality limits, controlled scope, and a plan to handle technical debt later. Without that plan, short-term speed becomes long-term pain.

In interviews, show your reasoning process. Explain what you considered, what you sacrificed, and why the decision made business sense.

</details>

<details open>
<summary><strong>6) List of Questions + Ideas</strong></summary>

### Core Questions (must-practice)
1. Tell me about a rewrite vs refactor decision.
2. How do you define "good enough" in your team?
3. When is technical debt acceptable?
4. How do you make sure temporary fixes do not become permanent?

### High-Value Case Questions
5. Share a case where you cut scope to protect quality.
6. Describe a workaround you used under deadline pressure.
7. Tell me about a decision you would make differently now.

### Critical Discussion Questions
8. Is code quality more important than time-to-market?
9. Should managers decide technical debt priorities?
10. Is "move fast" still valid for enterprise products?

**Tips for speaking practice:**
- Mention the business constraint first.
- Show one trade-off and one safeguard.
- End with what you learned.

---

</details>
