# Copilot Agent Instructions

> **CRITICAL — READ THIS FIRST BEFORE DOING ANYTHING ELSE**
>
> You MUST manage `.copilot/plan.json` as your task tracker.
> Do NOT use VS Code's built-in Todos feature. Do NOT use any other system.
> `.copilot/plan.json` is the ONLY source of truth for task tracking.

## Step 0 — Before starting ANY task

1. Check if `.copilot/plan.json` exists.
2. If it does NOT exist → create it immediately (see format below) before doing any work.
3. If it exists → read it, find the current step, continue from there.

## Every step — MANDATORY protocol

Before executing each step:

1. **Check** `.copilot/PAUSED` — if this file exists, STOP immediately. Do NOT proceed.
2. **Check** `.copilot/inject.md` — if this file exists, read it, follow the instruction, then DELETE the file.
3. **Update** `.copilot/plan.json` — set step status to `"running"` before starting.
4. After completing — set status to `"done"` or `"error"` and update `current_step`.

## plan.json format

```json
{
  "task": "Short description of the overall task",
  "created_at": "2026-01-01T00:00:00Z",
  "current_step": 1,
  "steps": [
    {
      "id": 1,
      "action": "verb-noun",
      "target": "path/to/file.ext",
      "intent": "Why this step exists",
      "success_criteria": "How to verify it worked",
      "requires_confirmation": false,
      "status": "pending",
      "error": null,
      "notes": []
    }
  ]
}
```

## Step statuses

- `pending` — not started
- `running` — currently executing (set this BEFORE starting)
- `done` — completed successfully
- `error` — failed (set `error` field with reason, then STOP)
- `skipped` — skipped by human instruction

## Hard rules

- NEVER use VS Code Todos or any other task tracking system.
- NEVER skip writing to plan.json before and after each step.
- NEVER skip the PAUSED check.
- If a step fails → set `"error"`, write reason in `error` field, STOP and wait.
- If `requires_confirmation` is true → set status to `"paused"`, STOP and wait.
- Keep steps small and atomic — one file or one logical change per step.
