---
sessionNumber: 8
title: Root Cause Analysis & Impact
topic: Diagnosing Incidents with Clear Business Impact
phase: PHASE 2 - ANALYTICAL THINKING IN IT
level: B2
description: Explain real production incidents with evidence, timeline, user impact, and practical prevention, including modern AI and platform dependencies.
---

# Session 8: Root Cause Analysis & Impact

**Level:** B2

**Focus:** Explain incidents with clear sequence, evidence, impact, mitigation, and prevention.

<details open>
<summary><strong>1) Vocabulary</strong></summary>

### Core Vocabulary - High Reuse

- **incident** /ˈɪnsədənt/ (n) - production problem that affects users, systems, or business
  - _Common chunks:_ production incident, incident review, incident summary
  - _Example:_ The incident affected checkout for 36 minutes.

- **symptom** /ˈsɪmptəm/ (n) - visible problem users or systems show
  - _Common chunks:_ user symptom, visible symptom, first symptom
  - _Example:_ The symptom was payment failure, but the cause was a validation change.

- **root cause** /ruːt kɔːz/ (n) - main reason the failure happened
  - _Common chunks:_ identify root cause, confirmed root cause, root cause analysis
  - _Example:_ The root cause was duplicated validation logic, not the payment provider.

- **timeline** /ˈtaɪmˌlaɪn/ (n) - sequence of what happened and when
  - _Common chunks:_ build a timeline, incident timeline, shared timeline
  - _Example:_ The timeline showed failures started six minutes after the feature flag changed.

- **evidence** /ˈevədəns/ (n) - facts that support a conclusion
  - _Common chunks:_ evidence showed, evidence-based RCA, weak evidence
  - _Example:_ Logs and traces gave us evidence that the delay happened before the provider call.

- **hypothesis** /haɪˈpɑːθəsɪs/ (n) - testable explanation of what might be wrong
  - _Common chunks:_ test a hypothesis, rule out a hypothesis, first hypothesis
  - _Example:_ Our first hypothesis was provider latency, but traces ruled it out.

- **impact** /ˈɪmpækt/ (n) - effect on users, revenue, trust, support, or operations
  - _Common chunks:_ user impact, business impact, impact window
  - _Example:_ The impact was 620 failed checkout attempts during the incident window.

- **mitigation** /ˌmɪtəˈɡeɪʃən/ (n) - short-term action to reduce damage quickly
  - _Common chunks:_ immediate mitigation, short-term mitigation, apply mitigation
  - _Example:_ The first mitigation was rolling back the feature flag.

- **prevention** /prɪˈvenʃən/ (n) - action that reduces the chance of the same issue happening again
  - _Common chunks:_ prevention action, prevention plan, prevent recurrence
  - _Example:_ Prevention included a contract test and a better alert.

- **confidence** /ˈkɑːnfədəns/ (n) - how certain the team is about the diagnosis
  - _Common chunks:_ confidence level, high confidence, low confidence
  - _Example:_ I would state the confidence level if the impact estimate is rough.

- **ownership** /ˈoʊnərˌʃɪp/ (n) - clear responsibility for follow-up actions
  - _Common chunks:_ action owner, clear ownership, assign ownership
  - _Example:_ Each corrective action needs an owner and due date.

- **fallback** /ˈfɔːlbæk/ (n) - backup behavior when the normal path fails
  - _Common chunks:_ fallback path, fallback message, fallback behavior
  - _Example:_ The AI assistant needed a fallback message when latency passed eight seconds.

### High-Value Verbs & Chunks

- **trace back** - to follow evidence back to the source
  - _Example:_ We traced back the error spike to one feature flag change.

- **rule out** - to prove one possible cause is not likely
  - _Example:_ We ruled out cache issues after checking hit-rate metrics.

- **narrow down** - to reduce the possible cause area
  - _Example:_ We narrowed down the failure to one endpoint and one customer segment.

- **roll back** - to undo a release or config change
  - _Example:_ We rolled back before investigating the deeper cause.

- **reproduce** - to trigger the issue again in a controlled way
  - _Example:_ QA reproduced the issue with one coupon and one payment method.

- **compare** - to check differences between working and failing cases
  - _Example:_ We compared successful and failed requests in the same time window.

- **estimate** - to give a useful approximate number
  - _Example:_ We estimated affected users from failed attempts and normal traffic.

- **separate** - to make two ideas clear and distinct
  - _Example:_ We separated mitigation from the final corrective action.

- **follow up** - to continue after the incident with action
  - _Example:_ We followed up with monitoring and contract tests.

- **write up** - to write the incident summary
  - _Example:_ I wrote up the RCA with cause, impact, and owners.

