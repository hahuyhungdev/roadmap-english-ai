---
sessionNumber: 5
title: AI Tools and the Changing Developer Role
topic: Daily AI Usage, Limits, and Practical Trade-offs
phase: PHASE 1 - TECH & BUSINESS
level: B2
description: Explain practical AI usage, verification habits, privacy boundaries, review accountability, and the changing value of engineering judgment.
---

# Session 5: AI Tools and the Changing Developer Role

**Level:** B2

**Focus:** Describe how AI helps real engineering work, where it creates risk, and how to keep quality and accountability.

<details open>
<summary><strong>1) Vocabulary</strong></summary>

### Core Vocabulary - High Reuse

- **draft** /dræft/ (n/v) - a first version that still needs review
  - _Common chunks:_ first draft, AI draft, draft a test case
  - _Example:_ I use AI for first drafts, but I do not treat the draft as final.

- **verification** /ˌverəfəˈkeɪʃən/ (n) - checking whether something is correct and safe
  - _Common chunks:_ verification step, verification checklist, verify the output
  - _Example:_ Verification matters more when AI output touches user-facing behavior.

- **judgment** /ˈdʒʌdʒmənt/ (n) - human ability to evaluate context, risk, and quality
  - _Common chunks:_ engineering judgment, human judgment, judgment quality
  - _Example:_ AI can suggest options, but engineering judgment decides what is safe to ship.

- **accountability** /əˌkaʊntəˈbɪləti/ (n) - responsibility for the final result
  - _Common chunks:_ review accountability, clear accountability, accountability stays with
  - _Example:_ Accountability stays with the engineer who submits the pull request.

- **boundary** /ˈbaʊndəri/ (n) - a clear limit on what is allowed
  - _Common chunks:_ privacy boundary, usage boundary, set a boundary
  - _Example:_ My boundary is simple: no secrets, customer data, or private logs in external AI tools.

- **quality** /ˈkwɑːləti/ (n) - how correct, reliable, and usable the work is
  - _Common chunks:_ quality bar, quality risk, protect quality
  - _Example:_ AI can improve speed, but quality still needs tests and review.

- **review** /rɪˈvjuː/ (n/v) - checking work before approval
  - _Common chunks:_ code review, manual review, review capacity
  - _Example:_ If reviewers are overloaded, AI-generated changes should stay smaller.

- **context** /ˈkɑːntekst/ (n) - information needed to make an answer fit the situation
  - _Common chunks:_ project context, missing context, package context
  - _Example:_ AI gave a generic answer because it did not have enough project context.

- **assumption** /əˈsʌmpʃən/ (n) - something treated as true without proof
  - _Common chunks:_ wrong assumption, check assumptions, hidden assumption
  - _Example:_ The AI made a wrong assumption about our API response shape.

- **workflow** /ˈwɝːkfloʊ/ (n) - the way work moves from idea to final result
  - _Common chunks:_ AI workflow, review workflow, team workflow
  - _Example:_ A good AI workflow includes drafting, checking, testing, and ownership.

- **risk** /rɪsk/ (n) - possible problem from using AI output incorrectly
  - _Common chunks:_ privacy risk, quality risk, reduce risk
  - _Example:_ The risk is not AI itself; the risk is trusting output without verification.

- **evidence** /ˈevədəns/ (n) - proof that supports a claim
  - _Common chunks:_ quality evidence, review evidence, evidence from tests
  - _Example:_ Tests, review comments, and defect rates give evidence that quality did not drop.

- **confidence** /ˈkɑːnfədəns/ (n) - how safe or certain the team feels
  - _Common chunks:_ confidence level, release confidence, false confidence
  - _Example:_ AI can create false confidence when the answer sounds correct but misses local rules.

- **ownership** /ˈoʊnərˌʃɪp/ (n) - responsibility for understanding and approving the final work
  - _Common chunks:_ own the change, final ownership, ownership stays with
  - _Example:_ Even if AI writes the first draft, I still own the final change.

### High-Value Verbs & Chunks

- **verify** - to check correctness with code, tests, docs, or evidence
  - _Example:_ I verify unfamiliar APIs against our codebase or official docs.

- **review** - to check quality before accepting work
  - _Example:_ I review AI-generated code like code from a new teammate.

- **cross-check** - to compare AI claims with a reliable source
  - _Example:_ I cross-check library options before using them.

- **filter out** - to remove unsafe or sensitive information
  - _Example:_ I filter out customer data before writing a prompt.

- **fall back on** - to use a safer manual process when AI is weak
  - _Example:_ I fall back on manual debugging when AI gives generic suggestions.

- **sign off on** - to approve after review
  - _Example:_ A human reviewer must sign off on AI-assisted changes.

- **package context** - to give AI the information it needs
  - _Example:_ I package context with requirements, constraints, and existing code behavior.

- **treat as a draft** - to use output as a starting point, not final work
  - _Example:_ I treat AI output as a draft until I can explain and verify it.

- **raise the bar** - to increase the quality requirement
  - _Example:_ I raise the review bar when AI touches auth, payment, or privacy.

