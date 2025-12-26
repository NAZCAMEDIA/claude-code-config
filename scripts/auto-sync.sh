#!/bin/bash
# 🔄 Claude Code Configuration Auto-Sync
# Drake Corsair Edition

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    CLAUDE_DIR="$HOME/.claude"
    CLAUDE_DESKTOP_DIR="$HOME/Library/Application Support/Claude"
    if command -v fswatch &> /dev/null; then
        WATCH_CMD="fswatch"
    elif command -v chokidar &> /dev/null; then
        WATCH_CMD="chokidar"
    else
        WATCH_CMD="none"
    fi
else
    CLAUDE_DIR="$HOME/.claude"
    CLAUDE_DESKTOP_DIR="$HOME/.config/Claude"
    if command -v inotifywait &> /dev/null; then
        WATCH_CMD="inotifywait"
    else
        WATCH_CMD="none"
    fi
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"

# Auto-sync interval in seconds (fallback if file watching not available)
SYNC_INTERVAL=${SYNC_INTERVAL:-300}  # Default: 5 minutes

# Function to sync configuration
sync_config() {
    echo -e "${CYAN}[$(date '+%Y-%m-%d %H:%M:%S')] 🔄 Syncing configuration...${NC}"

    # Check if there are changes
    cd "$REPO_DIR"

    # Run backup
    if [ -f "$SCRIPT_DIR/backup.sh" ]; then
        bash "$SCRIPT_DIR/backup.sh" > /dev/null 2>&1

        # Check if there are changes to commit
        if [ -n "$(git status --porcelain)" ]; then
            echo -e "${GREEN}   ✓ Changes detected, committing...${NC}"
            git add -A
            git commit -m "Auto-sync: $(date '+%Y-%m-%d %H:%M:%S')" > /dev/null 2>&1
            git push > /dev/null 2>&1 && echo -e "${GREEN}   ✓ Pushed to remote${NC}" || echo -e "${YELLOW}   ⚠ Push failed (check network)${NC}"
        else
            echo -e "${CYAN}   ℹ No changes to sync${NC}"
        fi
    fi
}

# Function to setup file watching
setup_file_watching() {
    local watch_files=(
        "$CLAUDE_DIR/claude_code_config.json"
        "$CLAUDE_DIR/settings.json"
        "$CLAUDE_DIR/statusline-comprehensive.sh"
        "$CLAUDE_DIR/agents"
        "$CLAUDE_DIR/skills"
        "$CLAUDE_DESKTOP_DIR/config.json"
        "$CLAUDE_DESKTOP_DIR/extensions-installations.json"
    )

    echo -e "${GREEN}👀 Setting up file watching...${NC}"

    case "$WATCH_CMD" in
        fswatch)
            echo -e "${GREEN}   ✓ Using fswatch${NC}"
            fswatch -o -r "${watch_files[@]}" | while read; do
                sleep 2  # Wait for file changes to settle
                sync_config
            done
            ;;
        inotifywait)
            echo -e "${GREEN}   ✓ Using inotifywait${NC}"
            inotifywait -m -r -e modify,create,delete,move \
                "$CLAUDE_DIR" "$CLAUDE_DESKTOP_DIR" 2>/dev/null | \
            while read path action file; do
                if [[ "$file" == *.json || "$file" == *.sh || "$file" == *.md ]]; then
                    sync_config
                fi
            done
            ;;
        chokidar)
            echo -e "${GREEN}   ✓ Using chokidar${NC}"
            chokidar "${watch_files[@]}" -c "bash $SCRIPT_DIR/backup.sh && cd $REPO_DIR && git add -A && git commit -m 'Auto-sync' && git push"
            ;;
        *)
            echo -e "${YELLOW}   ⚠ No file watcher available, using interval sync (${SYNC_INTERVAL}s)${NC}"
            echo -e "${YELLOW}   ℹ Install fswatch (macOS) or inotify-tools (Linux) for real-time sync${NC}"
            while true; do
                sync_config
                sleep "$SYNC_INTERVAL"
            done
            ;;
    esac
}

# Main function
main() {
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║     🔄 CLAUDE CODE AUTO-SYNC - CORSAIR EDITION          ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"

    echo -e "${CYAN}📂 Watching:${NC}"
    echo -e "   • Claude Code CLI: $CLAUDE_DIR"
    echo -e "   • Claude Desktop: $CLAUDE_DESKTOP_DIR"
    echo -e "   • Repository: $REPO_DIR"
    echo ""

    # Initial sync
    sync_config

    # Start file watching
    setup_file_watching
}

# Run main function
main
