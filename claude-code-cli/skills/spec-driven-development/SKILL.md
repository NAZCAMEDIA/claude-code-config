---
name: spec-driven-development
description: Creates specification documents BEFORE any implementation following PAT-002 pattern. This skill should be used when starting any new feature, module, component, or refactor. Generates structured specs with acceptance criteria, technical design, test requirements, and Architecture Decision Records (ADRs).
---

# Spec-Driven Development (PAT-002)

This skill ensures that every feature, module, or change is properly specified BEFORE any implementation begins. No code without specification.

## Core Principle

> "If you can't specify it, you can't build it correctly."

## When to Use This Skill

- Starting a new feature
- Creating a new module or component
- Beginning a refactor
- Making architectural decisions
- Planning API changes
- Designing database schemas

## Workflow

```
1. Receive Task/Requirement
        │
2. Create Specification Document
        │
3. Define Acceptance Criteria
        │
4. Design Technical Approach
        │
5. Identify Dependencies (→ PAT-006 if external)
        │
6. Document Test Strategy
        │
7. Review & Approve Spec
        │
8. Begin Implementation
```

## Specification Document Structure

Every spec document MUST contain:

1. **Overview** - What and why
2. **Acceptance Criteria** - Measurable success conditions
3. **Technical Design** - How it will be built
4. **API Contract** - Interfaces and data structures
5. **Dependencies** - External and internal
6. **Test Plan** - Testing strategy
7. **Rollout Plan** - How to deploy safely

## Creating a New Spec

### Step 1: Create the Document

```bash
# Use the generator script
bash scripts/new-spec.sh "Feature Name"

# Or manually
mkdir -p docs/specs
touch docs/specs/feature-name.md
```

### Step 2: Fill the Template

Use the template at [assets/spec-template.md](assets/spec-template.md).

### Step 3: Define Acceptance Criteria

Write testable, measurable criteria:

```markdown
## Acceptance Criteria

- [ ] User can login with email and password
- [ ] Invalid credentials show error message within 2 seconds
- [ ] Successful login redirects to dashboard
- [ ] Session expires after 24 hours of inactivity
- [ ] Failed attempts are rate-limited after 5 failures
```

**Rules for good acceptance criteria:**
- Specific and measurable
- Written from user perspective
- Testable (can write a test for it)
- Independent (doesn't depend on other criteria)

### Step 4: Technical Design

Document the implementation approach:

```markdown
## Technical Design

### Architecture
[Describe the architectural approach]

### Components
- Component A: [purpose]
- Component B: [purpose]

### Data Flow
[Describe how data moves through the system]

### State Management
[How state is managed]
```

### Step 5: Identify Dependencies

List all dependencies and trigger PAT-006 for external ones:

```markdown
## Dependencies

### External (Require PAT-006)
- [ ] axios@1.6.2 - HTTP client [VERIFIED: docs/api-verification/axios.md]
- [ ] bcrypt@5.1.1 - Password hashing [PENDING VERIFICATION]

### Internal
- AuthService - User authentication
- UserRepository - Database access
```

### Step 6: Test Plan

Define the testing strategy:

```markdown
## Test Plan

### Unit Tests
- [ ] Test valid credentials
- [ ] Test invalid credentials
- [ ] Test rate limiting

### Integration Tests
- [ ] Test full login flow
- [ ] Test session management

### E2E Tests
- [ ] Test login UI flow
- [ ] Test error states
```

## Architecture Decision Records (ADRs)

For significant architectural decisions, create an ADR:

```bash
bash scripts/new-adr.sh "Database Choice"
```

### ADR Template

See [assets/adr-template.md](assets/adr-template.md).

### When to Create an ADR

- Choosing between technologies
- Deciding on architectural patterns
- Making security decisions
- Selecting third-party services
- Changing existing architecture

## Spec Review Checklist

Before approving a spec:

```
[ ] Overview is clear and concise
[ ] All acceptance criteria are testable
[ ] Technical design is complete
[ ] Dependencies are identified
[ ] External dependencies have PAT-006 verification
[ ] Test plan covers all acceptance criteria
[ ] Rollout plan considers failure scenarios
[ ] ADRs created for major decisions
```

## Examples

### Example 1: Simple Feature Spec

```markdown
# Spec: User Profile Avatar Upload

## Overview
Allow users to upload and change their profile avatar.

## Acceptance Criteria
- [ ] User can upload JPG, PNG, or GIF images
- [ ] Maximum file size is 5MB
- [ ] Avatar is cropped to square (1:1 ratio)
- [ ] Avatar displays in header within 1 second of upload
- [ ] Invalid files show descriptive error message

## Technical Design
### Components
- AvatarUploader (React component)
- ImageProcessor (server-side)
- S3Storage (file storage)

### Data Flow
1. User selects file
2. Client validates type and size
3. Upload to server
4. Server processes and stores
5. Update user record
6. Return new avatar URL

## Dependencies
### External
- sharp@0.33.0 - Image processing [VERIFIED]
- @aws-sdk/client-s3@3.400.0 - S3 uploads [VERIFIED]

## Test Plan
- Unit: Validate file types, sizes
- Integration: Full upload flow
- E2E: UI upload interaction
```

### Example 2: ADR for Database Choice

```markdown
# ADR-001: Use PostgreSQL for Primary Database

## Status
Accepted

## Context
We need a primary database for storing user data, content,
and application state. Options considered:
- PostgreSQL
- MySQL
- MongoDB

## Decision
Use PostgreSQL 16.

## Rationale
- ACID compliance for financial transactions
- JSON support for flexible schemas
- Strong community and tooling
- Team familiarity

## Consequences
- Need PostgreSQL expertise on team
- Higher hosting costs than MySQL
- Must manage migrations carefully
```

## Scripts

### Create New Spec
```bash
bash scripts/new-spec.sh "Feature Name"
# Creates: docs/specs/feature-name.md
```

### Create New ADR
```bash
bash scripts/new-adr.sh "Decision Title"
# Creates: docs/ADR/ADR-XXX-decision-title.md
```

### Validate Spec
```bash
python scripts/validate-spec.py docs/specs/feature-name.md
# Checks all required sections are present
```

## Integration with Development Workflow

```
┌─────────────────────────────────────────────────────┐
│                   SPEC PHASE                        │
├─────────────────────────────────────────────────────┤
│  1. Create spec document                            │
│  2. Define acceptance criteria                      │
│  3. Design technical approach                       │
│  4. Identify dependencies                           │
│  5. Create ADRs for major decisions                 │
│  6. Review and approve                              │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│                VERIFICATION PHASE                   │
├─────────────────────────────────────────────────────┤
│  If external dependencies identified:               │
│  → Apply PAT-006 API Verification Protocol          │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│               IMPLEMENTATION PHASE                  │
├─────────────────────────────────────────────────────┤
│  1. Write tests (TDD)                               │
│  2. Implement to pass tests                         │
│  3. Refactor                                        │
│  4. Update spec if needed                           │
└─────────────────────────────────────────────────────┘
```

## Resources

- [Specification Template](assets/spec-template.md)
- [ADR Template](assets/adr-template.md)
- [New Spec Script](scripts/new-spec.sh)
- [New ADR Script](scripts/new-adr.sh)
- [Spec Validator](scripts/validate-spec.py)
