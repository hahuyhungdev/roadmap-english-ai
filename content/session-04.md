---
sessionNumber: 4
title: Technical Debt and Change Management
topic: Balancing Delivery Speed and Long-Term Code Health
phase: PHASE 1 - TECH & BUSINESS
level: B1-B2
description: Discuss technical debt in simple language and explain how you align refactor work with product goals.
---

# Session 4: Technical Debt and Change Management

**Level:** B1-B2  
**Focus:** Explain how you handle legacy code, convince stakeholders, and balance short-term delivery with long-term stability.

<details open>
<summary><strong>1) Vocabulary </strong></summary>

- **technical debt** /ˈtɛknɪkəl dɛt/ (n) - old code problems caused by past shortcuts  
  _Example 1:_ We spend too much time fixing old code in this module.  
  _Example 2:_ During release week, technical debt helped us make a safer decision.  
  _Example 3:_ We mentioned technical debt in stand-up when blockers appeared.

- **legacy code** /ˈlɛɡəsi koʊd/ (n) - older code still in use  
  _Example 1:_ The login flow still depends on legacy code.  
  _Example 2:_ In retro, we linked legacy code to one real production issue.  
  _Example 3:_ After QA feedback, legacy code was added to our rollout checklist.

- **refactor** /ˌriːˈfæktər/ (v/n) - improve structure without changing feature behavior  
  _Example 1:_ We planned a refactor before adding more features.  
  _Example 2:_ During release week, refactor helped us make a safer decision.  
  _Example 3:_ In one incident review, refactor explained why the bug happened.

- **maintenance** /ˈmeɪntənəns/ (n) - ongoing fixes and updates  
  _Example 1:_ Maintenance cost became too high for this service.  
  _Example 2:_ For one customer case, maintenance changed how we prioritized tasks.  
  _Example 3:_ We mentioned maintenance in stand-up when blockers appeared.

- **hotfix** /ˈhɑːtˌfɪks/ (n) - quick fix for urgent production issues  
  _Example 1:_ We shipped a hotfix during on-call.  
  _Example 2:_ In a recent sprint, hotfix became a key point in our planning discussion.  
  _Example 3:_ This quarter, hotfix helped us reduce repeated support requests.

- **regression** /rɪˈɡrɛʃən/ (n) - old behavior breaks after a change  
  _Example 1:_ We added tests to catch regression early.  
  _Example 2:_ In a recent sprint, regression became a key point in our planning discussion.  
  _Example 3:_ I used regression in a stakeholder update so everyone could follow.

- **backlog** /ˈbækˌlɔːɡ/ (n) - list of future work items  
  _Example 1:_ We tracked refactor tasks in our backlog.  
  _Example 2:_ Our team used backlog to explain the trade-off to product.  
  _Example 3:_ This quarter, backlog helped us reduce repeated support requests.

- **risk** /rɪsk/ (n) - chance of a negative outcome  
  _Example 1:_ Releasing without cleanup increased risk.  
  _Example 2:_ In a recent sprint, risk became a key point in our planning discussion.  
  _Example 3:_ I used risk in a stakeholder update so everyone could follow.

- **downtime** /ˈdaʊnˌtaɪm/ (n) - period when system is unavailable  
  _Example 1:_ Legacy bugs caused downtime twice last month.  
  _Example 2:_ For one customer case, downtime changed how we prioritized tasks.  
  _Example 3:_ After QA feedback, downtime was added to our rollout checklist.

- **change plan** /tʃeɪndʒ plæn/ (n) - step-by-step approach for updates  
  _Example 1:_ We proposed a change plan with small weekly steps.  
  _Example 2:_ In retro, we linked change plan to one real production issue.  
  _Example 3:_ After QA feedback, change plan was added to our rollout checklist.

**Additional useful terms:**
- **code review** /koʊd rɪˈvjuː/ (n) - peer check before merge
- **test coverage** /tɛst ˈkʌvərɪdʒ/ (n) - amount of code protected by tests
- **rollback** /ˈroʊlˌbæk/ (n/v) - return to previous stable version
- **cleanup sprint** /ˈkliːnˌʌp sprɪnt/ (n) - sprint focused on fixes and refactor
- **stability** /stəˈbɪləti/ (n) - reliability over time

</details>

<details open>
<summary><strong>2) Grammar & Useful Patterns (B2)</strong></summary>

- **Present Perfect for ongoing issues**  
  We have seen repeated bugs in this part of the system.

