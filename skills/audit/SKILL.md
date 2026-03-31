---
name: audit
description: Code security audit. Triggers on /audit, "audit this code", "security review code", "check for vulnerabilities in code", "code audit", or "find security bugs".
tools: Bash, Read, Write, Grep, Glob
context: fork
argument-hint: <file_path_or_directory>
---

# /audit — Code Security Audit Orchestrator

## Execution Flow

1. **Identify codebase language/framework** from file extensions and config files
2. **Run automated scanners** (if available): semgrep, bandit, npm audit, etc.
3. **Manual pattern analysis:** Search for known vulnerability patterns
4. **Generate severity-ranked report** with specific file:line references

## Automated Scanning
```bash
# Python
bandit -r <path> -f json 2>/dev/null || pip install bandit && bandit -r <path>
# or
semgrep --config auto <path> 2>/dev/null

# JavaScript/TypeScript
npm audit --json 2>/dev/null
npx eslint --no-eslintrc -c '{"rules":{"no-eval":"error"}}' <path> 2>/dev/null

# General
semgrep --config "p/owasp-top-ten" <path> 2>/dev/null
```

## Manual Pattern Search

### Injection Vulnerabilities
```bash
# SQL injection (string concatenation in queries)
grep -rnE "(SELECT|INSERT|UPDATE|DELETE|WHERE).*\+" --include="*.py" --include="*.js" --include="*.ts" <path>
grep -rnE "f\".*SELECT|f'.*SELECT" --include="*.py" <path>  # Python f-string SQL

# Command injection
grep -rnE "(subprocess|exec|system|popen|eval)\s*\(" --include="*.py" <path>
grep -rnE "(child_process|exec|spawn)\s*\(" --include="*.js" --include="*.ts" <path>

# XSS (unescaped output)
grep -rnE "innerHTML|dangerouslySetInnerHTML|v-html" --include="*.js" --include="*.ts" --include="*.tsx" --include="*.vue" <path>
```

### Authentication/Authorization
```bash
# Hardcoded secrets
grep -rnE "(password|secret|api_key|token|apikey)\s*[:=]\s*['\"][^'\"]{8,}" <path>
grep -rnE "(AKIA|ghp_|sk_live|sk_test)" <path>

# Weak crypto
grep -rnE "(md5|sha1|DES|RC4)\(" --include="*.py" --include="*.js" <path>
grep -rnE "Math\.random\(\)" --include="*.js" --include="*.ts" <path>  # Not cryptographically secure
```

### Data Exposure
```bash
# Sensitive data in logs
grep -rnE "(log|print|console\.log).*password" <path>

# Missing input validation
grep -rnE "req\.(body|params|query)\." --include="*.js" --include="*.ts" <path> | grep -v "validat"

# CORS wildcard
grep -rnE "Access-Control-Allow-Origin.*\*" <path>
```

## Output Format

```markdown
# Security Audit: <target>
**Scope:** <files/lines analyzed>
**Date:** <timestamp>

## Summary
| Severity | Count |
|----------|-------|
| Critical | N |
| High | N |
| Medium | N |
| Low | N |

## Findings

### [CRITICAL] <title>
- **File:** <path>:<line>
- **CWE:** CWE-<id>
- **Code:** `<vulnerable code snippet>`
- **Impact:** <what could go wrong>
- **Fix:** <specific remediation>
```
