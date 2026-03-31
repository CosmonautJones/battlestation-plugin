---
name: threat-intel
description: Threat intelligence gathering and analysis. Triggers on /threat-intel, "check this IOC", "threat assessment", "is this IP malicious", "MITRE mapping", or "threat actor research".
tools: Bash, Read, Write, Grep, Glob, WebFetch, WebSearch
context: fork
argument-hint: <ioc_or_threat_actor_name>
---

# /threat-intel — Threat Intelligence Orchestrator

## Execution Flow

1. **Classify input:** IP, domain, hash, email, threat actor name, CVE
2. **Spawn `threat-intel` agent** with the input and classification
3. **Agent queries open threat feeds:** OTX, AbuseIPDB, GreyNoise, VirusTotal (if API key), Shodan
4. **Map to MITRE ATT&CK** framework
5. **Generate intelligence brief** with confidence ratings and defensive recommendations

## Quick IOC Checks
```bash
# IP reputation
whois <ip>
curl -s "https://api.greynoise.io/v3/community/<ip>"

# Domain reputation
whois <domain>
dig <domain> ANY
curl -s "https://crt.sh/?q=%25.<domain>&output=json" | python -m json.tool | head -50

# CVE lookup
curl -s "https://cveawg.mitre.org/api/cve/<CVE-ID>"
```

## MITRE ATT&CK Quick Reference
- **TA0001** Initial Access | **TA0002** Execution | **TA0003** Persistence
- **TA0004** Privilege Escalation | **TA0005** Defense Evasion | **TA0006** Credential Access
- **TA0007** Discovery | **TA0008** Lateral Movement | **TA0009** Collection
- **TA0010** Exfiltration | **TA0011** Command and Control | **TA0040** Impact
