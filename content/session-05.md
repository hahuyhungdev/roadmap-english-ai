---
sessionNumber: 5
title: AI Tools and the Changing Developer Role
topic: Daily AI Usage, Limits, and Practical Trade-offs
phase: PHASE 1 - TECH & BUSINESS
level: B1-B2
description: Explain how you use AI tools in daily engineering work, where they help, and where you still rely on human checks.
---

# Session 5: AI Tools and the Changing Developer Role

**Level:** B1-B2  
**Focus:** Speak clearly about practical AI usage in software teams, including speed gains, risks, and clear boundaries.

<details open>
<summary><strong>1) Vocabulary </strong></summary>

- **code assistant** /koʊd əˈsɪstənt/ (n) - AI tool that suggests code  
  _Example 1:_ I use a code assistant to scaffold React form components.  
  _Example 2:_ During release week, code assistant helped us make a safer decision.  
  _Example 3:_ After QA feedback, code assistant was added to our rollout checklist.

- **boilerplate** /ˈbɔɪlərˌpleɪt/ (n) - repeated code patterns  
  _Example 1:_ AI is helpful for boilerplate, but I review every line before commit.  
  _Example 2:_ In a recent sprint, boilerplate became a key point in our planning discussion.  
  _Example 3:_ This quarter, boilerplate helped us reduce repeated support requests.

- **unit test** /ˈjuːnɪt tɛst/ (n) - small test for one function or component  
  _Example 1:_ We ask AI for unit test ideas, then adjust edge cases manually.  
  _Example 2:_ For one customer case, unit test changed how we prioritized tasks.  
  _Example 3:_ In one incident review, unit test explained why the bug happened.

- **debugging** /diˈbʌɡɪŋ/ (n) - finding and fixing problems  
  _Example 1:_ AI helps me read logs faster during debugging.  
  _Example 2:_ For one customer case, debugging changed how we prioritized tasks.  
  _Example 3:_ After QA feedback, debugging was added to our rollout checklist.

- **prompt** /prɑːmpt/ (n) - instruction given to an AI tool  
  _Example 1:_ A clear prompt gives better output and fewer random suggestions.  
  _Example 2:_ For one customer case, prompt changed how we prioritized tasks.  
  _Example 3:_ This quarter, prompt helped us reduce repeated support requests.

- **hallucination** /həˌluːsəˈneɪʃən/ (n) - incorrect AI output that sounds confident  
  _Example 1:_ We saw hallucination in API usage, so we verified docs first.  
  _Example 2:_ In a recent sprint, hallucination became a key point in our planning discussion.  
  _Example 3:_ We mentioned hallucination in stand-up when blockers appeared.

- **security-critical** /sɪˈkjʊrəti ˈkrɪtɪkəl/ (adj) - related to sensitive security logic  
  _Example 1:_ We never paste security-critical code into external tools.  
  _Example 2:_ From a business view, this risk was clearly security-critical.  
  _Example 3:_ Later, stakeholders said the safer option was less security-critical.

- **compliance** /kəmˈplaɪəns/ (n) - following legal or company rules  
  _Example 1:_ Compliance rules limit what data we can share with AI tools.  
  _Example 2:_ In a recent sprint, compliance became a key point in our planning discussion.  
  _Example 3:_ After QA feedback, compliance was added to our rollout checklist.

- **review** /rɪˈvjuː/ (n/v) - checking code quality and correctness  
  _Example 1:_ Human review is still mandatory before merge.  
  _Example 2:_ In a recent sprint, review became a key point in our planning discussion.  
  _Example 3:_ We mentioned review in stand-up when blockers appeared.

- **regression** /rɪˈɡrɛʃən/ (n) - new change breaks old behavior  
  _Example 1:_ AI suggestions can cause regression if we skip tests.  
  _Example 2:_ For one customer case, regression changed how we prioritized tasks.  
  _Example 3:_ After QA feedback, regression was added to our rollout checklist.

**Additional useful terms:**
- **context window** /ˈkɑːntɛkst ˈwɪndoʊ/ (n) - amount of text AI can process at once
- **autocomplete** /ˌɔːtoʊkəmˈpliːt/ (n) - automatic code suggestions
- **false positive** /ˌfɔːls ˈpɑːzətɪv/ (n) - warning that looks real but is not
- **policy** /ˈpɑːləsi/ (n) - internal rule for tool usage
- **fallback plan** /ˈfɔːlbæk plæn/ (n) - backup process when AI output is wrong

