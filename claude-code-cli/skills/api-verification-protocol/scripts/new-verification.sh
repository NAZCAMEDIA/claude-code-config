#!/bin/bash
# SOLARIA API Verification - New Document Generator
# Usage: bash new-verification.sh [library-name] [version] [docs-url]

LIBRARY="${1:-library-name}"
VERSION="${2:-1.0.0}"
DOCS_URL="${3:-https://docs.example.com}"
DATE=$(date +%Y-%m-%d)

# Create directory if needed
mkdir -p docs/api-verification

OUTPUT_FILE="docs/api-verification/${LIBRARY}.md"

if [ -f "$OUTPUT_FILE" ]; then
    echo "⚠️  Verification document already exists: $OUTPUT_FILE"
    read -p "Overwrite? (y/N) " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "Aborted."
        exit 1
    fi
fi

cat > "$OUTPUT_FILE" << EOF
# API Verification: ${LIBRARY}

## Metadata

| Field | Value |
|-------|-------|
| **Library** | ${LIBRARY} |
| **Version** | ${VERSION} |
| **Verified Date** | ${DATE} |
| **Verified By** | Commander |
| **Documentation URL** | ${DOCS_URL} |
| **GitHub/Repository** | [TODO: Add repo link] |
| **License** | [TODO: Add license] |

## Installation

\`\`\`bash
# npm
npm install ${LIBRARY}@${VERSION}

# pip
pip install ${LIBRARY}==${VERSION}

# cargo
cargo add ${LIBRARY}@${VERSION}
\`\`\`

## Purpose

[TODO: Brief description of what this library does and why we're using it]

## Verified Methods/Functions

### [TODO: Method 1]

| Property | Value |
|----------|-------|
| **Name** | \`methodName\` |
| **Signature** | \`methodName(param1: Type): ReturnType\` |
| **Purpose** | [What it does] |
| **Required Params** | \`param1\` - [description] |
| **Returns** | [Return type and description] |

**Example:**
\`\`\`javascript
// TODO: Working example from official docs
\`\`\`

---

### [TODO: Method 2]

| Property | Value |
|----------|-------|
| **Name** | \`anotherMethod\` |
| **Signature** | \`anotherMethod(config: ConfigType): Promise<Result>\` |
| **Purpose** | [What it does] |

**Example:**
\`\`\`javascript
// TODO: Working example
\`\`\`

---

## Types/Interfaces

### [TODO: TypeName]

\`\`\`typescript
// TODO: Type definition
interface ConfigType {
  required: string;
  optional?: number;
}
\`\`\`

---

## Gotchas & Pitfalls

### [TODO: Gotcha 1]

**Problem**: [What can go wrong]

**Solution**: [How to avoid]

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

**Time spent on verification**: [TODO] minutes
**Estimated time saved**: [TODO] hours

EOF

echo "✓ Created verification document: $OUTPUT_FILE"
echo ""
echo "Next steps:"
echo "1. Open $OUTPUT_FILE"
echo "2. Read ${DOCS_URL}"
echo "3. Fill in the TODO sections"
echo "4. Complete the verification checklist"
echo ""
echo "Time budget: 30 minutes (20 min reading + 10 min documenting)"
