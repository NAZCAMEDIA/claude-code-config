#!/bin/bash

OPENCODE_BRIDGE_DIR="${__dirname}/mcp-servers/opencode-bridge"
DFO_SERVER="${DFO_SERVER:-https://dfo.solaria.agency}"
DFO_MCP_URL="${DFO_MCP_URL}/mcp"
AUTH_TOKEN="${DFO_AUTH_TOKEN:-default}"
PROJECT_NAME="${PROJECT_NAME:-claude-code-config}"

echo "[OpenCode Sync] Starting sync..."

CHECK_SESSION_FILE="$OPENCODE_BRIDGE_DIR/.opencode_sessions.json"

if [ ! -f "$CHECK_SESSION_FILE" ]; then
  echo "{}" > "$CHECK_SESSION_FILE"
  echo "[OpenCode Sync] Created session file"
fi

OPENCODE_SESSION_DIR="${OPENCODE_BRIDGE_DIR}/.opencode_sessions"

mkdir -p "$OPENCODE_SESSION_DIR"

echo "[OpenCode Sync] Checking for Claude Code CLI sessions..."

CLAUDE_CODE_SESSIONS_DIR="${HOME}/.claude/sessions"

if [ -d "$CLAUDE_CODE_SESSIONS_DIR" ]; then
  echo "[OpenCode Sync] Found Claude Code sessions directory: $CLAUDE_CODE_SESSIONS_DIR"
  
  SESSION_FILES=$(find "$CLAUDE_CODE_SESSIONS_DIR" -name "session_*.json" 2>/dev/null | head -5)
  
  if [ -n "$SESSION_FILES" ]; then
    echo "[OpenCode Sync] Found $(echo "$SESSION_FILES" | wc -l | awk '{print $1}') sessions"
  fi
else
  echo "[OpenCode Sync] Warning: Claude Code sessions directory not found"
fi

echo "[OpenCode Sync] Sync complete"
echo ""