### Speaking Expansion Paths

- **RCA** can connect to symptom, timeline, evidence, cause, impact, and prevention.
  - _Flow:_ Users saw payment failures, the issue started after a feature flag change, logs confirmed malformed requests, and prevention was a contract test.

- **Impact** can connect to time window, affected users, revenue risk, support load, and trust.
  - _Flow:_ The impact window was 36 minutes, 620 checkout attempts failed, and the revenue at risk was an estimate, not a final number.

- **Mitigation** can connect to rollback, user protection, temporary state, and follow-up owner.
  - _Flow:_ We rolled back first to restore checkout, then kept investigating. The rollback reduced harm, but it was not the final fix.

- **AI/provider incident** can connect to model latency, queue, retrieval, prompt change, and fallback.
  - _Flow:_ The provider was slower, but traces showed most delay happened in retrieval before the model call.

### Secondary Vocabulary - Incident Terms

- **log review** - checking logs to find patterns and errors
  - _Example:_ Log review showed failed users hit the same validation path.

- **trace** - request path across services
  - _Example:_ Traces showed where the request slowed down.

- **impact window** - exact time period users were affected
  - _Example:_ The impact window was from 10:12 to 10:48.

- **affected users** - users impacted by a failure
  - _Example:_ We estimated around 2,400 affected users.

- **corrective action** - longer-term change that removes or reduces the weakness
  - _Example:_ Corrective actions included alerts and contract tests.

- **provider status** - availability or incident page from an external service
  - _Example:_ Provider status was normal, so we checked our integration.

</details>

<details open>
<summary><strong>2) Grammar & Useful Patterns (B2)</strong></summary>

### Speaking Frames

- **Incident start**
  The issue started at 10:12 after we enabled a new checkout rule.

- **User symptom**
  Users were seeing payment errors even though their payment details were valid.

- **Evidence**
  We confirmed the cause by comparing failed requests with successful requests.

- **Impact**
  The incident affected about 620 checkout attempts in 36 minutes.

- **Mitigation**
  Our immediate mitigation was rolling back the feature flag.

- **Ruled-out cause**
  We ruled out the payment provider because provider status and response logs were normal.

- **Prevention**
  To prevent this again, we added a contract test and a payment failure alert.

- **Blameless summary**
  The RCA focuses on the missing safeguard, not on blaming one person.

### Useful Sentence Patterns

- The incident started when...
- The first signal was...
- The user symptom was...
- At first, we thought...
- We confirmed it by...
- We ruled out...
- The impact window was...
- The clearest user impact was...
- Our immediate mitigation was...
- The corrective action was...
- The follow-up owner is...
- Next time, we will...

</details>

<details open>
<summary><strong>3) Collocations, Chunking & Phrasal Verbs</strong></summary>

### Communication Blocks

- **Diagnosis**
  - identify root cause
  - build incident timeline
  - test one hypothesis at a time
  - document evidence

- **Signals**
  - review logs and traces
  - compare product and technical signals
  - check provider status
  - reproduce the affected flow

- **Impact**
  - quantify impact window
  - estimate affected users
  - estimate revenue or trust risk
  - explain impact in plain language

- **Recovery**
  - apply short-term mitigation
  - roll back a release
  - enable fallback behavior
  - restore the main flow

- **Prevention**
  - define corrective actions
  - assign action owners
  - add monitoring alerts
  - prevent repeat incidents

### Useful Chunking & Sentence Starters

- At first, we thought...
- The first signal was...
- After comparing logs and traces, we found...
- The main impact window was...
- Our first mitigation was...
- We ruled out...
- Evidence showed that...
- The corrective action was...
- A key lesson was...
- The RCA is useful only if...
- The next owner is...
- Next time, we will...

### Useful Phrasal Verbs

- **trace back** -> We traced back the error spike to one feature flag change.
- **rule out** -> We ruled out cache issues after checking hit-rate metrics.
- **narrow down** -> We narrowed down the failure to one endpoint and one customer segment.
- **roll back** -> We rolled back the release before investigating the deeper cause.
- **follow up** -> We followed up with a contract test and a monitoring change.
- **write up** -> I wrote up RCA findings with impact numbers and owners.

</details>

<details open>
<summary><strong>4) Dialogues</strong></summary>

### Dialogue 1 - Structured Incident Explanation

**Teammate:** What actually happened with checkout yesterday?

**You:**
Checkout failed for some users for 36 minutes after we enabled a new validation rule. At first, it looked like a payment provider issue, but provider status was normal.

We compared failed requests with successful ones and found that our backend was sending malformed payment data only for one discount flow. We rolled back the flag first, then added a contract test for that flow.

### Dialogue 2 - Quantifying Impact

