---
name: research
description: Fan-out/fan-in parallel research skill. Spawns multiple researcher agents to investigate different angles simultaneously, then synthesizes results with Opus. Triggers on /research, "deep research", "investigate", "compare options", or "analyze alternatives".
tools: Read, Write, Grep, Glob, WebFetch, WebSearch
context: fork
argument-hint: <research_question_or_topic>
---

# /research — Fan-Out/Fan-In Research Orchestrator

## Overview

This skill implements the **stochastic consensus pattern**: spawn N parallel researcher agents (cheap, fast Haiku) to investigate different angles of a question, then aggregate results with a synthesizer agent (Opus) to find consensus, flag outliers, and produce actionable recommendations.

## Execution Flow

### Step 1: Decompose the Research Question

Break the user's question into 3-5 distinct research angles. Each angle should explore a different perspective:

**For technology comparisons:**
- Angle 1: Performance benchmarks and scalability
- Angle 2: Developer experience and ecosystem maturity
- Angle 3: Security track record and vulnerability history
- Angle 4: Community adoption and long-term viability
- Angle 5: Cost and licensing implications

**For problem investigation:**
- Angle 1: Root cause analysis (what's actually broken)
- Angle 2: Similar issues in the ecosystem (how others solved it)
- Angle 3: Architectural implications (systemic vs localized)
- Angle 4: Quick fix vs proper fix trade-offs

**For learning/exploration:**
- Angle 1: Core concepts and fundamentals
- Angle 2: Practical implementation patterns
- Angle 3: Common pitfalls and anti-patterns
- Angle 4: Real-world case studies and production experience

### Step 2: Fan-Out — Spawn Researcher Agents

Launch 3-5 `researcher` agents **in parallel** (single message, multiple Agent tool calls).

Each agent gets:
- The original research question for context
- Their specific angle/perspective to investigate
- Instructions to return structured findings (see researcher agent format)

Example prompt for each researcher:
```
Research question: "<user's question>"
Your angle: "<specific perspective>"

Investigate this specific angle thoroughly. Search the web, read relevant files, 
and return structured findings with confidence ratings. Focus on facts and evidence, 
not speculation. Return results in the standard researcher output format.
```

### Step 3: Fan-In — Collect Results

Wait for all researcher agents to complete. Read each agent's structured output.

### Step 4: Synthesize

If 3+ researchers returned results, spawn the `synthesizer` agent (Opus) with:
- All researcher outputs concatenated
- The original research question
- Instructions to find consensus, resolve conflicts, and flag outliers

If fewer than 3 researchers succeeded, synthesize manually:
- Merge findings by topic
- Note confidence levels
- Highlight gaps

### Step 5: Present Final Report

Deliver the synthesizer's output to the user. Highlight:
1. **Top 3 consensus findings** — What multiple researchers agreed on
2. **Key recommendation** — The single most actionable takeaway
3. **Interesting outlier** — One surprising finding worth investigating further
4. **Knowledge gaps** — What we still don't know

## Configuration

- **Default researchers:** 3 (override with `--agents N` in argument)
- **Researcher model:** Haiku (fast and cheap for breadth)
- **Synthesizer model:** Opus (deep reasoning for aggregation)
- **Timeout per researcher:** 120 seconds

## Example Usage

```
/research "Should we use Rust or Go for our new CLI tool?"
/research "What's causing memory leaks in Node.js event loops?"
/research "Best practices for securing Kubernetes in production" --agents 5
```
