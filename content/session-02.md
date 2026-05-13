---
sessionNumber: 2
title: System and Stakeholders
topic: Explaining Architecture and Team Communication
phase: PHASE 1 - TECH & BUSINESS
level: B2
description: Explain system flow, dependencies, risk, and stakeholder updates in simple product-friendly English.
---

# Session 2: System and Stakeholders

**Level:** B2

**Focus:** Explain how a feature works end to end and adapt the same technical reality for PM, QA, support, design, backend, and engineering.

<details open>
<summary><strong>1) Vocabulary</strong></summary>

### Core Vocabulary - High Reuse

- **flow** /floʊ/ (n) - the order of steps in a user action, feature, or system
  - _Common chunks:_ user flow, system flow, checkout flow, explain the flow
  - _Example:_ I usually explain the flow from the user's first action to the final UI state.

- **journey** /ˈdʒɝːni/ (n) - the full path a user takes to reach a goal
  - _Common chunks:_ user journey, map the journey, journey step
  - _Example:_ Starting with the user journey helps non-engineers understand the system faster.

- **dependency** /dɪˈpendənsi/ (n) - something your work relies on
  - _Common chunks:_ external dependency, dependency risk, depend on backend/provider
  - _Example:_ The main dependency was the payment API because the frontend could not test real errors without it.

- **stakeholder** /ˈsteɪkˌhoʊldər/ (n) - a person or team affected by the work or decision
  - _Common chunks:_ stakeholder update, stakeholder expectation, align with stakeholders
  - _Example:_ PM, QA, support, and backend all needed different details from the same system update.

- **update** /ˈʌpˌdeɪt/ (n/v) - a short message about progress, risk, or next steps
  - _Common chunks:_ send an update, status update, update the team
  - _Example:_ A good update says what is done, what is risky, who owns it, and what happens next.

- **blocker** /ˈblɑːkər/ (n) - something that stops progress
  - _Common chunks:_ current blocker, release blocker, remove a blocker
  - _Example:_ The frontend was not blocked, but real API testing was still waiting on backend.

- **risk** /rɪsk/ (n) - something that could create a problem later
  - _Common chunks:_ release risk, integration risk, make risk visible
  - _Example:_ The risk was not urgent yet, but it could affect release readiness.

- **context** /ˈkɑːntekst/ (n) - information people need to understand a situation
  - _Common chunks:_ give context, missing context, enough context to act
  - _Example:_ Support did not need the full API design, but they needed enough context to answer users.

- **expectation** /ˌekspekˈteɪʃən/ (n) - what someone believes should happen
  - _Common chunks:_ set expectations, manage expectations, expected behavior
  - _Example:_ We set expectations that payment failure testing needed one more QA pass.

- **handoff** /ˈhændˌɔːf/ (n) - transferring context or responsibility to another person or team
  - _Common chunks:_ support handoff, QA handoff, handoff note
  - _Example:_ I wrote a handoff note with screenshots, expected behavior, and escalation cases.

- **escalation** /ˌeskəˈleɪʃən/ (n) - raising an issue to the right person when it needs attention
  - _Common chunks:_ escalation path, escalate early, escalation rule
  - _Example:_ We agreed on an escalation path for payment failures during launch.

- **source of truth** /sɔːrs əv truːθ/ (n) - the official place people use for the latest answer
  - _Common chunks:_ one source of truth, keep it updated, official source of truth
  - _Example:_ We kept one source of truth for API fields, UI states, and open questions.

- **edge case** /edʒ keɪs/ (n) - an unusual but possible situation the system should handle
  - _Common chunks:_ edge case, test edge cases, document edge cases
  - _Example:_ QA needed the edge cases more than the internal implementation details.

- **readiness** /ˈredinəs/ (n) - whether something is prepared enough for the next step
  - _Common chunks:_ release readiness, QA readiness, check readiness
  - _Example:_ Release readiness depended on testing real payment failure states.

