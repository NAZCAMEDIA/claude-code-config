# DFO Sync Skill

## Descripcion

Skill de sincronizacion bidireccional entre Claude Code y SOLARIA Digital Field Operations (DFO). Mantiene el TodoList de Claude Code alineado con las tareas del DFO y actualiza el progreso automaticamente.

## Instalacion

El skill esta instalado en:
```
~/.claude/skills/dfo-sync/
```

## Uso

### Comandos Disponibles

| Comando | Descripcion |
|---------|-------------|
| `/dfo sync` | Sincronizacion completa bidireccional |
| `/dfo status` | Ver estado actual del proyecto |
| `/dfo next` | Obtener siguiente tarea prioritaria |
| `/dfo complete` | Marcar tarea actual como completada |
| `/dfo memory [query]` | Buscar en memorias del proyecto |
| `/dfo save` | Guardar contexto de sesion |

### Activacion Automatica

El skill se activa automaticamente cuando:

1. **Mencionas un proyecto**: "Vamos a trabajar en Akademate"
2. **Inicias sesion de desarrollo**: Claude detecta contexto de proyecto
3. **Completas tareas**: Se sincroniza automaticamente con DFO
4. **Creas nuevas tareas**: Se registran en DFO

## Flujo de Trabajo

### 1. Inicio de Sesion

```
Tu: "Quiero trabajar en el proyecto Vibe Platform"

Claude:
1. Conecta con DFO
2. Carga contexto del proyecto
3. Muestra tareas actuales
4. Sincroniza TodoList

Salida:
DFO Status: Vibe Platform
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sprint: Development | Active
Epic: MCP Integration

Current Task: Implement shadcn components
Progress: [██████░░░░] 60%

Next Up:
1. Configure D1 database - High
2. Deploy to Cloudflare - Medium
```

### 2. Durante el Desarrollo

Claude automaticamente:
- Actualiza progreso cuando completas subtareas
- Crea nuevas tareas cuando descubre trabajo
- Sincroniza cada 30 minutos en sesiones largas

### 3. Fin de Sesion

```
Tu: "/dfo save"

Claude:
1. Sincroniza todo el progreso
2. Guarda contexto en memoria
3. Reporta estado final

Salida:
Session Saved to DFO
━━━━━━━━━━━━━━━━━━━
Completed: 3 tasks
In Progress: 1 task
Duration: 2h 15m

Next Session:
- Continue: Configure D1 database
```

## Proyectos Disponibles

| ID | Proyecto | Estado | Progreso |
|----|----------|--------|----------|
| 5 | Vibe Platform | development | 28% |
| 2 | Akademate.com | development | 45% |
| 1 | SOLARIA DFO | development | 85% |
| 4 | Inmobiliaria VdR | planning | 0% |
| 3 | OFFICE.SOLARIA | planning | 0% |
| 97 | BRIK-64 Framework | planning | 0% |
| 96 | AGUA BENDITA | planning | 0% |

## Agente Claude Code

- **ID en DFO:** 11
- **Rol:** Developer
- **Tareas asignadas:** 256
- **Tareas completadas:** 162

## Estructura del Skill

```
dfo-sync/
├── SKILL.md                    # Instrucciones principales
├── README.md                   # Este archivo
└── references/
    ├── dfo-api-reference.md    # Documentacion completa API
    ├── workflow-protocols.md   # Protocolos de trabajo
    └── agent-configuration.md  # Configuracion de agentes
```

## Integracion con Memoria

El skill usa el sistema de memoria del DFO para:

- Guardar decisiones tecnicas
- Recordar contexto entre sesiones
- Buscar informacion historica

### Tags Disponibles

| Tag | Uso |
|-----|-----|
| `decision` | Decisiones de arquitectura |
| `learning` | Conocimiento adquirido |
| `context` | Contexto de proyecto |
| `bug` | Reportes de bugs |
| `pattern` | Patrones de codigo |
| `solution` | Soluciones implementadas |

## Troubleshooting

### DFO no conecta

1. Verificar que el MCP solaria-dfo este activo
2. Revisar logs de Claude Code
3. Intentar `/dfo sync` manualmente

### Tareas no sincronizan

1. Verificar project_id correcto
2. Usar `get_work_context()` para refrescar
3. Revisar que agent_id sea 11

### Memoria no encuentra resultados

1. Usar `memory_semantic_search` en vez de `memory_search`
2. Ajustar min_similarity a 0.3 para busquedas amplias
3. Verificar tags correctos

## Desarrollo Futuro

- [ ] Notificaciones en tiempo real
- [ ] Integracion con GitHub Issues
- [ ] Dashboard visual en terminal
- [ ] Sincronizacion con calendar