- **reduce blank-page time** - to avoid starting from nothing
  - _Example:_ AI reduces blank-page time for docs, tests, and release notes.

- **own the final decision** - to stay responsible for what is shipped
  - _Example:_ AI can suggest, but I own the final decision.

- **prove quality did not drop** - to show speed did not create hidden problems
  - _Example:_ We need defect data and review evidence to prove quality did not drop.

### Speaking Expansion Paths

- **AI draft** can connect to speed, review, ownership, and final quality.
  - _Flow:_ AI helps me start faster, but I treat the output as a draft. I still check requirements, edge cases, tests, and whether the code fits our project.

- **Privacy boundary** can connect to customer data, secrets, logs, and approved tools.
  - _Flow:_ I do not paste raw logs or customer data into external AI tools. If AI is useful, I anonymize the context or use an approved internal workflow.

- **Verification** can connect to tests, official docs, local code, and risk level.
  - _Flow:_ If AI suggests an unfamiliar API, I cross-check it. If the change touches payment or privacy, I require deeper review.

- **Judgment** can connect to problem framing, trade-offs, risk, and career value.
  - _Flow:_ AI can make drafting faster, but judgment decides whether the answer fits the product, the team, and the users.

### Secondary Vocabulary - AI/Product Terms

- **prompt quality** - how clear and useful the instruction to AI is
  - _Example:_ Prompt quality improved when I added constraints and project context.

- **hallucinated output** - AI output that sounds correct but is false
  - _Example:_ The AI suggested an option that did not exist in our library version.

- **sensitive data** - private user, company, security, or business information
  - _Example:_ Sensitive data should not go into unapproved AI tools.

- **review capacity** - how much careful review the team can realistically do
  - _Example:_ Review capacity becomes a bottleneck if AI creates too many changes.

- **source check** - verifying AI claims against docs, code, or tests
  - _Example:_ A source check caught the wrong API shape.

- **skill atrophy** - weakening of skills from over-reliance on automation
  - _Example:_ Juniors should explain AI-generated code to avoid skill atrophy.

</details>

<details open>
<summary><strong>2) Grammar & Useful Patterns (B2)</strong></summary>

### Speaking Frames

- **Routine use**
  I use AI for first drafts, test ideas, documentation, code exploration, and release notes.

- **Draft framing**
  I treat AI output as a starting point, not as production-ready work.

- **Boundary setting**
  I do not use external AI with secrets, customer data, private logs, or high-risk business logic.

- **Risk explanation**
  AI can produce confident mistakes when it lacks project context.

- **Accountability**
  Even if AI writes the first draft, I am still responsible for what I merge.

- **Risk-based review**
  If the change touches auth, payment, privacy, or user-facing AI behavior, I require deeper review.

- **Quality evidence**
  I would prove quality did not drop by checking bugs, review rework, tests, and production issues.

- **Balanced trade-off**
  AI reduces blank-page time, but it does not remove the need for judgment.

### Useful Sentence Patterns

- I use AI mainly for...
- I treat AI output as...
- I avoid AI when...
- The biggest benefit is...
- The biggest risk is...
- Before using the output, I check...
- My privacy boundary is...
- I would not merge it unless...
- The final decision stays with...
- The quality bar should be higher when...
- The speed gain is real only if...
- A safe AI workflow includes...

</details>

<details open>
<summary><strong>3) Collocations, Chunking & Phrasal Verbs</strong></summary>

### Communication Blocks

- **Daily usage**
  - generate first drafts
  - explain unfamiliar code
  - draft test ideas
  - summarize logs or notes

- **Verification**
  - review AI output
  - verify generated code
  - cross-check unfamiliar APIs
  - test edge cases

- **Safety boundaries**
  - protect sensitive data
  - enforce privacy boundaries
  - avoid raw customer logs
  - use approved tools

- **Team workflow**
  - maintain review accountability
  - match AI usage to review capacity
  - document AI usage rules
  - keep final ownership clear

- **Long-term skill**
  - build engineering judgment
  - prevent skill atrophy
  - explain before merging
  - use AI as a thinking partner

### Useful Chunking & Sentence Starters

- In my daily workflow, AI helps most with...
- I treat AI output as...
- The area where I avoid AI is...
- Before using the output, I check...
- The risk is not AI itself; the risk is...
- My rule is simple...
- If the reviewer is overloaded...
- For low-risk work, AI can...
- For high-risk work, I would...
- A useful policy would be...
- Long term, engineers will be valued for...
- The real value is not faster typing; it is...

### Useful Phrasal Verbs

- **check over** -> I check over generated code before using it.
- **filter out** -> I filter out sensitive data before writing a prompt.
- **fall back on** -> I fall back on manual debugging when AI output is weak.
- **build up** -> I build up my own judgment by explaining the code myself.
- **sign off on** -> A human reviewer must sign off on AI-assisted changes.
- **look up** -> I look up unfamiliar APIs in the docs before trusting the answer.
- **slow down** -> I slow down when AI output touches a critical flow.

</details>

<details open>
<summary><strong>4) Dialogues</strong></summary>

### Dialogue 1 - Daily AI Workflow

**Teammate:** Where does AI actually help you?

