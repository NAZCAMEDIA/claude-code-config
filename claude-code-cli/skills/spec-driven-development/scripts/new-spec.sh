#!/bin/bash
# SOLARIA Spec-Driven Development - New Specification Generator
# Usage: bash new-spec.sh "Feature Name"

FEATURE_NAME="${1:-New Feature}"
DATE=$(date +%Y-%m-%d)

# Convert feature name to filename (lowercase, hyphens)
FILENAME=$(echo "$FEATURE_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd 'a-z0-9-')

# Create directory if needed
mkdir -p docs/specs

OUTPUT_FILE="docs/specs/${FILENAME}.md"

if [ -f "$OUTPUT_FILE" ]; then
    echo "⚠️  Specification already exists: $OUTPUT_FILE"
    read -p "Overwrite? (y/N) " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "Aborted."
        exit 1
    fi
fi

cat > "$OUTPUT_FILE" << EOF
# Spec: ${FEATURE_NAME}

## Metadata

| Field | Value |
|-------|-------|
| **Author** | Commander |
| **Created** | ${DATE} |
| **Status** | Draft |
| **Priority** | P1 |
| **Estimated Effort** | M |

## Overview

### Problem Statement
[TODO: What problem does this solve? Why is it needed?]

### Proposed Solution
[TODO: High-level description of the solution]

### Goals
- [TODO: Goal 1]
- [TODO: Goal 2]

### Non-Goals
- [TODO: What this feature intentionally does NOT do]

---

## Acceptance Criteria

### Functional Requirements

- [ ] [TODO: Criterion 1 - specific, measurable, testable]
- [ ] [TODO: Criterion 2]
- [ ] [TODO: Criterion 3]

### Non-Functional Requirements

- [ ] Performance: [TODO: e.g., Response time < 200ms]
- [ ] Security: [TODO: e.g., Input sanitization required]
- [ ] Accessibility: [TODO: e.g., WCAG 2.1 AA compliance]

---

## Technical Design

### Architecture Overview

\`\`\`
[TODO: ASCII diagram or description of architecture]
\`\`\`

### Components

#### Component 1: [TODO: Name]
- **Purpose**: [TODO: What it does]
- **Responsibilities**: [TODO: List]
- **Interface**: [TODO: Public API/methods]

### Data Flow

\`\`\`
1. [TODO: Step 1]
2. [TODO: Step 2]
3. [TODO: Step 3]
\`\`\`

---

## API Contract

### Endpoints (if applicable)

#### \`POST /api/resource\`

**Request:**
\`\`\`json
{
  "field1": "string"
}
\`\`\`

**Response (200 OK):**
\`\`\`json
{
  "id": "uuid",
  "field1": "string"
}
\`\`\`

---

## Dependencies

### External Dependencies (Require PAT-006)

| Dependency | Version | Purpose | Verification Status |
|------------|---------|---------|---------------------|
| [TODO] | [x.y.z] | [purpose] | [ ] Pending |

### Internal Dependencies

| Module | Purpose |
|--------|---------|
| [TODO] | [purpose] |

---

## Test Plan

### Unit Tests

| Test Case | Description | Priority |
|-----------|-------------|----------|
| [TODO] | [what it tests] | High |

### Integration Tests

| Test Case | Description |
|-----------|-------------|
| [TODO] | [what it tests] |

### Edge Cases

- [ ] [TODO: Edge case 1]
- [ ] [TODO: Error handling case]

---

## Security Considerations

- [ ] Input validation implemented
- [ ] Authentication required
- [ ] Authorization checks in place

---

## Rollout Plan

### Phase 1: Development
- [ ] Implementation complete
- [ ] Unit tests passing
- [ ] Code review approved

### Phase 2: Deployment
- [ ] Staging deployment
- [ ] Production deployment

### Rollback Plan

[TODO: How to rollback if issues occur]

---

## Open Questions

- [ ] [TODO: Question that needs resolution]

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| ${DATE} | Commander | Initial draft |
EOF

echo "✓ Created specification: $OUTPUT_FILE"
echo ""
echo "Next steps:"
echo "1. Open $OUTPUT_FILE"
echo "2. Fill in all TODO sections"
echo "3. Define acceptance criteria"
echo "4. Identify dependencies (apply PAT-006 for external)"
echo "5. Get spec reviewed and approved"
echo "6. Begin implementation"
