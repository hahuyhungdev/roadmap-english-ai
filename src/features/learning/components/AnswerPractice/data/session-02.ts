import type { PracticeQuestionGroup } from "../../../types/practice";

export const session02QA: PracticeQuestionGroup[] = [
  {
    label: "Experience & Daily Work",
    questions: [
      {
        id: "s02-q1",
        text: "How would you describe your system architecture to someone non-technical?",
        group: "Experience & Daily Work",
        framework:
          "Use an analogy first, then break the system into 2–3 plain-language parts. End with how your piece fits in. Avoid jargon — treat it like explaining to a friend who doesn't code.",
        keyPoints: [
          "Use a simple analogy (restaurant, post office, etc.)",
          "Frontend = what users see and interact with",
          "Backend = business logic and data",
          "Your ownership: which part do you own?",
        ],
        samples: [
          "I usually compare it to a restaurant. The frontend is the dining room — what users see and interact with. The backend is the kitchen — it handles all the logic and data. My job is mainly on the dining room side, making sure users can order and pay without problems.",
          "I think of our system like a chain of post offices. The user sends a request — like placing an order — and our frontend receives it and displays it nicely. Then it gets passed to the backend, which handles the actual business logic like checking stock and processing payment. The backend returns a result, and the frontend shows it to the user. I own the frontend layer — specifically the checkout and account settings area — and I work closely with backend engineers to make sure the handoff between these layers is clean and reliable.",
        ],
      },
      {
        id: "s02-q2",
        text: "How do you communicate with backend engineers when building a new feature?",
        group: "Experience & Daily Work",
        framework:
          "Show that you align early, not just when you're blocked. Structure: upfront alignment → API contract → ongoing sync → handling changes. This shows cross-team maturity.",
        keyPoints: [
          "Align on API contract before building",
          "Use shared tools (Swagger, Notion, Postman)",
          "Sync regularly, not just at the end",
          "Handle API changes gracefully",
        ],
        samples: [
          "Before I start building, I sit down with the backend engineer to agree on the API shape — what endpoints we need, what the request and response look like. We write it down in a shared doc. That way, I can start the frontend with mock data while they build the real API.",
          "My process always starts before any code is written. I schedule a short kickoff with the backend engineer to align on the API contract — the endpoints, request bodies, response shapes, and error codes. We document this in a shared Notion page or use Swagger if the team has it set up. Then I build the frontend using mock data so we can work in parallel. As the backend API develops, I check in every few days to catch any changes early. If the API shape changes mid-development, we update the contract doc together so QA doesn't get surprised. This approach has saved us a lot of back-and-forth during QA and reduced integration bugs significantly.",
        ],
      },
      {
        id: "s02-q3",
        text: "Tell me about a time when a miscommunication with another team caused a problem.",
        group: "Experience & Daily Work",
        framework:
          "STAR format: set the scene, describe the misalignment, what happened, and — most importantly — what you changed afterward. Show accountability and a process improvement.",
        keyPoints: [
          "The root cause of the miscommunication",
          "The impact on delivery or quality",
          "Your role in the situation",
          "The concrete change you made afterward",
        ],
        samples: [
          "Once, frontend and backend had different understandings of how an error code should be handled. Frontend showed a generic error message, but the API was sending specific error codes that could have been much more helpful. QA caught it late. After that, we started documenting error handling in our API contracts.",
          "We once had a significant integration issue near release day. Backend had changed a field name in the API response — from `user_id` to `userId` — as part of a refactor. It was a small change, but no one notified the frontend team. The mismatch only appeared when we ran integration tests two days before the deadline. We had to rush to fix it and push the release by one day. After that incident, I proposed a simple rule: any API contract change must be announced in our shared Slack channel with a 48-hour notice. We also added a contract validation step in our CI pipeline. No similar issue has happened since.",
        ],
      },
    ],
  },
  {
    label: "Challenges & Trade-offs",
    questions: [
      {
        id: "s02-q4",
        text: "How do you handle a situation where stakeholders have conflicting priorities?",
        group: "Challenges & Trade-offs",
        framework:
          "Show that you can navigate conflict professionally. Structure: understand each side → find the shared goal → propose a middle ground → escalate if needed. Don't take sides.",
        keyPoints: [
          "Listen to both sides fully first",
          "Identify the shared business goal",
          "Propose a phased or partial solution",
          "Know when to escalate to a decision-maker",
        ],
        samples: [
          "I try to understand both sides first. Usually there's a shared goal underneath — like shipping on time or protecting quality. I look for a compromise, like splitting the work into phases. If we can't agree, I escalate to the PM or team lead to make the call.",
          "I had a situation where the design team wanted a complete visual redesign of a component, but the PM needed the feature shipped within two weeks — and both were pressing hard. Instead of choosing a side, I mapped out what was actually required for the two-week deadline versus what could come later. I proposed we ship with the current design but with the new behavior — and do the visual redesign in the next sprint after release. I showed both stakeholders the timeline impact of each option. The PM approved, design accepted the trade-off because they knew the redesign was scheduled, and we shipped on time. The key was making the trade-off visible to everyone instead of hiding it.",
        ],
      },
      {
        id: "s02-q5",
        text: "Describe your approach when you don't understand a requirement clearly.",
        group: "Challenges & Trade-offs",
        framework:
          "Show proactivity, not passivity. Structure: identify what's unclear → ask specific questions → clarify edge cases upfront → document the decision. Never just build what you assumed.",
        keyPoints: [
          "Ask specific, targeted questions (not vague 'I don't understand')",
          "Identify edge cases proactively",
          "Write down the agreed interpretation",
          "Check alignment before building, not after",
        ],
        samples: [
          "I ask specific questions rather than general ones. Instead of 'I don't understand', I say 'When the user does X, should Y happen or Z?' I try to identify edge cases upfront. Then I write down the agreed answers so there's no ambiguity later.",
          "When a requirement is unclear, I start by identifying the exact points of ambiguity rather than asking broadly. I usually prepare 3–5 specific scenario questions — like 'If the user has no payment method saved, should we show an empty state or redirect them to add one?' I bring these to a short sync with the PM or designer. Once we agree, I document the decisions in the ticket or Confluence page. This protects both me and the PM — if scope changes later, we have a clear record of what was originally agreed. I've learned that ambiguous requirements that are not clarified upfront almost always come back as bugs or rework during QA.",
        ],
      },
    ],
  },
  {
    label: "Critical Thinking",
    questions: [
      {
        id: "s02-q6",
        text: "How do you keep your team aligned when working across multiple squads or teams?",
        group: "Critical Thinking",
        framework:
          "Show that you think about information flow, not just your own work. Describe: documentation, async communication, shared agreements, and escalation paths.",
        keyPoints: [
          "Shared documentation everyone can access",
          "Regular but lightweight sync points",
          "Clear ownership boundaries",
          "A way to handle changes that affect other teams",
        ],
        samples: [
          "We use a shared doc for each cross-team feature with the API contract, key decisions, and open questions. We have a short weekly sync across squads to catch issues early. And we have a rule that any breaking change needs to be flagged 48 hours in advance.",
          "In my experience, misalignment across teams usually comes from information not being shared in the right format or at the right time. What works for us is having a living document per cross-team feature — API contracts, key decisions, edge cases, and open questions all in one place. We also do a short 20-minute weekly sync with leads from each squad. The most important rule we have is: any breaking change to a shared API or contract must be announced in a dedicated Slack channel at least 48 hours before merging. It sounds simple, but it prevents the most painful integration surprises.",
        ],
      },
      {
        id: "s02-q7",
        text: "What makes a good technical decision vs. a bad one?",
        group: "Critical Thinking",
        framework:
          "Show that good decisions consider trade-offs, context, and reversibility — not just what's technically elegant. A good decision is also documented and communicated.",
        keyPoints: [
          "Considers the specific context (team size, timeline, complexity)",
          "Weighs trade-offs explicitly",
          "Is reversible if wrong, or has a clear rollback plan",
          "Is documented so others understand the reasoning",
        ],
        samples: [
          "A good decision considers the context — team size, timeline, and risk. A bad decision is usually one that optimizes for the wrong thing, like picking a complex solution for a simple problem. Good decisions also get documented so the team understands the reasoning later.",
          "I think a good technical decision is one that considers trade-offs explicitly and fits the actual context. For example, choosing a proven library over a custom solution might look less impressive, but if it ships faster and the team can maintain it easily, it's the better choice. A bad decision is often one that's technically elegant but ignores practical constraints — like choosing a bleeding-edge framework for a small team that doesn't have time to learn it. I also think documentation is a key signal: if you can't write down why you made a decision, you probably didn't think through it carefully enough. And ideally, good decisions are at least partially reversible — if they turn out to be wrong, you can course-correct without massive rework.",
        ],
      },
    ],
  },
  {
    label: "Future & Big Picture",
    questions: [
      {
        id: "s02-q8",
        text: "How do you think the relationship between engineers and stakeholders should work?",
        group: "Future & Big Picture",
        framework:
          "This is a values question. Show that you see it as a partnership, not a service relationship. Engineers should contribute to decisions, not just execute orders.",
        keyPoints: [
          "Partnership, not just order-taker vs executor",
          "Engineers should flag risks proactively",
          "Mutual respect for each other's domain expertise",
          "Shared accountability for outcomes",
        ],
        samples: [
          "I think it should be a partnership. Engineers aren't just code executors — they understand the technical trade-offs and risks better than anyone. Good stakeholder relationships mean engineers flag risks early, and stakeholders trust the team's input. Both sides own the outcome together.",
          "The healthiest relationships I've seen between engineers and stakeholders work like a partnership where each side brings their expertise to the table. Stakeholders understand user needs, business goals, and market pressure. Engineers understand technical risk, feasibility, and long-term maintainability. When both sides respect that boundary, you get better decisions. The problems happen when engineers are treated as order-takers — 'just build what we said' — because then risk flags get ignored and technical debt accumulates silently. And the reverse problem is when engineers ignore business context and over-engineer. I try to be the kind of engineer who speaks up early, backs opinions with data, and stays focused on shared outcomes rather than just my part of the system.",
        ],
      },
    ],
  },
];
