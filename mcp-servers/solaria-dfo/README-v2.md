# SOLARIA DFO MCP Server v2.0

MCP Server para conectar con SOLARIA Digital Field Operations v2.0 con manejo robusto de conexión.

## Cambios v2.0 vs v3.3.0

- ✅ Health check dedicado para verificar conectividad
- ✅ Mensajes de error más claros con sugerencias de solución
- ✅ Manejo mejorado de timeouts y errores de red
- ✅ Detección de ECONNREFUSED, ETIMEDOUT, ENOTFOUND
- ✅ Compatibilidad con API v2.0 de SOLARIA DFO

## Instalación v2.0

```bash
cd mcp-servers/solaria-dfo

# Compilar versión v2.0
npm run build:v2

# Configurar en Claude Code
# Actualizar el path al archivo compilado dist-v2
```

## Configuración en Claude Code

Añadir a `~/.claude/claude_code_config.json`:

```json
{
  "mcpServers": {
    "solaria-dfo": {
      "command": "node /Users/carlosjperez/Documents/GitHub/claude-code-config/mcp-servers/solaria-dfo/dist-v2/index.js",
      "env": {
        "DFO_SERVER": "https://dfo.solaria.agency",
        "DFO_API_URL": "https://dfo.solaria.agency/api",
        "DFO_MCP_URL": "https://dfo.solaria.agency/mcp",
        "DFO_AUTH_TOKEN": "default",
        "PROJECT_NAME": "claude-code-config",
        "AGENT_ID": "11",
        "DFO_TIMEOUT": "30000"
      }
    }
  }
}
```

## Verificación de Conexión

```bash
# Ejecutar health check
echo '{"jsonrpc":"2.0","id":1,"method":"health_check","params":{}}' | node dist-v2/index.js

# Verificar logs
tail -f ~/.claude/mcp-solaria-dfo.log
```

## Troubleshooting

### Error: "Conexión rechazada - Servidor DFO no disponible"

- Verifica que dfo.solaria.agency esté activo: `curl https://dfo.solaria.agency/api/health`
- Revisa firewall/proxy que no esté bloqueando el puerto 443
- Contacta: soporte@solaria.agency

### Error: "Timeout de conexión - Servidor no responde"

- Aumenta `DFO_TIMEOUT` a 60000 (60 segundos)
- Verifica latencia de red: `ping dfo.solaria.agency`
- Posible sobrecarga del servidor - reintentar más tarde

### Error: "DNS no resuelto"

- Verifica DNS: `nslookup dfo.solaria.agency`
- Prueba con IP directa si DNS falla
- Verifica configuración /etc/hosts si hay override

## Variables de Entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `DFO_SERVER` | `https://dfo.solaria.agency` | URL base del servidor |
| `DFO_API_URL` | `${DFO_SERVER}/api` | Endpoint API REST |
| `DFO_MCP_URL` | `${DFO_SERVER}/mcp` | Endpoint MCP (no usado en v2.0) |
| `DFO_AUTH_TOKEN` | `default` | Token de autenticación |
| `PROJECT_NAME` | `default` | Nombre del proyecto para aislamiento |
| `AGENT_ID` | `11` | ID del agente Claude Code |
| `DFO_TIMEOUT` | `30000` | Timeout en milisegundos |

## Referencias

- SOLARIA DFO v2.0 API: https://dfo.solaria.agency/api/docs
- Protocolo MCP: https://modelcontextprotocol.io
- Repositorio: https://github.com/NAZCAMEDIA/claude-code-config
