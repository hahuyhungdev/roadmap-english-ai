---
sessionNumber: 9
title: Incident Under Pressure
topic: Real-Time Outage Handling and Team Coordination
phase: PHASE 2 - ANALYTICAL THINKING IN IT
level: B1-B2
description: Describe how you handle production incidents under time pressure, including communication and post-mortem work.
---

# Session 9: Incident Under Pressure

**Level:** B1-B2  
**Focus:** Explain what you did during a live outage, how you stayed calm, and how you coordinated technical and non-technical updates.

<details open>
<summary><strong>1) Vocabulary </strong></summary>

- **outage** /ˈaʊtədʒ/ (n) - period when service is down  
  _Example 1:_ We had a major outage during a marketing campaign.  
  _Example 2:_ On a real project, outage helped us explain the trade-off to product.  
  _Example 3:_ I used outage in a stakeholder update so non-technical teams could follow.

- **on-call** /ˈɑn kˈɔl/ (adj/n) - engineer responsible for urgent issues  
  _Example 1:_ I was on-call when the alerts started.  
  _Example 2:_ For production systems, this would be considered on-call.  
  _Example 3:_ That incident taught me not to ignore anything on-call.

- **escalation** /ˌɛskəlˈeɪʃən/ (n) - raising issue to higher support level  
  _Example 1:_ We escalated to database team within 10 minutes.  
  _Example 2:_ On a real project, escalation helped us explain the trade-off to product.  
  _Example 3:_ After that case, we added escalation to our checklist for future releases.

- **war room** /wˈɔr rˈum/ (n) - focused channel/meeting during incident  
  _Example 1:_ We opened a war room to coordinate quickly.  
  _Example 2:_ For a customer-facing bug, war room guided what we fixed first.  
  _Example 3:_ In retro, we connected war room with one clear lesson learned.

- **status update** /stˈætəs əpdˈeɪt/ (n) - clear progress message during incident  
  _Example 1:_ We sent status updates every 15 minutes.  
  _Example 2:_ On a real project, status update helped us explain the trade-off to product.  
  _Example 3:_ That experience showed how status update affects both speed and stability.

- **containment** /kəntˈeɪnmənt/ (n) - action to stop issue from getting worse  
  _Example 1:_ First containment step was disabling one faulty job.  
  _Example 2:_ For a customer-facing bug, containment guided what we fixed first.  
  _Example 3:_ In retro, we connected containment with one clear lesson learned.

- **rollback** /rˈoʊlbˌæk/ (n/v) - return to previous stable version  
  _Example 1:_ We rolled back the release to restore service.  
  _Example 2:_ On a real project, rollback helped us explain the trade-off to product.  
  _Example 3:_ In retro, we connected rollback with one clear lesson learned.

- **blast radius** /blˈæst rˈeɪdiəs/ (n) - how widely an issue spreads  
  _Example 1:_ Feature flags helped reduce blast radius.  
  _Example 2:_ For a customer-facing bug, blast radius guided what we fixed first.  
  _Example 3:_ After that case, we added blast radius to our checklist for future releases.

- **post-mortem** /pˈoʊst mˈɔrtəm/ (n) - review after incident  
  _Example 1:_ Our post-mortem focused on process gaps, not blame.  
  _Example 2:_ On a real project, post-mortem helped us explain the trade-off to product.  
  _Example 3:_ After that case, we added post-mortem to our checklist for future releases.

- **runbook** /ˈrʌnˌbʊk/ (n) - predefined incident handling guide  
  _Example 1:_ The runbook gave us clear first-response steps.  
  _Example 2:_ During planning, we used runbook to make a safer release decision.  
  _Example 3:_ In retro, we connected runbook with one clear lesson learned.

**Additional useful terms:**
- **incident commander** /ˈɪnsədənt kəmˈændɚ/ (n) - person leading incident response
- **handover** /hˈændoʊvɚ/ (n) - transfer of incident context
- **ETA** /i ti eɪ/ (n) - estimated time to recovery
- **service degradation** /sˈɝvəs dˌɛɡrədˈeɪʃən/ (n) - service works but with poor quality
- **communication channel** /kəmjˌunəkˈeɪʃən tʃˈænəl/ (n) - place for updates and coordination

</details>

