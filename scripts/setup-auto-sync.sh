#!/bin/bash
# 🔧 Setup Auto-Sync
# Drake Corsair Edition

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"

echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║     🔧 SETUP AUTO-SYNC - CORSAIR EDITION                ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS: Use launchd
    PLIST_PATH="$HOME/Library/LaunchAgents/com.nazcamedia.claude-code-sync.plist"

    echo -e "${CYAN}🍎 Setting up macOS launchd agent...${NC}"

    cat > "$PLIST_PATH" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.nazcamedia.claude-code-sync</string>

    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>$SCRIPT_DIR/auto-sync.sh</string>
    </array>

    <key>RunAtLoad</key>
    <true/>

    <key>KeepAlive</key>
    <true/>

    <key>StandardOutPath</key>
    <string>$HOME/.claude/sync.log</string>

    <key>StandardErrorPath</key>
    <string>$HOME/.claude/sync-error.log</string>

    <key>WorkingDirectory</key>
    <string>$REPO_DIR</string>
</dict>
</plist>
EOF

    # Load the launch agent
    if launchctl list | grep -q "com.nazcamedia.claude-code-sync"; then
        echo -e "${YELLOW}   ⚠ Launch agent already exists, reloading...${NC}"
        launchctl unload "$PLIST_PATH" 2>/dev/null
    fi

    launchctl load "$PLIST_PATH"
    echo -e "${GREEN}   ✓ Launch agent installed${NC}"
    echo -e "${GREEN}   ✓ Auto-sync will run automatically${NC}"
    echo -e "${CYAN}   ℹ Logs: $HOME/.claude/sync.log${NC}"

else
    # Linux: Use cron
    CRON_JOB="*/5 * * * * cd $REPO_DIR && bash $SCRIPT_DIR/backup.sh > /dev/null 2>&1 && git -C $REPO_DIR add -A && git -C $REPO_DIR commit -m 'Auto-sync' && git -C $REPO_DIR push"

    echo -e "${CYAN}🐧 Setting up Linux cron job...${NC}"

    # Check if cron job already exists
    if crontab -l 2>/dev/null | grep -q "claude-code-sync"; then
        echo -e "${YELLOW}   ⚠ Cron job already exists${NC}"
    else
        # Add cron job
        (crontab -l 2>/dev/null; echo "# Claude Code Auto-Sync") | crontab -
        (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
        echo -e "${GREEN}   ✓ Cron job installed${NC}"
        echo -e "${GREEN}   ✓ Auto-sync will run every 5 minutes${NC}"
    fi
fi

echo ""
echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║              ✅ SETUP COMPLETE!                          ║"
echo "║                                                          ║"
echo "║  Auto-sync is now active and will automatically:             ║"
echo "║  • Monitor configuration changes                            ║"
echo "║  • Commit changes to git                                  ║"
echo "║  • Push to remote repository                               ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Instructions
echo -e "${CYAN}📝 Manual commands:${NC}"
echo -e "   • Start sync:   $SCRIPT_DIR/auto-sync.sh"
echo -e "   • Backup now:   $SCRIPT_DIR/backup.sh"
echo -e "   • View logs:    $HOME/.claude/sync.log"
echo ""
