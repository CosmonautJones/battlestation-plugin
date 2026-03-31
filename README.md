# Battlestation Plugin for Claude Code

Turn Claude Code into an autonomous, multi-domain battle station. 15 specialized agents and 20 skills covering security reconnaissance, exploit development, digital forensics, OSINT, threat intelligence, parallel research, token-efficient browser automation, and self-healing agent patterns.

Built from patterns extracted from 27+ advanced Claude Code sources including Stripe's Minions architecture, the 4-layer Bowser Pattern, Karpathy self-improvement loops, and fan-out/fan-in stochastic consensus.

**277 validation tests passing.**

## Installation

```bash
# Add the marketplace
claude plugin marketplace add CosmonautJones/battlestation-plugin

# Install the plugin
claude plugin install battlestation@battlestation-plugin
```

## Skills (20)

### Security Operations
| Skill | Description | Trigger |
|-------|-------------|---------|
| `/recon` | Security reconnaissance orchestrator | "scan target", "port scan" |
| `/exploit-dev` | CTF & exploit development | "write exploit", "pwn this" |
| `/web-scan` | OWASP Top 10 web app scanner | "test web app", "check for SQLi" |
| `/osint` | Open source intelligence | "gather intel", "digital footprint" |
| `/forensics` | Digital forensics & evidence analysis | "analyze dump", "steganography" |
| `/packet-analysis` | Network packet capture analysis | "analyze pcap", "network forensics" |
| `/threat-intel` | Threat intelligence & IOC enrichment | "check this IOC", "MITRE mapping" |
| `/crypto-crack` | Cryptography analysis & cracking | "decrypt this", "break cipher" |
| `/hash-crack` | Hash identification & cracking | "crack this hash", "what hash" |
| `/decompile` | Reverse engineering & decompilation | "reverse engineer", "disassemble" |
| `/enum` | Detailed service enumeration | "enumerate services", "fingerprint" |
| `/pivot` | Post-exploitation & lateral movement | "lateral movement", "escalate" |
| `/phish-detect` | Phishing & social engineering detection | "is this phishing", "suspicious email" |
| `/audit` | Code security audit | "audit this code", "find security bugs" |
| `/report` | Professional security report generation | "pentest report", "CTF writeup" |

### Research & Orchestration
| Skill | Description | Trigger |
|-------|-------------|---------|
| `/research` | Fan-out/fan-in parallel research | "deep research", "compare options" |
| `/stochastic` | Stochastic consensus for decisions | "debate this", "multiple perspectives" |
| `/playwright-cli` | Token-efficient browser automation | "browse to", "test the UI" |
| `/heartbeat` | Session startup system check | "system check", "status report" |
| `/wrap-up` | Session close + memory update | "close session", "done for now" |

## Agents (15)

### Security Specialists
| Agent | Model | Purpose |
|-------|-------|---------|
| `recon-agent` | Haiku | Fast 4-phase recon (passive, active, enum, vuln) |
| `exploit-agent` | Sonnet | Exploit dev in isolated worktree |
| `web-scanner` | Sonnet | OWASP Top 10 systematic testing |
| `osint-agent` | Haiku | Open source intelligence collection |
| `forensics-agent` | Sonnet | File system, memory, network forensics |
| `malware-analyst` | Sonnet | Static malware analysis (isolated worktree) |
| `network-analyst` | Sonnet | Packet capture analysis & anomaly detection |
| `crypto-agent` | Haiku | Cipher identification & cryptanalysis |
| `threat-intel` | Haiku | IOC enrichment & MITRE ATT&CK mapping |
| `decompiler` | Sonnet | Binary reverse engineering & decompilation |
| `social-engineer` | Haiku | Phishing detection & social engineering defense |
| `report-writer` | Sonnet | Professional security report generation |

### Research & Automation
| Agent | Model | Purpose |
|-------|-------|---------|
| `researcher` | Haiku | Single-angle parallel research (fan-out) |
| `synthesizer` | Opus | Multi-agent consensus aggregation (fan-in) |
| `browser-qa` | Sonnet | Headless UI testing via Playwright CLI |

## Key Patterns

### Fan-Out/Fan-In Research
Spawn 3-5 cheap Haiku agents to investigate different angles in parallel, then synthesize with Opus for consensus-finding. The `/stochastic` skill extends this with debate personas (Pragmatist, Perfectionist, Skeptic, Innovator, Historian).

### 4-Layer Bowser Pattern (Browser Automation)
1. **Layer 1:** Core Playwright CLI (saves 90K tokens vs MCP)
2. **Layer 2:** Specialized `browser-qa` sub-agent
3. **Layer 3:** Orchestration commands (`/playwright-cli`)
4. **Layer 4:** Justfile bindings for one-keystroke execution

### Ralph Loop (Self-Healing)
Hooks return exit code 2 to feed errors back to Claude, forcing self-correction until the issue is resolved. Applied to file size warnings, test failures, and commit gates.

### Authorization Gates
Security skills (`/recon`, `/exploit-dev`, `/web-scan`, `/pivot`, `/osint`) require explicit authorization confirmation before executing. Valid contexts: pentesting, CTF, own infrastructure, security research, educational labs.

### MITRE ATT&CK Integration
Threat intelligence and incident response skills map findings to the MITRE ATT&CK framework for standardized reporting and detection engineering.

## Hooks

| Hook | Trigger | Action |
|------|---------|--------|
| Large file warning | PreToolUse (Read) | Exit code 2 Ralph Loop if >2000 lines |
| Auto-test | PostToolUse (Edit) | Run related tests, exit code 2 on failure |
| Agent logging | SubagentStop | Log agent activity to `~/.claude/logs/` |

## Recommended Tools

For full capability, install:

```bash
# Recon & scanning
sudo apt install nmap tshark whois dnsutils
pip install httpx
go install github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest
go install github.com/projectdiscovery/nuclei/v3/cmd/nuclei@latest
go install github.com/OJ/gobuster/v3@latest

# Exploit development
pip install pwntools scapy paramiko cryptography pefile yara-python

# Forensics
sudo apt install binwalk foremost exiftool volatility3 steghide

# Browser automation
pip install playwright && npx playwright install chromium

# Hash cracking
sudo apt install hashcat john
```

## Testing

```bash
node --test test/validate-plugin.test.js
```

277 tests validating: plugin structure, agent frontmatter, skill frontmatter, cross-references, hooks, and content quality.

## Configuration

The plugin sets these defaults in `settings.json`:
- Enables experimental agent teams
- Allows git, nmap, python, and just commands

## License

MIT
