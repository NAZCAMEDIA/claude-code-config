# SOLARIA Antipatterns Reference

## ANTI-001: Copy-Paste Without Comprehension

### Description
Copying code from examples, Stack Overflow, or AI suggestions without understanding how it works.

### Risk Level
**HIGH**

### Symptoms
- Code that "works but I don't know why"
- Inability to modify copied code
- Unexpected side effects
- Security vulnerabilities from untrusted sources

### Detection
```python
# Signs in code review:
- Inconsistent coding style within file
- Unused variables from copied snippets
- Comments that don't match code
- Magic numbers without explanation
```

### Prevention
1. Read and understand every line before using
2. Rewrite in your own style
3. Add comments explaining purpose
4. Test edge cases

### Remediation
1. Identify copied sections
2. Document what each part does
3. Refactor to project standards
4. Add comprehensive tests

---

## ANTI-002: Tests as Afterthought

### Description
Writing tests after implementation instead of before (violating TDD).

### Risk Level
**CRITICAL**

### Symptoms
- Tests written to pass existing code
- Low coverage in complex areas
- Tests that don't catch bugs
- "Happy path only" testing

### Detection
```bash
# Git history analysis:
git log --oneline --all | grep -E "(add|write).*test"
# If tests always come after features = antipattern

# Coverage analysis:
# Low coverage in complex functions = tests as afterthought
```

### Prevention
1. Write failing test FIRST
2. Implement to pass test
3. Refactor with green tests
4. Review test-to-implementation ratio

### Remediation
1. Stop current implementation
2. Write tests for existing code
3. Identify untested paths
4. Add missing test cases

---

## ANTI-003: Accumulated Technical Debt

### Description
Allowing shortcuts, workarounds, and "temporary" fixes to accumulate without tracking or resolution.

### Risk Level
**CRITICAL**

### Symptoms
- Growing list of TODOs/FIXMEs
- "We'll fix it later" mentality
- Increasing bug reports
- Slower feature development over time

### Detection
```bash
# Count debt markers:
grep -r "TODO\|FIXME\|HACK\|XXX" src/ | wc -l

# Track over time:
# If count increases each sprint = debt accumulating
```

### Prevention
1. Track every debt item
2. Allocate time for debt reduction
3. No new debt without ticket
4. Regular debt reviews

### Remediation
1. Audit all TODOs/FIXMEs
2. Create tracking tickets
3. Prioritize by impact
4. Schedule resolution sprints

---

## ANTI-004: Speculation-Driven API Design

### Description
Assuming how external APIs work without reading documentation.

### Risk Level
**CRITICAL**

### Symptoms
- "It should have a method called..."
- "This parameter probably does..."
- Multiple compilation/runtime errors
- Hours spent debugging API misuse

### Detection
```python
# Code review signals:
- API calls without documentation reference
- Parameter names that don't match docs
- Missing required parameters
- Wrong return type handling
```

### Prevention
**Apply PAT-006 (MANDATORY)**
1. Read documentation first (20 min)
2. Document verified APIs (10 min)
3. Use only verified methods
4. Test immediately

### Remediation
1. Stop implementation
2. Read official documentation
3. Create API verification document
4. Rewrite using verified APIs

### Case Study: BRIK-64
```
Without PAT-006: 39 compilation errors
With PAT-006: 0 compilation errors

Root cause: Assumed pest parser had Parser::new()
Reality: Constructor was Parser::from_config(config)

Time wasted: 4+ hours
Time saved with PAT-006: 30 minutes
```

---

## ANTI-005: Hidden Technical Debt

### Description
Not documenting shortcuts, workarounds, or known issues.

### Risk Level
**HIGH**

### Symptoms
- Surprises during code review
- "I didn't know that was a problem"
- Knowledge silos
- Repeated mistakes

### Detection
```bash
# Look for undocumented workarounds:
grep -r "workaround\|hack\|temporary" src/ --include="*.{js,ts,py,rs}"

# Check for missing documentation:
# Complex functions without comments = likely hidden debt
```

### Prevention
1. Document every shortcut immediately
2. Add TODO with ticket reference
3. Include in code review
4. Update team in standup

### Remediation
1. Code archaeology session
2. Interview original authors
3. Document all discoveries
4. Create tracking tickets

---

## ANTI-006: Undocumented Decisions

### Description
Making architectural or design decisions without recording rationale.

### Risk Level
**MEDIUM**

### Symptoms
- "Why did we do it this way?"
- Repeated discussions about past decisions
- Conflicting implementations
- Knowledge loss when team changes

### Detection
```bash
# Check for ADRs:
ls docs/ADR/ | wc -l
# If major features exist without ADRs = antipattern

# Check commit messages:
git log --oneline | grep -v "^[a-f0-9]* (feat\|fix\|docs)"
# Vague messages = undocumented decisions
```

### Prevention
1. Create ADR for every architectural decision
2. Document alternatives considered
3. Record consequences
4. Review ADRs periodically

### Remediation
1. List major architectural decisions
2. Create retrospective ADRs
3. Interview team about rationale
4. Document for future reference

---

## Antipattern Detection Script

To scan a project for antipatterns:

```bash
python scripts/detect-antipatterns.py /path/to/project
```

Output example:
```
SOLARIA Antipattern Scan Results
================================

ANTI-001 (Copy-Paste): 2 potential instances
  - src/auth.js:45 (inconsistent style)
  - src/utils.js:123 (unused variables)

ANTI-002 (Tests Afterthought): WARNING
  - Coverage: 45% (target: 75%)
  - 3 complex functions with 0% coverage

ANTI-003 (Tech Debt): 15 items found
  - TODO: 8
  - FIXME: 5
  - HACK: 2

ANTI-004 (Speculation): 0 detected
  - API verification docs present

ANTI-005 (Hidden Debt): 3 potential
  - Undocumented workarounds in src/api/

ANTI-006 (Undocumented): 2 missing ADRs
  - Database choice
  - Auth strategy

Summary: 4 antipatterns detected
Recommendation: Address ANTI-002 and ANTI-003 immediately
```
