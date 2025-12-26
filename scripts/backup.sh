#!/bin/bash
# 📦 Claude Code Configuration Backup
# Drake Corsair Edition

set -e

# Colors for output
ORANGE='\033[0;33m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${ORANGE}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║     📦 CLAUDE CODE CONFIG BACKUP - CORSAIR EDITION        ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    CLAUDE_DIR="$HOME/.claude"
    CLAUDE_DESKTOP_DIR="$HOME/Library/Application Support/Claude"
else
    CLAUDE_DIR="$HOME/.claude"
    CLAUDE_DESKTOP_DIR="$HOME/.config/Claude"
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"

echo -e "${CYAN}📂 Source: $CLAUDE_DIR${NC}"
echo -e "${CYAN}📂 Target: $REPO_DIR${NC}"
echo ""

# Backup Claude Code CLI configuration
echo -e "${ORANGE}⚙️  Backing up Claude Code CLI configuration...${NC}"

[ -f "$CLAUDE_DIR/claude_code_config.json" ] && cp "$CLAUDE_DIR/claude_code_config.json" "$REPO_DIR/claude-code-cli/claude_code_config.json" && echo -e "${GREEN}   ✓ claude_code_config.json${NC}" || echo -e "${CYAN}   ℹ claude_code_config.json not found, skipping${NC}"
[ -f "$CLAUDE_DIR/settings.json" ] && cp "$CLAUDE_DIR/settings.json" "$REPO_DIR/claude-code-cli/settings.json" && echo -e "${GREEN}   ✓ settings.json${NC}" || echo -e "${CYAN}   ℹ settings.json not found, skipping${NC}"
[ -f "$CLAUDE_DIR/statusline-comprehensive.sh" ] && cp "$CLAUDE_DIR/statusline-comprehensive.sh" "$REPO_DIR/claude-code-cli/statusline-comprehensive.sh" && echo -e "${GREEN}   ✓ statusline-comprehensive.sh${NC}" || echo -e "${CYAN}   ℹ statusline-comprehensive.sh not found, skipping${NC}"

# Backup agents
echo -e "${ORANGE}🤖 Backing up agents...${NC}"
if [ -d "$CLAUDE_DIR/agents" ]; then
    rm -rf "$REPO_DIR/claude-code-cli/agents"
    mkdir -p "$REPO_DIR/claude-code-cli/agents"
    cp -r "$CLAUDE_DIR/agents/"* "$REPO_DIR/claude-code-cli/agents/"
    echo -e "${GREEN}   ✓ $(ls -1 $REPO_DIR/claude-code-cli/agents/ | wc -l | tr -d ' ') agents${NC}"
else
    echo -e "${CYAN}   ℹ agents directory not found, skipping${NC}"
fi

# Backup skills
echo -e "${ORANGE}🔧 Backing up skills...${NC}"
if [ -d "$CLAUDE_DIR/skills" ]; then
    rm -rf "$REPO_DIR/claude-code-cli/skills"
    mkdir -p "$REPO_DIR/claude-code-cli/skills"
    cp -r "$CLAUDE_DIR/skills/"* "$REPO_DIR/claude-code-cli/skills/"
    echo -e "${GREEN}   ✓ $(ls -1 $REPO_DIR/claude-code-cli/skills/ | wc -l | tr -d ' ') skills${NC}"
else
    echo -e "${CYAN}   ℹ skills directory not found, skipping${NC}"
fi

# Backup Claude Desktop configuration
echo -e "${ORANGE}🖥️  Backing up Claude Desktop configuration...${NC}"

if [ -d "$CLAUDE_DESKTOP_DIR" ]; then
    [ -f "$CLAUDE_DESKTOP_DIR/config.json" ] && cp "$CLAUDE_DESKTOP_DIR/config.json" "$REPO_DIR/claude-desktop/config.json" && echo -e "${GREEN}   ✓ Desktop config.json${NC}" || echo -e "${CYAN}   ℹ Desktop config.json not found, skipping${NC}"
    [ -f "$CLAUDE_DESKTOP_DIR/extensions-installations.json" ] && cp "$CLAUDE_DESKTOP_DIR/extensions-installations.json" "$REPO_DIR/claude-desktop/extensions-installations.json" && echo -e "${GREEN}   ✓ Desktop extensions list${NC}" || echo -e "${CYAN}   ℹ extensions-installations.json not found, skipping${NC}"
else
    echo -e "${CYAN}   ℹ Claude Desktop directory not found, skipping${NC}"
fi

# Git status
echo ""
echo -e "${ORANGE}📊 Git Status:${NC}"
cd "$REPO_DIR"
git status --short

echo ""
echo -e "${ORANGE}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║              ✅ BACKUP COMPLETE!                          ║"
echo "║                                                          ║"
echo "║  To commit and push changes:                               ║"
echo "║    cd $REPO_DIR${NC}"
echo "║    git add -A && git commit -m 'Update config' && git push"
echo -e "${ORANGE}╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"
