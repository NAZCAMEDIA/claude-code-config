---
name: security-audit
description: Performs security audits following OWASP guidelines and SOLARIA security standards. This skill should be used before deployments, during code reviews, when implementing authentication, or when assessing application security including input validation, authentication, authorization, and data protection.
---

# Security Audit

This skill performs comprehensive security audits following OWASP Top 10 and SOLARIA security standards.

## OWASP Top 10 (2021)

| # | Vulnerability | Risk |
|---|---------------|------|
| A01 | Broken Access Control | Critical |
| A02 | Cryptographic Failures | Critical |
| A03 | Injection | Critical |
| A04 | Insecure Design | High |
| A05 | Security Misconfiguration | High |
| A06 | Vulnerable Components | High |
| A07 | Authentication Failures | Critical |
| A08 | Integrity Failures | High |
| A09 | Logging Failures | Medium |
| A10 | SSRF | High |

## Quick Audit

```bash
# Run security scan
bash scripts/security-scan.sh /path/to/project

# Check dependencies
npm audit
pip-audit
cargo audit
```

## Audit Checklist

### A01: Access Control
```
[ ] Role-based access control implemented
[ ] Direct object references validated
[ ] API endpoints require authentication
[ ] Admin functions protected
[ ] CORS properly configured
[ ] Rate limiting in place
```

### A02: Cryptographic Failures
```
[ ] HTTPS enforced everywhere
[ ] Strong passwords required (12+ chars)
[ ] Passwords hashed with bcrypt/argon2
[ ] Sensitive data encrypted at rest
[ ] No hardcoded secrets
[ ] API keys in environment variables
```

### A03: Injection
```
[ ] SQL: Parameterized queries only
[ ] XSS: Output encoding implemented
[ ] Command injection: Input sanitization
[ ] NoSQL: Query sanitization
[ ] LDAP: Input validation
```

### A07: Authentication
```
[ ] Multi-factor authentication available
[ ] Session tokens are random
[ ] Sessions expire appropriately
[ ] Logout invalidates session
[ ] Brute force protection
[ ] Password reset is secure
```

## Secure Code Patterns

### SQL Injection Prevention

Always use parameterized queries:

```javascript
// SECURE: Parameterized query
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);
```

### XSS Prevention

Always use safe DOM methods:

```javascript
// SECURE: Use textContent for plain text
element.textContent = userInput;

// SECURE: Use DOMPurify for HTML content
const clean = DOMPurify.sanitize(userInput);
```

### CSRF Protection

```html
<!-- Add CSRF token to forms -->
<form method="POST">
  <input type="hidden" name="_csrf" value="{{ csrfToken }}">
</form>
```

### Secure Direct Object Reference

```javascript
// SECURE: Always verify ownership
app.get('/api/documents/:id', (req, res) => {
  return Document.findOne({
    _id: req.params.id,
    owner: req.user.id  // Check ownership
  });
});
```

## Security Headers

```javascript
// Express with Helmet
const helmet = require('helmet');
app.use(helmet());

// Or manually
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
```

## Authentication Best Practices

### Password Hashing
```javascript
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

// Hash
const hash = await bcrypt.hash(password, SALT_ROUNDS);

// Verify
const match = await bcrypt.compare(password, hash);
```

### JWT Handling
```javascript
// Sign with expiration
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

// Verify
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
} catch (err) {
  // Token invalid or expired
}
```

### Session Security
```javascript
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,      // HTTPS only
    httpOnly: true,    // No JS access
    sameSite: 'strict',
    maxAge: 3600000    // 1 hour
  }
}));
```

## Input Validation

```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/users',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 12 }),
  body('name').trim().escape(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process valid input
  }
);
```

## Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later'
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 failed attempts
  message: 'Too many login attempts'
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
```

## Dependency Scanning

```bash
# Node.js
npm audit
npm audit fix

# Python
pip-audit
safety check

# Rust
cargo audit

# Go
govulncheck ./...
```

## Security Report Template

```markdown
# Security Audit Report

## Summary
- **Date**: YYYY-MM-DD
- **Project**: [Name]
- **Auditor**: [Name]
- **Risk Level**: Critical/High/Medium/Low

## Findings

### Finding 1: [Title]
- **Severity**: Critical
- **Location**: `src/auth/login.js:45`
- **Description**: [What's wrong]
- **Impact**: [What could happen]
- **Recommendation**: [How to fix]
- **Status**: Open/Resolved

## Recommendations
1. [Priority action 1]
2. [Priority action 2]
```

## Resources

- [Audit Checklist](assets/security-checklist.md)
- [Report Template](assets/report-template.md)
- [Scan Script](scripts/security-scan.sh)
