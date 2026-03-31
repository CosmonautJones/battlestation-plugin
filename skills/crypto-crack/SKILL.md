---
name: crypto-crack
description: Cryptography analysis and cracking. Triggers on /crypto-crack, "decrypt this", "break cipher", "crypto challenge", "decode", "what cipher is this", or "RSA attack".
tools: Bash, Read, Write, Edit, Grep, Glob
context: fork
argument-hint: <ciphertext_or_challenge_description>
---

# /crypto-crack — Cryptography Analysis Orchestrator

## Execution Flow

1. **Identify the crypto system:** Encoding, classical cipher, modern crypto, hash
2. **Spawn `crypto-agent`** with the ciphertext and any known parameters
3. **Agent performs identification → attack selection → implementation → verification**
4. **Return plaintext/flag** with full solution script

## Quick Identification Guide

| Pattern | Likely Type |
|---------|-------------|
| `=` or `==` at end, A-Za-z0-9+/ | Base64 |
| All hex characters, even length | Hex encoding |
| 32 hex chars | MD5 hash |
| 40 hex chars | SHA1 hash |
| 64 hex chars | SHA256 hash |
| Starts with `$2b$` or `$2a$` | bcrypt |
| Large numbers, e, n, c | RSA |
| `{{...}}` or shifted alphabet | Classical cipher |
| High entropy, fixed block sizes | Block cipher (AES/DES) |

## Common CTF Patterns
- **Multi-layer encoding:** base64 → hex → rot13 → base32 (peel one layer at a time)
- **RSA with small e:** Use Hastad's broadcast attack or cube root
- **RSA with close p,q:** Fermat factorization
- **XOR with repeating key:** Kasiski / IC analysis for key length, then frequency per column
- **ECB mode AES:** Look for repeating blocks in ciphertext
- **Padding oracle:** Byte-at-a-time decryption via padding error oracle
