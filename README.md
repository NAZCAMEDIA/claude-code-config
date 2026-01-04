# 🤖 Claude Code Configuration Sync

> **Drake Corsair Edition** - Complete Claude Code CLI and Desktop configuration backup and synchronization solution

![Claude Code](https://img.shields.io/badge/Claude%20Code-CLI-orange?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Linux-000000?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 📦 What's Included

This repository contains a complete backup and sync solution for:

### Claude Code CLI
- ⚙️ **Configuration Files**: `claude_code_config.json`, `settings.json`
- 🎨 **Status Line**: Custom statusline script with comprehensive system info
- 🤖 **Agents**: Custom AI agents for various domains (React, PostgreSQL, Security, etc.)
- 🔧 **Skills**: Specialized tools and workflows
- 🌐 **MCP Servers**: Multiple MCP server configurations (sequential-thinking, playwright, context7, etc.)
- 🔌 **Plugins**: Enabled plugins list and marketplaces

### Claude Desktop
- 🖥️ **Desktop Configuration**: Main config with MCP servers
- 📦 **Extensions**: Complete list of installed extensions

## 🚀 Quick Install

### One-Line Install (macOS)

```bash
curl -fsSL https://raw.githubusercontent.com/NAZCAMEDIA/claude-code-config/main/scripts/install.sh | bash
```

### Manual Install

```bash
# Clone repository
git clone https://github.com/NAZCAMEDIA/claude-code-config.git
cd claude-code-config

# Run install script
./scripts/install.sh
```

## 📁 Repository Structure

```
claude-code-config/
├── README.md
├── claude-code-cli/
│   ├── claude_code_config.json      # MCP servers configuration
│   ├── settings.json               # Main settings with plugins/permissions
│   ├── statusline-comprehensive.sh   # Custom statusline script
│   ├── agents/                    # Custom AI agents
│   └── skills/                    # Custom skills and workflows
├── claude-desktop/
│   ├── config.json                 # Desktop configuration
│   └── extensions-installations.json # Installed extensions
└── scripts/
    ├── install.sh                  # Installation script
    ├── backup.sh                  # Backup configuration
    ├── auto-sync.sh               # Real-time auto-sync
    └── setup-auto-sync.sh         # Setup automatic sync
```

## 🔄 Auto-Sync

### Enable Automatic Sync

Run the setup script to enable automatic synchronization:

```bash
./scripts/setup-auto-sync.sh
```

This will:
- **macOS**: Create a launchd agent that runs in the background
- **Linux**: Create a cron job that runs every 5 minutes

### How Auto-Sync Works

1. **Monitors** configuration files for changes
2. **Detects** modifications to:
   - MCP server configurations
   - Settings files
   - Agents and skills
   - Extension installations
3. **Automatically** backs up changes to this repository
4. **Commits** and **pushes** to GitHub

### Sync Across Multiple Machines

1. Clone this repository on each machine
2. Run `./scripts/install.sh` to setup
3. Run `./scripts/setup-auto-sync.sh` to enable auto-sync
4. Any changes on one machine will be automatically synced to all others

## ⚙️ Configuration Details

### MCP Servers (Current Setup)

| Server | Type | Description |
|--------|------|-------------|
| `solaria-dfo` | HTTP | Solaria Digital Factory API |
| `n8n` | Command | n8n automation integration |
| `sequential-thinking` | Command | Enhanced reasoning |
| `playwright` | Command | Browser automation |
| `context7` | Command | Up-to-date documentation |
| `coderabbit` | Command | AI code reviews |
| `mcp-mermaid` | Command | Diagram generation |

### Enabled Plugins

All plugins from `claude-code-plugins-plus` marketplace are enabled, including:
- Security tools (penetration-tester, secret-scanner, etc.)
- DevOps tools (ci-cd-pipeline-builder, monitoring-stack-deployer, etc.)
- API tools (api-sdk-generator, rest-api-generator, etc.)
- Database tools (database-schema-designer, migration-manager, etc.)

### Agents Available

- `analytics-metrics` - Analytics and metrics expert
- `bullmq-worker-automation` - BullMQ worker automation
- `db-postgresql` - PostgreSQL database specialist
- `frontend-react` - React frontend expert
- `infra-devops-architect` - Infrastructure and DevOps
- `llm-ingestion` - LLM data ingestion
- `payload-cms-architect` - Payload CMS specialist
- `security-gdpr-compliance` - Security and GDPR expert
- And more...

### 🎨 Specialized Skills

#### iOS 26 Design System (Sketch via MCP)

**NEW**: Programmatic iOS screen design capability using Sketch MCP server.

**Capabilities:**
- Generate complete iOS screens programmatically (login, signup, dashboards, etc.)
- Full iOS 26 design system compliance (8pt grid, safe areas, typography)
- Component library: buttons, inputs, text, navigation, cards
- Automated layout with native Sketch grid systems
- SF Pro typography with correct weights and sizes
- iOS semantic color system implementation

**Key Technical Achievements:**
- 6 validated patterns documented (shape creation, text centering, button padding)
- 6 antipatterns identified (missing fillType, background assignment, etc.)
- 8+ reusable component templates
- 13 iterations to perfect implementation
- 1,500+ lines of validated Sketch JavaScript code

**Files:**
- Skill definition: `claude-code-cli/skills/ios26-sketch-designer/skill.md`
- Ultra-optimized prompt: `/tmp/IOS26_DESIGNER_ULTRA_PROMPT.md`
- Working examples: `/tmp/create_login_*.js`

**Usage Example:**
```bash
# ECO can now generate complete iOS screens via:
# - Direct MCP calls to Sketch
# - Validated component templates
# - Automated grid and layout configuration
```

**Learnings Documented:**
- ShapePath vs Shape distinction
- fillType requirement for all fills
- Background property assignment timing
- fixedWidth property for text centering
- Button padding calculation patterns
- Grid 8pt alignment formulas
- MCP response handling (isError vs text)

#### iOS 26 Liquid Glass — World-Class Design

**NEW**: Apple-grade design system for iOS 26 Liquid Glass material implementation.

**Capabilities:**
- Complete semantic token system (colors, typography, spacing, materials, motion)
- Component library with perfect "Golden Sample" (Glass Pill Button)
- Semantic material mapping (glass/bar, glass/control, glass/sheet, glass/overlay)
- PASS/FAIL QA criteria for production readiness
- SwiftUI/UIKit implementation-ready (not concept, but production)
- Full light/dark mode + complex background variations

**Key Features:**
- 6 mandatory rules (Liquid Glass as functional layer, not decoration)
- Material tokens with explicit "when to use" / "when NOT to use"
- Golden Sample with 3 variants × 4 states
- MVP validation (Home Dashboard with all components)
- QA rubric: consistency, hierarchy, legibility, states, semantics, implementability

**Deliverables:**
- SKILL_SPEC (rules + material mapping + components)
- TOKEN PACK (complete table with usage guidelines)
- COMPONENT LIBRARY (Golden Sample + detailed specs)
- MVP (light + dark validation screens)
- QA REPORT (PASS/FAIL with documented corrections)

**Files:**
- Skill definition: `claude-code-cli/skills/ios26-liquid-glass-designer/skill.md`

**Excellence Criterion:**
- Golden Sample must be PERFECT (legible on 3 backgrounds: light, dark, photo)
- Hit targets ≥ 44x44pt
- States distinguishable WITHOUT animation
- 80%+ implementable with native SwiftUI/UIKit components
- If Golden Sample fails QA → NOT READY

**Critical Prohibition:**
❌ Do not use Liquid Glass as aesthetic makeup without functional purpose

**Usage Example:**
```bash
# ECO can now design world-class iOS 26 systems via:
# - Complete semantic token systems
# - Production-ready component libraries
# - PASS/FAIL QA validation
# - SwiftUI/UIKit implementation specs
```

## 🛠️ Manual Operations

### Backup Configuration

```bash
./scripts/backup.sh
```

This will:
- Copy all configuration files from your system to the repository
- Show git status
- Prompt you to commit and push changes

### Manual Sync

```bash
# From the repository directory
git add -A
git commit -m "Update configuration"
git push
```

### View Sync Logs

```bash
# macOS
tail -f ~/.claude/sync.log

# Linux (if using file watchers)
tail -f ~/.claude/sync.log
```

## 🔐 Security Notes

- **API Keys**: Some configuration files contain API keys. Make sure this repository is **private**
- **Sensitive Data**: Review `settings.json` and `claude_code_config.json` before committing
- **Environment Variables**: Use `settings.local.json` for machine-specific settings (not synced)

## 📝 License

MIT License - Feel free to use and modify!

---

*Made with 🧡 for the Drake Corsair community*
