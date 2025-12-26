---
name: tdd-workflow
description: Test-Driven Development workflow assistant implementing PAT-004 Testing Strategy. This skill should be used when implementing any feature to ensure tests are written BEFORE implementation code. Enforces red-green-refactor cycle and maintains the target of 75% or higher code coverage.
---

# TDD Workflow (PAT-004)

This skill implements Test-Driven Development practices ensuring tests are written BEFORE implementation, following the red-green-refactor cycle.

## Core Principle

> "Write a failing test before writing any production code."

## The TDD Cycle

```
┌─────────────────────────────────────────────────────────┐
│                     TDD CYCLE                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│    ┌─────────┐                                          │
│    │  RED    │ ← Write a failing test                   │
│    └────┬────┘                                          │
│         │                                               │
│         ▼                                               │
│    ┌─────────┐                                          │
│    │  GREEN  │ ← Write minimal code to pass             │
│    └────┬────┘                                          │
│         │                                               │
│         ▼                                               │
│    ┌─────────┐                                          │
│    │REFACTOR │ ← Improve while keeping tests green      │
│    └────┬────┘                                          │
│         │                                               │
│         └──────────────────────┐                        │
│                                │                        │
│                           (repeat)                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Coverage Targets

| Type | Target | Critical Minimum |
|------|--------|------------------|
| Unit Tests | ≥80% | 70% |
| Integration Tests | ≥70% | 60% |
| **Overall Coverage** | **≥75%** | **65%** |

## Step-by-Step Process

### Step 1: RED - Write a Failing Test

Before writing ANY implementation code:

```javascript
// Example: Testing a user validation function
describe('validateEmail', () => {
  it('should return true for valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('should return false for invalid email', () => {
    expect(validateEmail('invalid-email')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(validateEmail('')).toBe(false);
  });
});
```

**Rules:**
- Test MUST fail initially (function doesn't exist yet)
- Test describes the expected behavior
- Test is specific and focused

### Step 2: GREEN - Write Minimal Code to Pass

Write the simplest code that makes the test pass:

```javascript
// Minimal implementation
function validateEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

**Rules:**
- Only write code needed to pass the test
- Don't add extra features
- Don't optimize yet

### Step 3: REFACTOR - Improve the Code

With green tests, improve the code:

```javascript
// Refactored with better structure
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
  if (typeof email !== 'string') return false;
  if (email.trim().length === 0) return false;
  return EMAIL_REGEX.test(email);
}
```

**Rules:**
- Tests must stay green
- Improve readability, performance, structure
- Remove duplication
- Add edge case tests if discovered

## Test Organization

### Directory Structure

```
project/
├── src/
│   ├── services/
│   │   └── auth.ts
│   └── utils/
│       └── validation.ts
└── tests/
    ├── unit/
    │   ├── services/
    │   │   └── auth.test.ts
    │   └── utils/
    │       └── validation.test.ts
    ├── integration/
    │   └── auth-flow.test.ts
    └── e2e/
        └── login.test.ts
```

### Naming Conventions

```javascript
// File: [module].test.ts or [module].spec.ts

// Test suites: describe the module/function
describe('AuthService', () => {
  describe('login', () => {
    // Tests: describe expected behavior
    it('should return user token on valid credentials', () => {});
    it('should throw AuthError on invalid password', () => {});
    it('should rate limit after 5 failed attempts', () => {});
  });
});
```

## Test Types by Stack

### JavaScript/TypeScript (Jest)

```javascript
// Unit test
describe('calculateTotal', () => {
  it('should sum items correctly', () => {
    const items = [{ price: 10 }, { price: 20 }];
    expect(calculateTotal(items)).toBe(30);
  });
});

// Async test
describe('fetchUser', () => {
  it('should return user data', async () => {
    const user = await fetchUser('123');
    expect(user.id).toBe('123');
  });
});

// Mock test
describe('sendEmail', () => {
  it('should call email service', () => {
    const mockSend = jest.fn();
    sendEmail('test@example.com', mockSend);
    expect(mockSend).toHaveBeenCalledWith('test@example.com');
  });
});
```

### Python (pytest)