- **ownership** /ˈoʊnərˌʃɪp/ (n) - clear accountability for a part of the system or decision
  - _Common chunks:_ clear ownership, risk ownership, ownership boundary
  - _Example:_ Backend owned the API contract, and frontend owned the user-facing states.

- **alignment** /əˈlaɪnmənt/ (n) - shared understanding about direction, priority, or responsibility
  - _Common chunks:_ team alignment, get alignment, alignment with QA
  - _Example:_ We got alignment on which error cases were required before release.

### High-Value Verbs & Chunks

- **map out** - to describe or draw the main steps
  - _Example:_ I mapped out the checkout flow before talking about technical details.

- **clarify** - to make something easier to understand
  - _Example:_ I clarified which API errors should become user-facing messages.

- **sync up with** - to quickly align with another person or team
  - _Example:_ I synced up with QA on the payment failure scenarios.

- **flag** - to point out a risk or important issue early
  - _Example:_ I flagged the contract risk before it became a release blocker.

- **hand off to** - to pass context or responsibility to another person or team
  - _Example:_ I handed off user-facing payment messages to support before launch.

- **follow through on** - to continue until an open item is handled
  - _Example:_ I followed through on the open API questions after the meeting.

- **tailor the message** - to adjust an explanation for a specific audience
  - _Example:_ I tailored the message for PM, QA, and support without changing the facts.

- **break down** - to divide a complex system into smaller parts
  - _Example:_ I broke down the flow into user action, frontend behavior, backend response, and UI state.

- **raise early** - to mention a problem before it becomes urgent
  - _Example:_ I raised the dependency risk early because it could affect QA time.

- **confirm** - to check that something is correct
  - _Example:_ Backend confirmed the final error codes before QA started the last pass.

- **translate** - to explain technical information in practical language
  - _Example:_ I translated provider errors into user-facing support language.

- **summarize** - to give the short version
  - _Example:_ I summarized the risk in one line so the PM could decide quickly.

### Speaking Expansion Paths

- **System flow** can connect to user journey, frontend responsibility, backend responsibility, UI states, and risk.
  - _Flow:_ The user starts with checkout, the frontend handles form behavior, backend validates the order, and the UI shows success, pending, or failure.

- **Stakeholder update** can connect to progress, blocker, risk, owner, and next step.
  - _Flow:_ The UI is ready, QA is testing the happy path, but real payment failure states still need backend confirmation. Backend owns the next answer.

- **Dependency risk** can connect to API contracts, mock data, provider behavior, and release readiness.
  - _Flow:_ The mock API helped frontend move, but real provider behavior was still unverified. That meant we needed one integration pass before release.

- **Audience-aware explanation** can connect to PM, QA, support, and engineering needs.
  - _Flow:_ PM needs timeline and risk, QA needs expected behavior, support needs user-facing wording, and backend needs request and response details.

### Secondary Vocabulary - Technical/Product Terms

- **API contract** - the agreed request shape, response shape, and error behavior
  - _Example:_ A contract mismatch caused the UI to show the wrong error message.

- **mock API** - fake API response used before the real service is ready
  - _Example:_ Mock APIs helped us build early, but they did not prove the real flow was safe.

- **UI state** - visible condition in the interface, such as loading, empty, success, pending, or error
  - _Example:_ We documented every UI state before QA testing.

- **failure path** - what happens when the normal flow does not work
  - _Example:_ The failure path needed clearer messages for declined payments.

- **provider sandbox** - a test environment from an external service
  - _Example:_ The provider sandbox returned different error codes from production-like behavior.

- **release readiness** - whether the feature is safe enough to launch
  - _Example:_ Release readiness depended on real API testing, not only mock data.

</details>

<details open>
<summary><strong>2) Grammar & Useful Patterns (B2)</strong></summary>

### Speaking Frames

- **High-level flow**
  At a high level, the user submits the form, the frontend sends the request, backend validates it, and the UI shows the final state.

- **Responsibility split**
  Frontend owns the visible behavior, backend owns the API response, and QA owns the final test coverage.

