---
name: report
description: Professional security report generation. Triggers on /report, "write report", "pentest report", "incident report", "CTF writeup", "executive summary", or "document findings".
tools: Read, Write, Edit, Grep, Glob
argument-hint: <report_type_and_source_files>
---

# /report — Security Report Generator

## Report Types

### Penetration Test Report
Usage: `/report pentest` — reads all `recon_report_*`, `analysis_*`, and `exploit_*` files in the working directory and compiles a professional pentest report.

### Incident Response Report
Usage: `/report incident` — reads forensics reports, IOC lists, and timeline data to produce an IR report.

### CTF Write-up
Usage: `/report ctf <challenge_name>` — reads solve scripts and analysis docs to produce a shareable CTF writeup.

### Executive Summary
Usage: `/report executive` — distills any existing reports into a 1-page executive summary for non-technical leadership.

## Execution Flow

1. **Detect report type** from argument or ask user
2. **Scan working directory** for existing reports, findings, scripts
3. **Spawn `report-writer` agent** with:
   - Report type and template
   - All discovered source files
   - Severity ranking instructions
4. **Agent produces polished report** following professional templates
5. **Output as markdown** file: `report_<type>_<date>.md`

## Quality Standards
- Every finding has: description, impact, evidence, remediation
- Findings ranked by severity (CVSS if applicable)
- Executive summary is jargon-free and under 1 page
- Remediation roadmap with effort estimates and timelines
- All evidence referenced with file paths or inline
