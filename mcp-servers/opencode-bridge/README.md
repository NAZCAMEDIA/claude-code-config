# OpenCode Bridge MCP Server v1.0.0

MCP Bridge simple que integra OpenCode con SOLARIA DFO

## Herramientas

- `opencode_session_sync` - Sincronizar sesiones de OpenCode con Claude Code
- `opencode_dfo_bridge` - Puente a SOLARIA DFO (crear tareas, leer proyectos, etc.)

## Configuración

En `~/.claude/claude_code_config.json`:

```json
{
  "mcpServers": {
    "opencode-bridge": {
      "command": "node /Users/carlosjperez/Documents/GitHub/claude-code-config/mcp-servers/opencode-bridge/dist/index.js",
      "env": {
        "DFO_SERVER": "https://dfo.solaria.agency",
        "DFO_MCP_URL": "https://dfo.solaria.agency/mcp",
        "DFO_AUTH_TOKEN": "default",
        "PROJECT_NAME": "claude-code-config"
      }
    }
  }
}
```

## Instalación

```bash
cd mcp-servers/opencode-bridge
npm install
npm run build
```

## Uso

El MCP se iniciará automáticamente en Claude Code CLI con la configuración del settings.json.