- **Audience adaptation**
  For PM, I would explain timeline risk; for QA, I would explain edge cases; for support, I would explain what users see.

- **Dependency risk**
  The UI is ready, but final confidence depends on testing the real payment API.

- **Risk without panic**
  This is not blocked yet, but it could affect release readiness if the error codes change again.

- **Status update**
  UI is done, QA is testing, risk is real payment failures, owner is backend, and the next check is tomorrow morning.

- **Uncertainty**
  We know the happy path works, but we still need to verify slow responses, permission errors, and provider timeouts.

- **Escalation**
  I would escalate this if the provider behavior is still unclear by the release cutoff.

### Useful Sentence Patterns

- At a high level, the flow works like this...
- From the user's point of view...
- The frontend is responsible for...
- The backend/service is responsible for...
- The main dependency is...
- The open question is...
- The risk is not urgent yet, but...
- For PM/QA/support, I would explain it as...
- The source of truth should be...
- The next decision we need is...
- I would escalate this if...
- The safest next step is...

</details>

<details open>
<summary><strong>3) Collocations, Chunking & Phrasal Verbs</strong></summary>

### Communication Blocks

- **System explanation**
  - explain an end-to-end flow
  - map the user journey
  - break down the system
  - describe the failure path

- **Responsibilities**
  - define ownership boundaries
  - split frontend and backend responsibility
  - clarify who owns the risk
  - keep one source of truth

- **Stakeholder updates**
  - send a concise update
  - align stakeholder expectations
  - share enough context
  - reduce repeated questions

- **Risk and dependency**
  - track dependency risk
  - flag blockers early
  - confirm release readiness
  - escalate unresolved issues

- **QA and support**
  - document UI states
  - confirm expected behavior
  - hand off user-facing wording
  - list cases to escalate

### Useful Chunking & Sentence Starters

- The simplest way to explain it is...
- From the user's point of view...
- From the frontend side...
- The risky part is...
- The open question is...
- The dependency we need to watch is...
- For support, the key message is...
- For QA, the key scenario is...
- I would keep the shared facts the same, but...
- I would escalate this if...
- The next action belongs to...
- The part that still needs confirmation is...

### Useful Phrasal Verbs

- **map out** -> We mapped out the flow before implementation.
- **sync up with** -> I synced up with QA on error states.
- **flag up** -> I flagged up the API contract risk early.
- **hand off to** -> I handed off screenshots and notes to support.
- **follow through on** -> I followed through on the open API questions.
- **break down** -> I broke down the feature into user flow, API behavior, and UI states.
- **check in with** -> I checked in with backend before the final QA pass.

</details>

<details open>
<summary><strong>4) Dialogues</strong></summary>

### Dialogue 1 - Explaining System Flow

**Designer:** Can you explain how this subscription flow works?

**You:**
At a high level, the user selects a plan, enters payment details, and confirms the subscription. The frontend handles the form, basic validation, loading state, and user-facing messages.

Backend checks the plan and talks to the payment provider. After that, the frontend shows success, pending, or failure, so the user knows what to do next.

### Dialogue 2 - Giving A Stakeholder Update

**PM:** Are we ready for release?

**You:**
The main UI is ready, and QA has tested the happy path. The open risk is payment failure handling because the provider sandbox returned different error codes from the API contract.

Backend will confirm the final error codes today. If they change again, we should plan one more QA pass before release.

### Dialogue 3 - Support Handoff

**Support:** What should we tell users if payment is stuck?

**You:**
Tell them the payment is still pending and they should not retry immediately. The user sees a pending state when the provider has not confirmed the result yet.

I will share a short handoff note with screenshots, user-facing wording, and the cases that should be escalated to engineering.

### Dialogue 4 - Tailoring The Same Issue

**Manager:** Can you explain the issue simply for different teams?

**You:**
For PM, I would say the release risk is one unverified payment failure case. For QA, I would list the exact error states to test. For support, I would explain what users see and what message they can give.

The facts stay the same, but each team needs a different level of detail to act.

