---
name: phish-detect
description: Phishing and social engineering detection. Triggers on /phish-detect, "is this phishing", "analyze email", "check this link", "suspicious email", or "social engineering".
tools: Bash, Read, Write, Grep, Glob, WebFetch
argument-hint: <email_file_or_url_to_check>
---

# /phish-detect — Phishing Detection Orchestrator

## Execution Flow

1. **Classify input:** Email (.eml), URL, message text, screenshot
2. **Spawn `social-engineer` agent** with the input
3. **Agent analyzes:** Technical indicators (headers, SPF/DKIM, URL reputation) + manipulation patterns (urgency, authority, scarcity)
4. **Verdict:** MALICIOUS / SUSPICIOUS / LEGITIMATE with confidence

## Quick Checks
```bash
# Email header analysis
grep -E "^(From|Return-Path|Received|SPF|DKIM|Authentication-Results):" <email.eml>

# URL safety check
curl -sI "<url>" | head -20  # Check redirects
whois $(echo "<url>" | awk -F/ '{print $3}') | grep -i "creation date"  # Domain age

# Domain SPF check
dig txt <domain> | grep "v=spf1"
```

## Red Flags Checklist
- [ ] Sender display name doesn't match email address
- [ ] Lookalike domain (rn→m, l→1, O→0)
- [ ] Urgency language ("act now", "immediately", "suspended")
- [ ] Unexpected attachment (especially .zip, .exe, .docm)
- [ ] Link URL doesn't match displayed text
- [ ] Generic greeting ("Dear Customer" instead of your name)
- [ ] Poor grammar/spelling (decreasingly reliable indicator)
- [ ] Request for credentials or financial action
- [ ] Recently registered domain (<30 days)
- [ ] SPF/DKIM/DMARC failures in headers
