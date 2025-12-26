#!/bin/bash
# 🤖 Claude Code Configuration Sync Installer
# Drake Corsair Edition

set -e

# Colors for output
ORANGE='\033[0;33m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${ORANGE}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║     🤖 CLAUDE CODE CONFIG SYNC - CORSAIR EDITION        ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    CLAUDE_DIR="$HOME/.claude"
    CLAUDE_DESKTOP_DIR="$HOME/Library/Application Support/Claude"
    SED_CMD="sed -i ''"
else
    CLAUDE_DIR="$HOME/.claude"
    CLAUDE_DESKTOP_DIR="$HOME/.config/Claude" # Linux path
    SED_CMD="sed -i"
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"

echo -e "${CYAN}📂 Repository: $REPO_DIR${NC}"
echo -e "${CYAN}📂 Claude Code Dir: $CLAUDE_DIR${NC}"
echo -e "${CYAN}📂 Claude Desktop Dir: $CLAUDE_DESKTOP_DIR${NC}"
echo ""

# Backup existing config
echo -e "${ORANGE}📦 Creating backup of existing configuration...${NC}"
BACKUP_DIR="$CLAUDE_DIR/backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
[ -f "$CLAUDE_DIR/claude_code_config.json" ] && cp "$CLAUDE_DIR/claude_code_config.json" "$BACKUP_DIR/"
[ -f "$CLAUDE_DIR/settings.json" ] && cp "$CLAUDE_DIR/settings.json" "$BACKUP_DIR/"
[ -f "$CLAUDE_DIR/statusline-comprehensive.sh" ] && cp "$CLAUDE_DIR/statusline-comprehensive.sh" "$BACKUP_DIR/"
[ -f "$CLAUDE_DESKTOP_DIR/config.json" ] && cp "$CLAUDE_DESKTOP_DIR/config.json" "$BACKUP_DIR/"
[ -f "$CLAUDE_DESKTOP_DIR/extensions-installations.json" ] && cp "$CLAUDE_DESKTOP_DIR/extensions-installations.json" "$BACKUP_DIR/"
echo -e "${GREEN}   ✓ Backup created at $BACKUP_DIR${NC}"

# Create directories
mkdir -p "$CLAUDE_DIR/agents"
mkdir -p "$CLAUDE_DIR/skills"
mkdir -p "$CLAUDE_DIR/plugins"
mkdir -p "$CLAUDE_DIR/commands"
mkdir -p "$CLAUDE_DESKTOP_DIR"

# Install ECO Startup Protocol (Global CLAUDE.md)
echo -e "${ORANGE}🧠 Installing ECO Startup Protocol...${NC}"
if [ -f "$REPO_DIR/claude-code-cli/global/CLAUDE.md" ]; then
    cp "$REPO_DIR/claude-code-cli/global/CLAUDE.md" "$CLAUDE_DIR/CLAUDE.md"
    echo -e "${GREEN}   ✓ ECO Startup Protocol installed (~/.claude/CLAUDE.md)${NC}"
else
    echo -e "${YELLOW}   ⚠ ECO Startup Protocol not found${NC}"
fi

# Install Home CLAUDE.md (Project-level)
if [ -f "$REPO_DIR/CLAUDE.md" ]; then
    cp "$REPO_DIR/CLAUDE.md" "$HOME/CLAUDE.md"
    echo -e "${GREEN}   ✓ ECO Master Protocol installed (~/CLAUDE.md)${NC}"
else
    echo -e "${YELLOW}   ⚠ ECO Master Protocol not found${NC}"
fi

# Install Claude Code CLI configuration
echo -e "${ORANGE}⚙️  Installing Claude Code CLI configuration...${NC}"

# Install claude_code_config.json
if [ -f "$REPO_DIR/claude-code-cli/claude_code_config.json" ]; then
    cp "$REPO_DIR/claude-code-cli/claude_code_config.json" "$CLAUDE_DIR/claude_code_config.json"
    echo -e "${GREEN}   ✓ claude_code_config.json installed${NC}"
else
    echo -e "${RED}   ✗ claude_code_config.json not found${NC}"
fi

# Install settings.json
if [ -f "$REPO_DIR/claude-code-cli/settings.json" ]; then
    # Preserve environment-specific settings
    if [ -f "$CLAUDE_DIR/settings.local.json" ]; then
        echo -e "${CYAN}   ℹ Preserving existing settings.local.json${NC}"
    fi
    cp "$REPO_DIR/claude-code-cli/settings.json" "$CLAUDE_DIR/settings.json"
    echo -e "${GREEN}   ✓ settings.json installed${NC}"
