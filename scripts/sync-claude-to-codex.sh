#!/usr/bin/env bash
# 🤖 Sync CLAUDE instructions into AGENTS (Codex) reference file

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLAUDE_FILE="$REPO_DIR/CLAUDE.md"
AGENTS_FILE="$REPO_DIR/AGENTS.md"

if [[ ! -f "$CLAUDE_FILE" ]]; then
  echo "Missing $CLAUDE_FILE"
  exit 1
fi

{
  cat <<'EOF'
# AGENTS (Codex Instructions Mirror)

> Este archivo es mantenido automáticamente a partir del protocolo `CLAUDE.md`. Su propósito es dar a Codex (este agente) el mismo contexto y habilidades que Claude Code. Los cambios en `CLAUDE.md` se reflejarán aquí mediante un GitHub Action diario.

EOF
  cat "$CLAUDE_FILE"
  echo
  echo "## Equipamiento replicado de Claude Code"
  echo
  echo "### Agentes personalizados (claude-code-cli/agents)"
  ls -1 "$REPO_DIR/claude-code-cli/agents" | sort
  echo
  echo "### Skills disponibles (claude-code-cli/skills)"
  ls -1 "$REPO_DIR/claude-code-cli/skills" | sort
  echo
  echo "### Configuraciones destacadas"
  echo "- $REPO_DIR/claude-code-cli/claude_code_config.json"
  echo "- $REPO_DIR/claude-code-cli/settings.json"
  echo "- $REPO_DIR/claude-code-cli/statusline-comprehensive.sh"
  echo "- $REPO_DIR/claude-desktop/config.json"
  echo "- $REPO_DIR/claude-desktop/extensions-installations.json"
  echo
  echo "### Auto-sync y distribución"
  echo "- \`.github/workflows/daily-sync.yml\` mantiene el repositorio (Claude) actualizado."
  echo "- \`.github/workflows/daily-codex-instructions.yml\` (nuevo) replicará este archivo cada día y lo empujará si detecta cambios."
} > "$AGENTS_FILE"

chmod 644 "$AGENTS_FILE"

echo "Updated $AGENTS_FILE"
