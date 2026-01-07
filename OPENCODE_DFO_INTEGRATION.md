# Instalación y Configuración de OpenCode + SOLARIA DFO

## Overview

Este repositorio `claude-code-config` ha sido extendido para integrar completamente OpenCode (Claude Code CLI) con SOLARIA DFO v3.3.0, proporcionando un entorno centralizado para:

- **Gestión de proyectos y tareas** vía SOLARIA DFO
- **Sincronización automática** de sesiones y configuraciones entre instancias
- **Skills portables** con contexto completo de DFO
- **Plugins del marketplace** preconfigurados y sincronizados

## Arquitectura de Integración

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│  OpenCode     │◄──►│ Claude Code CLI │◄──►│  SOLARIA DFO    │
└─────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
        │               │               │               │               │               │
└─────────────────┴───────────┴───────────────┴───────────────┘
        │               │               │               │               │               │
```

## Componentes Instalados

### 1. MCP SOLARIA-DFO v3.3.0

**Ubicación**: `mcp-servers/solaria-dfo/`

**Herramientas** (27 total):
- Gestión de proyectos: `list_projects`, `create_project`, `get_project`, `update_project`
- Gestión de tareas: `list_tasks`, `create_task`, `update_task`, `complete_task`, `get_ready_tasks`
- Agentes: `list_agents`, `get_agent`, `update_agent_status`
- Dashboard: `get_dashboard_overview`, `get_dashboard_alerts`
- Memoria: `memory_create`, `memory_list`, `memory_get`, `memory_update`, `memory_delete`, `memory_search`, `memory_semantic_search`, `memory_boost`, `memory_related`, `memory_link`
- Auditoría: `log_activity`

**Configuración en Claude Code**:
```json
"mcpServers": {
  "solaria_dfo": {
    "command": "node /ruta/absoluta/al/mcp-servers/solaria-dfo/dist/index.js",
    "env": {
      "DFO_SERVER": "https://dfo.solaria.agency",
      "DFO_MCP_URL": "https://dfo.solaria.agency/mcp",
      "DFO_AUTH_TOKEN": "default",
      "PROJECT_NAME": "claude-code-config"
    }
  }
}
```

### 2. MCP OpenCode Bridge v1.0.0

**Ubicación**: `mcp-servers/opencode-bridge/`

**Herramientas** (4 herramientas):
- `opencode_session_sync` - Sincroniza sesiones de OpenCode con Claude Code
- `opencode_dfo_bridge` - Puente a SOLARIA DFO (ejecuta herramientas DFO desde OpenCode)
- `opencode_execute_skill` - Ejecuta skills de Claude Code con contexto DFO
- `opencode_sync_config` - Sincroniza configuraciones entre instancias

**Configuración en Claude Code**:
```json
"mcpServers": {
  "opencode_bridge": {
    "command": "node /ruta/absoluta/al/mcp-servers/opencode-bridge/dist/index.js",
    "env": {
      "OPENCODE_BRIDGE_DIR": "/ruta/absoluta/al/mcp-servers/opencode-bridge",
      "DFO_SERVER": "https://dfo.solaria.agency",
      "DFO_MCP_URL": "https://dfo.solaria.agency/mcp",
      "DFO_AUTH_TOKEN": "default",
      "PROJECT_NAME": "claude-code-config"
    }
  }
}
```

### 3. Scripts de Sincronización

**opencode-sync.sh**
- Detecta sesiones de OpenCode en `~/.claude/sessions`
- Actualiza estado en `.opencode_sessions.json`
- Sincroniza sesiones con GitHub Actions (automatic)

**GitHub Actions** (`.github/workflows/opencode-sync.yml`):
- Se ejecuta automáticamente en push al repo
- Detecta y sincroniza sesiones, configuraciones, CLAUDE.md
- Comparte cambios entre instancias vía GitHub

### 4. Script de Auto-Instalación

**install-opencode.sh**
- Instalador unificado que configura todo el entorno
- Detecta MCP SOLARIA-DFO compilado
- Detecta MCP OpenCode Bridge compilado
- Actualiza `~/.claude/claude_code_config.json` con ambos MCPs
- Crea directorios de trabajo necesarios
- Sincroniza plugins marketplace en configuración
- Verifica Node.js instalado

## Instalación

### En Cualquier Máquina con Claude Code CLI

```bash
# Clonar repositorio
git clone https://github.com/NAZCAMEDIA/claude-code-config.git

