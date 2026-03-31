---
name: enum
description: Detailed service and system enumeration. Triggers on /enum, "enumerate services", "what's running", "service detection", "banner grab", or "fingerprint".
tools: Bash, Read, Write, Grep, Glob
context: fork
argument-hint: <target_host_and_optional_port>
---

# /enum — Service Enumeration Orchestrator

## Execution Flow

1. **Parse target** (host + optional port/service)
2. **Run service-specific enumeration** based on detected services
3. **Compile detailed service profile**

## Service-Specific Enumeration

### HTTP/HTTPS (80, 443, 8080, 8443)
```bash
# Technology stack
curl -sI "$TARGET" | grep -i server
httpx -u "$TARGET" -tech-detect -status-code -title -follow-redirects

# Directories
gobuster dir -u "$TARGET" -w /usr/share/wordlists/dirb/common.txt -t 20

# Virtual hosts
gobuster vhost -u "$TARGET" -w /usr/share/wordlists/subdomains.txt

# API endpoints
curl -s "$TARGET/api/" "$TARGET/swagger.json" "$TARGET/openapi.json" "$TARGET/graphql"
```

### SSH (22)
```bash
nmap -sV -p22 --script ssh-auth-methods,ssh-hostkey "$TARGET"
# Check for weak key exchange algorithms
ssh -v "$TARGET" 2>&1 | grep "kex:"
```

### SMB (139, 445)
```bash
nmap -sV -p139,445 --script smb-enum-shares,smb-enum-users,smb-os-discovery "$TARGET"
smbclient -L "//$TARGET" -N
enum4linux -a "$TARGET"
```

### DNS (53)
```bash
dig axfr @"$TARGET" <domain>           # Zone transfer
dig ANY @"$TARGET" <domain>
nmap -sV -p53 --script dns-nsid,dns-recursion "$TARGET"
```

### FTP (21)
```bash
nmap -sV -p21 --script ftp-anon,ftp-syst "$TARGET"
# Check anonymous login
curl -s "ftp://$TARGET/"
```

### SMTP (25, 587)
```bash
nmap -sV -p25,587 --script smtp-commands,smtp-enum-users "$TARGET"
```

### MySQL (3306) / PostgreSQL (5432)
```bash
nmap -sV -p3306 --script mysql-info,mysql-enum "$TARGET"
nmap -sV -p5432 --script pgsql-brute "$TARGET"
```

### SNMP (161)
```bash
snmpwalk -v2c -c public "$TARGET"
onesixtyone "$TARGET" public
```

### RDP (3389)
```bash
nmap -sV -p3389 --script rdp-enum-encryption "$TARGET"
```
