import type { PracticeQuestionGroup } from "../../../types/practice";

// Based on user's Obsidian notes: lesson 4 ver2 technical debt.md
export const session04QA: PracticeQuestionGroup[] = [
  {
    label: "Core Concepts",
    questions: [
      {
        id: "s04-q1",
        text: "What does technical debt look like in your project?",
        group: "Core Concepts",
        framework:
          "Give a concrete example from your work. Don't just define the term — describe what it looks like in practice: symptoms, where it lives, what it costs.",
        keyPoints: [
          "Specific area of your codebase with debt",
          "Visible symptoms (bugs keep returning, slow to change)",
          "How it affects the team's speed",
          "Whether it's documented or hidden",
        ],
        samples: [
          "Technical debt in our project looks like old components that have been patched many times. Every time we touch them, bugs come back in unexpected places. We spend extra time in QA for those areas, even for small changes.",
          "In our project, technical debt is most visible in some legacy modules that were written quickly during an early growth phase. The same module might have five different patterns for handling errors because different engineers added to it over time without a clear standard. Every time we need to change that module — even for a small feature — it takes significantly longer than expected, and we often find regressions in areas we didn't touch. We've estimated that maintaining these legacy areas takes about 20–25% of our sprint capacity. The debt is partially documented in our backlog with tech debt labels, but some of it is hidden in undocumented code that only one or two engineers fully understand.",
        ],
      },
      {
        id: "s04-q2",
        text: "How do you explain refactoring value to non-technical people?",
        group: "Core Concepts",
        framework:
          "Use a financial or physical analogy — debt, old car, leaky pipe. Focus on business cost: slower delivery, more bugs, higher maintenance. Show numbers if you have them.",
        keyPoints: [
          "Use an analogy they can relate to",
          "Translate into business cost (hours, bugs, delays)",
          "Show the future benefit (faster features, fewer incidents)",
          "Propose a concrete investment (one sprint, two weeks, etc.)",
        ],
        samples: [
          "I explain it like an old car that keeps breaking down. Fixing it now costs one week of work. But if we ignore it, we'll spend that time on repairs over the next three months — plus the stress of unexpected breakdowns during important releases.",
          "I compare it to a leaky pipe in an office building. You can ignore it for months, and it might seem fine day to day. But it's quietly increasing your water bill and slowly damaging the walls. One day it causes a flood that costs ten times more to repair. When I talk to the PM or business stakeholders, I bring real numbers: in the last quarter, we spent about 30% of our sprint time on bug fixes in one legacy module — that's roughly six engineer-days per month. If we spend two weeks refactoring it now, we estimate cutting that to under 10% and shipping new features 40% faster in that area. That framing usually gets approval.",
        ],
      },
      {
        id: "s04-q3",
        text: "When do you fix old code instead of building new features?",
        group: "Core Concepts",
        framework:
          "Show decision-making maturity. Key triggers: recurring bugs, team slowdown before a big feature, stability risk. Connect the decision to business impact, not just code cleanliness.",
        keyPoints: [
          "High bug frequency in a specific area",
          "Upcoming feature that depends on the problematic code",
          "Slowdown measurable in sprint velocity",
          "Risk of downtime or data issues",
        ],
        samples: [
          "We fix old code when it's causing repeated problems. If the same area keeps breaking every sprint, or if we're about to build something on top of it, we clean it first. We don't refactor for its own sake — there needs to be a business reason.",
          "My trigger for prioritizing cleanup over new features is when the debt is causing measurable pain: recurring production bugs in the same area, a module that's consistently slower to change than similar ones, or an upcoming large feature that depends on the problematic code. Before a major checkout redesign last year, we spent one sprint cleaning up the old payment state management. Without that cleanup, our estimate for the redesign was eight weeks. After the cleanup, it took five. The PM was initially reluctant to 'waste a sprint on cleanup,' but that two-week estimate reduction was easy to justify. We also fix immediately when there's a risk of downtime or data corruption — no business goal justifies that kind of risk.",
        ],
      },
      {
        id: "s04-q4",
        text: "How do you reduce regression risk during a refactor?",
        group: "Core Concepts",
        framework:
          "Show safety-first thinking. Key practices: test coverage first, small incremental changes, feature flags, code review, CI gates. The goal is to change the implementation without changing the behavior.",
        keyPoints: [
          "Write or improve tests before touching the code",
          "Break into small, independently deployable steps",
          "Use feature flags to control rollout",
          "Run full test suite after each small change",
        ],
        samples: [
          "Before refactoring, I make sure the existing behavior is covered by tests — or I write them if they don't exist. Then I break the refactor into very small steps and run the test suite after each one. I never change the external behavior and the internals at the same time.",
          "The most important rule I follow is: never change behavior and structure at the same time. First I write tests that lock down the current behavior — even if the code is messy. Then I refactor the internals while keeping those tests green. I also break the work into small, independently deployable PRs — nothing over 400 lines of diff. This way, if something breaks, it's easy to identify which change caused it. For higher-risk refactors, we use feature flags so we can ship the new code to 10% of users first and monitor for errors before full rollout. This approach has let us run significant refactors with zero production incidents.",
        ],
      },
    ],
  },
  {
    label: "High-Value Cases",
    questions: [
      {
        id: "s04-q5",
        text: "Share a case where cleanup work improved release quality.",
        group: "High-Value Cases",
        framework:
          "STAR: Situation (the problem), Task (your goal), Action (what you did), Result (measurable improvement). Make the before/after contrast clear.",
        keyPoints: [
          "The specific area and what was wrong",
          "What the cleanup involved",
          "Measurable improvement afterward",
          "Team or business impact",
        ],
        samples: [
          "Our user profile page had legacy code from many quick fixes. We were getting regression bugs after every release. We spent one sprint cleaning up the code and improving test coverage. After that, the next three releases had almost no regression in that area. The team felt much more confident.",
          "We had a checkout state management module that was causing about three regression bugs per release. In one sprint, we refactored it: extracted pure functions, eliminated duplicate state, and added comprehensive unit tests. The test coverage for that module went from 20% to 80%. In the following three months, we had zero regression bugs from that module. Release confidence improved noticeably — QA stopped flagging it as a high-risk area. The PM later used it as a case study for why technical debt work should be a regular part of sprint planning.",
        ],
      },
      {
        id: "s04-q6",
        text: "Tell me about a refactor that failed or took much longer than expected.",
        group: "High-Value Cases",
        framework:
          "Be honest about the failure — what went wrong, why, and most importantly, what you changed afterward. This shows maturity and learning ability.",
        keyPoints: [
          "What you underestimated (hidden dependencies, complexity)",
          "The impact on the team and timeline",
          "How you recovered or adapted",
          "The process change you made afterward",
        ],
        samples: [
          "We tried to refactor a large authentication module. We thought it would take two weeks but it took nearly five. We found many hidden dependencies we hadn't mapped. The lesson was to do a small proof of concept and dependency analysis before committing to a large refactor.",
          "We once planned to refactor our authentication module in two weeks. It ended up taking almost five weeks and blocked two other features from shipping. The core problem was that we didn't map out the full dependency graph before starting. We thought the module was isolated, but it was imported — often indirectly — in over 40 places across the codebase. Every time we thought we were done, a new dependency appeared. The team got fatigued and made some rushed decisions near the end that introduced small bugs. After this experience, I introduced a mandatory pre-refactor checklist: full dependency mapping, a proof of concept for the trickiest integration, a written breakdown of the work into phases, and sign-off from one other senior engineer on the scope estimate. We haven't had a runaway refactor since.",
        ],
      },
      {
        id: "s04-q7",
        text: "How does your team track and manage technical debt in the backlog?",
        group: "High-Value Cases",
        framework:
          "Describe a concrete system, not just intentions. Labels, regular reviews, a ratio rule, or a dedicated slot in sprint planning. Show that debt is visible, not just discussed vaguely.",
        keyPoints: [
          "How debt items are labeled and tracked",
          "Who can add debt items and how",
          "How often they're reviewed",
          "A rule or ratio for including them in sprints",
        ],
        samples: [
          "We use a 'Tech Debt' label in our backlog. Engineers can add items whenever they find a problem. In sprint planning, we try to include at least one cleanup ticket for every five feature tickets. It's not a strict rule, but it keeps debt visible and prevents it from being ignored.",
          "We have a structured approach. Every debt item in our backlog must have three things: a description of the problem, an estimate of the business cost (time wasted per month, bug frequency), and a proposed fix approach. This forces engineers to think about whether something is actually worth fixing. During bi-weekly backlog grooming, we review and reprioritize debt items alongside features. Our team follows a rough guideline: 15–20% of sprint capacity for debt work. That number has been flexible — during a major product push we dropped to 10%, and we consciously paid it back in a lighter sprint afterward. The key is making debt visible and reviewed regularly, not letting it pile up invisibly.",
        ],
      },
    ],
  },
  {
    label: "Practical Situations",
    questions: [
      {
        id: "s04-q8",
        text: "How do you convince the product team to accept a delay for refactoring work?",
        group: "Practical Situations",
        framework:
          "Show that you speak business language, not engineering language. Lead with cost and risk, offer a compromise, and back it with data. Never just say 'the code is messy.'",
        keyPoints: [
          "Quantify the current cost (time, bugs, incidents)",
          "Show the future savings",
          "Propose a compromise (partial refactor + one small feature)",
          "Frame it as risk reduction, not code quality",
        ],
        samples: [
          "I prepare simple data: number of bugs, hours spent on hotfixes, risk of downtime. Then I say: 'If we fix this now, we can deliver features faster for the next three months.' Usually I propose a compromise — we do part of the refactor and still deliver one small feature. Most of the time, they agree when they see the numbers.",
          "I never lead with 'the code is bad.' Instead I prepare three numbers: how many hours per sprint the team spends on bugs in this area, how many production incidents it caused last quarter, and the estimated risk multiplier if we build the next major feature on top of it without cleaning it first. Then I propose a phased approach: we take two sprints to clean it up, and I commit to a specific delivery date for the next feature. I usually also bring an alternative: 'We can skip the cleanup and still deliver by this date, but here's the likely risk.' Giving stakeholders a real choice with real trade-offs tends to work better than asking for permission to do tech work.",
        ],
      },
      {
        id: "s04-q9",
        text: "Is it okay to ship with known technical debt under deadline pressure?",
        group: "Practical Situations",
        framework:
          "Show nuance — not 'never' and not 'always fine'. The key variables are: which part of the system, how much debt, and whether there's a plan to fix it. Show accountability.",
        keyPoints: [
          "Context matters: which area of the system",
          "Low-risk areas vs critical paths (auth, payment)",
          "The importance of naming and documenting the debt",
          "Having a concrete plan to address it afterward",
        ],
        samples: [
          "Sometimes yes, if it's in a low-risk area and we have a clear plan to fix it. But if the debt is in critical paths like login or payment, it's dangerous. In those cases, I try to push back and explain the risk, even under deadline pressure.",
          "It depends entirely on where the debt lives. For a UI component that's only used in one non-critical flow, shipping with known debt under deadline pressure is often the right call — as long as it's documented in the backlog immediately, not just mentally noted. For anything touching authentication, payment, data integrity, or high-traffic APIs, I push back hard. The risk of a production incident in those areas is simply not worth the deadline pressure. I've learned to be explicit about the debt when shipping: I add a comment in the code, create a follow-up ticket with a target sprint, and mention it in the PR description so it doesn't get lost. Debt you can see is manageable. Debt that's invisible accumulates silently until it causes a real crisis.",
        ],
      },
    ],
  },
  {
    label: "Critical Thinking",
    questions: [
      {
        id: "s04-q10",
        text: "Can technical debt ever be a good thing?",
        group: "Critical Thinking",
        framework:
          "Show that you understand debt as a strategic tool, not just a failure. The analogy to financial debt is powerful: debt is fine if it's intentional, visible, and has a repayment plan.",
        keyPoints: [
          "Intentional debt to ship faster and test an idea",
          "The analogy to financial debt (short-term loan)",
          "The conditions that make it acceptable (low-risk, has a plan)",
          "The danger of unintentional or invisible debt",
        ],
        samples: [
          "Yes, intentional debt can be good. If we need to ship fast to test whether users want a feature, we can take shortcuts knowingly. It's like a short-term loan — it's only a problem if you forget to pay it back.",
          "Absolutely, if it's intentional and explicit. Technical debt is like financial debt — borrowing is rational when the return on investment justifies the interest. If we're building an MVP to validate a business idea, taking shortcuts is smart. Spending three months building the perfect architecture for a feature that users might not want is wasteful. The debt only becomes a problem when it's invisible, unacknowledged, or left without a repayment plan. The most dangerous debt is the kind nobody admits exists — hidden in an undocumented module that everyone's afraid to touch. Intentional, documented, prioritized debt is a normal part of engineering. It's the hidden kind that eventually causes crises.",
        ],
      },
      {
        id: "s04-q11",
        text: "What have you learned about managing technical debt over your career?",
        group: "Critical Thinking",
        framework:
          "This is a reflective question — show growth and genuine lessons, not just best practices you've read. Be specific about what changed in your behavior or thinking.",
        keyPoints: [
          "An early mistake or misconception about debt",
          "A specific lesson that changed how you work",
          "How you think about debt differently now vs early career",
          "What you'd tell a junior engineer about it",
        ],
        samples: [
          "Early in my career, I thought technical debt was always the result of laziness or bad decisions. Now I understand it's often a rational choice. The lesson I'd share is: make it visible. Debt that's acknowledged and tracked is manageable. Debt that's hidden is what eventually causes crises.",
          "The biggest shift in my thinking was realizing that technical debt isn't caused by bad engineers — it's caused by time pressure and evolving requirements, which are universal. Early in my career I thought the goal was to eliminate all debt. Now I think the goal is to manage it consciously: know where it is, know the cost, and have a plan. The habit I've built is to name it out loud: when I'm shipping something I know is imperfect, I say 'this is intentional debt, here's the ticket for the follow-up.' That simple practice has done more for team health than any refactoring sprint I've ever done, because it keeps the debt visible and prioritized instead of buried.",
        ],
      },
    ],
  },
];
