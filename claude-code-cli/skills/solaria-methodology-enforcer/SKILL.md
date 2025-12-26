---
name: solaria-methodology-enforcer
description: Enforces SOLARIA methodology patterns (PAT-001 to PAT-006) and detects antipatterns (ANTI-001 to ANTI-006) during software development. This skill should be used when developing any feature, implementing integrations, or reviewing code quality. Automatically triggers PAT-006 API Verification Protocol for external dependencies.
---

# SOLARIA Methodology Enforcer

This skill ensures consistent application of the SOLARIA methodology across all development activities, guaranteeing zero technical debt, 80% reduction in debugging time, and 90% reduction in rework.

## Core Principles

1. **Specification First**: No code without specification
2. **Test-Driven**: Tests precede implementation
3. **Zero Technical Debt**: Measurable and enforced
4. **Continuous Documentation**: Every decision recorded
5. **Quality Gates**: Automated validation at every phase

## When to Apply This Skill

- Starting any new feature or module
- Integrating with external dependencies (triggers PAT-006)
- Reviewing code for quality compliance
- Auditing existing code for antipatterns
- Planning refactoring efforts

## Workflow

### Phase 1: Specification
1. Create specification document BEFORE any code
2. Define acceptance criteria
3. Document technical design decisions
4. If external dependencies involved → trigger PAT-006

### Phase 2: Implementation
1. Write tests FIRST (TDD)
2. Implement to pass tests
3. Refactor while maintaining green tests
4. Document as you code

### Phase 3: Validation
1. Run quality gates checklist
2. Verify coverage ≥75%
3. Check for antipatterns
4. Generate session summary

## Patterns Reference

For detailed pattern documentation, load [references/patterns.md](references/patterns.md).

| Pattern | Name | Purpose |
|---------|------|---------|
| PAT-001 | Workspace Structure | Consistent project organization |
| PAT-002 | Spec-Driven Development | Specification precedes code |
| PAT-003 | Quality Gates | Automated validation checkpoints |
| PAT-004 | Testing Strategy | TDD with ≥75% coverage |
| PAT-005 | Documentation Protocol | Continuous documentation |
| PAT-006 | API Verification Protocol | **MANDATORY** for external APIs |

## Antipatterns Reference

For detailed antipattern documentation, load [references/antipatterns.md](references/antipatterns.md).

| Antipattern | Name | Risk |
|-------------|------|------|
| ANTI-001 | Copy-Paste Without Comprehension | High |
| ANTI-002 | Tests as Afterthought | Critical |
| ANTI-003 | Accumulated Technical Debt | Critical |
| ANTI-004 | Speculation-Driven API Design | Critical |
| ANTI-005 | Hidden Technical Debt | High |
| ANTI-006 | Undocumented Decisions | Medium |

## Quality Gates Checklist

Before completing any phase, verify:

```
[ ] Tests written BEFORE implementation
[ ] All tests passing (100%)
[ ] Code coverage ≥75%
[ ] Zero compiler warnings
[ ] Zero linting errors
[ ] Documentation updated
[ ] No TODO/FIXME without tracking
[ ] Session summary generated
```

To run automated checks, execute:
```bash
bash scripts/quality-gates.sh /path/to/project
```

## Detection Commands

To detect antipatterns in code:
```bash
python scripts/detect-antipatterns.py /path/to/project
```

To verify coverage threshold:
```bash
bash scripts/check-coverage.sh /path/to/project 75
```

## Integration Decision Tree

```
New Task Received
    │
    ├─ Is it a new feature?
    │   └─ YES → Create spec document (PAT-002)
    │            └─ Does it use external APIs/libraries?
    │                └─ YES → Apply PAT-006 (MANDATORY)
    │
    ├─ Is it a bug fix?
    │   └─ YES → Write failing test first
    │            └─ Fix to make test pass
    │
    └─ Is it refactoring?
        └─ YES → Ensure tests exist first
                 └─ Refactor with green tests
```

## Metrics to Track

| Metric | Target | Measurement |
|--------|--------|-------------|
| Test Coverage | ≥75% | Automated |
| Tests Passing | 100% | Automated |
| Compiler Warnings | 0 | Automated |
| Technical Debt Items | 0 | Manual review |
| Documentation Coverage | 100% | Manual review |

## Session Summary Template

At the end of each development session, generate:

```markdown
## Session Summary - [DATE]

### Completed
- [List of completed items]

### Metrics
- Coverage: X%
- Tests: X passing / X total
- Warnings: X

### Learnings
- [Key learnings from this session]

### Next Steps
- [Immediate next actions]
```

## Examples

### Example 1: New Feature with External API

```
1. "I need to integrate Stripe payments"
2. → Detect external dependency (Stripe)
3. → Trigger PAT-006 API Verification Protocol
4. → Read Stripe API docs (20 min)
5. → Document verified APIs
6. → Create specification
7. → Write tests
8. → Implement
9. → Validate quality gates
```

### Example 2: Bug Fix

```
1. "The login form fails silently"
2. → Write failing test that reproduces bug
3. → Implement fix
4. → Verify test passes
5. → Check no regressions
6. → Document fix in session summary
```

## Resources

- [Patterns Documentation](references/patterns.md)
- [Antipatterns Documentation](references/antipatterns.md)
- [Quality Gates Script](scripts/quality-gates.sh)
- [Antipattern Detector](scripts/detect-antipatterns.py)
- [Coverage Checker](scripts/check-coverage.sh)
