# SOLARIA Patterns Reference

## PAT-001: Workspace Structure

### Purpose
Establish consistent project organization across all SOLARIA projects.

### Structure
```
project-root/
├── docs/
│   ├── specs/           # Specification documents
│   ├── ADR/             # Architecture Decision Records
│   └── audits/          # Audit reports
├── src/                 # Source code
├── tests/               # Test files
├── scripts/             # Automation scripts
├── .memory/             # Learning logs (JSONL)
├── CLAUDE.md            # AI context file
└── PHASE_STATUS.md      # Progress tracking
```

### Rules
1. Every project MUST have a `docs/specs/` directory
2. Every architectural decision MUST have an ADR
3. Learning logs stored in `.memory/learning_log.jsonl`
4. `PHASE_STATUS.md` updated at each phase completion

---

## PAT-002: Spec-Driven Development

### Purpose
Ensure specification precedes implementation.

### Specification Template
```markdown
# Feature: [Name]

## Overview
[Brief description]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Technical Design
[Architecture decisions]

## API Contract
[If applicable]

## Test Plan
[Testing strategy]

## Dependencies
[External dependencies - triggers PAT-006 if present]
```

### Rules
1. NO code without specification
2. Specification reviewed before implementation
3. Changes to spec require documentation
4. Spec stored in `docs/specs/[feature-name].md`

---

## PAT-003: Quality Gates

### Purpose
Automated validation at every development phase.

### Gate Checkpoints

#### Pre-Implementation Gate
- [ ] Specification document exists
- [ ] Acceptance criteria defined
- [ ] Test plan documented
- [ ] Dependencies identified

#### Post-Implementation Gate
- [ ] All tests passing
- [ ] Coverage ≥75%
- [ ] Zero warnings
- [ ] Zero linting errors
- [ ] Documentation updated

#### Pre-Merge Gate
- [ ] Code review completed
- [ ] All gates passed
- [ ] Session summary generated

### Automation
```bash
# Run all quality gates
bash scripts/quality-gates.sh /path/to/project

# Expected output:
# ✓ Tests: 100% passing
# ✓ Coverage: 82%
# ✓ Warnings: 0
# ✓ Lint: 0 errors
# ✓ Docs: Updated
```

---

## PAT-004: Testing Strategy

### Purpose
Implement TDD with measurable coverage targets.

### TDD Cycle
```
1. RED    → Write failing test
2. GREEN  → Implement to pass
3. REFACTOR → Improve while green
```

### Coverage Targets
| Type | Target |
|------|--------|
| Unit Tests | ≥80% |
| Integration Tests | ≥70% |
| Overall Coverage | ≥75% |

### Test Organization
```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── e2e/            # End-to-end tests
└── fixtures/       # Test data
```

### Rules
1. Tests MUST be written BEFORE implementation
2. No merge without passing tests
3. Coverage must not decrease
4. Test names must be descriptive

---

## PAT-005: Documentation Protocol

### Purpose
Continuous documentation throughout development.

### Documentation Types

#### Code Documentation
- Function/method docstrings
- Complex logic comments
- API documentation

#### Project Documentation
- README.md (project overview)
- CLAUDE.md (AI context)
- CHANGELOG.md (version history)

#### Decision Documentation
- ADRs for architectural decisions
- Learning logs for insights
- Session summaries

### ADR Template
```markdown
# ADR-XXX: [Title]

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
[Why is this decision needed?]

## Decision
[What was decided?]

## Consequences
[What are the implications?]
```

---

## PAT-006: API Verification Protocol (MANDATORY)

### Purpose
Eliminate speculation-driven API design by verifying APIs before use.

### When to Apply
- Integrating ANY external library
- Using ANY third-party API
- Consuming ANY external service
- Using framework features for first time

### Process

#### Step 1: Read Documentation (20 min)
```
1. Locate official documentation
2. Read API reference completely
3. Identify available methods/endpoints
4. Note version requirements
5. Check for breaking changes
```

#### Step 2: Document Verified APIs (10 min)
```markdown
# API Verification: [Library/Service Name]

## Version
[Exact version verified]

## Verified Methods/Endpoints
| Method | Parameters | Returns | Notes |
|--------|------------|---------|-------|
| method1() | param1: Type | ReturnType | Usage notes |

## Example Usage
[Working code example from docs]

## Gotchas
[Common pitfalls discovered]
```

#### Step 3: Design with Reality
```
- Use ONLY verified APIs
- No speculation about "what should exist"
- No assumptions about parameter names
- Test immediately after implementation
```

### Results
| Metric | Without PAT-006 | With PAT-006 |
|--------|-----------------|--------------|
| Compilation Errors | 39 | 0 |
| Debug Time | 4+ hours | <30 min |
| Rework | High | None |

### Example
```
❌ WRONG (Speculation):
"Parser probably has a new() constructor"
→ Write code assuming Parser::new() exists
→ Compilation fails
→ Hours debugging

✓ CORRECT (PAT-006):
1. Read lib.rs documentation
2. Find actual constructor: Parser::from_config(config)
3. Document in verification file
4. Use verified API
→ Works first time
```
