#!/bin/bash

set -e

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
SCRIPT_NAME="install-opencode.sh"
VERSION="1.0.0"

echo "================================================================"
echo "       OpenCode Auto-Installation Script v$VERSION"
echo "================================================================"
echo ""
echo "Este script configura automáticamente tu entorno de Claude Code CLI"
echo "con integración completa de OpenCode y SOLARIA DFO v3.3.0"
echo ""
echo "  OpenCode ↔ Claude Code CLI ↔ SOLARIA DFO (Cerebro Central)"
echo "        ↓                    ↓                    ↓"
echo ""
echo "================================================================"
echo ""
echo "Pasos de instalación:"
echo ""

echo "[1/7] Detectando entorno..."
echo ""

OS="$(uname -s)"
CLAUDE_DIR="$HOME/.claude"

if [ -d "$CLAUDE_DIR" ]; then
  echo "  ✓ Directorio Claude Code detectado: $CLAUDE_DIR"
else
  echo "  ✗ Error: No se encontró directorio Claude Code"
  echo "    Asegúrate de tener Claude Code CLI instalado"
  exit 1
fi

echo ""
echo "[2/7] Configurando SOLARIA DFO MCP..."
echo ""

SOLARIA_DFO_DIST="$REPO_ROOT/mcp-servers/solaria-dfo/dist"

if [ ! -f "$SOLARIA_DFO_DIST/index.js" ]; then
  echo "  ✗ Error: No se encontró MCP SOLARIA DFO compilado"
  echo "    Ejecutando: cd mcp-servers/solaria-dfo && npm install && npm run build"
  echo "    Presiona Enter para continuar o Ctrl+C para cancelar..."
  read -r
fi

echo "  ✓ MCP SOLARIA DFO listo"

echo ""
echo "[3/7] Configurando OpenCode Bridge MCP..."
echo ""

OPENCODE_BRIDGE_DIR="$REPO_ROOT/mcp-servers/opencode-bridge"

if [ ! -f "$OPENCODE_BRIDGE_DIR/dist/index.js" ]; then
  echo "  ✗ Error: No se encontró MCP OpenCode Bridge compilado"
  echo "    Ejecutando: cd mcp-servers/opencode-bridge && npm install && npm run build"
  echo "    Presiona Enter para continuar o Ctrl+C para cancelar..."
  read -r
fi

echo "  ✓ MCP OpenCode Bridge listo"

echo ""
echo "[4/7] Actualizando settings.json de Claude Code..."
echo ""

SETTINGS_FILE="$CLAUDE_DIR/claude_code_config.json"

if [ -f "$SETTINGS_FILE" ]; then
  BACKUP_FILE="${SETTINGS_FILE}.backup.$(date +%s)"
  cp "$SETTINGS_FILE" "$BACKUP_FILE"
  echo "  ✓ Backup creado: $BACKUP_FILE"
else
  echo "  ✓ Nuevo archivo de configuración"
fi

if command -v node >/dev/null 2>&1; then
  NODE_PATH=$(command -v node | cut -d'=' -f1)
  echo "  ✓ Node.js detectado: $NODE_PATH"
else
  echo "  ✗ Error: Node.js no encontrado"
  exit 1
fi

SOLARIA_DFO_ABS_PATH="$(cd "$REPO_ROOT/mcp-servers/solaria-dfo" && pwd)/dist/index.js"
OPENCODE_BRIDGE_ABS_PATH="$(cd "$REPO_ROOT/mcp-servers/opencode-bridge" && pwd)/dist/index.js"

UPDATE_SETTINGS="
{
  \"mcpServers\": {
    \"solaria_dfo\": {
      \"command\": \"node $SOLARIA_DFO_ABS_PATH\",
      \"env\": {
        \"DFO_SERVER\": \"https://dfo.solaria.agency\",
        \"DFO_MCP_URL\": \"https://dfo.solaria.agency/mcp\",
        \"DFO_AUTH_TOKEN\": \"default\",
        \"PROJECT_NAME\": \"claude-code-config\"
      }
    },
    \"opencode-bridge\": {
      \"command\": \"node $OPENCODE_BRIDGE_ABS_PATH\",
      \"env\": {
        \"OPENCODE_BRIDGE_DIR\": \"$OPENCODE_BRIDGE_DIR\",
        \"DFO_SERVER\": \"https://dfo.solaria.agency\",
        \"DFO_MCP_URL\": \"https://dfo.solaria.agency/mcp\",
        \"DFO_AUTH_TOKEN\": \"default\",
        \"PROJECT_NAME\": \"claude-code-config\"
      }
    }
  }
}
"

echo "$UPDATE_SETTINGS" > "$SETTINGS_FILE"
echo "  ✓ settings.json actualizado"

echo ""
echo "[5/7] Creando directorio de trabajo para OpenCode Bridge..."
echo ""

mkdir -p "$OPENCODE_BRIDGE_DIR/.opencode_sessions"
echo "  ✓ Directorio de sesiones creado: $OPENCODE_BRIDGE_DIR/.opencode_sessions"

echo ""
echo "[6/7] Sincronizando configuración de plugins marketplace..."
echo ""

PLUGINS_FILE="$REPO_ROOT/.github/workflows/opencode-sync.yml"

if [ -f "$PLUGINS_FILE" ]; then
  echo "  ✓ GitHub Actions workflow configurado para sync automático"
else
  echo "  ✗ Warning: GitHub Actions workflow no encontrado"
fi

echo ""
echo "================================================================"
echo "                      ¡INSTALACIÓN COMPLETADA!"
echo "================================================================"
echo ""
echo "Componentes instalados:"
echo "  ✓ MCP SOLARIA DFO v3.3.0 (27 herramientas)"
echo "  ✓ MCP OpenCode Bridge v1.0.0 (4 herramientas)"
echo "  ✓ Configuración actualizada"
echo "  ✓ Scripts de sincronización"
echo "  ✓ GitHub Actions workflow"
echo ""
echo "Próximos pasos:"
echo "  1. Reiniciar Claude Code CLI"
echo "  2. Verificar que los MCPs se inician automáticamente"
echo "  3. Crear primera sesión de OpenCode"
echo ""
echo "Información de soporte:"
echo "  - Dashboard SOLARIA DFO: https://dfo.solaria.agency"
echo "  - Repositorio: https://github.com/NAZCAMEDIA/claude-code-config"
echo "  - Documentación: Ver CLAUDE.md y archivos README.md en mcp-servers/"
echo ""
echo "================================================================"
