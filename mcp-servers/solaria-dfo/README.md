# SOLARIA DFO MCP Server v3.3.0

MCP Server para conectar con SOLARIA Digital Field Operations centralizado.

## 📦 Instalación

### Desde el repositorio

```bash
# Clonar repositorio
cd mcp-servers/solaria-dfo

# Instalar dependencias
npm install

# Compilar TypeScript
npm run build
```

### Configuración en Claude Code

Añadir a `~/.claude/claude_code_config.json`:

```json
{
  "mcpServers": {
    "solaria-dfo": {
      "command": "node /Users/carlosjperez/Documents/GitHub/claude-code-config/mcp-servers/solaria-dfo/dist/index.js",
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

## 🔧 Herramientas Disponibles

### Contexto de Proyecto (CRÍTICO)

| Herramienta | Descripción | Uso |
|-------------|-------------|-------|
| `set_project_context` | Establecer contexto de proyecto (LLAMAR PRIMERO) | Aísla la sesión a un proyecto específico |
| `get_current_context` | Verificar contexto actual | Validar aislamiento |

### Gestión de Proyectos

| Herramienta | Descripción |
|-------------|-------------|
| `list_projects` | Listar todos los proyectos |
| `create_project` | Crear nuevo proyecto |
| `get_project` | Obtener detalle de proyecto |
| `update_project` | Actualizar proyecto |

### Gestión de Tareas

| Herramienta | Descripción |
|-------------|-------------|
| `list_tasks` | Listar tareas con filtros |
| `get_ready_tasks` | Tareas listas para trabajar (scoring inteligente) |
| `create_task` | Crear nueva tarea |
| `update_task` | Actualizar tarea |
| `complete_task` | Marcar tarea completada |

### Agentes IA

| Herramienta | Descripción |
|-------------|-------------|
| `list_agents` | Listar agentes SOLARIA |
| `get_agent` | Obtener estado de agente |
| `update_agent_status` | Actualizar estado de agente |

### Dashboard & Analytics

| Herramienta | Descripción |
|-------------|-------------|
| `get_dashboard_overview` | KPIs ejecutivos |
| `get_dashboard_alerts` | Alertas activas |
| `log_activity` | Registrar actividad (auditoría) |

### Memoria Persistente

| Herramienta | Descripción |
|-------------|-------------|
| `memory_create` | Crear memoria (decisiones, contexto) |
| `memory_list` | Listar memorias |
| `memory_get` | Obtener memoria específica |
| `memory_update` | Actualizar memoria |
| `memory_delete` | Eliminar memoria |
| `memory_search` | Búsqueda full-text |
| `memory_semantic_search` | Búsqueda semántica |
| `memory_boost` | Aumentar importancia |
| `memory_related` | Memorias relacionadas |
| `memory_link` | Crear relación |

## 🚀 Uso con Claude Code

```bash
# Al iniciar una sesión de trabajo, PRIMERO establecer contexto:
set_project_context({project_name: "Nombre del Proyecto"})

# Luego verificar contexto:
get_current_context()

# Crear tareas en el proyecto:
create_task({title: "Implementar feature", project_id: 1})

# Guardar decisiones importantes:
memory_create({
  content: "Usaremos JWT para autenticación",
  tags: ["decision", "security"],
  importance: 0.8
})

# Buscar decisiones previas:
memory_semantic_search({query: "autenticación JWT"})
```

## 🔐 Multi-Agent Project Isolation

Cuando múltiples agentes Claude trabajan simultáneamente:

1. **Cada agente debe llamar `set_project_context` al inicio**
2. El servidor DFO aisla automáticamente las operaciones
3. Tarea creada por agente A NO es visible para agente B
4. Verificar aislamiento con `get_current_context`

## 🌐 Servidor Centralizado

- **Dashboard**: https://dfo.solaria.agency
- **MCP Endpoint**: https://dfo.solaria.agency/mcp
- **API REST**: https://dfo.solaria.agency/api

## 📝 Variables de Entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `DFO_SERVER` | `https://dfo.solaria.agency` | URL base del servidor |
| `DFO_MCP_URL` | `${DFO_SERVER}/mcp` | Endpoint MCP |
| `DFO_AUTH_TOKEN` | `default` | Token de autenticación |
| `PROJECT_NAME` | `default` | Nombre del proyecto para aislamiento |

## 🔗 Referencias

- SOLARIA DFO Docs: https://github.com/SOLARIA-AGENCY/solaria-digital-field--operations
- Protocolo MCP: https://modelcontextprotocol.io
