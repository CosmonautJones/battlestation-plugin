---
name: packet-analysis
description: Network packet capture analysis. Triggers on /packet-analysis, "analyze pcap", "network forensics", "packet capture", "what's in this traffic", or "extract from pcap".
tools: Bash, Read, Write, Grep, Glob
context: fork
argument-hint: <pcap_file_path>
---

# /packet-analysis — Network Packet Analysis Orchestrator

## Execution Flow

1. **Validate PCAP file exists** and get basic stats
2. **Spawn `network-analyst` agent** with the PCAP path
3. **Agent performs 4-phase analysis:** Overview → Protocol analysis → Deep inspection → Anomaly detection
4. **Extract artifacts:** Files, credentials, IOCs
5. **Present findings** with traffic timeline

## Quick Commands
```bash
# Overview
capinfos <pcap>
tshark -r <pcap> -z io,phs

# Find credentials
tshark -r <pcap> -Y "http.authbasic || ftp.request.command==PASS" -T fields -e frame.time -e ip.src -e http.authbasic -e ftp.request.arg

# Extract files
tshark -r <pcap> --export-objects http,./extracted/

# DNS queries
tshark -r <pcap> -Y dns.qry.name -T fields -e dns.qry.name | sort -u

# Follow specific TCP stream
tshark -r <pcap> -z follow,tcp,ascii,0
```
