#!/bin/bash
# SOLARIA ECO - Gemini CLI Adapter Installer
# Instala el ecosistema SOLARIA (Skills, Protocolos) en Gemini CLI
# Uso: ./install-gemini-adapter.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GEMINI_DIR="$HOME/.gemini"
SKILLS_SOURCE="$SCRIPT_DIR/claude-code-cli/skills"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   GEMINI CLI ADAPTER SETUP - SOLARIA ECO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Crear directorios base
echo "[1/4] Preparando directorios..."
if [ ! -d "$GEMINI_DIR" ]; then
    echo "  Creating $GEMINI_DIR..."
    mkdir -p "$GEMINI_DIR"
fi

mkdir -p "$GEMINI_DIR/skills"
mkdir -p "$GEMINI_DIR/agents"
echo "  ✓ Directorios listos: ~/.gemini/{skills,agents}"

# 2. Instalar Skills (Bridge from Claude)
echo ""
echo "[2/4] Migrando Skills de Solaria..."
if [ -d "$SKILLS_SOURCE" ]; then
    # Copiar skills recursivamente
    cp -r "$SKILLS_SOURCE/"* "$GEMINI_DIR/skills/"
    echo "  ✓ $(ls "$GEMINI_DIR/skills" | wc -l | xargs) skills instalados en ~/.gemini/skills"
    
    # Crear un índice de skills para Gemini si es necesario (opcional)
    ls "$GEMINI_DIR/skills" > "$GEMINI_DIR/skills/installed_skills.txt"
else
    echo "  ❌ Error: No se encontró fuente de skills en $SKILLS_SOURCE"
    exit 1
fi

# 3. Instalar Protocolo Maestro (GEMINI.md)
echo ""
echo "[3/4] Instalando Protocolo Maestro..."
if [ -f "$SCRIPT_DIR/GEMINI.md" ]; then
    cp "$SCRIPT_DIR/GEMINI.md" "$GEMINI_DIR/GEMINI.md"
    # También copiar como instrucciones de sistema si Gemini CLI lo soporta en config
    # O crear un alias en .bashrc/.zshrc para cargar el contexto
    echo "  ✓ GEMINI.md instalado en ~/.gemini/GEMINI.md"
else
    echo "  ❌ Error: No se encontró GEMINI.md"
fi

# 4. Configurar Alias (Opcional pero recomendado)
echo ""
echo "[4/4] Generando instrucciones de carga..."

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ INSTALACIÓN COMPLETADA"
echo ""
echo "Para activar el modo SOLARIA en Gemini CLI, usa este prompt de inicio:"
echo ""
echo "👉 'Lee y adopta el protocolo definido en ~/.gemini/GEMINI.md'"
echo ""
echo "Tus skills están disponibles en ~/.gemini/skills/"
echo "Ejemplo: 'Usa el skill en ~/.gemini/skills/ios26-liquid-glass-designer/skill.md'"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