<details open>
<summary><strong>2) Grammar & Useful Patterns (B2)</strong></summary>

- **Past Continuous for real-time actions**  
  We were investigating logs while support was informing customers.

- **Past Simple for key events**  
  We detected the issue at 2:10 PM and rolled back at 2:22 PM.

- **Time sequencing**  
  First we contained, then we diagnosed, and finally we recovered service.

- **Responsibility language**  
  I took ownership of communication with product during the outage.

- **Contrast language**  
  We moved fast, but we still followed runbook checks.

- **Future prevention language**  
  We will improve alert rules to detect this earlier.

### Useful Sentence Patterns
- During the incident, my role was...
- The first thing we did was...
- We kept everyone updated by...
- We had to choose between... and...
- We recovered service in...
- Afterward, we improved...

</details>

<details open>
<summary><strong>3) Collocations, Chunking & Phrasal Verbs</strong></summary>

### Strong Collocations
- handle production outage
- coordinate incident response
- send regular status updates
- reduce blast radius
- execute rollback plan
- restore customer trust
- manage team stress
- document incident timeline
- run post-mortem review
- improve on-call readiness
- close communication gaps
- prevent repeat failures

**Examples (real work):**
- In one release week, we had to handle production outage while still trying to coordinate incident response.
- In retro, we agreed to send regular status updates earlier so the same issue would not repeat.

### Useful Chunking & Sentence Starters
- As soon as alerts fired,...
- My first priority was...
- We quickly set up...
- Under pressure, we still...
- One hard decision was...
- The team stayed aligned by...
- After recovery, we...
- The key lesson was...

**Examples (using starters):**
- "A real issue we faced was repeated timeout errors, so we paused rollout and checked logs first."
- "To reduce risk, we shipped to 10% of users first, then expanded after QA sign-off."

### Useful Phrasal Verbs
- **jump in** -> I jumped in to coordinate updates.
- **lock down** -> We locked down deployments during investigation.
- **roll back** -> We rolled back the newest release.
- **calm down** -> I focused on clear steps to calm down the team.
- **write up** -> We wrote up the incident report the same day.

</details>

<details open>
<summary><strong>4) Typical Dialogues</strong></summary>

### Dialogue 1 - Real-Time Response

**Interviewer:** Tell me about an outage you handled under pressure.

**You:**  
I was on-call when checkout started failing. We opened a war room, assigned roles, and sent updates every 15 minutes.

We rolled back quickly to restore service. It reduced downtime, but we delayed two planned deployments.

### Dialogue 2 - Communication Under Stress

**Interviewer:** How did you communicate during the incident?

**You:**  
I posted short updates for product and support: impact, current action, and ETA. This helped them answer customer questions.

Technical work was urgent, but clear communication prevented panic.

### Dialogue 3 - Post-Mortem Mindset

**Interviewer:** What happened after service recovered?

**You:**  
We ran a blameless post-mortem, reviewed timeline, and created follow-up tasks for monitoring and runbook updates.

It took extra team time, but future incidents became easier to handle.

</details>

<details open>
<summary><strong>5) Reading Text</strong></summary>

Production incidents test both technical skills and communication skills. During pressure, teams need simple priorities: contain damage, restore service, and keep stakeholders informed.

A common mistake is focusing only on technical fixes and ignoring communication. In real business environments, product, support, and leadership need clear status updates to make decisions.

After recovery, post-mortem work is critical. Without it, teams repeat the same outages and on-call stress stays high.

</details>

<details open>
<summary><strong>6) List of Questions + Ideas</strong></summary>

### Core Questions (must-practice)
1. What do you do in the first 10 minutes of an outage?
2. How do you split roles during incident response?
3. How do you communicate with non-technical stakeholders under pressure?
4. What makes a good post-mortem?

### High-Value Case Questions
5. Share a case where rollback was the best decision.
6. Tell me about a hard trade-off during incident handling.
7. Describe one change that improved your on-call process.

### Critical Discussion Questions
8. Should teams optimize for fast rollback or root cause first?
9. Is it okay to pause feature work after a major outage?
10. How often should teams run incident drills?

**Tips for speaking practice:**
- Speak in timeline order.
- Include one emotion + one action (stress -> clear steps).
- Mention both technical and communication outcomes.

---

</details>