```python
# Unit test
def test_calculate_total():
    items = [{"price": 10}, {"price": 20}]
    assert calculate_total(items) == 30

# Async test
@pytest.mark.asyncio
async def test_fetch_user():
    user = await fetch_user("123")
    assert user["id"] == "123"

# Parametrized test
@pytest.mark.parametrize("email,expected", [
    ("user@example.com", True),
    ("invalid", False),
    ("", False),
])
def test_validate_email(email, expected):
    assert validate_email(email) == expected

# Fixture
@pytest.fixture
def sample_user():
    return {"id": "123", "name": "Test User"}

def test_user_greeting(sample_user):
    assert greet(sample_user) == "Hello, Test User!"
```

### Rust

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_calculate_total() {
        let items = vec![Item { price: 10 }, Item { price: 20 }];
        assert_eq!(calculate_total(&items), 30);
    }

    #[test]
    fn test_validate_email_valid() {
        assert!(validate_email("user@example.com"));
    }

    #[test]
    fn test_validate_email_invalid() {
        assert!(!validate_email("invalid"));
    }

    #[test]
    #[should_panic(expected = "empty email")]
    fn test_validate_email_panics_on_empty() {
        validate_email("");
    }
}
```

## What to Test

### DO Test

- **Business logic** - Core domain rules
- **Edge cases** - Boundaries, empty values, null
- **Error handling** - Exceptions, error codes
- **State changes** - Side effects, mutations
- **Integration points** - API calls, database

### DON'T Test

- **Framework code** - Trust the framework
- **Trivial getters/setters** - No logic to test
- **Third-party libraries** - They have their own tests
- **Private implementation** - Test through public API

## Running Coverage

### JavaScript (Jest)

```bash
# Generate coverage report
npm test -- --coverage

# Set threshold in jest.config.js
module.exports = {
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75
    }
  }
};
```

### Python (pytest-cov)

```bash
# Generate coverage report
pytest --cov=src --cov-report=html

# Set threshold in pyproject.toml
[tool.coverage.report]
fail_under = 75
```

### Rust (cargo-tarpaulin)

```bash
# Generate coverage report
cargo tarpaulin --out Html

# With threshold
cargo tarpaulin --fail-under 75
```

## TDD Checklist

Before each implementation:

```
[ ] Have I written the test first?
[ ] Does the test fail for the right reason?
[ ] Am I testing behavior, not implementation?
[ ] Have I considered edge cases?
```

After implementation:

```
[ ] Do all tests pass?
[ ] Is coverage ≥75%?
[ ] Did I refactor with green tests?
[ ] Are test names descriptive?
```

## Anti-Patterns to Avoid

### ANTI-002: Tests as Afterthought

```
❌ WRONG:
1. Write all implementation code
2. Write tests to achieve coverage
3. Tests don't catch bugs because they're written to pass

✓ CORRECT:
1. Write test describing behavior
2. Test fails (RED)
3. Write code to pass test (GREEN)
4. Refactor (REFACTOR)
5. Tests actually validate behavior
```

### Testing Implementation Details

```javascript
// ❌ BAD: Tests implementation
it('should use regex for validation', () => {
  expect(validateEmail.toString()).toContain('RegExp');
});

// ✓ GOOD: Tests behavior
it('should return true for valid email', () => {
  expect(validateEmail('user@example.com')).toBe(true);
});
```

### Flaky Tests

```javascript
// ❌ BAD: Depends on timing
it('should complete within 100ms', () => {
  const start = Date.now();
  doSomething();
  expect(Date.now() - start).toBeLessThan(100);
});

// ✓ GOOD: Deterministic
it('should return expected result', () => {
  const result = doSomething();
  expect(result).toEqual(expectedValue);
});
```

## Scripts

### Check Coverage Threshold
```bash
bash scripts/check-coverage.sh /path/to/project 75
```

### Generate Test Template
```bash
bash scripts/new-test.sh src/services/auth.ts
# Creates: tests/unit/services/auth.test.ts
```

## Resources

- [Testing Patterns by Stack](references/testing-patterns.md)
- [Coverage Strategies](references/coverage-strategies.md)
- [Test Template Generator](scripts/new-test.sh)
- [Coverage Checker](scripts/check-coverage.sh)
