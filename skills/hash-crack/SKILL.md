---
name: hash-crack
description: Hash identification and cracking. Triggers on /hash-crack, "crack this hash", "identify hash", "hashcat", "rainbow table", or "what hash is this".
tools: Bash, Read, Write, Edit, Grep, Glob
context: fork
argument-hint: <hash_value_or_file>
---

# /hash-crack — Hash Cracking Orchestrator

## Execution Flow

1. **Identify hash type** by length and format
2. **Select attack strategy:** Dictionary, rules, brute-force, rainbow tables
3. **Execute cracking** with available tools
4. **Report plaintext** or recommend next steps if not cracked

## Hash Identification

| Length | Chars | Likely Type | Hashcat Mode |
|--------|-------|-------------|-------------|
| 32 | hex | MD5 | 0 |
| 40 | hex | SHA1 | 100 |
| 56 | hex | SHA224 | 1300 |
| 64 | hex | SHA256 | 1400 |
| 96 | hex | SHA384 | 10800 |
| 128 | hex | SHA512 | 1700 |
| 60 | `$2b$`/`$2a$` | bcrypt | 3200 |
| 34 | `$1$` | MD5crypt | 500 |
| 34 | `$5$` | SHA256crypt | 7400 |
| 98+ | `$6$` | SHA512crypt | 1800 |
| 32 | `$apr1$` | Apache MD5 | 1600 |

## Attack Methods

### Dictionary Attack
```bash
# Hashcat
hashcat -m <mode> <hash_file> /usr/share/wordlists/rockyou.txt

# John the Ripper
john --wordlist=/usr/share/wordlists/rockyou.txt <hash_file>
```

### Rule-Based Attack
```bash
hashcat -m <mode> <hash_file> /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule
```

### Python (for simple cases)
```python
import hashlib

target = "<hash>"
with open("/usr/share/wordlists/rockyou.txt", "rb") as f:
    for line in f:
        word = line.strip()
        if hashlib.md5(word).hexdigest() == target:
            print(f"Cracked: {word.decode()}")
            break
```

### Online Resources
- CrackStation (pre-computed tables)
- HashKiller database
- cmd5.org