**Product Manager:** How big was the impact?

**You:**
The impact window was 10:12 to 10:48. During that time, around 2,400 checkout attempts happened, and 620 failed. Based on normal order value, the revenue at risk was around $18,000, but some users may retry later.

I would describe it as medium customer impact and high urgency because it affected payment, not just a secondary feature.

### Dialogue 3 - AI Feature RCA

**Engineering Lead:** Was the AI provider the root cause?

**You:**
Not directly. The provider was slower than usual, but our traces showed most delay happened in our retrieval step before the model call. We were sending too many documents to the assistant after a prompt update.

The mitigation was reducing retrieved documents and showing a fallback message when response time passed eight seconds. The corrective action is adding prompt-size checks and latency alerts for retrieval, queue, and provider time separately.

### Dialogue 4 - Blameless Summary

**Manager:** So whose fault was it?

**You:**
I would not frame it as one person's fault. The direct cause was a validation change, but the deeper weakness was missing contract coverage for the discount payment path.

The useful follow-up is improving the safeguard, not blaming the engineer who changed the rule.

</details>

<details open>
<summary><strong>5) Context Flows</strong></summary>

### Flow 1 - Symptom + Timeline + Cause

The user symptom was failed checkout, not just an error in logs. The issue started at 10:12, shortly after a feature flag changed validation behavior. We compared successful and failed requests and found malformed payment data in one discount flow. That evidence explained both the failure and the timing.

### Flow 2 - Mitigation + Final Fix

Our immediate mitigation was rolling back the feature flag because users could not complete payment. That restored the main flow quickly. But the rollback was not the final fix. The corrective action was adding contract tests and safer rollout checks for that payment path.

### Flow 3 - Impact + Confidence

The impact window was 36 minutes. Around 620 checkout attempts failed, and the revenue at risk was roughly $18,000 based on normal order value. I would state that as an estimate, not a final number, because some users may retry later.

### Flow 4 - AI Dependency + Layered RCA

For AI incidents, I would not immediately blame the model provider. I would check prompt size, retrieval latency, queue depth, provider status, and fallback behavior. The user sees one slow answer, but the cause may sit in a different layer.

</details>

<details open>
<summary><strong>6) Reading Text</strong></summary>

### Reading 1 - RCA Starts With User Impact

Root cause analysis is not only about finding who made a mistake. It is about understanding the full chain: user symptom, trigger, weak point, impact, mitigation, and prevention. A good RCA makes the system easier to trust after something goes wrong.

Starting with user impact keeps the explanation grounded. "Users could not complete payment for 36 minutes" is clearer than "the API had errors."

### Reading 2 - Evidence Beats Guessing

In modern products, the root cause is not always inside one code change. It may involve a feature flag, CDN rule, third-party auth service, payment provider, queue backlog, model API, prompt update, or data retrieval step.

That is why strong teams compare product signals with technical signals. They look at the customer journey first, then use logs, metrics, traces, and provider status to explain what failed.

### Reading 3 - Impact Needs More Than One Number

Impact also needs more than one number. Saying "it was bad" is not enough. You can share the impact window, affected users, failed transactions, revenue at risk, support load, and confidence level.

For AI features, impact may include trust risk or accuracy risk, not only downtime. A low error count can still matter if the affected users are high-value customers.

### Reading 4 - Mitigation Is Not The Same As Prevention

A rollback or feature flag change may protect users quickly. That is useful during an active incident. But mitigation should not quietly become the final answer.

After recovery, the team still needs prevention: tests, alerts, fallback behavior, ownership, and better rollout rules. A useful RCA changes the system after the incident.

### Reading 5 - Useful Patterns Noticed

- The incident started when...
- The user symptom was...
- At first, we thought...
- We confirmed it by...
- We ruled out...
- The impact window was...
- Our immediate mitigation was...
- The corrective action was...
- The RCA is useful only if...

**Reusable discussion idea:** A strong RCA moves from user symptom to evidence, then from recovery to prevention.

</details>

<details open>
<summary><strong>7) Questions & Practice Ideas</strong></summary>

1. How do you run RCA step by step after a production failure?
2. Which logs, metrics, and traces do you check first, and why?
3. How do you quantify impact window, affected transactions, and revenue risk?
4. How do you write an RCA summary that is honest without creating blame?
5. When is a fast mitigation acceptable, and when does it create long-term risk?
6. How do AI features and third-party platforms change incident investigation?
7. What alternative cause should you rule out before confirming root cause?
8. If business impact looked low at first but grew later, what did the analysis miss?
9. How do you avoid blaming the wrong team when evidence is incomplete?
10. What makes an RCA useful after the incident is over?

</details>
