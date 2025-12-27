# DFO Sync Command

Sincronización bidireccional con SOLARIA Digital Field Operations.

## Uso

```
/dfo [subcommand] [args]
```

## Subcomandos

- **sync** - Sincronización completa bidireccional
- **status** - Estado actual del proyecto
- **ready** - Mostrar tareas listas para trabajar (sin bloqueadores)
- **next** - Siguiente tarea prioritaria
- **complete** - Marcar tarea actual como completada
- **memory [query]** - Buscar en memorias del proyecto
- **save** - Guardar contexto de sesión
- **project [name]** - Cambiar proyecto activo

## Instrucciones

Cuando el usuario ejecuta `/dfo`:

### Sin argumentos o `sync`
1. Llamar `set_project_context()` si no hay contexto
2. Llamar `get_work_context()`
3. Listar tareas del sprint activo con `list_tasks()`
4. Mapear a TodoList las tareas in_progress y pending de alta prioridad
5. Reportar estado en formato ejecutivo

### `status`
1. Llamar `get_work_context()`
2. Mostrar resumen de sprint, epic, y tarea actual
3. No modificar TodoList

### `ready`
1. Llamar `get_ready_tasks(format: "human")` con filtros del proyecto activo
2. Mostrar lista ordenada por readiness_score (prioridad inteligente)
3. Incluir razones de preparación para cada tarea
4. Ofrecer iniciar la tarea con mayor score
5. Filtros opcionales: `--priority`, `--sprint`, `--agent`

Ejemplo:
```
/dfo ready                    # Todas las tareas ready del proyecto
/dfo ready --priority high    # Solo tareas high/critical
/dfo ready --sprint 1         # Solo Sprint 1
```

### `next`
1. Llamar `list_tasks(status: "pending")` ordenadas por prioridad
2. Mostrar próxima tarea recomendada
3. Ofrecer iniciarla

### `complete`
1. Identificar tarea actual in_progress
2. Llamar `complete_task()` con notas
3. Llamar `get_work_context()` para siguiente
4. Actualizar TodoList

### `memory [query]`
1. Llamar `memory_semantic_search(query)`
2. Mostrar resultados relevantes
3. Ofrecer `memory_boost()` si es útil

### `save`
1. Sincronizar progreso pendiente
2. Crear memoria de sesión con `memory_create()`
3. Reportar estado guardado

### `project [name]`
1. Llamar `list_projects()` si no se especifica nombre
2. Llamar `set_project_context(project_name)`
3. Ejecutar sync automáticamente

## Herramientas MCP Requeridas

- `mcp__solaria-dfo__set_project_context`
- `mcp__solaria-dfo__get_work_context`
- `mcp__solaria-dfo__list_tasks`
- `mcp__solaria-dfo__get_ready_tasks` **(NEW - DFN-004)**
- `mcp__solaria-dfo__complete_task`
- `mcp__solaria-dfo__complete_task_item`
- `mcp__solaria-dfo__memory_create`
- `mcp__solaria-dfo__memory_semantic_search`

## Formato de Salida

```
DFO Status: [Proyecto]
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sprint: [Nombre] | [Estado]
Epic: [Nombre]

Tarea Actual: [Título]
Progreso: [██████░░░░] XX% (X/Y items)

Pendientes:
1. [Tarea] - [Prioridad]
2. [Tarea] - [Prioridad]

Bloqueadores: [None | Lista]
```

## Agent ID

Claude Code = **ID 11** en DFO
