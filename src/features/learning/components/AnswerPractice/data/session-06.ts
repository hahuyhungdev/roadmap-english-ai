import type { PracticeQuestionGroup } from "../../../types/practice";

// Based on user's Obsidian notes: lesson 6.md (Documentation as a Product)
export const session06QA: PracticeQuestionGroup[] = [
  {
    label: "Core Questions",
    questions: [
      {
        id: "s06-q1",
        text: "Why do you treat documentation as part of delivery, not extra work?",
        group: "Core Questions",
        framework:
          "Start with a mindset shift, then support it with a real example. The core argument: skipping docs creates more work later — repeated questions, rework, QA confusion. Show the ROI.",
        keyPoints: [
          "Documentation during development costs less than after",
          "Skipping it causes repeated questions and rework",
          "It speeds up QA and reduces back-and-forth",
          "A concrete example where writing docs saved time",
        ],
        samples: [
          "I used to think documentation was extra work, especially under deadlines. But I saw that skipping it actually creates more work later. Questions from QA and backend, rework, misunderstandings. Now I write short docs during development — API examples and edge cases — and it saves time for everyone.",
          "The mindset shift happened when I saw how much time was lost to repeated questions. On one project, I tracked how often QA and backend asked me the same questions about a feature I'd shipped three weeks earlier — it was about 40% of my Slack messages in a given week. When I started writing a simple document per feature — API behavior, edge cases, error states — those questions dropped dramatically. The ROI became obvious: one hour of writing during development saved five hours of back-and-forth after. Now I treat a feature as not done until its key behaviors are documented. It's part of the definition of done, not a separate task.",
        ],
      },
      {
        id: "s06-q2",
        text: "What documentation problems happen most often in real projects?",
        group: "Core Questions",
        framework:
          "Give 2–3 concrete, real problems — not abstract ones. Show you've experienced this firsthand. The most common: outdated docs, missing edge cases, team misalignment on behavior.",
        keyPoints: [
          "Mismatch between design, frontend, backend, and QA understanding",
          "Outdated docs after code changes",
          "Missing edge cases (empty states, error handling)",
          "Documentation that describes structure but not behavior in context",
        ],
        samples: [
          "The most common problem is mismatch between teams. Design, frontend, backend, and QA don't always understand the feature the same way. Another issue is outdated docs — we update the code but forget to update the doc. QA then follows old information and reports false bugs.",
          "I've seen the same problems repeatedly. First, mismatch at handoff: each team builds a mental model of the feature based on different sources — design shows the success flow, backend builds the API based on their interpretation, QA tests against the original brief. Without a single document that all three reference, you get inconsistency that only surfaces during QA — the most expensive place to find it. Second, documentation rot: the first version gets written, the code evolves through three PRs, and the doc never gets updated. Now QA is testing against a description that's three iterations behind. Third, missing the non-happy path: most docs show what happens when everything works. Nobody documents what happens when the API returns a partial success, or what the UI shows for an empty state. Those cases cause bugs almost every time.",
        ],
      },
      {
        id: "s06-q3",
        text: "Have you experienced a mismatch between design, API, and QA? What happened?",
        group: "Core Questions",
        framework:
          "STAR: describe the specific mismatch, the downstream impact, and what you changed afterward. Be concrete — what specifically was different between what design showed and what the API returned?",
        keyPoints: [
          "What the design showed vs what the API actually returned",
          "How far into the process the mismatch was discovered",
          "The cost: rework, delay, extra QA cycles",
          "The specific change you made to prevent it",
        ],
        samples: [
          "Once, the design showed a simple success flow, but the API returned multiple states — partial success, special errors. Frontend handled it one way, QA tested based on the original design. That caused confusion and back-and-forth. After that, I started documenting UI states clearly and aligning early with backend and QA.",
          "On a checkout flow project, the design only showed the happy path — user fills in details, pays, success screen. The API had five distinct response types: success, partial success (payment accepted but some items out of stock), payment failed, session expired, and a specific fraud-flag state. Frontend handled three of these; QA expected all five to have distinct UI states based on a requirements doc that nobody had updated after the API was finalized. We found this during the second round of QA, two days before the planned release. It cost us four days of rework and pushed the release. After that, I started a practice of writing a UI state inventory for any feature with complex API interactions — listing every response code and what the user sees for each one. QA now reviews this before writing test cases.",
        ],
      },
    ],
  },
  {
    label: "Practical Approach",
    questions: [
      {
        id: "s06-q4",
        text: "How do you avoid ambiguity in your documentation?",
        group: "Practical Approach",
        framework:
          "Show concrete techniques: examples over descriptions, listing all states explicitly, early alignment with backend and QA. The goal is documentation that leaves no room for interpretation.",
        keyPoints: [
          "Use examples (sample API requests/responses) not just descriptions",
          "List all UI states: loading, empty, error, partial success",
          "Confirm with backend and QA before writing",
          "Use screenshots or diagrams for complex flows",
        ],
        samples: [
          "I use examples instead of just descriptions. For example, I include sample API requests and responses. I also always write down key states: loading, empty, and error — because these are easy to miss. And I confirm early with backend and QA to make sure we understand the same thing.",
          "The most effective technique is replacing descriptions with examples. Instead of writing 'the error message should be user-friendly,' I write 'when the API returns a 422, display: Your session has expired. Please refresh and try again.' No ambiguity. I also create a state table for every feature: every possible UI state in one column, what triggers it in the second, what the user sees in the third. If I can't fill out every row confidently, that's a signal I need to sync with backend before building. Another practice: I share the first draft with both backend and QA before finalizing it. If they read it and have questions, those questions reveal ambiguities I need to fix.",
        ],
      },
      {
        id: "s06-q5",
        text: "Have you ever missed something important in documentation? What did you do?",
        group: "Practical Approach",
        framework:
          "Be honest about the gap. Show what the impact was, how you found it, and the specific process change you made. Demonstrate accountability, not just awareness.",
        keyPoints: [
          "The specific gap (missing error case, wrong state documented)",
          "How it was discovered and at what cost",
          "Your immediate response",
          "The prevention mechanism you added afterward",
        ],
        samples: [
          "Once I missed documenting an error case from the API. The main flow worked, but when the API returned a specific error, frontend and QA handled it differently. We had to fix it later, which cost extra time. After that, I updated the doc and now I always double-check important API error codes.",
          "I once shipped a feature without documenting the behavior when a third-party payment provider returns a timeout error. It wasn't in any requirement, and I assumed it would just show a generic error. In production, the timeout caused a frontend crash because I hadn't handled that specific response shape. QA hadn't tested it because it wasn't in any test spec. After the hotfix, I ran a retrospective with the team. We created a checklist for any feature that involves third-party APIs: list all their documented error codes, decide on the UI behavior for each, and get QA sign-off on the spec before building. It added about 30 minutes per feature but eliminated this whole class of bug.",
        ],
      },
      {
        id: "s06-q6",
        text: "How often do you write and update documentation?",
        group: "Practical Approach",
        framework:
          "Show that it's integrated into your workflow, not a separate task. Describe when you write (during dev, not after), when you update (immediately on change), and a lightweight review habit.",
        keyPoints: [
          "Write during development, not after shipping",
          "Update immediately when code changes",
          "Sprint-end review to catch outdated sections",
          "Keep it lightweight — useful, not exhaustive",
        ],
        samples: [
          "I don't treat documentation as a separate task. I write it during development when I understand the feature best. When something changes, I update immediately. At the end of each sprint, I do a quick review to fix outdated parts. This keeps docs useful without taking much extra time.",
          "My rule is to write documentation at the point of maximum understanding — which is during development, not after. That's when edge cases are fresh in my mind, when I've just had the sync with backend, when the trade-offs are still clear. Writing docs after shipping is always harder and less accurate. For updates: I have a discipline of updating the doc in the same PR where I change the behavior. If the PR touches the API contract or the UI state, the doc update is part of the PR checklist. At the end of each sprint, I do a five-minute scan of docs from that sprint to check for anything that drifted. It sounds like overhead, but in practice it's three or four small edits that prevent a lot of confusion later.",
        ],
      },
    ],
  },
  {
    label: "Critical Thinking",
    questions: [
      {
        id: "s06-q7",
        text: "How does documentation quality affect team onboarding and knowledge sharing?",
        group: "Critical Thinking",
        framework:
          "Make the connection between docs and team velocity. Good docs reduce onboarding time, reduce interruptions to senior engineers, and preserve institutional knowledge. Give a concrete example.",
        keyPoints: [
          "New engineers can onboard faster with good setup docs",
          "Senior engineers get fewer repeated questions",
          "Team knowledge isn't lost when someone leaves",
          "A specific example where docs helped someone get started",
        ],
        samples: [
          "Good docs help new developers start faster. They can follow setup steps, check API examples, and understand the flow without asking too many questions. In one project, we improved the setup guide and onboarding time dropped noticeably. It also helped the team stay consistent and avoid repeating the same mistakes.",
          "On one project, we had no documentation when a senior engineer left. The next three months were painful — half my Slack messages were from the new engineer asking questions about how things worked, questions I couldn't fully answer because even I didn't know all the edge cases. After that experience, we invested two weeks in documenting the system: setup guide, key architectural decisions, API behavior for each module, and a decision log explaining why we made certain choices. The next engineer who joined got up to speed in a week instead of a month. The investment paid back within the first sprint. Documentation is essentially a knowledge transfer that happens asynchronously and scales infinitely.",
        ],
      },
      {
        id: "s06-q8",
        text: "If API docs are updated but still misunderstood, what is usually missing?",
        group: "Critical Thinking",
        framework:
          "Show that good documentation requires more than just updating the spec. What's usually missing: real usage context, the 'why' behind behavior, non-happy-path examples, and human review of the doc itself.",
        keyPoints: [
          "Structure without context — shows what but not why or when",
          "Real usage examples in a real user flow",
          "Edge cases and error scenarios",
          "Nobody reviewed the doc from the reader's perspective",
        ],
        samples: [
          "Usually what's missing is context and real usage. API docs often show structure, but not how the API is used in a real user flow. Edge cases like empty data or special errors may not be clear. And sometimes the doc is written from the writer's perspective, not the reader's.",
          "When API docs are technically accurate but still cause misunderstandings, it's usually because they describe the structure without the behavior in context. You see: 'field X is optional, type string.' You don't see: 'if field X is absent, the frontend should show the fallback state Y, not an error.' The second version requires the doc author to think from the reader's perspective — not just 'what is this?' but 'how does this change what I need to build?' Another common gap: API docs written by backend engineers often lack the frontend-relevant context — like 'this endpoint takes 2–3 seconds on first load, so the UI needs a meaningful loading state.' That operational context is often more useful than the field list. The fix is to have frontend engineers review API docs before finalizing them.",
        ],
      },
      {
        id: "s06-q9",
        text: "What's the most important type of documentation for a frontend engineer?",
        group: "Critical Thinking",
        framework:
          "This is an opinion question — have a clear view. The best argument: UI state documentation is the most frontend-specific and most often missing. Support with reasoning.",
        keyPoints: [
          "UI state documentation (loading, empty, error, partial states)",
          "API error handling expectations (not just success cases)",
          "Component API docs for shared design system components",
          "Decision logs for non-obvious choices",
        ],
        samples: [
          "For me, it's UI state documentation. Every loading state, empty state, error state, and edge case. These are the things that fall between design and backend — nobody owns them explicitly, so they often get skipped. When they're missing, QA finds gaps, backend makes assumptions, and users see broken experiences.",
          "The most valuable documentation for a frontend engineer is UI state documentation — a complete inventory of every state a component or page can be in, and what triggers each state. This is the piece that most often falls through the cracks. Backend documents the API structure. Design documents the happy path. But nobody documents what the UI shows when the API returns a 204 with no body, or when the user has no items in their cart, or when a third-party service is down. These in-between states are where bugs live. My second most important type is decision documentation: a brief note in a PR or ticket explaining why a non-obvious choice was made. This is invaluable six months later when someone asks 'why do we do it this weird way?'",
        ],
      },
    ],
  },
];
