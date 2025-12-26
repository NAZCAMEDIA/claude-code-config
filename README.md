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
