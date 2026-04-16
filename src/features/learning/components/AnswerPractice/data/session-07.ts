import type { PracticeQuestionGroup } from "../../../types/practice";

export const session07QA: PracticeQuestionGroup[] = [
  {
    label: "Setting the Scene",
    questions: [
      {
        id: "s07-q1",
        text: "Can you walk me through one project end to end — what was the problem, and why did it matter?",
        group: "Setting the Scene",
        framework:
          "Start with the business problem, not the technical solution. Structure: business context → who was affected → why it was urgent → what the metric looked like before. Hook the interviewer with the stakes first.",
        keyPoints: [
          "The business problem in plain language",
          "Who was affected (users, teams, revenue)",
          "Why solving it mattered and when",
          "The measurable state before you worked on it",
        ],
        samples: [
          "We had a checkout flow where about 25% of users dropped off at the payment step. This was directly hurting revenue. The issue had been known for a while, but no team had owned it end to end. I took ownership of the full project — from diagnosing the problem to shipping and measuring the result.",
          "The project I'm most proud of is a complete rebuild of our checkout payment step. Context: our analytics showed that 28% of users who reached the payment screen didn't complete the purchase — significantly higher than the industry average of 15–18%. Every percentage point of drop-off meant real lost revenue at our transaction volume. The problem had multiple causes: confusing form layout, poor error messages that didn't tell users what went wrong, and a payment failure that sometimes happened silently. No single team had ever owned the full experience end to end. The PM asked me to take full ownership of diagnosing, designing the fix, building it, and measuring the outcome.",
        ],
      },
      {
        id: "s07-q2",
        text: "How did you design your approach to the project?",
        group: "Setting the Scene",
        framework:
          "Show that you started with understanding, not building. Structure: research phase → identified root causes → proposed solution → validated approach before committing. Don't jump straight to implementation.",
        keyPoints: [
          "Started with research (data, user interviews, error logs)",
          "Identified the root causes, not just symptoms",
          "Proposed and got feedback on the approach before building",
          "Planned in phases to reduce risk",
        ],
        samples: [
          "I started by analyzing error logs and session recordings to understand where users were failing. Then I identified three root causes. I proposed a phased fix: first fix the silent failures, then improve error messages, then simplify the form. I got sign-off on the approach before writing any production code.",
          "I started with a diagnostic phase before writing a single line of code. I analyzed Sentry error logs to find the most frequent failure points, watched 50 session recordings to see where users hesitated or clicked the wrong thing, and pulled error rate data broken down by device, browser, and payment method. This gave me three clear root causes: 38% of failures were a silent API timeout that we were handling incorrectly, 30% were from an unhelpful generic error message that didn't tell users what to do next, and 32% were from a form layout that was confusing on mobile. I wrote up these findings with supporting data and proposed a phased approach: fix the silent failures in week one, improve error messages in week two, redesign the mobile layout in weeks three and four. The PM and design lead reviewed the plan before I started building.",
        ],
      },
    ],
  },
  {
    label: "Your Role & Ownership",
    questions: [
      {
        id: "s07-q3",
        text: "What was your specific ownership in this project? Where did you go beyond just writing code?",
        group: "Your Role & Ownership",
        framework:
          "Show that senior-level ownership goes beyond implementation. Include: requirement clarification, cross-team coordination, technical decisions, communication of progress, and post-launch monitoring.",
        keyPoints: [
          "You defined or clarified requirements, not just received them",
          "You coordinated across teams (design, backend, QA)",
          "You made key technical decisions",
          "You monitored the outcome after launch",
        ],
        samples: [
          "My ownership covered the full lifecycle. I diagnosed the problem, wrote the technical spec, coordinated with backend on API changes, reviewed the design with the UX team, drove QA test planning, and monitored the metrics post-launch. I also wrote the post-launch report for stakeholders.",
          "My ownership was genuinely end to end. I started by defining the success metric with the PM — we agreed that the goal was to bring payment completion rate from 72% to at least 82%. I wrote a technical spec that described the required API changes and got backend alignment before building. I ran a design review with the UX team to make sure my implementation matched the updated mobile design. I worked with QA to define the test cases — specifically making sure we covered all the error code scenarios that had been missing from previous test plans. After launch, I owned the monitoring: I set up a custom dashboard for payment error rates and completion rates, and I published a weekly metrics update to stakeholders for the first month. That level of ownership, not just code delivery, is what I mean when I say I took full responsibility for this project.",
        ],
      },
      {
        id: "s07-q4",
        text: "What was the hardest technical decision you had to make during the project?",
        group: "Your Role & Ownership",
        framework:
          "Show real decision-making, not just implementation. Structure: the specific choice, the options you considered, the trade-offs, why you chose what you did, and what the result was.",
        keyPoints: [
          "Two or three real options you genuinely considered",
          "The trade-off between them (not a fake choice)",
          "What influenced your final decision",
          "Whether you were right — and what you'd do differently",
        ],
        samples: [
          "The hardest decision was whether to fix the existing payment integration or replace it with a new provider. Replacing would give us a better API and better mobile UX, but it would delay the project by six weeks and introduce a whole new integration risk. We decided to fix the existing integration first and plan a proper migration for the next quarter. In hindsight, it was the right call — the fix was successful and we had time to plan the migration properly.",
          "The hardest decision was whether to rebuild the payment form from scratch or patch the existing one. The existing form had significant structural issues — event handling was tangled, state management was scattered across three files, and the mobile behavior was built with hacks that broke in some browsers. Rebuilding would be cleaner and give us a better foundation, but it was an eight-week project. Patching was riskier in the long run but could ship in three weeks. I chose to patch with a clear boundary: we'd patch specifically the areas causing the drop-off, but I wrote the new code in an isolated way that could be extracted into a rebuild later. I also created a tech debt ticket for the rebuild with a target quarter. The patched version shipped in three weeks, hit our metric goals, and the rebuild is currently in planning. Looking back, I'd make the same call — the business needed the fix quickly, and 'clean' wasn't worth eight more weeks of high drop-off.",
        ],
      },
    ],
  },
  {
    label: "Trade-offs & Challenges",
    questions: [
      {
        id: "s07-q5",
        text: "What trade-off did you have to make, and what did you give up?",
        group: "Trade-offs & Challenges",
        framework:
          "Be honest about what was sacrificed. A strong answer shows you made a conscious decision, not that everything was perfect. Structure: the constraint → the two options → what you chose → what the cost was → whether you'd do it differently.",
        keyPoints: [
          "A real constraint (time, resources, technical limitation)",
          "What you gave up (a feature, code quality, test coverage)",
          "Whether the trade-off was worth it",
          "How you managed the cost afterward",
        ],
        samples: [
          "We gave up full test coverage in the first release. We focused testing on the critical payment flow and skipped some edge cases to meet the deadline. I documented the gaps and we filled them in the following sprint. It was a calculated risk — the coverage we had was enough to give us confidence in the core path.",
          "The main trade-off was test coverage. To ship within the agreed timeline, I prioritized test coverage on the critical payment path — the main success flow and the three most common error scenarios. We shipped with about 65% coverage of the total edge case space. I was explicit about this: I created a ticket listing the 12 edge cases we hadn't tested yet, estimated they were low-probability paths, and got the PM and QA lead to formally acknowledge the gap. We filled it in the sprint after launch. If I could do it over, I'd push back slightly harder on the timeline to get to 85% coverage before shipping — we did encounter one edge case bug in production that was in the untested set. It was minor and fixed quickly, but it reinforced my belief that test coverage is worth fighting for even under deadline pressure.",
        ],
      },
    ],
  },
  {
    label: "Result & Lessons",
    questions: [
      {
        id: "s07-q6",
        text: "What was the measurable outcome of the project?",
        group: "Result & Lessons",
        framework:
          "Lead with the metric, then explain what it means in business terms. If you have a before/after number, use it. If you can connect it to revenue or user retention, even better.",
        keyPoints: [
          "The specific metric before and after",
          "The business impact (revenue, user satisfaction, support tickets)",
          "How long it took to see the result",
          "Any unexpected positive or negative outcomes",
        ],
        samples: [
          "Payment completion rate improved from 72% to 84% within three weeks of launch. Support tickets about payment errors dropped by 60%. The PM presented this in the quarterly business review. It was the clearest business outcome I've delivered.",
          "Payment completion rate went from 72% to 86% within four weeks of launch — exceeding our 82% target. In absolute numbers at our transaction volume, that 14-point improvement meant roughly 300 additional completed purchases per day. Support tickets related to payment issues dropped by 65%. We also saw a secondary benefit we didn't anticipate: mobile users specifically improved by 19 percentage points, which was higher than desktop. The mobile layout changes had a bigger impact than we expected. The PM presented the results in the quarterly business review and used the project as a case study for how to approach high-impact reliability improvements. The post-launch monitoring I set up ran for eight weeks and confirmed the gains were sustained.",
        ],
      },
      {
        id: "s07-q7",
        text: "What was the most important lesson you took away from this project?",
        group: "Result & Lessons",
        framework:
          "Be specific and personal. The best lessons are ones that changed a behavior or process, not just insight you had. Show how you applied it afterward.",
        keyPoints: [
          "A specific, actionable lesson (not just 'communication is important')",
          "How it changed your behavior or process afterward",
          "Whether you've applied it to a subsequent project",
          "What you'd tell another engineer facing a similar project",
        ],
        samples: [
          "The biggest lesson was: start with data, not assumptions. I'd assumed I knew where the problem was — the form layout. But the data showed the biggest issue was the silent timeout, which I hadn't noticed at all. If I'd jumped straight to building, I'd have improved the wrong thing.",
          "The most important lesson was the value of the diagnostic phase. My instinct at the start was to start designing solutions because I had a hypothesis. The data proved my hypothesis was only partially right — the silent timeout was the biggest single cause of failures, and I hadn't even considered it as the culprit. If I'd built the solution I had in my head on day one, I'd have improved the completion rate by maybe 5 percentage points instead of 14. The lesson I now apply to every project: spend real time understanding the problem before proposing solutions. This sounds obvious but it's genuinely rare in fast-moving teams. I now have a personal rule: I won't write a technical spec until I've spent at least two days understanding the problem from multiple angles — data, user behavior, and cross-team input.",
        ],
      },
    ],
  },
];
