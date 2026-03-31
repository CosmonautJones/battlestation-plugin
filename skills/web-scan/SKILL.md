---
name: web-scan
description: Web application security scanning. Triggers on /web-scan, "test web app", "OWASP scan", "check for SQLi", "check for XSS", "API security test", or "pentest web".
tools: Bash, Read, Write, Grep, Glob
context: fork
disable-model-invocation: true
argument-hint: <target_url>
---

# /web-scan — Web Application Security Scanner

## Authorization Gate

Confirm the user has authorization to test this web application.

## Execution Flow

1. **Validate target URL** and confirm scope
2. **Check tool availability:** `curl`, `nmap`, `nikto`, `sqlmap`, `nuclei`
3. **Spawn `web-scanner` agent** with target URL and scope
4. **Agent tests OWASP Top 10 systematically:**
   - A01: Broken Access Control (IDOR, privilege escalation, forced browsing)
   - A02: Cryptographic Failures (TLS, cookies, password storage)
   - A03: Injection (SQLi, XSS, SSTI, command injection)
   - A04: Insecure Design (business logic, rate limiting)
   - A05: Security Misconfiguration (headers, defaults, error disclosure)
   - A06: Vulnerable Components (library versions, known CVEs)
   - A07: Auth Failures (session, JWT, password policy)
   - A08: Software Integrity (CI/CD, deserialization)
   - A09: Logging Failures (security event monitoring)
   - A10: SSRF (internal service access, cloud metadata)
5. **Generate severity-ranked report** with evidence and remediation

## Quick Checks
```bash
# Security headers
curl -sI "$URL" | grep -iE "x-frame|x-content|strict-transport|content-security"

# Technology detection
curl -s "$URL" | grep -oE '(jquery|react|angular|vue|bootstrap)[/-][0-9.]+' | sort -u

# Common paths
for path in robots.txt sitemap.xml .git/HEAD .env wp-admin admin login api/swagger; do
  STATUS=$(curl -sL -o /dev/null -w "%{http_code}" "$URL/$path")
  echo "$path: $STATUS"
done
```
