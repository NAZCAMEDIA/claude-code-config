#!/bin/bash

set -e

OPENCODE_BRIDGE_DIR="${__dirname}/mcp-servers/opencode-bridge"
CLAUDE_CLI_DIR="$HOME/.claude"
DFO_SERVER="${DFO_SERVER:-https://dfo.solaria.agency}"
DFO_MCP_URL="${DFO_MCP_URL:-${DFO_SERVER}/mcp}"
AUTH_TOKEN="${DFO_AUTH_TOKEN:-default}"
PROJECT_NAME="${PROJECT_NAME:-claude-code-config}"

echo "[OpenCode Sync] Starting session synchronization..."
echo ""
echo "Configuration:"
echo "  OpenCode Bridge: $OPENCODE_BRIDGE_DIR"
echo "  Claude Code CLI: $CLAUDE_CLI_DIR"
echo "  DFO Server: $DFO_MCP_URL"
echo "  Project: $PROJECT_NAME"
echo ""

SESSION_STATE_FILE="${OPENCODE_BRIDGE_DIR}/.opencode_sessions.json"

SESSION_STATE=$(cat "$SESSION_STATE_FILE" 2>/dev/null || echo '{"sessions":{}}')

LAST_SYNC_TIME=$(echo "$SESSION_STATE" | jq -r '.last_sync_time // empty' 2>/dev/null)
CURRENT_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

echo "[OpenCode Sync] Last sync: ${LAST_SYNC_TIME:-never}"
echo "[OpenCode Sync] Current time: $CURRENT_TIME"
echo ""

if [ -d "$CLAUDE_CLI_DIR/sessions" ]; then
  SESSION_COUNT=$(find "$CLAUDE_CLI_DIR/sessions" -name "session_*.json" 2>/dev/null | wc -l | tr -d ' ')
  echo "[OpenCode Sync] Found $SESSION_COUNT Claude Code sessions"
  
  LATEST_SESSION=$(find "$CLAUDE_CLI_DIR/sessions" -name "session_*.json" -type f -printf '%T@%s\n' 2>/dev/null | sort -rn | head -1)
  
  if [ -n "$LATEST_SESSION" ]; then
    LATEST_TIMESTAMP=$(echo "$LATEST_SESSION" | cut -d'.' -f1)
    LATEST_ID=$(echo "$LATEST_SESSION" | cut -d'.' -f2)
    echo "[OpenCode Sync] Latest session: $LATEST_ID ($LATEST_TIMESTAMP)"
  fi
else
  echo "[OpenCode Sync] No Claude Code sessions directory found"
fi

echo ""

NEW_STATE=$(echo "$SESSION_STATE" | jq ".last_sync_time = \"$CURRENT_TIME\" | .session_count = $SESSION_COUNT")

if [ -n "$LATEST_SESSION" ]; then
  NEW_STATE=$(echo "$NEW_STATE" | jq ".latest_session_id = \"$LATEST_ID\" | .latest_session_time = \"$LATEST_TIMESTAMP\"")
fi

echo "$NEW_STATE" > "$SESSION_STATE_FILE"

echo "[OpenCode Sync] Session state updated"
echo ""
echo "Actions performed:"
echo "  ✓ Discovered Claude Code sessions"
echo "  ✓ Updated sync timestamp"
echo "  ✓ Recorded session state"