</details>

<details open>
<summary><strong>2) Grammar & Useful Patterns (B2)</strong></summary>

- **Present Simple for routine use**  
  I use AI tools for first drafts and repetitive coding tasks.

- **Present Perfect for change over time**  
  AI tools have reduced time spent on basic setup.

- **Contrast language (but / however)**  
  AI is fast, but I never trust output without checks.

- **Rules and boundaries (must / should not)**  
  We must review AI-generated code before deployment.

- **Conditionals for risk**  
  If we copy code blindly, we can introduce security bugs.

- **Past case explanation**  
  Last sprint, AI helped us generate tests, but we rewrote many assertions.

### Useful Sentence Patterns
- I use AI mostly for..., not for...
- It saves time, but...
- A real example is...
- We still rely on human review because...
- Our team policy says...
- The best use case for me is...

</details>

<details open>
<summary><strong>3) Collocations, Chunking & Phrasal Verbs</strong></summary>

### Strong Collocations
- generate test drafts
- speed up debugging
- review AI output
- catch logic errors
- avoid blind copy-paste
- protect sensitive code
- follow compliance rules
- validate against documentation
- reduce repetitive work
- improve developer workflow
- prevent security regressions
- set clear usage boundaries

**Examples (real work):**
- In one release week, we had to generate test drafts while still trying to speed up debugging.
- In retro, we agreed to review AI output earlier so the same issue would not repeat.

### Useful Chunking & Sentence Starters
- In my daily workflow, I use AI to...
- A good use case is...
- One bad use case is...
- We got faster results when...
- We still had to check...
- The trade-off is speed versus...
- To stay safe, we...
- In production code, I always...

**Examples (using starters):**
- "A real issue we faced was repeated timeout errors, so we paused rollout and checked logs first."
- "To reduce risk, we shipped to 10% of users first, then expanded after QA sign-off."

### Useful Phrasal Verbs
- **speed up** -> AI can speed up test setup.
- **check over** -> I always check over generated code.
- **leave out** -> Sometimes AI leaves out edge cases.
- **lock down** -> We lock down access for sensitive repositories.
- **fall back** -> If output is weak, we fall back to manual coding.

</details>

<details open>
<summary><strong>4) Typical Dialogues</strong></summary>

### Dialogue 1 - Daily Use

**Interviewer:** How do you use AI tools at work?

**You:**  
I use them for repetitive tasks like test templates, simple refactor suggestions, and writing commit message drafts. In one sprint, this saved me about two to three hours.

It helps speed, but I still verify logic and run tests before merge.

### Dialogue 2 - Clear Boundaries

**Interviewer:** What do you never use AI for?

**You:**  
I do not use AI for security-critical code or compliance-sensitive business logic. We also avoid sharing private customer data in prompts.

AI is useful for support tasks, but ownership stays with the engineer.

### Dialogue 3 - Trade-off Case

**Interviewer:** Has AI ever caused problems in your team?

**You:**  
Yes. We accepted a generated helper function too quickly, and it caused a regression in edge cases. We found it in QA and fixed it before release.

So now we move faster with AI, but quality checks are stricter.

</details>

<details open>
<summary><strong>5) Reading Text</strong></summary>

AI tools are now part of many developer workflows. They help with boilerplate, test ideas, and quick debugging support. This can reduce routine work and let engineers focus on harder tasks.

But teams still need clear rules. AI output can be wrong, outdated, or insecure. That is why strong teams treat AI output as a draft, not as final code. Review, testing, and documentation checks are still required.

In interviews, practical answers are best: explain where AI saves time, where it creates risk, and how your team controls that risk.

</details>

<details open>
<summary><strong>6) List of Questions + Ideas</strong></summary>

### Core Questions (must-practice)
1. How do you use AI tools in your daily workflow?
2. Which tasks are good for AI support and which are not?
3. How do you prevent bugs from AI-generated code?
4. What team rule do you follow when using AI tools?

### High-Value Case Questions
5. Share a case where AI saved real engineering time.
6. Tell me about a bug caused by AI output and what changed after that.
7. Describe how AI changed your role in code review.

### Critical Discussion Questions
8. Does AI make junior developers learn slower?
9. Should teams allow AI in all parts of the codebase?
10. Who is responsible when AI-generated code fails in production?

**Tips for speaking practice:**
- Mention one real tool and one real task.
- Include one trade-off in each answer.
- Keep your language operational, not abstract.

---

</details>
