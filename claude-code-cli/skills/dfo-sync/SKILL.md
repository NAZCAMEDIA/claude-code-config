---
name: dfo-sync
description: Bidirectional synchronization between Claude Code and SOLARIA DFO. Automatically syncs tasks, updates progress, manages work context, and keeps the TodoList aligned with DFO. Use at session start, when completing tasks, or when "/dfo" is mentioned. Triggers on project work, task management, and development sessions.
---

# DFO Sync Agent

## Overview

This skill provides bidirectional synchronization between Claude Code's TodoList and the SOLARIA Digital Field Operations (DFO) system. It ensures that:

1. **DFO → Claude**: Work context, tasks, and priorities flow into the development session
2. **Claude → DFO**: Progress updates, completions, and new tasks flow back to DFO

## When to Use

**Automatic Triggers:**
- At the start of any development session
- When user mentions a project name (Akademate, Vibe Platform, etc.)
- When completing significant tasks
- When "/dfo" or "/sync" is mentioned
- When creating new tasks or subtasks

**Manual Invocation:**
- `/dfo sync` - Full bidirectional sync
- `/dfo status` - Show current work context
- `/dfo next` - Get next priority task
- `/dfo complete [task_id]` - Mark task as complete

## Core Operations

### 1. Session Initialization Protocol

**ALWAYS execute at session start:**

```
1. Call get_work_context() to retrieve:
   - Current project
   - Active sprint (phase)
   - Active epic
   - Current in-progress task with subtasks

2. If no project context set:
   - Call set_project_context() with project name/ID

3. Sync DFO tasks to TodoList:
   - Map in_progress tasks → in_progress todos
   - Map pending high-priority tasks → pending todos
   - Limit to 5-7 actionable items
```

### 2. Task Synchronization Matrix

| DFO Status | TodoList Status | Sync Direction |
|------------|-----------------|----------------|
| pending | pending | DFO → TodoList |
| in_progress | in_progress | Bidirectional |
| completed | completed | TodoList → DFO |
| blocked | pending (flagged) | DFO → TodoList |

### 3. Progress Update Protocol

**When completing a todo item:**

```
1. Identify corresponding DFO task/item
2. Call complete_task_item() with:
   - task_id
   - item_id
   - actual_minutes (if tracked)
   - notes (brief completion summary)
3. Check if parent task is 100% complete
4. If complete, call complete_task() with completion_notes
5. Update TodoList to reflect new state
```

### 4. Task Creation Protocol

**When creating new work items:**

```
1. Create task in DFO via create_task():
   - title, description
   - priority (critical/high/medium/low)
   - estimated_hours
   - Assign to agent (Claude Code = ID 11)

2. Break down into subtasks via create_task_items():
   - Each subtask with title, estimated_minutes

3. Add corresponding items to TodoList
```

## DFO API Reference

### Context Operations

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `get_work_context` | Full session context | Session start, context refresh |
| `set_project_context` | Set active project | Project switch, initialization |
| `get_current_context` | Quick context check | Mid-session verification |

### Task Operations

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `list_tasks` | Get tasks by status/priority | Sync, planning |
| `get_task` | Task details + subtasks | Task focus |
| `create_task` | New task | New work identified |
| `update_task` | Modify task | Status change, reassignment |
| `complete_task` | Mark 100% done | Task finished |

### Subtask Operations

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `list_task_items` | Get checklist items | Task breakdown view |
| `create_task_items` | Add subtasks | Planning phase |
| `complete_task_item` | Mark item done | Granular progress |
| `update_task_item` | Modify item | Corrections |

### Sprint & Epic Operations

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `list_sprints` | Project phases | Phase overview |
| `list_epics` | Feature groups | Epic planning |
| `update_epic` | Epic status | Feature completion |

### Memory Operations

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `memory_create` | Store context/decisions | Important learnings |
| `memory_search` | Find past context | Context recall |
| `memory_semantic_search` | AI-powered search | Complex queries |

## Workflow Examples

### Example 1: Session Start

```
User: "Vamos a trabajar en Akademate"

Agent Actions:
1. set_project_context(project_name: "Akademate.com")
2. get_work_context()
3. Map current tasks to TodoList:
   - [in_progress] "Implement user authentication"
   - [pending] "Create course enrollment API"
   - [pending] "Design admin dashboard"
4. Report: "Proyecto Akademate cargado. Tarea actual: Implement user authentication (45% complete)"
```

### Example 2: Task Completion

```
User completes authentication implementation

Agent Actions:
1. complete_task_item(task_id: 123, item_id: 456, notes: "JWT auth implemented with refresh tokens")
2. Check parent task progress
3. If 100%: complete_task(task_id: 123, completion_notes: "Authentication system fully implemented")
4. Update TodoList: mark as completed
5. get_work_context() to load next priority
6. Report: "Tarea completada. Siguiente: Create course enrollment API"
```

### Example 3: Discovering New Work

```
Agent identifies bug during development

Agent Actions:
1. create_task(
     title: "Fix race condition in enrollment",
     description: "Found during auth testing...",
     priority: "high",
     project_id: 2,
     assigned_agent_id: 11
   )
2. create_task_items(task_id: new_id, items: [
     {title: "Identify race condition source"},
     {title: "Add mutex lock"},
     {title: "Test concurrent enrollments"}
   ])
3. Update TodoList with new task
4. Report: "Bug registrado en DFO: #task_id"
```

## Status Reporting Format

When reporting DFO status, use this format:

```
DFO Status: [Project Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sprint: [Sprint Name] | Phase: [Phase Type]
Epic: [Epic Name]

Current Task: [Task Title]
Progress: [██████████░░░░] 60% (6/10 items)
Priority: [Priority Level]

Next Up:
1. [Next task title] - [Priority]
2. [Following task] - [Priority]

Blockers: [None | List blockers]
```

## Integration with TodoList

### Mapping Rules

```
DFO Task → TodoList Item:
  - content: task.title
  - activeForm: "Working on " + task.title
  - status: task.status (mapped)

DFO Subtask → Nested approach:
  - Parent task as main todo
  - Subtasks inform progress percentage
```

### Sync Frequency

- **Session start**: Full sync
- **Task completion**: Immediate update
- **Every 30 minutes**: Background context refresh (if running long)
- **Project switch**: Full sync

## Agent ID Reference

Claude Code in DFO: **Agent ID 11**

Always use this when:
- Creating tasks (assigned_agent_id: 11)
- Filtering tasks (agent_id: 11)
- Logging activities (agent_id: 11)

## Error Handling

| Error | Action |
|-------|--------|
| Project not found | Prompt user to select from list_projects() |
| Task already completed | Skip update, refresh context |
| Network timeout | Retry once, then queue for later |
| Invalid task_id | Re-fetch from get_work_context() |

## Best Practices

1. **Always verify context** before task operations
2. **Use semantic search** for finding related past work
3. **Log important decisions** to memory system
4. **Update DFO immediately** on task completion (don't batch)
5. **Keep TodoList lean** - max 7 items visible
6. **Use subtasks** for granular tracking (auto-updates progress)
