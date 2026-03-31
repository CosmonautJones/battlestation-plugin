# Battlestation Plugin for Claude Code

Turn Claude Code into an autonomous, multi-domain battle station. Security recon, exploit development, parallel research, token-efficient browser automation, and self-healing agent patterns.

Built from patterns extracted from 27+ advanced Claude Code sources including Stripe's Minions architecture, the 4-layer Bowser Pattern, Karpathy self-improvement loops, and fan-out/fan-in stochastic consensus.

## Installation

```bash
# Add the marketplace
claude plugin marketplace add CosmonautJones/battlestation-plugin

# Install the plugin
claude plugin install battlestation@battlestation-plugin
```

## Skills

| Skill | Description | Trigger |
|-------|-------------|---------|
| `/recon` | Security reconnaissance orchestrator | "scan target", "enumerate", "port scan" |
| `/exploit-dev` | CTF & exploit development | "write exploit", "CTF challenge", "pwn this" |
| `/research` | Fan-out/fan-in parallel research | "deep research", "compare options" |
| `/playwright-cli` | Token-efficient browser automation | "browse to", "test the UI", "scrape" |
| `/heartbeat` | Session startup system check | "system check", "status report" |
| `/wrap-up` | Session close + memory update | "close session", "done for now" |

## Agents

| Agent | Model | Purpose |
|-------|-------|---------|
| `recon-agent` | Haiku | Fast recon scanning (passive + active) |
| `exploit-agent` | Sonnet | Exploit dev in isolated worktree |
| `researcher` | Haiku | Single-angle research for fan-out |
| `synthesizer` | Opus | Multi-agent research aggregation |
| `browser-qa` | Sonnet | Headless UI testing via Playwright CLI |

## Key Patterns

### Fan-Out/Fan-In Research
Spawn 3-5 cheap Haiku agents to investigate different angles in parallel, then synthesize with Opus for consensus-finding.

### 4-Layer Bowser Pattern (Browser Automation)
1. **Layer 1:** Core Playwright CLI (saves 90K tokens vs MCP)
2. **Layer 2:** Specialized browser-qa sub-agent
3. **Layer 3:** Orchestration commands (`/playwright-cli`)
4. **Layer 4:** Justfile bindings for one-keystroke execution

### Ralph Loop (Self-Healing)
Hooks return exit code 2 to feed errors back to Claude, forcing self-correction until the issue is resolved.

### Authorization Gates
Security skills (`/recon`, `/exploit-dev`) require explicit authorization confirmation before executing. Valid contexts: pentesting, CTF, own infrastructure, security research.

## Recommended Security Tools

For full `/recon` and `/exploit-dev` capability, install:

```bash
# Recon tools
sudo apt install nmap
pip install httpx subfinder
go install github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest

# Exploit tools
pip install pwntools scapy paramiko cryptography

# Browser automation
pip install playwright
npx playwright install chromium
```

## Configuration

The plugin sets these defaults in `settings.json`:
- Enables experimental agent teams
- Allows git, nmap, python, and just commands

## License

MIT
