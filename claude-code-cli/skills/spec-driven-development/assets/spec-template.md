# Spec: [FEATURE_NAME]

## Metadata

| Field | Value |
|-------|-------|
| **Author** | [name] |
| **Created** | [YYYY-MM-DD] |
| **Status** | Draft / In Review / Approved / Implemented |
| **Priority** | P0 / P1 / P2 / P3 |
| **Estimated Effort** | S / M / L / XL |

## Overview

### Problem Statement
[What problem does this solve? Why is it needed?]

### Proposed Solution
[High-level description of the solution]

### Goals
- [Goal 1]
- [Goal 2]

### Non-Goals
- [What this feature intentionally does NOT do]

---

## Acceptance Criteria

### Functional Requirements

- [ ] [Criterion 1 - specific, measurable, testable]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

### Non-Functional Requirements

- [ ] Performance: [e.g., Response time < 200ms]
- [ ] Security: [e.g., Input sanitization required]
- [ ] Accessibility: [e.g., WCAG 2.1 AA compliance]
- [ ] Scalability: [e.g., Support 1000 concurrent users]

---

## Technical Design

### Architecture Overview

```
[ASCII diagram or description of architecture]
```

### Components

#### Component 1: [Name]
- **Purpose**: [What it does]
- **Responsibilities**:
  - [Responsibility 1]
  - [Responsibility 2]
- **Interface**: [Public API/methods]

#### Component 2: [Name]
- **Purpose**: [What it does]
- **Responsibilities**: [List]
- **Interface**: [Public API/methods]

### Data Model

```sql
-- Database schema changes (if applicable)
CREATE TABLE example (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Data Flow

```
1. [Step 1 - User action or trigger]
2. [Step 2 - System processing]
3. [Step 3 - Data transformation]
4. [Step 4 - Response/output]
```

### State Management

[How state is managed - local, global, server, etc.]

---

## API Contract

### Endpoints (if applicable)

#### `POST /api/resource`

**Request:**
```json
{
  "field1": "string",
  "field2": 123
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "field1": "string",
  "field2": 123,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Errors:**
| Code | Description |
|------|-------------|
| 400 | Invalid input |
| 401 | Unauthorized |
| 500 | Server error |

### Types/Interfaces

```typescript
interface ResourceInput {
  field1: string;
  field2: number;
}

interface ResourceOutput {
  id: string;
  field1: string;
  field2: number;
  createdAt: Date;
}
```

---

## Dependencies

### External Dependencies (Require PAT-006)

| Dependency | Version | Purpose | Verification Status |
|------------|---------|---------|---------------------|
| [library] | [x.y.z] | [purpose] | [ ] Pending / [x] Verified |

### Internal Dependencies

| Module | Purpose |
|--------|---------|
| [module] | [purpose] |

### Infrastructure Dependencies

- [ ] Database changes required
- [ ] New environment variables
- [ ] Third-party service setup
- [ ] Infrastructure provisioning

---

## Test Plan

### Unit Tests

| Test Case | Description | Priority |
|-----------|-------------|----------|
| [test_name] | [what it tests] | High/Medium/Low |

### Integration Tests

| Test Case | Description | Components Involved |
|-----------|-------------|---------------------|
| [test_name] | [what it tests] | [components] |

### E2E Tests

| Test Case | User Flow |
|-----------|-----------|
| [test_name] | [step-by-step flow] |

### Edge Cases

- [ ] [Edge case 1]
- [ ] [Edge case 2]
- [ ] [Error handling case]

---

## Security Considerations

- [ ] Input validation implemented
- [ ] Authentication required
- [ ] Authorization checks in place
- [ ] Sensitive data encrypted
- [ ] Audit logging enabled
- [ ] Rate limiting considered

---

## Rollout Plan

### Phase 1: Development
- [ ] Implementation complete
- [ ] Unit tests passing
- [ ] Code review approved

### Phase 2: Testing
- [ ] Integration tests passing
- [ ] QA approval
- [ ] Performance testing complete

### Phase 3: Deployment
- [ ] Staging deployment
- [ ] Smoke tests passing
- [ ] Production deployment
- [ ] Monitoring configured

### Rollback Plan

[How to rollback if issues occur]

---

## Open Questions

- [ ] [Question 1 that needs resolution]
- [ ] [Question 2]

---

## Related Documents

- [ADR-XXX: Related Decision](../ADR/ADR-XXX.md)
- [API Verification: library](../api-verification/library.md)
- [Previous Spec: related-feature](./related-feature.md)

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| [YYYY-MM-DD] | [name] | Initial draft |