</details>

<details open>
<summary><strong>5) Context Flows</strong></summary>

### Flow 1 - User Journey + Technical Layers

The easiest way to explain the system is to start with the user journey. The user chooses a plan, enters payment details, and confirms the subscription. Then I add the technical layers: frontend validation, backend order checks, payment provider response, and final UI state. That keeps the explanation clear without hiding the important system parts.

### Flow 2 - Status Update + Risk + Owner

The UI is implemented and QA has tested the happy path. The open risk is real payment failure handling because the provider sandbox returned different error codes. Backend owns the next confirmation, and frontend will update the UI mapping after that. If the codes change again, we need one more QA pass before release.

### Flow 3 - Same Facts, Different Audience

I would keep the facts the same for everyone, but change the explanation. PM needs timeline and release risk. QA needs expected behavior and edge cases. Support needs user-facing wording and escalation rules. Engineering needs the API contract and failure path.

### Flow 4 - Mock API + Real Integration

Mock APIs are useful because they let frontend work continue before the real service is ready. The trade-off is that mock data is usually too clean. Real APIs can be slow, incomplete, or inconsistent. So I would use mocks early, but I would not call the feature ready until real integration testing passes.

</details>

<details open>
<summary><strong>6) Reading Text</strong></summary>

### Reading 1 - Start With The User Journey

A clear system explanation usually starts with the user, not the code. If you begin with services, endpoints, and implementation details, non-engineers may get lost. If you begin with what the user does, people can follow the logic faster.

For example: "The user selects a plan, enters payment details, and confirms the subscription. Then the frontend sends the request to backend, backend checks the plan and payment, and the UI shows success, pending, or failure." This gives enough structure before you add deeper technical detail.

### Reading 2 - Tailor The Message Without Changing The Facts

Different stakeholders need different details. PM needs timeline, scope, and risk. QA needs expected behavior, edge cases, and test data. Support needs user-facing wording and escalation rules. Backend needs contracts, payloads, and failure cases.

Good communication does not mean creating four different truths. It means keeping one source of truth and tailoring the explanation around what each audience needs to do next.

### Reading 3 - Make Risk Visible Early

Risk language should be calm and specific. Saying "almost done" can hide important uncertainty. Saying "the UI is done, but real payment failure states still need API testing" gives the team a better picture.

Early risk visibility is not panic. It gives people time to adjust scope, add QA time, or prepare a fallback. The goal is not to sound negative. The goal is to help the team make a decision before pressure becomes too high.

### Reading 4 - Mock Data Is Useful But Limited

Mock data helps frontend move when backend or a provider is not ready. It is useful for layout, basic state handling, and early demos. But mock data can also create false confidence because it is usually clean, fast, and predictable.

Before release, the team still needs real integration testing. Real APIs can return slow responses, missing fields, different error codes, or unexpected provider behavior. A mock is a development tool, not proof that the flow is safe.

### Reading 5 - Useful Patterns Noticed

- At a high level, the flow works like this...
- From the user's point of view...
- The frontend is responsible for...
- The open risk is...
- The part that still needs confirmation is...
- For PM, I would explain...
- For QA, the key scenario is...
- For support, the user-facing message is...
- The mock helps us move, but it does not prove...

**Reusable discussion idea:** Strong system communication turns technical complexity into clear flow, ownership, risk, and next action.

</details>

<details open>
<summary><strong>7) Questions & Practice Ideas</strong></summary>

1. How would you explain a system flow from the user's point of view?
2. What details should you include when explaining a feature to QA?
3. How would you explain the same issue differently to PM, QA, and support?
4. What dependency risk have you faced in a real project?
5. What should a useful status update include?
6. When should a team escalate a risk before full evidence exists?
7. What quality risks can mock APIs or mock data create?
8. If a stakeholder asks, "Are we ready?", how would you answer honestly?
9. How does stakeholder communication differ between a beginner and an experienced engineer?
10. How would you summarize a technical risk in one or two clear sentences?

</details>
