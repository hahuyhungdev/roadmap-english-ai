import type { PracticeQuestionGroup } from "../../../types/practice";

export const session01QA: PracticeQuestionGroup[] = [
  {
    label: "Experience & Daily Work",
    questions: [
      {
        id: "s01-q1",
        text: "Can you describe your current role and what you actually do day to day?",
        group: "Experience & Daily Work",
        framework:
          "Use the pattern: Role → Core responsibility → Business value. Start with your title, explain what you own, then connect it to a real user or business outcome.",
        keyPoints: [
          "Your title and team",
          "What area/feature you own",
          "A metric or outcome you care about",
          "Who you work with (PM, design, backend)",
        ],
        samples: [
          "I'm a frontend engineer at a fintech startup. I mainly work on the checkout and payment flows. My day-to-day is a mix of building new features, fixing bugs, and doing code reviews. I try to keep my work connected to real user impact, like reducing failed transactions.",
          "I'm a frontend engineer with about three years of experience, and I focus on the payment and account settings area of our product. Day to day, I work on new features, fix production issues, and collaborate closely with product managers and designers. One thing I pay attention to is business impact — for example, I recently worked on a checkout improvement that reduced payment errors by around 15%, which directly improved conversion for the company.",
        ],
      },
      {
        id: "s01-q2",
        text: "How do you explain your technical work to non-technical stakeholders like a PM or business manager?",
        group: "Experience & Daily Work",
        framework:
          "Use the 'So what?' technique: technical work → plain language → business result. Avoid jargon. Lead with the outcome, then briefly explain what you did.",
        keyPoints: [
          "Translate tech terms into plain language",
          "Lead with the result, not the process",
          "Use numbers when possible",
          "Give one concrete example",
        ],
        samples: [
          "I usually skip the technical details and focus on the result. For example, instead of saying we refactored the API call, I say: we fixed a slow step that was making users wait too long, and now it's three times faster.",
          "When talking to non-technical stakeholders, I always lead with the outcome first. For example, instead of explaining that we changed from REST polling to WebSockets, I'd say: 'We made the dashboard update in real time, so users don't have to refresh the page anymore — support tickets about missing data dropped by 40% in the first week.' Then if they want more detail, I can go deeper.",
        ],
      },
      {
        id: "s01-q3",
        text: "Can you give an example of a feature you built that had a clear business impact?",
        group: "Experience & Daily Work",
        framework:
          "Use STAR: Situation (what the problem was) → Task (your role) → Action (what you built) → Result (the measurable outcome). Keep the result specific with numbers if possible.",
        keyPoints: [
          "State the business problem first",
          "Your specific contribution",
          "The metric before vs after",
          "Why it mattered to the company",
        ],
        samples: [
          "We had a problem where users were dropping off at the payment step. I simplified the form — removed two fields and added inline validation. After we shipped it, checkout completion went up noticeably, and support complaints about the form dropped.",
          "Last year, our checkout abandonment rate was quite high — around 30% of users who reached the payment step didn't complete it. My task was to improve the form UX. I removed two unnecessary address fields, added real-time inline validation, and optimized the mobile keyboard experience. After we released it, checkout completion improved by 18%, and support tickets about the payment form dropped by half within two weeks. The PM used that number in the quarterly review.",
        ],
      },
      {
        id: "s01-q4",
        text: "How do you decide what to work on when there are many things in the backlog?",
        group: "Experience & Daily Work",
        framework:
          "Describe your prioritization thinking: urgency vs impact, stakeholder alignment, and how you communicate trade-offs. Show that you think beyond just code.",
        keyPoints: [
          "Impact vs effort analysis",
          "Bug severity vs new features",
          "Aligning with PM and business goals",
          "Communicating trade-offs clearly",
        ],
        samples: [
          "I look at two things: how much it affects users, and how much effort it takes. High-impact, low-effort items go first. I also check if there are production bugs that are hurting users right now — those jump to the top.",
          "I usually work with the PM to align on priority, but I do my own quick impact vs effort assessment first. I ask: is this a bug hurting active users right now, or a new feature? If it's a production bug affecting conversion or core flows, it's urgent. For backlog items, I look at how many users it affects and how long it would take. I've also learned to push back when scope is too big for a deadline — I'd rather ship a smaller, stable version than rush and introduce new bugs.",
        ],
      },
    ],
  },
  {
    label: "Challenges & Trade-offs",
    questions: [
      {
        id: "s01-q5",
        text: "Describe a time when you had to make a trade-off — for example, shipping faster vs. doing it properly.",
        group: "Challenges & Trade-offs",
        framework:
          "Acknowledge both sides of the trade-off honestly. Structure: What was the pressure? → What were the two options? → What did you choose and why? → What was the cost? → What did you learn?",
        keyPoints: [
          "The deadline or business pressure",
          "The two options you weighed",
          "Which you chose and the reasoning",
          "What you gave up",
          "The lesson or follow-up action",
        ],
        samples: [
          "We had a deadline to ship before a marketing campaign. We chose to cut one reporting feature and ship the core flow first. We added the feature in the next sprint. The trade-off was acceptable because the core experience was solid.",
          "Before a big product launch, we were under pressure to ship a new onboarding flow. The proper version needed backend changes that would take two extra weeks. We decided to ship a frontend-only version that worked but had some manual steps for edge cases. The main trade-off was that the support team had to handle a few exceptions manually for about three weeks until the full version was ready. I documented the workaround clearly and set a deadline to close the gap. In the end, the launch went smoothly, and the full version shipped on schedule.",
        ],
      },
      {
        id: "s01-q6",
        text: "Have you ever pushed back on a product requirement? How did you handle it?",
        group: "Challenges & Trade-offs",
        framework:
          "Show that you can disagree professionally. Structure: What was asked? → What concern did you have (technical or UX)? → How did you raise it? → What was the outcome?",
        keyPoints: [
          "The original request",
          "Your specific concern (not just 'too hard')",
          "How you communicated it (data, alternatives)",
          "The final decision and your acceptance of it",
        ],
        samples: [
          "The PM wanted to add a step to verify the phone number before checkout. I pushed back because we had data showing users already drop off at that step. We agreed to make it optional instead. That was a good compromise.",
          "Once, the PM wanted to add a mandatory phone verification step before checkout to reduce fraud. I pushed back because we had data showing our biggest drop-off point was already on that screen — adding friction would likely hurt conversion more than fraud was costing us. I shared the funnel data and proposed an alternative: make verification optional but add a clear trust badge instead. The PM agreed to run an A/B test. The no-verification variant actually performed better on conversion, so we went with my suggestion. I learned that pushing back with data is much more effective than just saying 'that's too much work.'",
        ],
      },
      {
        id: "s01-q7",
        text: "Tell me about a production bug or incident you handled. What was your process?",
        group: "Challenges & Trade-offs",
        framework:
          "Use the incident response pattern: Detect → Assess impact → Communicate → Fix → Post-mortem. Show ownership — stay calm, be transparent, and focus on the root cause.",
        keyPoints: [
          "How you detected or were alerted",
          "The business impact (who was affected)",
          "Your immediate actions to contain it",
          "The root cause",
          "What you changed to prevent recurrence",
        ],
        samples: [
          "We had a bug where some users couldn't complete payment on a specific browser. I found it through Sentry alerts. I quickly identified the root cause — a CSS issue with an old Safari version — and shipped a hotfix within two hours. I also added a browser compatibility check to our test suite.",
          "We once had a critical issue where payment was failing silently for about 5% of users on iOS Safari. I was alerted through Sentry at 9pm. I immediately escalated to the backend team and the PM, assessed that around 200 transactions per hour could be affected, and we decided to temporarily roll back the release while I investigated. The root cause was a date formatting bug in a third-party library that behaved differently on older Safari. I fixed the formatting, tested on multiple devices, and we re-deployed by midnight. After that, I wrote a post-mortem, added Safari-specific tests to our CI pipeline, and created a monitoring alert for payment error rate spikes.",
        ],
      },
    ],
  },
  {
    label: "Critical Thinking",
    questions: [
      {
        id: "s01-q8",
        text: "How do you measure whether a feature you built was actually successful?",
        group: "Critical Thinking",
        framework:
          "Show product thinking beyond just 'it shipped'. Mention: defining success upfront, tracking metrics, and what you do when results are unexpected.",
        keyPoints: [
          "Agreeing on success metrics before building",
          "Specific metrics (conversion, error rate, time on task)",
          "How you track post-launch",
          "A case where results surprised you",
        ],
        samples: [
          "Before building, I agree with the PM on what success looks like — usually a metric like error rate or conversion. After launch, I check the numbers after one or two weeks. If it's not moving, we investigate why.",
          "Before I start building, I try to agree with the PM on a success metric — something specific like 'checkout completion rate goes up by at least 5%' or 'support tickets about this flow drop by 30%'. After we ship, I check the data after one week and again after two weeks. Once, we built a feature we were confident about, but the metric barely moved. It turned out users weren't even discovering the feature. That taught me to always include discoverability in the definition of done — it's not just about building it correctly, but about users actually finding and using it.",
        ],
      },
      {
        id: "s01-q9",
        text: "What's the difference between how a junior engineer and a senior engineer explains their work to the business?",
        group: "Critical Thinking",
        framework:
          "Compare the two mindsets: task-focused vs outcome-focused, technical language vs business language. This is a reflection question — show self-awareness and growth.",
        keyPoints: [
          "Junior: explains what they did (tasks, tools)",
          "Senior: explains why it matters (impact, decisions)",
          "Senior connects work to business outcomes",
          "Senior anticipates risks and trade-offs proactively",
        ],
        samples: [
          "A junior usually explains what they built — 'I added a validation function and fixed the CSS.' A senior connects it to why it matters — 'We reduced form errors by 40%, which means fewer users abandon checkout.' The senior thinks about outcomes, not just tasks.",
          "In my early career, I would describe my work by listing what I did: 'I built this component, I fixed this bug, I refactored this service.' There was no connection to business outcomes. As I became more experienced, I learned to frame work differently: 'I fixed a bug that was causing 8% of checkout attempts to fail silently — after the fix, conversion improved and we stopped getting those support escalations.' The key difference is that a senior engineer understands the 'so what' of their work, proactively flags risks to stakeholders, and thinks about trade-offs before being asked. It's less about technical skill and more about business awareness.",
        ],
      },
      {
        id: "s01-q10",
        text: "Have you ever worked on something that was technically interesting but had low business value? How did you handle it?",
        group: "Critical Thinking",
        framework:
          "Show maturity: acknowledging the tension between engineer curiosity and business priorities. Describe how you either redirected it or found a way to justify the value.",
        keyPoints: [
          "The technically interesting work",
          "Why the business value was unclear",
          "How you responded (deprioritized, reframed, or justified)",
          "What you learned about balancing engineering interests with business needs",
        ],
        samples: [
          "We had an idea to rewrite our state management from Redux to Zustand. It was interesting technically but had almost no user impact. We kept it in the backlog, did it gradually in quiet periods, and made sure it never blocked business-priority work.",
          "Once our team became excited about migrating our entire frontend to a micro-frontend architecture. Technically it was fascinating — better code isolation, independent deployments per team. But when I mapped out the timeline and impact on users, it was at least three months of work with zero visible improvement for users or business metrics. I raised this in planning, suggesting we break it into smaller, justified pieces — first we'd only split out the module that was causing the most merge conflicts and slowing down releases. We got buy-in for that smaller scope. The lesson was that technical improvements need to be tied to a concrete pain point, otherwise they compete with business work and often lose — or worse, they get abandoned halfway.",
        ],
      },
    ],
  },
  {
    label: "Future & Big Picture",
    questions: [
      {
        id: "s01-q11",
        text: "Where do you see yourself in two to three years? What kind of engineer do you want to become?",
        group: "Future & Big Picture",
        framework:
          "Be honest and specific. Show direction without being too rigid. Connect your growth goal to the role you're interviewing for. Avoid clichés like 'I want to be a manager' unless you mean it.",
        keyPoints: [
          "A specific technical or leadership direction",
          "Why that direction (what motivates you)",
          "How this role fits that path",
          "One concrete step you're already taking",
        ],
        samples: [
          "In two or three years, I want to be a senior engineer who can lead small technical projects end to end — from planning to production. I'm working toward that by being more involved in architecture decisions now and improving how I communicate with product and business stakeholders.",
          "In the next two to three years, I want to grow into a senior engineer who can take full ownership of a product area — not just the code, but the technical strategy, the trade-off decisions, and the stakeholder communication. Right now I'm strong on the execution side, but I'm actively working on the broader skills: I've started writing technical proposals for my team, I'm taking on more cross-team coordination work, and I'm studying system design to improve my architecture thinking. I'm looking for a role where I can take on that kind of ownership and grow into it with the right support.",
        ],
      },
      {
        id: "s01-q12",
        text: "Do you think engineers should care about business impact, or is that the PM's job?",
        group: "Future & Big Picture",
        framework:
          "This is an opinion question — have a clear point of view and defend it. The expected answer is 'yes, both' — but show nuance: why it matters for engineers specifically, and where the line is.",
        keyPoints: [
          "Engineers who understand business make better decisions",
          "It helps with prioritization and trade-offs",
          "It doesn't mean engineers replace PMs",
          "Give an example of when business awareness helped you personally",
        ],
        samples: [
          "I think engineers absolutely should care about business impact. Not to replace the PM, but because when you understand why something matters, you make better decisions. You don't gold-plate features that don't need it, and you flag risks before they become real problems.",
          "I strongly believe engineers should care about business impact — not to do the PM's job, but because it makes you a fundamentally better engineer. When you understand the business context, you can make smarter technical decisions. For example, if I know that a 100ms latency improvement on checkout will increase conversion by 2%, I know it's worth the extra effort. If I don't have that context, I might deprioritize it because it feels like micro-optimization. I've seen engineers who only think about code quality and ignore business outcomes — they sometimes build elegant solutions to the wrong problem. Understanding business impact is what separates engineers who get things done from engineers who get the right things done.",
        ],
      },
    ],
  },
];
