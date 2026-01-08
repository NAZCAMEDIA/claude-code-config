#!/bin/bash
# SOLARIA ECO - Claude Code Configuration Sync Script
# Sincroniza configuración del repo con ~/.claude/
# Uso: ./sync-config.sh [--force]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="$HOME/.claude"
CONFIG_SOURCE="$SCRIPT_DIR/claude-code-cli"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   ECO Config Sync - SOLARIA NEMESIS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verificar que existe el directorio fuente
if [ ! -d "$CONFIG_SOURCE" ]; then
    echo "❌ Error: No se encontró $CONFIG_SOURCE"
    exit 1
fi

# Crear backup si existe configuración previa
if [ -f "$CLAUDE_DIR/settings.local.json" ]; then
    BACKUP_FILE="$CLAUDE_DIR/settings.local.json.backup.$(date +%Y%m%d_%H%M%S)"
    cp "$CLAUDE_DIR/settings.local.json" "$BACKUP_FILE"
    echo "✓ Backup creado: $BACKUP_FILE"
fi

# Sincronizar settings.json -> settings.json (archivo principal)
echo ""
echo "📋 Sincronizando configuración..."

# Copiar settings.json (archivo principal que Claude Code lee)
cp "$CONFIG_SOURCE/settings.json" "$CLAUDE_DIR/settings.json"
echo "✓ settings.json -> ~/.claude/settings.json"

# Copiar statusline script
cp "$CONFIG_SOURCE/statusline-comprehensive.sh" "$CLAUDE_DIR/statusline-comprehensive.sh"
chmod +x "$CLAUDE_DIR/statusline-comprehensive.sh"
echo "✓ statusline-comprehensive.sh instalado"

# Sincronizar agentes si existen
if [ -d "$CONFIG_SOURCE/agents" ]; then
    mkdir -p "$CLAUDE_DIR/agents"
    cp -r "$CONFIG_SOURCE/agents/"* "$CLAUDE_DIR/agents/" 2>/dev/null || true
    echo "✓ Agentes sincronizados"
fi

# Sincronizar skills si existen
if [ -d "$CONFIG_SOURCE/skills" ]; then
    mkdir -p "$CLAUDE_DIR/skills"
    cp -r "$CONFIG_SOURCE/skills/"* "$CLAUDE_DIR/skills/" 2>/dev/null || true
    echo "✓ Skills sincronizados"
fi

# Sincronizar commands si existen
if [ -d "$CONFIG_SOURCE/commands" ]; then
    mkdir -p "$CLAUDE_DIR/commands"
    cp -r "$CONFIG_SOURCE/commands/"* "$CLAUDE_DIR/commands/" 2>/dev/null || true
    echo "✓ Commands sincronizados"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Sincronización completada"
echo ""
echo "Configuraciones aplicadas:"
echo "  • outputStyle: cto-executive"
echo "  • bypassPermissions: enabled (todos los permisos)"
echo "  • alwaysThinkingEnabled: true"
echo "  • statusLine: comprehensive (CTO mode)"
echo "  • plugins: 29 habilitados (incluye ralph-wiggum)"
echo "  • ralph-wiggum: enabled (/ralph-loop, /cancel-ralph)"
echo "  • MCP servers: solaria-dfo, sequential-thinking"
echo ""
echo "🚀 Comandos disponibles:"
echo "  • /ralph-loop [criterio]  - Inicia bucle iterativo autónomo"
echo "  • /cancel-ralph           - Detiene bucle en progreso"
echo ""
echo "⚠️  Reinicia Claude Code para aplicar cambios"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
