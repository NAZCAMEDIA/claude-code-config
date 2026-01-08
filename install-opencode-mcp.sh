#!/bin/bash

# OpenCode MCP Installer
# Configura MCPs SOLARIA-DFO y OpenCode Bridge para OpenCode

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
CONFIG_DIR="$HOME/.config/opencode"
CONFIG_FILE="$CONFIG_DIR/config.json"

echo "🔧 OpenCode MCP Installer"
echo "=========================="

# Verificar OpenCode instalado
if ! command -v opencode &> /dev/null; then
    echo "❌ OpenCode no está instalado"
    exit 1
fi

echo "✅ OpenCode encontrado"

# Crear directorio de configuración si no existe
mkdir -p "$CONFIG_DIR"

# Crear configuración base si no existe
if [ ! -f "$CONFIG_FILE" ]; then
    echo "📝 Creando configuración base..."
    cat > "$CONFIG_FILE" << 'EOF'
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["oh-my-opencode"],
  "mcp": {}
}
EOF
fi

# MCPs a instalar
SOLARIA_DFO_PATH="$SCRIPT_DIR/mcp-servers/solaria-dfo/dist/index.js"
OPENCODE_BRIDGE_PATH="$SCRIPT_DIR/mcp-servers/opencode-bridge/dist/index.js"

# Verificar que los MCPs estén compilados
if [ ! -f "$SOLARIA_DFO_PATH" ]; then
    echo "❌ SOLARIA-DFO no compilado. Ejecuta primero: cd mcp-servers/solaria-dfo && npm run build"
    exit 1
fi

if [ ! -f "$OPENCODE_BRIDGE_PATH" ]; then
    echo "❌ OpenCode Bridge no compilado. Ejecuta primero: cd mcp-servers/opencode-bridge && npm install && npm run build"
    exit 1
fi

echo "✅ MCPs compilados y listos"

# Leer configuración actual
CONFIG=$(cat "$CONFIG_FILE")

# Añadir MCPs usando jq si está disponible, otherwise usar sed
if command -v jq &> /dev/null; then
    echo "🔧 Actualizando configuración con jq..."

    # Construir nuevo config con MCPs añadidos
    NEW_CONFIG=$(echo "$CONFIG" | jq --arg sdf "$SOLARIA_DFO_PATH" --arg odb "$OPENCODE_BRIDGE_PATH" '
        .mcp["solaria-dfo"] = {
            "type": "local",
            "command": ["node", $sdf],
            "enabled": true
        } |
        .mcp["opencode-bridge"] = {
            "type": "local",
            "command": ["node", $odb],
            "enabled": true
        }
    ')

    echo "$NEW_CONFIG" > "$CONFIG_FILE"
else
    echo "⚠️  jq no disponible, usando edición manual..."
    echo "Asegúrate de que $CONFIG_FILE contiene:"
    echo ''
    echo '    "solaria-dfo": {'
    echo '      "type": "local",'
    echo '      "command": ["node", "'"$SOLARIA_DFO_PATH"'"],'
    echo '      "enabled": true'
    echo '    },'
    echo '    "opencode-bridge": {'
    echo '      "type": "local",'
    echo '      "command": ["node", "'"$OPENCODE_BRIDGE_PATH"'"],'
    echo '      "enabled": true'
    echo '    }'
fi

echo "✅ Configuración actualizada en $CONFIG_FILE"
echo ""
echo "📋 MCPs configurados:"
echo "   • SOLARIA-DFO (27 herramientas)"
echo "   • OpenCode Bridge (4 herramientas)"
echo ""
echo "🔄 Reinicia OpenCode para aplicar cambios:"
echo "   # Cerrar todas las instancias de OpenCode"
echo "   # Luego ejecutar:"
echo "   opencode"
