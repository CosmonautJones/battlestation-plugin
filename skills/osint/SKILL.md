---
name: osint
description: Open source intelligence gathering. Triggers on /osint, "gather intel", "investigate target", "background check", "digital footprint", or "who is this". Requires authorization for person targets.
tools: Bash, Read, Write, Grep, Glob, WebFetch, WebSearch
context: fork
argument-hint: <domain_person_or_organization>
---

# /osint — Open Source Intelligence Orchestrator

## Authorization Gate

For **person** targets: Confirm authorization (HR investigation, threat assessment, self-audit).
For **domain/org** targets: Confirm this is authorized reconnaissance.

## Execution Flow

1. **Classify target type:** Domain, IP, Person, Organization, Email
2. **Check tool availability:** `subfinder`, `httpx`, `whois`, `dig`, `curl`
3. **Spawn `osint-agent`** with target and type classification
4. **Agent executes collection disciplines:** Domain OSINT, Person OSINT, Org OSINT as appropriate
5. **Review report** for completeness and accuracy
6. **Present findings** with attack surface summary (if security context)

## Quick Commands
```bash
# Domain quick profile
whois <domain> && dig <domain> ANY && curl -sI https://<domain>

# Email breach check (ethical - public notifications only)
curl -s "https://haveibeenpwned.com/api/v3/breachedaccount/<email>"

# Subdomain discovery
subfinder -d <domain> -silent | httpx -silent -status-code
```