# Ejecutar instalador
cd claude-code-config
bash install-opencode.sh
```

### Verificación Post-Instalación

1. **Reiniciar Claude Code CLI**
2. **Verificar MCPs**: Ejecuta cualquier herramienta de SOLARIA-DFO para confirmar conexión
3. **Probar OpenCode Bridge**: Iniciar una sesión de OpenCode y verificar sincronización

## Uso

### Flujo de Trabajo Típico

1. Usuario inicia OpenCode en cualquier máquina
2. OpenCode Bridge detecta la sesión y configura contexto en SOLARIA DFO
3. Agente Claude Code puede:
   - Crear tareas con `create_task` (se guardan en DFO)
   - Listar proyectos con `list_projects`
   - Guardar decisiones en memoria con `memory_create`
   - Consultar tareas listas con `get_ready_tasks`
4. Cambios se sincronizan automáticamente a todas las instancias vía GitHub Actions

## Skills

Los skills en `.claude/skills/` y `.claude/skills/` son ya OpenCode-compatibles y se integran automáticamente con SOLARIA DFO a través del OpenCode Bridge MCP:

- **solaria-methodology-enforcer**: Valida patrones SOLARIA automáticamente
- **ios26-sketch-designer**: Diseño de pantallas iOS 26 en Sketch
- **ios26-liquid-glass-designer**: Sistema de diseño iOS 26 Liquid Glass
- **apple-multiplatform-swift-engineer**: Desarrollo multiplataforma Swift 6
- **spec-driven-development**: Crea especificaciones antes de implementar
- **tdd-workflow**: Implementa TDD (PAT-004) con pruebas antes de código
- **software-architecture**: Guías de arquitectura de calidad
- **mcp-builder**: Crea MCP servers personalizados
- **pm2-deployment**: Despliegue con PM2 para Node.js
- **security-audit**: Auditorías de seguridad OWASP
- **technical-debt-tracker**: Gestión de deuda técnica
- **api-verification-protocol**: Verificación de APIs externas

## Plugins Marketplace Configurados

Los siguientes plugins del marketplace están preconfigurados en `~/.claude/settings.json`:

- **Claude Code Plugins Plus** (27 plugins):
  - security-audit-reporter, secret-scanner, penetration-tester
  - API generators: api-documentation-generator, api-sdk-generator
  - Testing: accessibility-test-scanner
  - DevOps: ci-cd-pipeline-builder, docker-compose-generator, gitops-workflow-builder
  - Fullstack: fullstack-starter-pack
  - Frontend: frontend-design
  - Database: database-schema-designer, query-performance-analyzer, database-migration-manager
  - Infra: infrastructure-as-code-generator
  - Security: api-security-scanner, api-rate-limiter, owasp-compliance-checker
  - Deployment: api-mock-server, rest-api-generator, graphql-server-builder
  - Git: git-commit-smart
  - Testing: devops-automation-pack

- **Dev Browser**: dev-browser-marketplace

Todos estos plugins se sincronizan automáticamente con las configuraciones del repositorio.

## Arquitectura de Memoria Centralizada

SOLARIA DFO actúa como cerebro central para todas las instancias:

- **Memoria persistente**: Decisiones, contexto, aprendizajes almacenados
- **Búsqueda semántica**: Memoria indexada con embeddings para recuperación inteligente
- **Cross-references**: Relaciones entre memorias para contexto conectado
- **Boost system**: Sistema de importancia para destacar información clave

## Sincronización Multi-Instancia

Cuando tienes múltiples máquinas con Claude Code:

1. **Sesiones aisladas**: Cada sesión tiene su propio contexto en SOLARIA DFO
2. **Configuración compartida**: Skills, plugins y configuraciones sincronizados vía GitHub
3. **Auditoría completa**: Todos los cambios y actividades se registran en DFO
4. **Gestión de proyectos**: Proyectos visibles en todas las instancias

## Dashboard SOLARIA DFO

Acceso en: **https://dfo.solaria.agency**

- Monitor de proyectos activos
- Vista de tareas con scoring de readiness
- Panel de agentes (estado, carga actual)
- Alertas: deadlines, bloqueadores, over-budget
- Memoria: búsqueda full-text y semántica

## Troubleshooting

### MCP SOLARIA-DFO no responde

```bash
# Verificar conexión
curl https://dfo.solaria.agency/mcp/health

# Verificar logs
tail -f ~/.claude/mcp_servers/solaria_dfo.log
```

### OpenCode Bridge no responde

```bash
# Verificar logs
tail -f ~/.claude/mcp_servers/opencode_bridge.log
```

### Reiniciar Claude Code CLI

```bash
# Reiniciar completamente
# macOS/Linux: cerrar y abrir Claude Code CLI
```

## Roadmap de Desarrollo

### Fase 1: Completado ✅
- [x] MCP SOLARIA-DFO v3.3.0
- [x] MCP OpenCode Bridge v1.0.0
- [x] Scripts de sincronización
- [x] GitHub Actions para auto-sync
- [x] Script de auto-instalación
- [x] Configuración actualizada

### Fase 2: Mejoras Futuras
- [ ] Agentes de sincronización activa en todas las instancias
- [ ] Webhooks para notificaciones en tiempo real
- [ ] CLI de administración para DFO integrado
- [ ] Dashboard de OpenCode Sessions visible en DFO
- [ ] Análisis de uso de tools y skills para optimización

## Contribuir

Para contribuir a la integración OpenCode + SOLARIA DFO:

1. **Reportar bugs**: Issues en GitHub
2. **Sugerir mejoras**: Pull requests con nuevas features
3. **Mejorar skills**: Agregar nuevos skills compatibles
4. **Documentar**: Actualizar README y documentación técnica

## Soporte

- **Dashboard**: https://dfo.solaria.agency
- **GitHub**: https://github.com/NAZCAMEDIA/claude-code-config
- **Issues**: github.com/NAZCAMEDIA/claude-code-config/issues

---

*Última actualización: Enero 2026*
*Versión: 1.0.0*
