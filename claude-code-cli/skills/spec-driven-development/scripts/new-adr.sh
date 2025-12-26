#!/bin/bash
# SOLARIA Spec-Driven Development - New ADR Generator
# Usage: bash new-adr.sh "Decision Title"

TITLE="${1:-Untitled Decision}"
DATE=$(date +%Y-%m-%d)

# Create directory if needed
mkdir -p docs/ADR

# Find next ADR number
LAST_ADR=$(ls docs/ADR/ADR-*.md 2>/dev/null | sort -V | tail -1 | grep -oE 'ADR-[0-9]+' | grep -oE '[0-9]+')
if [ -z "$LAST_ADR" ]; then
    NEXT_NUM="001"
else
    NEXT_NUM=$(printf "%03d" $((10#$LAST_ADR + 1)))
fi

# Convert title to filename
TITLE_SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd 'a-z0-9-')

OUTPUT_FILE="docs/ADR/ADR-${NEXT_NUM}-${TITLE_SLUG}.md"

cat > "$OUTPUT_FILE" << EOF
# ADR-${NEXT_NUM}: ${TITLE}

## Metadata

| Field | Value |
|-------|-------|
| **Author** | Commander |
| **Created** | ${DATE} |
| **Updated** | ${DATE} |
| **Status** | Proposed |

---

## Context

### Problem Statement

[TODO: Describe the problem or situation that requires a decision]

### Background

[TODO: Provide relevant background information, constraints, and requirements]

---

## Decision Drivers

- [TODO: Driver 1]
- [TODO: Driver 2]
- [TODO: Driver 3]

---

## Considered Options

### Option 1: [TODO: Name]

**Description**: [TODO: Brief description]

**Pros**:
- [TODO: Pro 1]
- [TODO: Pro 2]

**Cons**:
- [TODO: Con 1]
- [TODO: Con 2]

---

### Option 2: [TODO: Name]

**Description**: [TODO: Brief description]

**Pros**:
- [TODO: Pro 1]

**Cons**:
- [TODO: Con 1]

---

## Decision

### Chosen Option

**[TODO: Option X: Name]**

### Rationale

[TODO: Explain why this option was chosen over the others]

### Trade-offs Accepted

- [TODO: Trade-off 1]

---

## Consequences

### Positive

- [TODO: Positive consequence 1]

### Negative

- [TODO: Negative consequence 1]

---

## Implementation

### Action Items

- [ ] [TODO: Action 1]
- [ ] [TODO: Action 2]

---

## Validation

### Success Metrics

- [TODO: How we'll know this decision was correct]

### Review Date

[TODO: Date to review this decision's effectiveness]

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| ${DATE} | Commander | Initial proposal |
EOF

echo "✓ Created ADR: $OUTPUT_FILE"
echo ""
echo "Next steps:"
echo "1. Open $OUTPUT_FILE"
echo "2. Describe the problem context"
echo "3. Document all considered options"
echo "4. Record the decision and rationale"
echo "5. List consequences and action items"
echo "6. Get ADR reviewed and status changed to 'Accepted'"
