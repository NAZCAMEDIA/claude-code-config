#!/bin/bash
# Model Switcher - Cambia el modelo de Claude Code automáticamente
# Uso: ./model-switcher.sh [haiku|sonnet|opus]

set -e

SETTINGS_FILE="$HOME/.claude/settings.json"
MODEL=${1:-haiku}

# Validar modelo
if [[ ! "$MODEL" =~ ^(haiku|sonnet|opus)$ ]]; then
    echo "❌ Error: Modelo inválido. Usa: haiku, sonnet, u opus"
    exit 1
fi

# Verificar que settings.json existe
if [ ! -f "$SETTINGS_FILE" ]; then
    echo "❌ Error: $SETTINGS_FILE no encontrado"
    exit 1
fi

# Cambiar modelo usando jq
jq ".model = \"$MODEL\"" "$SETTINGS_FILE" > "$SETTINGS_FILE.tmp" && mv "$SETTINGS_FILE.tmp" "$SETTINGS_FILE"

# Mostrar confirmación
case $MODEL in
    haiku)
        echo "✅ Model switched to: Haiku 4.5"
        echo ""
        echo "Características:"
        echo "  • Velocidad: ⚡⚡⚡ MÁXIMA"
        echo "  • Costo: 💰 MÍNIMO"
        echo "  • Ideal para: Git ops, búsquedas, tareas simples"
        ;;
    sonnet)
        echo "✅ Model switched to: Sonnet 4.5"
        echo ""
        echo "Características:"
        echo "  • Velocidad: ⚡⚡ RÁPIDA"
        echo "  • Capacidad: 🧠 BUENA"
        echo "  • Ideal para: Desarrollo, refactoring, tests"
        ;;
    opus)
        echo "✅ Model switched to: Opus 4.5"
        echo ""
        echo "Características:"
        echo "  • Velocidad: ⚡ MODERADA"
        echo "  • Capacidad: 🧠🧠🧠 MÁXIMA"
        echo "  • Ideal para: Arquitectura, planning, estrategia"
        ;;
esac

echo ""
echo "Status: ACTIVO"
echo "⚠️  Cambio efectivo en nueva sesión de Claude Code"