else
    echo -e "${RED}   ✗ settings.json not found${NC}"
fi

# Install statusline script
if [ -f "$REPO_DIR/claude-code-cli/statusline-comprehensive.sh" ]; then
    cp "$REPO_DIR/claude-code-cli/statusline-comprehensive.sh" "$CLAUDE_DIR/statusline-comprehensive.sh"
    chmod +x "$CLAUDE_DIR/statusline-comprehensive.sh"
    echo -e "${GREEN}   ✓ statusline-comprehensive.sh installed${NC}"
else
    echo -e "${RED}   ✗ statusline-comprehensive.sh not found${NC}"
fi

# Install agents
echo -e "${ORANGE}🤖 Installing agents...${NC}"
if [ -d "$REPO_DIR/claude-code-cli/agents" ]; then
    cp -r "$REPO_DIR/claude-code-cli/agents/"* "$CLAUDE_DIR/agents/"
    echo -e "${GREEN}   ✓ $(ls -1 $REPO_DIR/claude-code-cli/agents/ | wc -l | tr -d ' ') agents installed${NC}"
else
    echo -e "${RED}   ✗ agents directory not found${NC}"
fi

# Install skills
echo -e "${ORANGE}🔧 Installing skills...${NC}"
if [ -d "$REPO_DIR/claude-code-cli/skills" ]; then
    cp -r "$REPO_DIR/claude-code-cli/skills/"* "$CLAUDE_DIR/skills/"
    echo -e "${GREEN}   ✓ $(ls -1 $REPO_DIR/claude-code-cli/skills/ | wc -l | tr -d ' ') skills installed${NC}"
else
    echo -e "${RED}   ✗ skills directory not found${NC}"
fi

# Install Claude Desktop configuration
echo -e "${ORANGE}🖥️  Installing Claude Desktop configuration...${NC}"

if [ -d "$CLAUDE_DESKTOP_DIR" ]; then
    # Install config.json
    if [ -f "$REPO_DIR/claude-desktop/config.json" ]; then
        cp "$REPO_DIR/claude-desktop/config.json" "$CLAUDE_DESKTOP_DIR/config.json"
        echo -e "${GREEN}   ✓ Desktop config.json installed${NC}"
    else
        echo -e "${RED}   ✗ Desktop config.json not found${NC}"
    fi

    # Install extensions-installations.json
    if [ -f "$REPO_DIR/claude-desktop/extensions-installations.json" ]; then
        cp "$REPO_DIR/claude-desktop/extensions-installations.json" "$CLAUDE_DESKTOP_DIR/extensions-installations.json"
        echo -e "${GREEN}   ✓ Desktop extensions list installed${NC}"
    else
        echo -e "${RED}   ✗ extensions-installations.json not found${NC}"
    fi
fi

# Setup auto-sync
echo -e "${ORANGE}🔄 Setting up auto-sync...${NC}"
if [ -f "$SCRIPT_DIR/setup-auto-sync.sh" ]; then
    bash "$SCRIPT_DIR/setup-auto-sync.sh"
    echo -e "${GREEN}   ✓ Auto-sync configured${NC}"
else
    echo -e "${YELLOW}   ⚠ Auto-sync script not found, skipping${NC}"
fi

echo ""
echo -e "${ORANGE}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║              ✅ INSTALLATION COMPLETE!                   ║"
echo "║                                                          ║"
echo "║  Restart Claude Code CLI to apply all changes              ║"
echo "║  Restart Claude Desktop to apply desktop changes            ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Summary
echo -e "${CYAN}📊 Summary:${NC}"
echo -e "   • MCP Servers: $(grep -o '"[^"]*":' "$CLAUDE_DIR/claude_code_config.json" | wc -l | tr -d ' ')"
echo -e "   • Enabled Plugins: $(grep -o '"[^"]*": true' "$CLAUDE_DIR/settings.json" | wc -l | tr -d ' ')"
echo -e "   • Agents: $(ls -1 $CLAUDE_DIR/agents/ | wc -l | tr -d ' ')"
echo -e "   • Skills: $(ls -1 $CLAUDE_DIR/skills/ | wc -l | tr -d ' ')"
echo ""
