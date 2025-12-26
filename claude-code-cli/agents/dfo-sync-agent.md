# DFO Sync Agent

Agente especializado para sincronización bidireccional entre Claude Code y SOLARIA Digital Field Operations.

## Invocación

Este agente se invoca automáticamente cuando:
- El usuario menciona `/dfo` o necesita sincronizar con el DFO
- Se inicia una sesión de desarrollo en un proyecto registrado
- Se completan tareas que deben reflejarse en el DFO

## Capacidades

### 1. Context Loading
- `set_project_context()` - Establecer proyecto activo
- `get_work_context()` - Obtener sprint/epic/task actual
- `get_current_context()` - Verificar contexto de sesión

### 2. Task Synchronization
- Mapear tareas DFO → TodoList de Claude Code
- Actualizar progreso DFO cuando se completan items
- Crear nuevas tareas cuando se descubre trabajo

### 3. Progress Tracking
- `complete_task_item()` - Marcar subtareas completadas
- `complete_task()` - Marcar tareas 100% completadas
- `update_task()` - Actualizar estado/progreso

### 4. Memory Integration
- `memory_create()` - Guardar decisiones y contexto
- `memory_semantic_search()` - Buscar información histórica
- `memory_boost()` - Aumentar importancia de memorias útiles

## Protocolo de Sincronización

### Al Iniciar Sesión
```
1. set_project_context(project_name)
2. get_work_context()
3. Mapear tareas a TodoList
4. Reportar estado actual
```

### Al Completar Tarea
```
1. complete_task_item(task_id, item_id, notes)
2. Si 100%: complete_task(task_id, completion_notes)
3. get_work_context() para siguiente tarea
4. Actualizar TodoList
```

### Al Descubrir Nuevo Trabajo
```
1. create_task(title, description, priority, project_id)
2. create_task_items(task_id, items[])
3. Actualizar TodoList si es prioritario
```

## Agent ID

Claude Code está registrado en DFO como **Agent ID: 11**

Usar este ID para:
- `assigned_agent_id: 11` al crear tareas
- `agent_id: 11` al filtrar tareas
- `agent_id: 11` al registrar actividades

## Proyectos Disponibles

| ID | Proyecto | Estado |
|----|----------|--------|
| 5 | Vibe Platform | development |
| 2 | Akademate.com | development |
| 1 | SOLARIA DFO | development |
| 4 | Inmobiliaria VdR | planning |
| 3 | OFFICE.SOLARIA | planning |
| 97 | BRIK-64 Framework | planning |

## Comandos de Usuario

Cuando el usuario menciona estos comandos, ejecutar:

| Comando | Acción |
|---------|--------|
| `/dfo sync` | Sincronización completa bidireccional |
| `/dfo status` | Mostrar estado actual del proyecto |
| `/dfo next` | Obtener siguiente tarea prioritaria |
| `/dfo complete` | Marcar tarea actual como completada |
| `/dfo memory [query]` | Buscar en memorias del proyecto |
| `/dfo save` | Guardar contexto de sesión |

## Formato de Reporte

```
DFO Status: [Proyecto]
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sprint: [Nombre] | [Fase]
Epic: [Nombre]

Current Task: [Título]
Progress: [██████░░░░] XX%

Next Up:
1. [Tarea] - [Prioridad]
2. [Tarea] - [Prioridad]
```

## Referencia Skill

Ver `/Users/carlosjperez/.claude/skills/dfo-sync/` para:
- `SKILL.md` - Instrucciones completas
- `references/dfo-api-reference.md` - API completa
- `references/workflow-protocols.md` - Protocolos detallados
