---
sessionNumber: 8
title: Root Cause Analysis & Impact
topic: Diagnosing Incidents with Clear Business Impact
phase: PHASE 2 - ANALYTICAL THINKING IN IT
level: B1-B2
description: Explain incident investigation steps (logs, timeline, root cause) and quantify impact with numbers like downtime, users affected, and business loss.
---

# Session 8: Root Cause Analysis & Impact

**Level:** B1-B2  
**Focus:** Structured debugging + impact quantification.
**Scope:** Explain incident investigation steps (logs, timeline, root cause) and quantify impact with numbers like downtime, users affected, and business loss.

<details open>
<summary><strong>1) Vocabulary </strong></summary>

- **root cause** /rˈut kˈɑz/ (n) - the main reason a problem happened  
  _Example 1:_ The root cause was a missing validation check.  
  _Example 2:_ We used this in a production case to decide the next safe step.  
  _Example 3:_ Using this consistently made handoff and review much smoother.

- **incident** /ˈɪnsədənt/ (n) - serious production problem  
  _Example 1:_ We had an incident during peak payment hours.  
  _Example 2:_ In one release, this became important when priorities changed quickly.  
  _Example 3:_ After that case, we added it to our normal workflow.

- **timeline** /tˈaɪmlaɪn/ (n) - sequence of events over time  
  _Example 1:_ We created a timeline to understand what failed first.  
  _Example 2:_ We used this in a production case to decide the next safe step.  
  _Example 3:_ Using this consistently made handoff and review much smoother.

- **log analysis** /lˈɔɡ ənˈæləsəs/ (n) - reading logs to find patterns and errors  
  _Example 1:_ Log analysis showed repeated timeout errors.  
  _Example 2:_ We discussed this in stand-up to keep the team aligned.  
  _Example 3:_ Now I mention this early so product and engineering stay on the same page.

- **5 Whys** /fˈaɪv wˈaɪz/ (n) - method of asking why several times  
  _Example 1:_ We used 5 Whys to avoid shallow conclusions.  
  _Example 2:_ We used this in a production case to decide the next safe step.  
  _Example 3:_ Using this consistently made handoff and review much smoother.

- **downtime** /dˈaʊntˌaɪm/ (n) - period when service is unavailable  
  _Example 1:_ Downtime lasted about 45 minutes.  
  _Example 2:_ We discussed this in stand-up to keep the team aligned.  
  _Example 3:_ Now I mention this early so product and engineering stay on the same page.

- **affected users** /əfˈɛktɪd jˈuzɚz/ (n) - users impacted by the issue  
  _Example 1:_ Around 2,000 users were affected.  
  _Example 2:_ We used this in a production case to decide the next safe step.  
  _Example 3:_ Using this consistently made handoff and review much smoother.

- **lost transactions** /lˈɔst trænzˈækʃənz/ (n) - payments/orders that failed  
  _Example 1:_ The bug caused lost transactions for three hours.  
  _Example 2:_ We discussed this in stand-up to keep the team aligned.  
  _Example 3:_ Now I mention this early so product and engineering stay on the same page.

- **mitigation** /mˌɪtɪɡˈeɪʃən/ (n) - short-term action to reduce damage  
  _Example 1:_ Our first mitigation was to disable one unstable endpoint.  
  _Example 2:_ We used this in a production case to decide the next safe step.  
  _Example 3:_ Using this consistently made handoff and review much smoother.

- **post-mortem** /pˈoʊst mˈɔrtəm/ (n) - review after incident  
  _Example 1:_ We wrote a post-mortem and tracked follow-up tasks.  
  _Example 2:_ We discussed this in stand-up to keep the team aligned.  
  _Example 3:_ Now I mention this early so product and engineering stay on the same page.

**Additional useful terms:**
- **alert fatigue** /əlˈɝt fətˈiɡ/ (n) - too many alerts reduce response quality
- **detection gap** /dɪtˈɛkʃən ɡˈæp/ (n) - delay between issue start and detection
- **containment** /kəntˈeɪnmənt/ (n) - actions to stop issue spread
- **permanent fix** /pˈɝmənənt fˈɪks/ (n) - long-term solution
- **owner** /ˈoʊnɚ/ (n) - person responsible for follow-up

</details>

<details open>
<summary><strong>2) Grammar & Useful Patterns (B2)</strong></summary>

