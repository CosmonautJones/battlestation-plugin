---
name: decompile
description: Reverse engineering and binary decompilation. Triggers on /decompile, "reverse engineer", "decompile this", "analyze binary", "disassemble", "what does this binary do", or "crack me".
tools: Bash, Read, Write, Grep, Glob
context: fork
argument-hint: <binary_file_path>
---

# /decompile — Reverse Engineering Orchestrator

## Execution Flow

1. **Validate binary file** exists and get initial triage (`file`, `checksec`)
2. **Spawn `decompiler` agent** with binary path and triage info
3. **Agent performs 5-phase pipeline:** Triage → Structure mapping → Disassembly → Decompilation → Documentation
4. **Output:** Function map, pseudocode annotations, vulnerability notes
5. **If vulnerabilities found**, suggest routing to `/exploit-dev`

## Quick Triage
```bash
file <binary>
checksec --file=<binary>
strings <binary> | grep -iE "(flag|password|secret|key|admin|shell)" | head -20
readelf -h <binary> 2>/dev/null || objdump -f <binary>
```

## Tool Availability
```bash
# Check what's available
for tool in objdump readelf nm strings gdb r2 ghidra; do
  which $tool 2>/dev/null && echo "$tool: YES" || echo "$tool: NO"
done
```
