---
name: api-verification-protocol
description: Implements PAT-006 mandatory protocol for external API integrations. This skill should be used BEFORE writing any code that depends on external libraries, frameworks, or third-party APIs. Prevents speculation-driven API design (ANTI-004) which causes compilation errors and wasted debugging time.
---

# API Verification Protocol (PAT-006)

This skill implements the **MANDATORY** API verification protocol that must be applied before integrating any external dependency. It reduced compilation errors from 39 to 0 in the BRIK-64 project.

## When This Skill MUST Be Used

- Integrating ANY external library (npm, pip, cargo, etc.)
- Consuming ANY third-party API (REST, GraphQL, etc.)
- Using framework features for the first time
- Upgrading dependencies to new major versions
- Working with unfamiliar codebases

## The Problem This Solves

**ANTI-004: Speculation-Driven API Design**

```
❌ WRONG (Without Protocol):
Developer: "The parser library probably has Parser::new()"
→ Writes code assuming this exists
→ Compilation fails
→ 4+ hours debugging
→ Discovers actual method is Parser::from_config(config)

✓ CORRECT (With Protocol):
Developer: "Let me verify the parser API first"
→ Reads documentation (20 min)
→ Documents Parser::from_config(config)
→ Uses verified API
→ Works first time
```

## Protocol Steps

### Step 1: Read Documentation (20 minutes)

Before writing ANY code that uses an external dependency:

1. **Locate official documentation**
   - Official website docs
   - GitHub README
   - API reference
   - Type definitions (.d.ts, stubs)

2. **Read completely**
   - All available methods/functions
   - Constructor patterns
   - Required parameters
   - Return types
   - Error handling

3. **Note critical details**
   - Version requirements
   - Breaking changes in recent versions
   - Deprecation warnings
   - Common gotchas

### Step 2: Document Verified APIs (10 minutes)

Create a verification document using the template:

```bash
# Create verification document
touch docs/api-verification/[library-name].md
```

Use the template in [assets/api-verification-template.md](assets/api-verification-template.md).

### Step 3: Design with Reality

**Rules:**
- Use ONLY methods documented in verification file
- NO speculation about "what should exist"
- NO assumptions about parameter names
- If unsure, go back to Step 1

### Step 4: Implement and Test Immediately

```
1. Write code using ONLY verified APIs
2. Compile/run immediately after each API call
3. If error → check verification doc
4. If not in doc → go back to Step 1
```

## Verification Document Template

See [assets/api-verification-template.md](assets/api-verification-template.md) for the full template.

Quick reference:

```markdown
# API Verification: [Library Name]

## Metadata
- **Library**: [name]
- **Version**: [exact version]
- **Verified Date**: [YYYY-MM-DD]
- **Documentation URL**: [link]

## Verified Methods

### [MethodName]
- **Signature**: `methodName(param1: Type, param2: Type): ReturnType`
- **Purpose**: [what it does]
- **Example**:
```[language]
// Working example from docs
```

## Gotchas
- [Common pitfall 1]
- [Common pitfall 2]
```

## Examples

### Example 1: Node.js Library (axios)

```markdown
# API Verification: axios

## Metadata
- **Library**: axios
- **Version**: 1.6.2
- **Verified Date**: 2024-01-15
- **Documentation URL**: https://axios-http.com/docs/intro

## Verified Methods

### axios.get()
- **Signature**: `axios.get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse>`
- **Example**:
```javascript
const response = await axios.get('https://api.example.com/data', {
  headers: { 'Authorization': 'Bearer token' }
});
console.log(response.data);
```

### axios.create()
- **Signature**: `axios.create(config?: CreateAxiosDefaults): AxiosInstance`
- **Example**:
```javascript
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: { 'X-Custom-Header': 'value' }
});
```

## Gotchas
- Response data is in `response.data`, not `response.body`
- Errors throw, not return error codes (use try/catch)
- Default timeout is 0 (no timeout) - always set explicitly
```

### Example 2: Rust Crate (serde)

```markdown
# API Verification: serde_json

## Metadata
- **Library**: serde_json
- **Version**: 1.0.108
- **Verified Date**: 2024-01-15
- **Documentation URL**: https://docs.rs/serde_json/latest/serde_json/

## Verified Methods

### serde_json::from_str()
- **Signature**: `fn from_str<'a, T>(s: &'a str) -> Result<T, Error> where T: Deserialize<'a>`
- **Example**:
```rust
#[derive(Deserialize)]
struct User { name: String, age: u32 }

let user: User = serde_json::from_str(r#"{"name":"John","age":30}"#)?;
```

### serde_json::to_string()
- **Signature**: `fn to_string<T>(value: &T) -> Result<String, Error> where T: ?Sized + Serialize`
- **Example**:
```rust
let json = serde_json::to_string(&user)?;
```

## Gotchas
- Requires `#[derive(Serialize, Deserialize)]` on structs
- Field names must match JSON keys exactly (or use #[serde(rename)])
- Optional fields need `Option<T>` type
```

## Automation Scripts

### Verify Import Coverage

Check that all imports have verification documents:

```bash
python scripts/verify-imports.py /path/to/project
```

### Create New Verification Doc

Quick-start a new verification document:

```bash
bash scripts/new-verification.sh axios 1.6.2 https://axios-http.com/docs
```

## Integration with Development Workflow

```
1. Identify external dependency needed
     │
2. Check if verification doc exists
     │
     ├─ YES → Use verified APIs
     │
     └─ NO → STOP CODING
              │
              └─ Execute PAT-006:
                   1. Read docs (20 min)
                   2. Create verification doc (10 min)
                   3. Continue implementation
```

## Metrics

| Metric | Without PAT-006 | With PAT-006 |
|--------|-----------------|--------------|
| Compilation Errors | 39 | 0 |
| Debug Time (API issues) | 4+ hours | <30 min |
| Rework from wrong API | High | None |
| Time Investment | 0 min | 30 min |
| **ROI** | - | **8x time saved** |

## Resources

- [API Verification Template](assets/api-verification-template.md)
- [Import Verification Script](scripts/verify-imports.py)
- [New Verification Script](scripts/new-verification.sh)