- **Past Simple for incident story**  
  The issue started at 10:12 AM after deployment.

- **Past Continuous for ongoing failure**  
  Users were seeing payment errors during checkout.

- **Cause and effect**  
  Because one cache key expired early, requests failed.

- **Quantification language**  
  The issue affected about 18% of traffic.

- **Sequence connectors**  
  First we mitigated, then we identified root cause, and finally we deployed a fix.

- **Future prevention language**  
  We will add monitoring so the same issue is detected faster.

### Useful Sentence Patterns
- The incident started when...
- The root cause was...
- We confirmed it by...
- Business impact was...
- Our immediate mitigation was...
- To prevent this again, we...

</details>

<details open>
<summary><strong>3) Collocations, Chunking & Phrasal Verbs</strong></summary>

### Strong Collocations
- identify root cause
- quantify business impact
- analyze production logs
- restore service quickly
- reduce detection time
- ship a hotfix safely
- write a clear post-mortem
- assign follow-up owners
- prevent repeat incidents
- improve alert quality
- track reliability metrics
- communicate status updates

**Examples (real work):**
- In one release week, we had to identify root cause while still trying to quantify business impact.
- In retro, we agreed to analyze production logs earlier so the same issue would not repeat.

### Useful Chunking & Sentence Starters
- At first, we thought...
- After log analysis, we found...
- The main impact was...
- We took a short-term step to...
- The permanent fix was...
- A key lesson was...
- Next time, we will...

**Examples (using starters):**
- "A real issue we faced was repeated timeout errors, so we paused rollout and checked logs first."
- "To reduce risk, we shipped to 10% of users first, then expanded after QA sign-off."

### Useful Phrasal Verbs
- **track down** -> We tracked down the failing query.
- **shut off** -> We shut off one feature flag to stabilize traffic.
- **bring back** -> We brought back full service after the fix.
- **write up** -> I wrote up the timeline for the post-mortem.
- **follow through** -> We followed through on every prevention task.

</details>

<details open>
<summary><strong>4) Typical Dialogues</strong></summary>

### Dialogue 1 - Structured Incident Explanation

**Interviewer:** Tell me about a serious bug you investigated.

**You:**  
We had a payment incident after a release. Users got timeout errors during checkout. We checked logs, compared old and new queries, and found an index issue as the root cause.

We rolled back first, then shipped a safer fix. It restored service quickly, but we lost some transactions before mitigation.

### Dialogue 2 - Quantifying Impact

**Interviewer:** How did you explain business impact?

**You:**  
I shared three numbers: downtime, affected users, and estimated lost revenue per hour. This helped product and leadership understand urgency.

Technical detail mattered, but business numbers helped faster decisions.

### Dialogue 3 - Prevention

**Interviewer:** What did you change after the incident?

**You:**  
We added query performance alerts and a pre-release load test for high-risk endpoints. We also improved runbook steps for on-call.

It took extra effort, but our detection time became much faster.

</details>

<details open>
<summary><strong>5) Reading Text</strong></summary>

Root cause analysis is not only about finding who made a mistake. It is about understanding the full chain: trigger, weak point, impact, and recovery. Calm, structured communication is very important in this process.

Strong teams quantify impact with clear numbers. Saying "it was bad" is not enough. You can share affected users, downtime, and estimated business loss. This helps teams prioritize fixes and prevention.

A good post-mortem should be practical: what happened, what we fixed, and what actions are already tracked.

</details>

<details open>
<summary><strong>6) List of Questions + Ideas</strong></summary>

### Core Questions (must-practice)
1. How do you investigate a production bug step by step?
2. What data do you use to find root cause?
3. How do you quantify incident impact for non-technical teams?
4. What makes a post-mortem useful?

### High-Value Case Questions
5. Share a real incident and your role in the investigation.
6. Tell me about a wrong assumption during debugging and how you corrected it.
7. Describe one prevention change that reduced future incident risk.

### Critical Discussion Questions
8. Should teams optimize for faster recovery or perfect diagnosis first?
9. Is it okay to ship a quick hotfix with known limitations?
10. Who should own post-mortem follow-up actions?

**Tips for speaking practice:**
- Use a clear sequence: incident -> analysis -> fix -> prevention.
- Include at least one number in impact.
- Keep blame out; focus on learning and system improvement.

---

</details>