**You:**
It helps most with first drafts: test ideas, documentation, release notes, and code explanation. It saves me from starting from a blank page.

But I still check requirements, edge cases, existing patterns, and tests before using the output.

### Dialogue 2 - Privacy Boundary

**PM:** Can we paste customer logs into AI to summarize issues faster?

**You:**
Not raw logs. They may contain user data, tokens, or business-sensitive details. We should remove sensitive fields first or use an approved internal tool.

AI can help summarize, but privacy boundaries come before speed.

### Dialogue 3 - Review Accountability

**Tech Lead:** This code was generated by AI. Who owns it?

**You:**
The engineer who submits it owns it. AI can write the first draft, but the person merging it must understand the logic, verify edge cases, and explain why it fits the codebase.

If the reviewer is overloaded, we should reduce scope instead of increasing risky AI-generated changes.

### Dialogue 4 - Proving Quality

**Manager:** AI is making us faster. How do we know quality is not dropping?

**You:**
I would check the whole delivery cycle, not just first-draft speed. We should look at review rework, failed tests, escaped bugs, support tickets, and rollback rate.

If drafting is faster but QA and review take longer, the speed gain may not be real.

</details>

<details open>
<summary><strong>5) Context Flows</strong></summary>

### Flow 1 - Use Case + Review + Ownership

In my daily workflow, AI helps most with first drafts, test ideas, documentation, and code exploration. I treat the output as a starting point. Before using it, I check the requirement, edge cases, tests, and local patterns. Even if AI helped, I still own what I merge.

### Flow 2 - Privacy Boundary + Safer Alternative

I do not paste raw customer logs, API keys, private incidents, or sensitive business data into external AI tools. If AI can help, I remove sensitive fields or use an approved internal workflow. The trade-off is a little more preparation time, but it protects users and the company.

### Flow 3 - Speed + Quality Evidence

AI can make drafting faster, but speed alone is not enough. I would check whether defect rate, review rework, failed tests, or support tickets increased. If quality stayed stable or improved, the speed gain is real. If review and QA absorb the extra cost, the gain is fake.

### Flow 4 - Beginner vs Experienced Use

Beginners may use AI to get answers quickly, which can be helpful but risky. Experienced engineers use AI more like a thinking partner. They give better context, challenge the output, and know when to ignore it. The difference is not tool access; it is judgment and ownership.

</details>

<details open>
<summary><strong>6) Reading Text</strong></summary>

### Reading 1 - AI Is A Drafting Layer

AI tools are now part of normal engineering work. They can draft tests, explain unfamiliar code, summarize logs, write documentation, and suggest implementation options. Used well, they reduce blank-page time and help engineers move faster.

But a fast draft is still a draft. The engineer still needs to check requirements, edge cases, tests, security, accessibility, and local code patterns. The useful mindset is not "AI finished it." It is "AI helped me start."

### Reading 2 - Accountability Does Not Move To The Tool

AI does not remove engineering responsibility. It can hallucinate APIs, miss business rules, ignore edge cases, or produce code that does not match the local architecture. The faster the output appears, the more important verification becomes.

In a healthy workflow, accountability stays with the engineer who submits the change. AI can contribute, but a human must understand, verify, and sign off on the final result.

### Reading 3 - Privacy Boundaries Come Before Speed

AI can be useful for summarizing logs or incidents, but raw data can contain private user information, secrets, tokens, or business-sensitive details. That makes privacy boundaries non-negotiable.

The safer option is to remove sensitive fields, use synthetic examples, or use an approved internal tool. This may slow the workflow slightly, but it prevents a much bigger trust problem.

### Reading 4 - Review Capacity Is A Real Constraint

AI can increase output faster than the team can review it. If reviewers are overloaded, manual review becomes weaker and mistakes pass through more easily. That means AI adoption has to match review capacity.

Low-risk docs, test drafts, and small refactors can move faster. High-risk areas like auth, payment, privacy, and user-facing AI behavior need deeper review. The review process should follow risk, not hype.

### Reading 5 - Useful Patterns Noticed

- I use AI mainly for...
- I treat AI output as...
- Before using the output, I check...
- My privacy boundary is...
- The risk is not AI itself; the risk is...
- If the change touches payment or privacy...
- The speed gain is real only if...
- Even if AI writes the first draft...
- Long term, engineers will be valued for...

**Reusable discussion idea:** Good AI usage is not blind speed. It is faster drafting plus stronger verification, clear boundaries, and human judgment.

</details>

<details open>
<summary><strong>7) Questions & Practice Ideas</strong></summary>

1. Which AI tasks save you the most time in real work?
2. Where do you avoid AI completely, and why?
3. What should be in a practical verification checklist?
4. How do you keep accountability clear when AI contributes to a change?
5. What are the benefits and limits of AI-generated code in team workflows?
6. How does AI usage differ between beginner and experienced engineers?
7. When should quality be prioritized over speed in AI-assisted delivery?
8. How do you prove that AI improved speed without lowering quality?
9. What should a team do if reviewers are overloaded by AI-generated changes?
10. How would you summarize your AI usage rule in one or two clear sentences?

</details>