- **Past Simple for one project story**  
  We paused one feature and cleaned up the payment module.

- **Cause and effect**  
  Because the code was tightly coupled, small changes created new bugs.

- **Concession language**  
  Even though refactor takes time, it reduces incident risk.

- **Conditionals for planning**  
  If we do not fix this now, release risk will keep growing.

- **Persuasion structures**  
  I explained that one week of cleanup could save many support hours.

### Useful Sentence Patterns
- This part is hard to maintain because...
- We had a lot of bugs here, so...
- We decided to fix it before adding new features.
- I showed the team that...
- It delayed delivery a bit, but...
- The long-term result was...

</details>

<details open>
<summary><strong>3) Collocations, Chunking & Phrasal Verbs</strong></summary>

### Strong Collocations
- manage technical debt
- refactor legacy code
- reduce regression risk
- improve release stability
- prioritize bug fixes
- build stakeholder trust
- estimate cleanup effort
- plan phased changes
- reduce on-call noise
- protect critical paths
- avoid repeated hotfixes
- align engineering and product

**Examples (real work):**
- In one release week, we had to manage technical debt while still trying to refactor legacy code.
- In retro, we agreed to reduce regression risk earlier so the same issue would not repeat.

### Useful Chunking & Sentence Starters
- We saw the same bug again and again...
- The main issue was...
- To explain it to product, I said...
- Our short-term plan was..., then...
- We accepted a delay because...
- One risk we could not ignore was...
- After cleanup, we noticed...
- If we had skipped this, ...

**Examples (using starters):**
- "A real issue we faced was repeated timeout errors, so we paused rollout and checked logs first."
- "To reduce risk, we shipped to 10% of users first, then expanded after QA sign-off."

### Useful Phrasal Verbs
- **clean up** -> We cleaned up the oldest part of the checkout code.
- **break up** -> We broke up the refactor into small tickets.
- **slow down** -> We slowed down feature work for one sprint.
- **pay off** -> The cleanup paid off during the next release.
- **fall back** -> We prepared a rollback plan to fall back safely.

</details>

<details open>
<summary><strong>4) Typical Dialogues</strong></summary>

### Dialogue 1 - Explain Technical Debt

**Interviewer:** Can you share a case of technical debt?

**You:**  
Yes. Our checkout module had many quick fixes from past deadlines. We had a lot of bugs there, and on-call alerts were frequent.

We set aside one sprint to refactor the core validation logic. It slowed new feature work, but incident count dropped.

### Dialogue 2 - Convincing Stakeholders

**Interviewer:** How did you convince product to allow refactor time?

**You:**  
I showed data: bug count, support hours, and failed releases from that module. I explained that one week of cleanup could save time every sprint.

We agreed on a phased plan. We kept one small feature, but delayed two low-impact items.

### Dialogue 3 - Balancing Speed and Health

**Interviewer:** How do you balance delivery and code quality?

**You:**  
I try to ship in small steps. If the risk is low, we can move fast. If a module is unstable, we fix core problems first.

This approach is not always fastest today, but it avoids bigger delays later.

</details>

<details open>
<summary><strong>5) Reading Text</strong></summary>

Technical debt is normal in real projects, especially when deadlines are tight. The problem starts when teams keep adding new features without fixing old weak areas. Then small changes become risky, and bug fixing takes too much time.

Change management means making this work visible and practical. Engineers can explain the cost in simple terms: incidents, support load, release delays, and stress on on-call. This helps managers understand why refactor work has business value.

Good teams use a balanced plan: fix high-risk code first, keep some feature delivery, and track progress in backlog.

</details>

<details open>
<summary><strong>6) List of Questions + Ideas</strong></summary>

### Core Questions (must-practice)
1. What does technical debt look like in your project?
2. How do you explain refactor value to non-technical people?
3. When do you fix old code instead of building new features?
4. How do you reduce regression during refactor?

### High-Value Case Questions
5. Share a case where cleanup work improved release quality.
6. Tell me about a refactor that failed or took longer than expected.
7. Describe how your team tracked debt work in backlog.

### Critical Discussion Questions
8. Is it okay to ship with known debt under deadline pressure?
9. Should every sprint include dedicated cleanup time?
10. What is the risk of postponing refactor for too long?

**Tips for speaking practice:**
- Use one concrete bug example.
- Mention both short-term cost and long-term gain.
- Keep the explanation simple and measurable.

---

</details>
