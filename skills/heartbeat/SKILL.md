---
name: heartbeat
description: Session startup automation. Scans skills/agents/hooks for changes, checks MCP health, loads recent memory, and reports system status. Triggers on /heartbeat, "system check", "status report", or at session start.
tools: Bash, Read, Grep, Glob
---

# /heartbeat — Session Startup Automation

## Purpose

Run this at the start of every session to get a real-time status report of your battle station. It scans your entire Claude Code infrastructure and reports what's healthy, what's changed, and what needs attention.

## Execution Flow

### Step 1: Scan Installed Components

**Skills inventory:**
```bash
# Count and list all skills
ls ~/.claude/skills/*/SKILL.md 2>/dev/null | wc -l
ls ~/.claude/skills/*/SKILL.md 2>/dev/null
```

**Agents inventory:**
```bash
ls ~/.claude/agents/*.md 2>/dev/null | wc -l
ls ~/.claude/agents/*.md 2>/dev/null
```

**Hooks inventory:**
```bash
ls ~/.claude/hooks/*.sh 2>/dev/null
cat ~/.claude/settings.json | python -c "import sys,json; s=json.load(sys.stdin); [print(f'  {k}: {len(v)} hooks') for k,v in s.get('hooks',{}).items()]"
```

### Step 2: Check MCP Server Health

```bash
# Check if NotebookLM MCP is responsive
python -c "
import asyncio
from notebooklm import NotebookLMClient
async def check():
    try:
        async with await NotebookLMClient.from_storage() as client:
            nbs = await client.notebooks.list()
            print(f'NotebookLM: OK ({len(nbs)} notebooks)')
    except Exception as e:
        print(f'NotebookLM: ERROR - {e}')
asyncio.run(check())
" 2>&1
```

Check other MCP servers by verifying their processes or making test calls.

### Step 3: Check Tool Availability

```bash
# Security tools
for tool in nmap gobuster subfinder httpx nuclei; do
    which $tool 2>/dev/null && echo "$tool: installed" || echo "$tool: NOT FOUND"
done

# Development tools
for tool in git python node just docker; do
    which $tool 2>/dev/null && echo "$tool: installed" || echo "$tool: NOT FOUND"
done

# Python packages
python -c "
for pkg in ['pwntools', 'scapy', 'requests', 'beautifulsoup4', 'paramiko', 'cryptography']:
    try:
        __import__(pkg.replace('-','_').split('4')[0])
        print(f'{pkg}: installed')
    except ImportError:
        print(f'{pkg}: NOT FOUND')
"
```

### Step 4: Git Status (if in a repo)

```bash
git status --short 2>/dev/null || echo "Not a git repository"
git log --oneline -5 2>/dev/null || true
```

### Step 5: Load Recent Memory

Read the memory index:
```bash
cat ~/.claude/projects/*/memory/MEMORY.md 2>/dev/null | head -50
```

### Step 6: Check for Stale Components

Look for skills/agents that reference tools or files that no longer exist:
```bash
# Check for broken agent references in skills
grep -r "agent" ~/.claude/skills/*/SKILL.md 2>/dev/null | grep -v "^#"
```

## Output Format

```markdown
# Battle Station Status Report
**Date:** <timestamp>
**Session:** Fresh start

## Infrastructure
| Component | Count | Status |
|-----------|-------|--------|
| Skills | <N> | <OK/WARN> |
| Agents | <N> | <OK/WARN> |
| Hooks | <N> | <OK/WARN> |
| MCP Servers | <N> | <OK/WARN> |

## Tool Availability
| Category | Installed | Missing |
|----------|-----------|---------|
| Security | nmap, httpx | gobuster, nuclei |
| Dev | git, python, node | docker |
| Python | requests, pwntools | scapy |

## Recent Activity
- Last commit: <message> (<time ago>)
- Uncommitted changes: <count>

## Attention Needed
- <any warnings, missing tools, expired auth, etc.>

## Ready
Battle station is <FULLY OPERATIONAL / DEGRADED (list issues)>.
```
