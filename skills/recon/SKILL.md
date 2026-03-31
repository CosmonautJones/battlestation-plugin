---
name: recon
description: Security reconnaissance skill for authorized penetration testing and CTF competitions. Triggers on /recon, "scan target", "enumerate", "port scan", "subdomain", or "vulnerability scan". Requires explicit target authorization.
tools: Bash, Read, Write, Grep, Glob
context: fork
disable-model-invocation: true
argument-hint: <target_host_or_ip>
---

# /recon — Security Reconnaissance Orchestrator

## Authorization Gate

**CRITICAL: Before ANY scanning, you MUST confirm authorization.**

Ask the user:
> "I'm about to perform security reconnaissance on `<target>`. Do you have explicit authorization to scan this target? (pentest engagement, CTF, your own infrastructure, or authorized security research)"

If the user does not confirm authorization, **STOP immediately**. Do not scan.

Permitted contexts:
- Pentesting engagements with signed authorization
- CTF competitions and challenges
- User's own infrastructure/servers
- Authorized security research
- Educational/lab environments (e.g., HackTheBox, TryHackMe, VulnHub)

## Execution Flow

### Step 1: Target Validation
Parse the target argument. Determine if it's:
- A single IP address
- A hostname/domain
- A CIDR range
- A URL (extract the host)

### Step 2: Tool Availability Check
Check which tools are installed:
```bash
which nmap subfinder httpx gobuster feroxbuster nuclei dig whois curl 2>/dev/null
```
Report any missing tools and adjust the scan plan accordingly.

### Step 3: Spawn Recon Agent
Use the `recon-agent` to execute the 4-phase reconnaissance:

1. **Passive Recon** — WHOIS, DNS, subdomains, certificate transparency
2. **Active Scanning** — Nmap port/service scanning
3. **Service Enumeration** — HTTP probing, directory discovery, banner grabbing
4. **Vulnerability Scanning** — Nuclei templates, NSE scripts

Pass the target and available tools list to the agent.

### Step 4: Report Generation
The recon-agent writes `recon_report_<target>.md` in the working directory.

Review the report for:
- Completeness (all available phases executed)
- Accuracy (no scan errors or timeouts left unaddressed)
- Actionability (clear next steps for further investigation)

### Step 5: Present Results
Summarize the key findings to the user:
- Number of open ports
- Critical/high severity vulnerabilities found
- Interesting services or misconfigurations
- Recommended next steps (further enumeration, exploit research, etc.)

## Quick Reference: Common Targets for Practice

- `scanme.nmap.org` — Nmap's authorized test target
- HackTheBox / TryHackMe machines (with active subscription)
- Local VMs (VulnHub images)
- `localhost` / `127.0.0.1` (your own services)

## Error Handling

- If nmap isn't installed: suggest `sudo apt install nmap` or `choco install nmap`
- If scan times out: retry with reduced port range or faster timing (`-T4`)
- If permission denied: suggest running with appropriate privileges
- If target unreachable: verify network connectivity, check for VPN requirements
