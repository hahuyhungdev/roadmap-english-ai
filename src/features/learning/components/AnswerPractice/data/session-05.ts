import type { PracticeQuestionGroup } from "../../../types/practice";

// Based on user's Obsidian notes: lesson 5 AI tools.md
export const session05QA: PracticeQuestionGroup[] = [
  {
    label: "Daily AI Usage",
    questions: [
      {
        id: "s05-q1",
        text: "How do you use AI tools in your daily workflow?",
        group: "Daily AI Usage",
        framework:
          "Describe a multi-step workflow, not just 'I use Copilot for code.' Show breadth: research, code, review, testing. Mention cost/model trade-offs to show depth.",
        keyPoints: [
          "Multiple workflow stages (reading docs, writing code, reviewing PRs)",
          "Different tools for different tasks",
          "Cost awareness (lighter model for simple tasks, stronger for complex)",
          "You still guide the process — AI doesn't run free",
        ],
        samples: [
          "I use AI across many steps — not just coding. I use it to read documentation, summarize pull requests, and understand unfamiliar parts of the codebase. For coding, I use it for boilerplate, refactoring, and test generation. One important thing: I don't let it run freely on critical code. I stay in control.",
          "I use AI across many steps of my workflow. For research and onboarding, I use it to read documentation and summarize unfamiliar code quickly. For development, I use coding agents for implementing small features, writing tests, and generating boilerplate. For PRs, I use AI to review code for obvious issues before human review. I also think about cost — I use lighter, cheaper models for simple tasks like formatting or summarizing, and stronger models for complex reasoning or architecture questions. The key principle I follow is control: I don't let agents run autonomously on critical code. I always review changes step by step, especially for anything touching authentication, payments, or data.",
        ],
      },
      {
        id: "s05-q2",
        text: "Which tasks are good for AI support and which are not?",
        group: "Daily AI Usage",
        framework:
          "Show clear thinking about AI boundaries. Good: structured, repetitive, well-defined tasks. Bad: security-critical, complex business logic, architecture decisions. Be specific with examples.",
        keyPoints: [
          "Good: boilerplate, tests, docs, summarization, exploration",
          "Bad: security logic, complex business rules, architecture decisions",
          "The key criterion: does it require deep context and long-term thinking?",
          "AI is improving but still lacks real system understanding",
        ],
        samples: [
          "AI works well for structured, repetitive tasks — boilerplate code, test cases, log summarization, documentation. It's not reliable for security-critical logic, complex business rules, or architecture decisions. Those require context and long-term thinking that AI still lacks.",
          "AI excels at tasks that are well-defined and have patterns to follow: generating boilerplate, writing unit tests, summarizing logs, explaining unfamiliar code, and creating initial drafts of technical designs. For these, AI is genuinely faster and the output is reliable enough with a quick review. However, I avoid using AI for security-critical logic, complex business rule implementation, or system architecture decisions. These areas require deep understanding of the specific system, long-term consequences, and trade-offs that AI can't fully reason about. For example, I'd never trust AI to design the authentication flow or handle edge cases in payment processing without extremely careful human review of every single line.",
        ],
      },
      {
        id: "s05-q3",
        text: "How do you prevent bugs from AI-generated code?",
        group: "Daily AI Usage",
        framework:
          "Treat AI like a junior developer: review everything, don't assume correctness. Key practices: small scoped tasks, automated checks, validate each step before proceeding.",
        keyPoints: [
          "Review AI code like a junior developer's PR",
          "Break tasks into small steps and validate each",
          "Automated checks: lint, tests, CI pipeline",
          "Limit scope — no large multi-file changes at once",
        ],
        samples: [
          "I treat AI-generated code like code from a junior developer. I always review it carefully. I break tasks into small steps and validate each change before moving to the next. I also rely on automated checks — linting, tests, and CI — to catch issues I might miss.",
          "My core practice is to treat AI-generated code with the same scrutiny as code from someone I haven't worked with before — which means review everything. I also limit scope: I never let AI change more than a few files at once, because larger changes are harder to review and errors compound. For each small change, I validate it against tests before moving to the next step. Some tools support hooks that run tests automatically after every AI change, which helps a lot. Another practice: I'm explicit in my prompts about edge cases and error handling, because AI tends to write the happy path and skip edge cases unless you specifically ask. The mindset shift that helped most was accepting that AI code is a first draft, not a finished product.",
        ],
      },
    ],
  },
  {
    label: "Team & Process",
    questions: [
      {
        id: "s05-q4",
        text: "What team rules do you follow when using AI tools?",
        group: "Team & Process",
        framework:
          "Show that your team has governance, not just individual habits. Cover: data security, code review requirements, boundary definitions, and shared standards.",
        keyPoints: [
          "No sensitive data or secrets in external AI tools",
          "All AI-generated code goes through normal code review",
          "Clear boundaries on which areas AI can touch",
          "Shared standards, not just individual preferences",
        ],
        samples: [
          "Our team has clear rules. We never put sensitive data or production secrets into external tools. All AI-generated code goes through normal code review and CI checks. We also define areas where AI can and can't be used — test generation is encouraged, authentication logic requires strict review.",
          "We have a few hard rules that everyone follows. First: never put sensitive data, API keys, or production system details into external AI tools — we use enterprise or self-hosted options for anything security-sensitive. Second: all AI-generated code must go through the same code review and CI pipeline as human-written code — no exceptions. Third: we define scope boundaries per area. AI is freely encouraged for UI components, test generation, documentation, and boilerplate. For authentication, payments, and data integrity, any AI-generated code gets a mandatory second review from a senior engineer. These rules aren't bureaucracy — they're how we get speed without losing reliability.",
        ],
      },
      {
        id: "s05-q5",
        text: "Tell me about a bug caused by AI-generated code. What did you change afterward?",
        group: "Team & Process",
        framework:
          "Be honest about a real failure. Show the investigation, the root cause, and — most importantly — the process change. This shows accountability and learning.",
        keyPoints: [
          "What the AI-generated code was supposed to do",
          "How the bug appeared and was discovered",
          "The root cause (edge case, prompt was too vague, etc.)",
          "The specific process change you made afterward",
        ],
        samples: [
          "I once used AI to generate a data transformation function. It worked for common cases but failed on edge cases with null values. After that, I changed my workflow to always include edge case testing and be more explicit in my prompts. I also break complex logic into smaller steps instead of asking AI to handle everything at once.",
          "I generated a utility function for transforming API response data into a display format. The AI code looked clean and passed my initial review. In production, it failed silently for users who had missing optional fields — the function just returned undefined for those cases instead of a sensible default. It wasn't caught in tests because the test data was always complete. After this, I made two changes: I started explicitly including edge cases in my prompts ('handle cases where fields may be null or missing'), and I added a test generation step where I ask AI to generate edge-case tests separately before writing the implementation. That combination catches most issues before they reach review.",
        ],
      },
      {
        id: "s05-q6",
        text: "How has AI changed your approach to code review?",
        group: "Team & Process",
        framework:
          "Show that AI shifts the review focus, not just the volume. Less time on syntax/formatting, more on logic, requirements fit, and system impact. Also acknowledge new challenges (larger PRs, harder to review).",
        keyPoints: [
          "Less focus on syntax/formatting (AI handles that)",
          "More focus on logic, edge cases, system impact",
          "Check if the solution actually matches the requirement",
          "New challenge: PRs can be larger and harder to review",
        ],
        samples: [
          "I spend less time on syntax and formatting now because AI usually handles that well. Instead I focus on logic, edge cases, and system impact. I also pay more attention to whether the solution matches the actual requirement — AI often builds what was literally asked, not what was actually needed.",
          "Code review has shifted for me in two ways. First, I spend much less time on style and formatting issues — AI-generated code is usually syntactically clean. Second, I spend significantly more time on the things that matter: does the logic actually handle all the edge cases, does this fit the broader system design, is there a security concern I need to flag, and most importantly — does this actually solve the right problem? AI tends to implement what was literally described in the prompt, not necessarily what the user actually needs. I've started adding a question to my review checklist: 'Does this match the spirit of the requirement, not just the letter?' One challenge is that PRs can be larger now because developers generate more code faster. I've started asking engineers to break AI-assisted PRs into smaller, more focused chunks so they're actually reviewable.",
        ],
      },
    ],
  },
  {
    label: "Critical Thinking",
    questions: [
      {
        id: "s05-q7",
        text: "Does AI make junior developers learn slower?",
        group: "Critical Thinking",
        framework:
          "Nuanced answer required. Yes if overused passively. No if used actively with reflection. Show what habits or guidelines help juniors use AI productively.",
        keyPoints: [
          "AI can explain concepts and reduce frustration (positive)",
          "Passive use without reflection can skip important thinking (negative)",
          "A good practice: write code first, use AI to improve or check it",
          "Guidance and discipline matter more than the tool itself",
        ],
        samples: [
          "It depends on how they use it. AI can help juniors learn faster by explaining concepts and reducing frustration. But if they rely on it too much and skip the thinking process, their long-term growth suffers. In some teams, we encourage juniors to explain AI-generated code before using it.",
          "I think AI has the potential to accelerate junior learning significantly, but only if used actively rather than passively. A junior who reads an AI explanation, asks follow-up questions, and then tries to implement it themselves is learning faster. A junior who copies AI code without understanding it is building a dependency, not a skill. The practice I recommend is: write your own solution first, even if it's wrong. Then use AI to review it, understand the improvements, and implement them yourself. This is slower in the short term but builds real understanding. Some teams also require juniors to walk through AI-generated code in the next standup — explaining it out loud forces real comprehension.",
        ],
      },
      {
        id: "s05-q8",
        text: "Who is responsible when AI-generated code fails in production?",
        group: "Critical Thinking",
        framework:
          "Clear answer: the engineer who reviewed and deployed it. AI is a tool like a compiler or library — accountability stays with the human. Show how this should shape team norms.",
        keyPoints: [
          "The engineer who reviewed and deployed it is responsible",
          "AI is a tool, not an accountable actor",
          "This should raise the bar for review quality, not lower it",
          "Team processes (code review, CI) exist for exactly this reason",
        ],
        samples: [
          "The developer is still responsible. AI is just a tool — like a compiler or a library. If something goes wrong, the person who reviewed and deployed the code owns the result. Using AI doesn't reduce responsibility; it actually increases the need for careful validation.",
          "The answer is unambiguous: the engineer who reviewed and approved the code is responsible. AI is a tool, not a team member with accountability. This matters because it shapes how people should use AI — with the same rigor they'd apply to any code going to production. Some teams have made the mistake of thinking AI-generated code is somehow pre-validated or lower risk. It's not — if anything, it requires more careful attention because AI can be very confidently wrong, generating plausible-looking code that has subtle bugs. The fact that accountability stays with the engineer is the right incentive structure. It means we don't let review quality slip just because the code was AI-generated.",
        ],
      },
      {
        id: "s05-q9",
        text: "How do you think AI will change the developer role in the next few years?",
        group: "Critical Thinking",
        framework:
          "Show forward-thinking without being either too optimistic or dismissive. The emerging role: less implementation, more orchestration, design, and validation. Engineers need stronger system thinking, not weaker.",
        keyPoints: [
          "Less time on implementation, more on design and validation",
          "Engineers become orchestrators of AI agents",
          "Stronger requirements for system thinking and judgment",
          "The skills that matter more: clarity of thought, communication, trade-off reasoning",
        ],
        samples: [
          "The role is shifting from writing code to guiding systems. We'll spend more time on design, requirements clarity, and validation, and less on implementation. AI handles more of the routine work. This means we need stronger system thinking and clearer communication — not weaker.",
          "I think the role shifts from implementation-heavy to judgment-heavy. Right now, a significant part of engineering time goes to routine implementation — writing boilerplate, creating standard tests, setting up configurations. AI will handle more of that over the next few years. What remains, and becomes more important, is the reasoning that AI can't replicate well: understanding the actual user problem behind a requirement, making architecture decisions with full business context, evaluating trade-offs across time and teams, and catching the subtle wrong assumptions in AI-generated solutions. The engineers who will be most valuable are those who can think clearly about systems, communicate requirements precisely to both humans and AI agents, and review output critically. It's less about how fast you type and more about how clearly you think.",
        ],
      },
    ],
  },
  {
    label: "Future & Principles",
    questions: [
      {
        id: "s05-q10",
        text: "How do you decide if an AI tool is safe enough to use for sensitive work?",
        group: "Future & Principles",
        framework:
          "Show a systematic evaluation. Key factors: data handling policy, enterprise tier, access control, local deployment option. Don't just say 'I check the privacy policy.'",
        keyPoints: [
          "Data handling: is it stored, used for training?",
          "Enterprise or self-hosted options for sensitive work",
          "What access the tool requires to your codebase",
          "Team policy and compliance requirements",
        ],
        samples: [
          "I look at three things: trust, data handling, and control. Is the tool widely used with clear policies? Is my code stored or used for training? Can I limit what it accesses? For sensitive work, I prefer enterprise options or local deployment. If I'm not sure, I avoid it for critical tasks.",
          "My evaluation has a few layers. First, data handling: does this tool store my inputs, use them for model training, or share them with third parties? For anything involving proprietary code or business logic, the answer to all three must be no — or I need the enterprise tier with a data processing agreement. Second, access scope: some AI tools ask for broad repository access. I prefer tools where I control exactly what context is shared per session. Third, I check whether there's an on-premise or self-hosted option for high-security work. For our security-critical flows, we use an internal LLM deployment rather than external services. The principle is: the sensitivity of the work should determine the trust level required from the tool.",
        ],
      },
    ],
  },
];
