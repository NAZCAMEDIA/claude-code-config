---
name: technical-debt-tracker
description: Tracks and manages technical debt across projects to maintain the SOLARIA zero-debt goal. This skill should be used when identifying, documenting, prioritizing, or auditing technical debt items including TODOs, FIXMEs, workarounds, and architectural compromises.
---

# Technical Debt Tracker

This skill tracks and manages technical debt to maintain the SOLARIA methodology's zero-debt goal.

## Core Principle

> "Technical debt is like financial debt - it must be tracked, measured, and systematically paid down."

## What Counts as Technical Debt

| Type | Example | Priority |
|------|---------|----------|
| **TODO** | Missing feature | Medium |
| **FIXME** | Known bug | High |
| **HACK** | Workaround | High |
| **XXX** | Dangerous code | Critical |
| **Deprecated** | Old API usage | Medium |
| **Performance** | Slow queries | Medium |
| **Security** | Missing validation | Critical |
| **Documentation** | Missing docs | Low |

## Quick Scan

```bash
# Scan project for debt markers
bash scripts/scan-debt.sh /path/to/project

# Output debt report
python scripts/debt-report.py /path/to/project
```

## Debt Item Template

```markdown
## DEBT-XXX: [Title]

| Field | Value |
|-------|-------|
| **Type** | TODO / FIXME / HACK / Security / Performance |
| **Priority** | Critical / High / Medium / Low |
| **Location** | `src/file.ts:123` |
| **Created** | YYYY-MM-DD |
| **Owner** | [name] |

### Description
[What is the debt and why does it exist?]

### Impact
[What problems does this cause?]

### Resolution Plan
[How to fix it]

### Estimated Effort
[S/M/L/XL]
```

## Tracking Methods

### 1. Code Comments (Inline)
```javascript
// TODO(DEBT-001): Implement proper error handling
// FIXME(DEBT-002): Race condition in async operation
// HACK(DEBT-003): Temporary workaround for API bug
```

### 2. Debt Log File
```
.debt/
├── DEBT-001-error-handling.md
├── DEBT-002-race-condition.md
└── index.md  # Summary of all debt
```

### 3. Issue Tracker
- Create issues with `tech-debt` label
- Link to code location
- Track in sprint planning

## Debt Audit Process

### Weekly Audit
```
1. Run debt scan script
2. Review new debt items
3. Update priorities
4. Plan resolution for Critical/High items
```

### Sprint Planning
```
1. Allocate 20% of capacity to debt reduction
2. Include at least one High priority item
3. Never add new debt without tracking
```

## Metrics

### Debt Score Calculation
```
Score = (Critical × 10) + (High × 5) + (Medium × 2) + (Low × 1)

Target: Score < 20
Warning: Score 20-50
Critical: Score > 50
```

### Trend Tracking
```
| Sprint | New Debt | Resolved | Net | Score |
|--------|----------|----------|-----|-------|
| S1     | 5        | 2        | +3  | 35    |
| S2     | 3        | 6        | -3  | 28    |
| S3     | 2        | 5        | -3  | 20    |
```

## Prevention Rules

1. **No merge with new untracked debt**
2. **Every HACK needs a ticket**
3. **TODOs must have owner and date**
4. **Weekly debt review meeting**

## Scan Script

```bash
#!/bin/bash
# scripts/scan-debt.sh

PROJECT_PATH="${1:-.}"

echo "Technical Debt Scan"
echo "==================="
echo ""

echo "TODOs:"
grep -rn "TODO" "$PROJECT_PATH" --include="*.{ts,js,py,rs}" | wc -l

echo "FIXMEs:"
grep -rn "FIXME" "$PROJECT_PATH" --include="*.{ts,js,py,rs}" | wc -l

echo "HACKs:"
grep -rn "HACK" "$PROJECT_PATH" --include="*.{ts,js,py,rs}" | wc -l

echo "XXXs:"
grep -rn "XXX" "$PROJECT_PATH" --include="*.{ts,js,py,rs}" | wc -l

echo ""
echo "Details:"
grep -rn "TODO\|FIXME\|HACK\|XXX" "$PROJECT_PATH" \
  --include="*.{ts,js,py,rs}" \
  | head -20
```

## Resolution Workflow

```
1. Identify debt item
2. Create tracking entry
3. Assess priority and effort
4. Schedule in sprint
5. Implement fix
6. Remove debt marker
7. Update tracking
8. Verify in code review
```

## Integration with CI/CD

```yaml
# .github/workflows/debt-check.yml
- name: Check Technical Debt
  run: |
    DEBT_COUNT=$(grep -rn "TODO\|FIXME\|HACK" src/ | wc -l)
    if [ $DEBT_COUNT -gt 50 ]; then
      echo "Too much technical debt: $DEBT_COUNT items"
      exit 1
    fi
```

## Resources

- [Scan Script](scripts/scan-debt.sh)
- [Report Generator](scripts/debt-report.py)
- [Debt Item Template](assets/debt-item-template.md)
