---
name: stochastic
description: Stochastic consensus pattern for high-stakes decisions. Spawns multiple parallel agents with different perspectives, aggregates for statistical consensus and creative outliers. Triggers on /stochastic, "consensus check", "debate this", "multiple perspectives", or "parallel opinions".
tools: Read, Write, Grep, Glob, WebFetch, WebSearch
context: fork
argument-hint: <question_or_decision>
---

# /stochastic — Stochastic Consensus Orchestrator

## Overview

For high-stakes decisions where a single agent's opinion isn't enough. Spawns 5-10 parallel agents with different "personas" to debate the question, then aggregates results statistically.

## When to Use

- Architecture decisions with long-term consequences
- Security assessment disagreements
- Tool/framework selection for new projects
- Debugging where the root cause is unclear
- Any decision where you want to minimize hallucination risk

## Execution Flow

### Step 1: Define Debate Positions
Given the question, create 5 contrasting personas:

1. **The Pragmatist** — What's the simplest approach that works?
2. **The Perfectionist** — What's the ideal solution regardless of effort?
3. **The Skeptic** — What could go wrong? What are we missing?
4. **The Innovator** — What's the unconventional approach no one considers?
5. **The Historian** — What has worked (or failed) in similar situations before?

### Step 2: Fan-Out
Spawn 5 `researcher` agents (Haiku) in parallel, each assigned one persona:

```
You are the [Persona]. Given this question: "[question]"
Argue your position with evidence. Be opinionated, not neutral.
Return: Position (1 sentence), Arguments (3-5 bullets with evidence),
Confidence (0-100), Risks of this approach.
```

### Step 3: Collect & Score
Read all 5 responses. For each proposed approach:
- **Consensus score** = number of agents who agree / total agents
- **Confidence-weighted score** = sum of agreeing agents' confidence / total possible
- **Risk diversity** = unique risks identified across all agents

### Step 4: Synthesize
Spawn `synthesizer` agent (Opus) with all positions:

```
5 agents debated: "[question]"
Find: (1) The statistical consensus — what most agents agree on
(2) The highest-conviction outlier — one unique idea worth considering
(3) The combined risk profile — all risks from all agents merged
(4) Your final recommendation with confidence level
```

### Step 5: Present
```markdown
# Stochastic Consensus: <question>
**Agents polled:** 5
**Consensus strength:** <strong/moderate/weak>

## Consensus Position
<what most agents agreed on>
**Agreement:** N/5 agents, confidence-weighted score: X%

## Notable Dissent
<the strongest counterargument>
**From:** <persona>
**Confidence:** X%

## Combined Risk Profile
- <risk 1 — identified by N agents>
- <risk 2 — identified by N agents>

## Final Recommendation
<synthesizer's recommendation with reasoning>
```

## Configuration
- **Default agents:** 5
- **Override:** `/stochastic --agents 10 "question"` for higher confidence
- **Fast mode:** `/stochastic --agents 3 "question"` for quicker consensus
