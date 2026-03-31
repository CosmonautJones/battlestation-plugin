---
name: wrap-up
description: Session close automation. Reviews work done, collects feedback, updates memory/learnings, and optionally commits uncommitted work. Triggers on /wrap-up, "close session", "end session", "save progress", or "done for now".
tools: Bash, Read, Write, Edit, Grep, Glob
disable-model-invocation: true
---

# /wrap-up — Session Close Automation

## Purpose

Run this before ending a session to ensure nothing is lost. It reviews what was accomplished, captures learnings, updates memory, and handles any loose ends.

## Execution Flow

### Step 1: Review Session Work

Check what was done this session:

```bash
# Recent file changes
git diff --stat HEAD 2>/dev/null || echo "No git repo"
git status --short 2>/dev/null

# Recently modified files (last 2 hours)
find . -name "*.py" -o -name "*.md" -o -name "*.json" -o -name "*.sh" -mmin -120 2>/dev/null | head -20
```

Summarize:
- Files created
- Files modified
- Tests written/passing
- Skills/agents added
- Configuration changes

### Step 2: Collect Feedback

Ask the user:

1. **What worked well this session?** (Saves as positive feedback memory)
2. **What was frustrating or wrong?** (Saves as corrective feedback memory)
3. **Anything to remember for next time?** (Saves to appropriate memory type)

If the user says "skip" or "nothing", move on.

### Step 3: Update Memory

Based on the session's work and feedback:

1. Check if any existing memories need updating (stale info)
2. Save new learnings:
   - Feedback memories for corrections/confirmations
   - Project memories for ongoing work status
   - Reference memories for external resources discovered
3. Update MEMORY.md index if new memories were added

### Step 4: Handle Uncommitted Work

If there are uncommitted changes:

```bash
git status --short 2>/dev/null
```

Ask the user:
> "You have uncommitted changes. Would you like to commit them before closing?"

If yes, create a descriptive commit with all relevant changes.
If no, note the uncommitted state in memory for next session.

### Step 5: Update Learnings Log

If the project has a learnings file (e.g., `lessons-learned.md`), append any discoveries:

```markdown
## <date> — Session Summary
- **Worked on:** <brief description>
- **Learned:** <key technical/process insight>
- **Watch out for:** <gotcha or pitfall discovered>
```

### Step 6: Final Status

Report to the user:
```markdown
## Session Wrap-Up Complete

**Work reviewed:** <N> files changed
**Memory updated:** <N> new/updated entries
**Git status:** <committed/uncommitted changes remain>
**Learnings captured:** <yes/no>

See you next time. Run `/heartbeat` when you're back.
```
