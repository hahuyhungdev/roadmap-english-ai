import type { PracticeQuestionGroup } from "../../../types/practice";

export const session03QA: PracticeQuestionGroup[] = [
  {
    label: "Experience & Daily Work",
    questions: [
      {
        id: "s03-q1",
        text: "What's your current tech stack and why does your team use it?",
        group: "Experience & Daily Work",
        framework:
          "Don't just list technologies — explain the business reason behind each choice. Structure: technology → why we chose it → what problem it solves → any trade-off.",
        keyPoints: [
          "Name the core technologies (framework, state, build tool, etc.)",
          "The reason each was chosen (team familiarity, performance, ecosystem)",
          "A trade-off or limitation you're aware of",
          "Whether you'd make the same choice today",
        ],
        samples: [
          "We use React with TypeScript on the frontend, and Next.js for the pages that need SSR. We chose React because the team already knew it well and the ecosystem is large. TypeScript helps us catch errors early. The main trade-off is build complexity — Next.js adds some overhead for simple pages.",
          "Our frontend stack is React with TypeScript, Next.js for server-side rendering, and TailwindCSS for styling. We chose React mainly because of team familiarity and the size of the ecosystem — it's much easier to hire for and find solutions to problems. TypeScript was added about a year into the project when bugs from type mismatches became a recurring issue. Next.js was chosen specifically for SEO on our marketing pages and for the performance benefits of SSR on the main product pages. The trade-off is that Next.js has a steeper learning curve and some architectural constraints, but the performance and SEO improvements justified it for our use case.",
        ],
      },
      {
        id: "s03-q2",
        text: "Have you ever argued for or against a technology choice? What happened?",
        group: "Experience & Daily Work",
        framework:
          "Show that you have technical opinions and can defend them professionally. Structure: what was proposed → your position and reasoning → how the discussion went → final outcome and what you learned.",
        keyPoints: [
          "What technology was being considered",
          "Your specific concern or counter-proposal",
          "How you made your case (data, POC, risk analysis)",
          "The final decision and your reaction to it",
        ],
        samples: [
          "We were considering switching from REST to GraphQL. I pushed back because our team was small and GraphQL adds complexity that we didn't need yet. We didn't have queries complex enough to justify it. We stuck with REST and added a simple BFF layer instead, which solved the problem with less risk.",
          "We were evaluating whether to adopt a micro-frontend architecture for our product. A senior engineer was enthusiastic about it — better team independence, separate deployments. I raised concerns: our team was only six frontend engineers, the overhead of managing separate apps would be significant, and we'd introduce a whole new category of integration bugs. Instead of just saying no, I did a small analysis showing that our current pain points — slow CI, merge conflicts — could be addressed with better monorepo tooling and module boundaries. I presented this in our architecture review meeting. The team agreed to try the simpler approach first, and it worked well enough that we never needed micro-frontends. I learned that new architecture should solve real problems you have, not theoretical problems you might have.",
        ],
      },
      {
        id: "s03-q3",
        text: "How do you handle it when you need to use an unfamiliar technology quickly?",
        group: "Experience & Daily Work",
        framework:
          "Show a structured learning approach. Structure: quickly assess the scope → find the minimum needed to start → build something small → identify risks early. Don't fake confidence — show how you manage uncertainty.",
        keyPoints: [
          "Quickly read official docs and find real-world examples",
          "Build a small spike or proof of concept first",
          "Identify the riskiest unknowns and tackle them first",
          "Ask for help or pair with someone who knows it",
        ],
        samples: [
          "I start by reading the official docs and finding a few real-world examples. Then I build something very small — not production code — just to understand how it works. I try to identify the riskiest parts early so I'm not surprised near the deadline.",
          "Last year I had to integrate a new payment SDK that I'd never used before, and we had about three days before the feature deadline. My first step was to read the official docs and look for real-world GitHub examples to understand common patterns. Then I built a small spike — a throwaway prototype — to test the critical flows before writing any real code. This helped me discover early that the SDK had a quirk around error handling in async flows that wasn't documented clearly. I raised this with the team, we adjusted the timeline slightly, and avoided a nasty surprise near launch. The main principle I follow is: get the risky unknowns on the table as early as possible.",
        ],
      },
    ],
  },
  {
    label: "Challenges & Trade-offs",
    questions: [
      {
        id: "s03-q4",
        text: "Describe a time when a technical decision you made turned out to be wrong. What did you do?",
        group: "Challenges & Trade-offs",
        framework:
          "Show maturity and accountability. The best answer acknowledges the mistake clearly, explains the impact, describes how you fixed it, and shows what you learned — without excessive self-criticism.",
        keyPoints: [
          "The decision you made and your reasoning at the time",
          "How and when you discovered it was wrong",
          "The impact on the team or product",
          "How you fixed it and what you changed going forward",
        ],
        samples: [
          "I once decided to store some UI state in a global Redux store when it should have stayed local. It worked at first, but as the feature grew, it created bugs in unrelated parts of the UI. I refactored it after we found the root cause. The lesson: keep state as local as possible until you have a real reason to share it.",
          "Early in my current project, I made a decision to cache API responses aggressively on the frontend for performance. It worked well in testing. But in production, we started getting reports of users seeing stale data — sometimes hours-old information. The issue was that I didn't account for how often the data actually changed in real usage. I had to quickly add cache invalidation logic and add a TTL that was much shorter. The bigger lesson was that I should have consulted with the backend team first about update frequency before designing the caching strategy. Now I treat caching decisions as a shared frontend-backend decision, not something I decide unilaterally.",
        ],
      },
      {
        id: "s03-q5",
        text: "How do you evaluate whether to use a library or build something yourself?",
        group: "Challenges & Trade-offs",
        framework:
          "Show a structured decision framework. Key factors: complexity, maintenance burden, team ownership, long-term cost. Build-vs-buy is a recurring engineering trade-off question in interviews.",
        keyPoints: [
          "Is the problem truly unique to your business?",
          "Maintenance burden of the library vs custom code",
          "Team's ability to debug/extend the library",
          "Bundle size and performance impact",
        ],
        samples: [
          "I ask: is this a solved problem? If yes, use a library. If the library is well-maintained, has wide adoption, and doesn't add much bundle size, it's almost always better than building it yourself. I only build custom when the requirements are unique enough that a library would need heavy customization anyway.",
          "My default is to use a library for anything that's a solved, general problem — date formatting, form validation, rich text editing. The ecosystem is mature and the maintenance is handled by a community. I only lean toward building custom when one of these things is true: the library is significantly over-engineered for our needs, we'd need to heavily fork or patch it, or it introduces a bundle size cost that isn't justified. For example, we once replaced a 40kb animation library with a 20-line CSS utility because we only needed one specific animation. But for things like accessible dropdown menus or date pickers, I'd almost always reach for a well-tested library — the edge cases around accessibility and browser compatibility alone are not worth rebuilding.",
        ],
      },
    ],
  },
  {
    label: "Critical Thinking",
    questions: [
      {
        id: "s03-q6",
        text: "How do you explain a complex technical concept to a non-technical audience?",
        group: "Critical Thinking",
        framework:
          "Use the 'analogy → impact → question' structure. Start with an analogy the audience already understands, connect it to the business impact, then invite questions. Avoid jargon unless you define it immediately.",
        keyPoints: [
          "Find an analogy from everyday life",
          "Focus on the outcome, not the mechanism",
          "Check for understanding actively",
          "Be willing to adjust your explanation on the fly",
        ],
        samples: [
          "I use analogies. For example, explaining caching: 'Imagine a waiter who remembers your regular order. Instead of asking the kitchen every time, he remembers. That's what caching does — the app remembers frequent answers so it doesn't need to ask the server every time.' Then I connect it to the business outcome: faster pages, lower server costs.",
          "The most effective approach I've found is to start with an analogy that the person already understands, then connect it to the business outcome. For example, explaining microservices to a PM: 'Think of it like different departments in a company — HR, finance, sales. Each department works independently and has its own systems. Right now, our app is more like a single room where everyone works together — that's efficient for a small team, but as we grow it gets chaotic. Microservices means separating into departments. The business benefit is that one department can change without disrupting the others.' Then I check understanding: 'Does that match what you were imagining?' Inviting feedback prevents the conversation from being one-directional and helps me adjust if my analogy missed the mark.",
        ],
      },
      {
        id: "s03-q7",
        text: "What's the biggest trade-off between moving fast and maintaining code quality?",
        group: "Critical Thinking",
        framework:
          "Show nuance — it's not 'quality always wins' or 'speed always wins'. The answer depends on context: product stage, team size, risk area. Show that you can reason about when each matters.",
        keyPoints: [
          "Speed matters more in early-stage or experimental features",
          "Quality matters more in high-risk or high-traffic areas",
          "Technical debt is a loan with interest — be conscious of it",
          "The real risk: speed without awareness of the debt accumulating",
        ],
        samples: [
          "Moving fast gets things in front of users sooner, but messy code slows you down later. The trade-off is really about when you pay the cost. I think speed is fine for experimental features — if we're not sure users want it, why over-engineer it? But for core paths like payment or auth, I slow down and do it properly, because bugs there are very expensive.",
          "The trade-off isn't really speed vs quality in an absolute sense — it's about when you pay the cost and how high the interest is. Moving fast accumulates technical debt, which is like a short-term loan. That's fine if you're explicit about it and you plan to pay it back. The problem is when teams move fast without awareness of the debt building up — suddenly you can't ship anything without breaking something else. My rule of thumb: move fast in low-risk, experimental, or reversible areas. Slow down and do it properly for core product paths — authentication, payment, data integrity — because bugs there are extremely expensive to fix and damage user trust. And most importantly, name the debt when you create it. Write it in the ticket, flag it in the PR. That way it doesn't disappear into the codebase silently.",
        ],
      },
    ],
  },
  {
    label: "Future & Big Picture",
    questions: [
      {
        id: "s03-q8",
        text: "How do you think about long-term maintainability when choosing tools or patterns?",
        group: "Future & Big Picture",
        framework:
          "Show that you think beyond the current sprint. Consider: team knowledge, onboarding cost, library longevity, and the cost of change. Senior engineers think about the future team, not just themselves.",
        keyPoints: [
          "Will new team members understand this easily?",
          "Is this library/pattern likely to be supported in 3 years?",
          "How easy is it to change or reverse this decision?",
          "Documentation and onboarding cost",
        ],
        samples: [
          "I think about onboarding cost — will a new engineer understand this in a year? I also think about library longevity. If a library has low activity and few maintainers, I'm cautious about depending on it for core features. I prefer boring, well-established tools for the critical parts of the system.",
          "Maintainability comes down to three things for me: how easy is it to understand, how easy is it to change, and how safe is it to change? When I evaluate a tool or pattern, I try to imagine a new engineer joining the team in a year and reading this code cold. If it would take them a week to understand a pattern that could have been solved simply, that's a hidden cost the team pays repeatedly. I also check library health signals: last release date, open issue volume, whether the maintainers are actively engaged. I've been burned once by a dependency that got abandoned, and migrating away from it took a full sprint. For core functionality, I now strongly prefer established, widely-used tools with large communities, even if a newer alternative looks more impressive.",
        ],
      },
    ],
  },
];
