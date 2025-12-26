#!/bin/bash
# SOLARIA Session Summary Generator
# Usage: bash generate-summary.sh [project-name]

PROJECT_NAME="${1:-$(basename $(pwd))}"
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H:%M)

# Create directory
mkdir -p docs/sessions

OUTPUT_FILE="docs/sessions/${DATE}-session.md"

# Get git info if available
if git rev-parse --git-dir > /dev/null 2>&1; then
    COMMITS_TODAY=$(git log --oneline --since="midnight" 2>/dev/null | wc -l | tr -d ' ')
    FILES_CHANGED=$(git diff --stat HEAD~${COMMITS_TODAY:-1} 2>/dev/null | tail -1 || echo "N/A")
    RECENT_COMMITS=$(git log --oneline -5 2>/dev/null)
else
    COMMITS_TODAY="N/A"
    FILES_CHANGED="N/A"
    RECENT_COMMITS="Not a git repository"
fi

cat > "$OUTPUT_FILE" << EOF
# Session Summary

## Metadata

| Field | Value |
|-------|-------|
| **Date** | ${DATE} |
| **Time** | ${TIME} |
| **Project** | ${PROJECT_NAME} |
| **Phase** | Development |
| **Author** | Commander |

---

## Completed Work

### Features/Tasks
- [ ] [TODO: List completed tasks]

### Code Changes
- **Commits Today**: ${COMMITS_TODAY}
- **Changes**: ${FILES_CHANGED}

### Recent Commits
\`\`\`
${RECENT_COMMITS}
\`\`\`

---

## Metrics

### Code Quality
| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Test Coverage | TODO% | TODO% | ≥75% |
| Tests Passing | TODO | TODO | 100% |
| Lint Errors | TODO | TODO | 0 |

---

## Learnings

### Technical Discoveries
1. **[TODO: Discovery Title]**
   - Context: [When/where]
   - Insight: [What was learned]

### Gotchas/Pitfalls
- [TODO: Issues encountered]

---

## Blockers & Issues

### Resolved
- [TODO: Issues fixed today]

### Unresolved
- [TODO: Pending issues]

---

## Next Steps

### Immediate (Next Session)
1. [ ] [TODO: Next action]

### Short-term
- [ ] [TODO: This week]

---

## References

- [TODO: Related docs, PRs, issues]

---

## Notes

[TODO: Additional context]
EOF

echo "✓ Created session summary: $OUTPUT_FILE"
echo ""
echo "Next steps:"
echo "1. Open $OUTPUT_FILE"
echo "2. Fill in the TODO sections"
echo "3. Add learnings to the learning log:"
echo "   bash scripts/add-learning.sh 'type' 'category' 'content'"
