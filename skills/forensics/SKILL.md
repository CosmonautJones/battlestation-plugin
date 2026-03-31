---
name: forensics
description: Digital forensics and evidence analysis. Triggers on /forensics, "analyze dump", "memory forensics", "disk image", "investigate incident", "extract evidence", or "steganography".
tools: Bash, Read, Write, Grep, Glob
context: fork
argument-hint: <evidence_file_or_case_description>
---

# /forensics — Digital Forensics Orchestrator

## Evidence Handling

**CRITICAL: Preserve evidence integrity.**
1. Hash the original file immediately: `sha256sum <evidence>`
2. Work on copies only: `cp <evidence> <evidence>.working`
3. Document every action in an evidence log

## Execution Flow

1. **Classify evidence type:** Memory dump, disk image, PCAP, file artifact, log file
2. **Route to appropriate agent:**
   - Memory/disk/files/stego → `forensics-agent`
   - Malware samples → `malware-analyst` (isolated worktree)
   - Network captures → `network-analyst`
3. **Agent performs analysis pipeline** (identification → extraction → correlation → reporting)
4. **Compile timeline** across all evidence sources
5. **Generate IOC list** for threat hunting

## Quick Reference
```bash
# File identification
file <artifact> && binwalk <artifact> && exiftool <artifact>

# Memory dump analysis
volatility -f <dump> imageinfo
volatility -f <dump> pslist
volatility -f <dump> netscan

# Steganography
zsteg <png>
steghide extract -sf <jpg> -p ""
binwalk -e <file>

# PCAP quick look
tshark -r <pcap> -z io,phs
tshark -r <pcap> -z conv,tcp
```
