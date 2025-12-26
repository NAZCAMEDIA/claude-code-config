#!/bin/bash
# SOLARIA Learning Log Entry
# Usage: bash add-learning.sh "type" "category" "content"
# Types: discovery, gotcha, pattern, decision, performance, security

TYPE="${1:-discovery}"
CATEGORY="${2:-general}"
CONTENT="${3:-Learning entry}"
DATE=$(date +%Y-%m-%d)
PROJECT=$(basename $(pwd))

# Validate type
VALID_TYPES="discovery gotcha pattern decision performance security"
if [[ ! " $VALID_TYPES " =~ " $TYPE " ]]; then
    echo "Error: Invalid type '$TYPE'"
    echo "Valid types: $VALID_TYPES"
    exit 1
fi

# Create directory
mkdir -p .memory

LOG_FILE=".memory/learning_log.jsonl"

# Create JSON entry
ENTRY=$(cat << EOF
{"date":"${DATE}","type":"${TYPE}","category":"${CATEGORY}","content":"${CONTENT}","project":"${PROJECT}"}
EOF
)

# Append to log
echo "$ENTRY" >> "$LOG_FILE"

echo "✓ Added learning entry to $LOG_FILE"
echo ""
echo "Entry:"
echo "$ENTRY" | python3 -m json.tool 2>/dev/null || echo "$ENTRY"
