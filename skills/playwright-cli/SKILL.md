---
name: playwright-cli
description: Token-efficient browser automation using Playwright CLI instead of MCP (saves ~90K tokens). 4-layer Bowser Pattern for headless browsing, UI testing, scraping, and form automation. Triggers on /playwright-cli, "browse to", "test the UI", "scrape", "automate browser", "fill form", or "check the website".
tools: Bash, Read, Write, Grep, Glob
argument-hint: <url_or_task_description>
---

# /playwright-cli — 4-Layer Token-Efficient Browser Automation

## Why CLI Over MCP

The Playwright MCP server dumps the **entire website accessibility tree** into Claude's context window — up to 90,000 tokens per page. The Playwright CLI saves the tree to **local disk** and only feeds Claude a condensed summary. Same capability, fraction of the token cost.

## Layer 1: Core Browser Operations

### Navigate & Snapshot
```bash
python -c "
from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    )
    page = context.new_page()
    page.goto('TARGET_URL', wait_until='networkidle')
    
    # Save full accessibility tree to disk (NOT to context!)
    snapshot = page.accessibility.snapshot()
    with open('a11y_tree.json', 'w') as f:
        json.dump(snapshot, f, indent=2)
    
    # Save screenshot
    page.screenshot(path='screenshot.png', full_page=True)
    
    # Save page text content (lightweight)
    content = page.text_content('body')
    with open('page_text.txt', 'w') as f:
        f.write(content or '')
    
    # Save key metrics
    title = page.title()
    url = page.url
    print(f'Title: {title}')
    print(f'URL: {url}')
    print(f'A11y nodes: {len(str(snapshot))} chars saved to a11y_tree.json')
    
    browser.close()
"
```

Then read only the parts you need:
```bash
# Read just the page text (tiny token cost)
cat page_text.txt

# Search accessibility tree for specific elements
python -c "import json; tree=json.load(open('a11y_tree.json')); [print(n) for n in str(tree).split(',') if 'button' in str(n).lower()]"
```

### Form Interaction
```python
page.fill('input[name="email"]', 'value')
page.fill('input[name="password"]', 'value')
page.click('button[type="submit"]')
page.wait_for_load_state('networkidle')
```

### Data Extraction
```python
# Extract structured data
rows = page.query_selector_all('table tr')
data = []
for row in rows:
    cells = row.query_selector_all('td')
    data.append([cell.text_content() for cell in cells])
```

### Multi-Page Flows
```python
# Login -> Navigate -> Extract
page.goto('https://example.com/login')
page.fill('#email', 'user@example.com')
page.fill('#password', 'pass')
page.click('#submit')
page.wait_for_url('**/dashboard')
page.goto('https://example.com/target-page')
```

## Layer 2: QA Testing (via browser-qa agent)

For structured UI testing, spawn the `browser-qa` agent with a user story:

```markdown
## User Story: Login Flow
**URL:** https://app.example.com/login
**Steps:**
1. Navigate to login page
2. Fill email: test@example.com
3. Fill password: testpass123
4. Click "Sign In" button
5. Verify redirect to /dashboard
6. Verify "Welcome" text is visible
```

The browser-qa agent executes headless, captures failures, and returns a structured pass/fail report.

## Layer 3: Orchestration

For multi-page or multi-scenario testing, spawn multiple browser-qa agents in parallel:

```
Agent 1: Test login flow
Agent 2: Test registration flow  
Agent 3: Test password reset flow
Agent 4: Test checkout flow
```

Each runs headless in its own browser instance. Collect and merge all results.

## Layer 4: Justfile Integration

```makefile
# In Justfile
browse url:
    claude --skill playwright-cli "Navigate to {{url}} and summarize the page"

ui-test story:
    claude --skill playwright-cli "Run QA test from {{story}}"

scrape url selector:
    claude --skill playwright-cli "Extract all {{selector}} from {{url}}"
```

## Persistent Sessions

For sites requiring authentication, use persistent browser contexts:

```python
# Save session
context = browser.new_context(storage_state='auth_state.json')
# ... login ...
context.storage_state(path='auth_state.json')

# Reuse session later
context = browser.new_context(storage_state='auth_state.json')
```

## Anti-Detection (When Needed)

For sites with bot detection:
```python
browser = p.chromium.launch(
    headless=True,
    args=[
        '--disable-blink-features=AutomationControlled',
        '--disable-features=IsolateOrigins,site-per-process'
    ]
)
context = browser.new_context(
    user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport={'width': 1920, 'height': 1080},
    locale='en-US'
)
```

## Error Handling

- **Navigation timeout:** Increase with `page.goto(url, timeout=60000)`
- **Element not found:** Use `page.wait_for_selector(sel, timeout=10000)` before interaction
- **Anti-bot block:** Switch to headed mode, add delays, rotate user agents
- **SSL errors:** Use `browser.new_context(ignore_https_errors=True)` for testing only
