---
name: pivot
description: Post-exploitation pivoting and lateral movement analysis. Triggers on /pivot, "pivot from", "lateral movement", "post-exploitation", "escalate privileges", or "move laterally". For authorized pentesting and CTF only.
tools: Bash, Read, Write, Grep, Glob
context: fork
disable-model-invocation: true
argument-hint: <current_access_description>
---

# /pivot — Post-Exploitation & Pivoting Orchestrator

## Authorization Gate

**This skill is for authorized pentesting and CTF ONLY.**
Confirm: penetration test engagement, CTF competition, or security lab environment.

## Execution Flow

1. **Assess current position:** What access do we have? What user? What host?
2. **Enumerate locally:** Users, processes, network connections, file system
3. **Identify escalation paths:** SUID, sudo, kernel, services, credentials
4. **Map network position:** Adjacent hosts, routes, ARP table
5. **Document pivot strategy** with exact commands

## Local Enumeration (Linux)
```bash
# Identity
id && whoami && hostname && uname -a

# Users and groups
cat /etc/passwd | grep -v nologin | grep -v false
cat /etc/group

# Network position
ip addr && ip route && arp -a
ss -tlnp  # Listening services
cat /etc/resolv.conf

# Processes
ps auxf

# Interesting files
find / -perm -4000 -type f 2>/dev/null  # SUID binaries
find / -writable -type f 2>/dev/null | head -20
cat /etc/crontab && ls /etc/cron.d/

# Sudo permissions
sudo -l 2>/dev/null

# Credentials
cat ~/.bash_history
find / -name "*.conf" -o -name "*.cfg" -o -name "*.ini" 2>/dev/null | xargs grep -l "password" 2>/dev/null
```

## Local Enumeration (Windows)
```cmd
whoami /all
net user && net localgroup administrators
systeminfo
netstat -ano
tasklist /v
cmdkey /list
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated 2>nul
```

## Privilege Escalation Paths

### Linux
- **SUID abuse:** GTFOBins reference for exploitable SUID binaries
- **Sudo misconfig:** `sudo -l` → check for NOPASSWD or wildcard commands
- **Kernel exploits:** Match `uname -r` against known CVEs
- **Cron jobs:** Writable scripts in cron paths
- **Capabilities:** `getcap -r / 2>/dev/null`
- **Docker escape:** Check if user is in docker group

### Windows
- **Token impersonation:** SeImpersonatePrivilege (Potato family)
- **Service misconfig:** Unquoted service paths, writable service binaries
- **AlwaysInstallElevated:** MSI package escalation
- **DLL hijacking:** Missing DLLs in writable PATH directories
- **Stored credentials:** `cmdkey /list`, browser saved passwords

## Lateral Movement Techniques
- **SSH keys:** `find / -name "id_rsa" -o -name "authorized_keys" 2>/dev/null`
- **Pass-the-hash:** Extracted NTLM hashes for SMB/WMI
- **Port forwarding:** `ssh -L <local>:<target>:<remote> user@pivot`
- **SOCKS proxy:** `ssh -D 1080 user@pivot` for full network access
- **Credential reuse:** Test found passwords against other services/hosts

## Output Format

```markdown
# Pivot Analysis
**Current Position:** <user>@<host>
**Access Level:** <user/root/SYSTEM>

## Local Enumeration Summary
<key findings about current host>

## Escalation Paths Found
| Path | Confidence | Complexity |
|------|-----------|-----------|

## Network Position
<adjacent hosts, reachable services>

## Recommended Next Steps
1. <specific action with exact command>
```
