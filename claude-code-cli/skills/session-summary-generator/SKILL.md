---
name: session-summary-generator
description: Generates structured session summaries at the end of development phases following SOLARIA documentation protocol. This skill should be used when completing a feature, sprint, work session, or any significant development milestone to document achievements, metrics, learnings, and next steps.
---

# Session Summary Generator

This skill generates comprehensive session summaries that capture achievements, metrics, learnings, and next steps at the end of development phases.

## When to Use

- End of a development session
- Completing a feature or milestone
- Finishing a sprint or iteration
- Before switching contexts to another project
- After resolving a complex bug
- Any point where documentation of progress is valuable

## Summary Structure

Every session summary includes:

1. **Metadata** - Date, duration, project
2. **Completed Work** - What was accomplished
3. **Metrics** - Coverage, tests, performance
4. **Learnings** - Key insights and discoveries
5. **Blockers/Issues** - Problems encountered
6. **Next Steps** - Immediate follow-up actions
7. **References** - Related docs, commits, PRs

## Quick Generate

To generate a session summary:

```bash
bash scripts/generate-summary.sh
```

Or manually create following the template below.

## Session Summary Template

```markdown
# Session Summary

## Metadata

| Field | Value |
|-------|-------|
| **Date** | YYYY-MM-DD |
| **Duration** | X hours |
| **Project** | [Project Name] |
| **Phase** | [Development/Testing/Deploy/etc.] |
| **Author** | [Name] |

---

## Completed Work

### Features/Tasks
- [x] [Task 1 description]
- [x] [Task 2 description]
- [ ] [Incomplete task - moved to next session]

### Code Changes
- **Files Modified**: X files
- **Lines Added**: +XXX
- **Lines Removed**: -XXX
- **Commits**: X commits

### Key Commits
- `abc1234` - [Commit message]
- `def5678` - [Commit message]

---

## Metrics

### Code Quality
| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Test Coverage | X% | X% | ≥75% |
| Tests Passing | X/X | X/X | 100% |
| Lint Errors | X | X | 0 |
| Type Errors | X | X | 0 |

### Performance (if applicable)
| Metric | Value | Notes |
|--------|-------|-------|
| Build Time | Xs | |
| Test Suite | Xs | |
| Bundle Size | XKB | |

---

## Learnings

### Technical Discoveries
1. **[Discovery Title]**
   - Context: [When/where this was discovered]
   - Insight: [What was learned]
   - Application: [How it can be applied]

### Patterns Identified
- [Pattern or best practice discovered]

### Gotchas/Pitfalls
- [Issue encountered and how to avoid]

---

## Blockers & Issues

### Resolved
- **[Issue]**: [How it was resolved]

### Unresolved
- **[Issue]**: [Current status and plan]

### Technical Debt Created
- [ ] [Debt item] - [Reason for debt]

---

## Next Steps

### Immediate (Next Session)
1. [ ] [Action item 1]
2. [ ] [Action item 2]

### Short-term (This Week)
- [ ] [Action item]

### Backlog
- [ ] [Item to address later]

---

## References

### Documentation
- [Spec: Feature Name](docs/specs/feature.md)
- [ADR-XXX: Decision](docs/ADR/ADR-XXX.md)

### External Resources
- [Relevant documentation link]

### Related PRs/Issues
- PR #XXX - [Description]
- Issue #XXX - [Description]

---

## Notes

[Any additional context or observations]
```

## Learning Log Integration

Session summaries feed into the `.memory/learning_log.jsonl` file:

```jsonl
{"date":"2024-01-15","type":"discovery","category":"api","content":"axios error.response contains full response data","project":"webapp"}
{"date":"2024-01-15","type":"gotcha","category":"testing","content":"Jest mocks must be reset between tests with beforeEach","project":"webapp"}
{"date":"2024-01-15","type":"pattern","category":"react","content":"useCallback with empty deps for stable callbacks in useEffect","project":"webapp"}
```

### Log Entry Types

| Type | Description |
|------|-------------|
| `discovery` | New technical knowledge |
| `gotcha` | Pitfall or common mistake |
| `pattern` | Useful code pattern |
| `decision` | Architecture/design decision |
| `performance` | Performance insight |
| `security` | Security consideration |

## Automation Scripts

### Generate Summary
```bash
bash scripts/generate-summary.sh [project-name]
# Creates: docs/sessions/YYYY-MM-DD-session.md
```

### Add Learning Log Entry
```bash
bash scripts/add-learning.sh "discovery" "api" "axios handles errors differently"
# Appends to: .memory/learning_log.jsonl
```

### View Recent Learnings
```bash
bash scripts/view-learnings.sh 7
# Shows learnings from last 7 days
```

## Best Practices

### Be Specific
```markdown
❌ "Fixed bug"
✓ "Fixed race condition in auth token refresh causing 401 errors on slow connections"
```

### Quantify Progress
```markdown
❌ "Improved coverage"
✓ "Improved coverage from 62% to 78% by adding tests for UserService"
```

### Document Context
```markdown
❌ "Found issue with API"
✓ "Discovered Stripe webhook signature verification requires raw body, not parsed JSON"
```

### Link References
```markdown
❌ "See the PR"
✓ "See PR #142 for implementation details"
```

## Session Summary Checklist

Before finishing a session:

```
[ ] All completed work documented
[ ] Metrics captured (coverage, tests, etc.)
[ ] Key learnings recorded
[ ] Blockers noted with status
[ ] Next steps defined
[ ] Learning log updated
[ ] Summary saved to docs/sessions/
```

## Resources

- [Summary Template](assets/session-summary-template.md)
- [Learning Log Template](assets/learning-log-entry.json)
- [Generate Summary Script](scripts/generate-summary.sh)
- [Add Learning Script](scripts/add-learning.sh)
