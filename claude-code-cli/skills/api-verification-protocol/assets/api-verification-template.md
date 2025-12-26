# API Verification: [LIBRARY_NAME]

## Metadata

| Field | Value |
|-------|-------|
| **Library** | [name] |
| **Version** | [exact version, e.g., 1.6.2] |
| **Verified Date** | [YYYY-MM-DD] |
| **Verified By** | [name/alias] |
| **Documentation URL** | [official docs link] |
| **GitHub/Repository** | [repo link] |
| **License** | [MIT, Apache 2.0, etc.] |

## Installation

```bash
# npm
npm install [library]@[version]

# pip
pip install [library]==[version]

# cargo
cargo add [library]@[version]
```

## Purpose

[Brief description of what this library does and why we're using it]

## Verified Methods/Functions

### [Method/Function 1]

| Property | Value |
|----------|-------|
| **Name** | `methodName` |
| **Signature** | `methodName(param1: Type, param2?: Type): ReturnType` |
| **Purpose** | [What it does] |
| **Required Params** | `param1` - [description] |
| **Optional Params** | `param2` - [description, default value] |
| **Returns** | [Return type and description] |
| **Throws** | [Exceptions/errors it can throw] |

**Example:**
```[language]
// Working example copied/adapted from official docs
const result = methodName(value1, value2);
```

**Notes:**
- [Any important notes about this method]

---

### [Method/Function 2]

| Property | Value |
|----------|-------|
| **Name** | `anotherMethod` |
| **Signature** | `anotherMethod(config: ConfigType): Promise<Result>` |
| **Purpose** | [What it does] |

**Example:**
```[language]
// Working example
```

---

## Types/Interfaces

### [TypeName]

```[language]
// Type definition
interface ConfigType {
  required: string;
  optional?: number;
}
```

**Fields:**
- `required` (string): [description]
- `optional` (number, optional): [description, default]

---

## Common Patterns

### Pattern 1: [Name]

```[language]
// Common usage pattern
```

### Pattern 2: [Name]

```[language]
// Another common pattern
```

---

## Error Handling

### [ErrorType1]

- **When thrown**: [conditions]
- **How to handle**: [solution]
- **Example**:
```[language]
try {
  // code
} catch (error) {
  if (error instanceof ErrorType1) {
    // handle
  }
}
```

---

## Gotchas & Pitfalls

### Gotcha 1: [Title]

**Problem**: [What can go wrong]

**Wrong**:
```[language]
// Code that causes the problem
```

**Correct**:
```[language]
// Code that avoids the problem
```

### Gotcha 2: [Title]

**Problem**: [Description]

**Solution**: [How to avoid]

---

## Version History & Breaking Changes

### Version [X.X.X] → [Y.Y.Y]

- **Breaking**: [breaking change description]
- **Migration**: [how to migrate]

---

## Related Documentation

- [Official Docs](link)
- [API Reference](link)
- [Examples](link)
- [Migration Guide](link)

---

## Verification Checklist

- [ ] Read official documentation completely
- [ ] Verified all methods we plan to use
- [ ] Tested examples in isolation
- [ ] Documented gotchas discovered
- [ ] Checked for breaking changes in target version
- [ ] Confirmed license compatibility

---

## Session Notes

[Any additional notes from the verification session]

**Time spent on verification**: [X] minutes
**Estimated time saved**: [X] hours (based on avoided debugging)
