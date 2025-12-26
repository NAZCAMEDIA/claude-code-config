# SOLARIA DFO API Reference

Complete reference for all MCP tools available in the SOLARIA Digital Field Operations system.

## Project Management

### list_projects
List all projects in the SOLARIA system.
```
Parameters: None
Returns: Array of projects with id, name, client, status, completion_percentage, etc.
```

### get_project
Get detailed information about a specific project.
```
Parameters:
  - project_id (number, required): The project ID
Returns: Full project details including tasks count, agents assigned
```

### create_project
Create a new project.
```
Parameters:
  - name (string, required): Project name
  - description (string): Project description
  - client (string): Client name
  - budget (number): Project budget in dollars
  - deadline (string): YYYY-MM-DD format
```

### update_project
Update project information.
```
Parameters:
  - project_id (number, required): Project ID
  - name, description, budget, deadline (optional)
  - status: planning | development | testing | deployment | completed | on_hold | cancelled
```

---

## Context Management

### set_project_context
**CRITICAL: Call this FIRST when starting work on a project.**
```
Parameters:
  - project_name (string): Search by name
  - project_id (number): Direct ID if known
  - working_directory (string): Path to help identify
```

### get_current_context
Get current session context.
```
Returns: Current project isolation info
```

### get_work_context
**CRITICAL: Call at start of work session.**
```
Returns:
  - Current project
  - Active sprint (phase)
  - Active epic
  - Current in-progress task with subtasks
```

---

## Task Management

### list_tasks
List tasks with filters.
```
Parameters:
  - project_id (number): Filter by project
  - status: pending | in_progress | completed | blocked
  - priority: critical | high | medium | low
  - agent_id (number): Filter by assigned agent
```

### get_task
Get detailed task information.
```
Parameters:
  - task_id (number, required)
Returns: Task details, progress, subtasks
```

### create_task
Create a new task.
```
Parameters:
  - title (string, required): Task title
  - project_id (number, required for remote)
  - description (string): Task description
  - priority: critical | high | medium | low
  - estimated_hours (number): Estimated time
  - assigned_agent_id (number): Agent ID (Claude Code = 11)
  - status: pending | in_progress
```

### update_task
Update existing task.
```
Parameters:
  - task_id (number, required)
  - status: pending | in_progress | completed | blocked
  - priority: critical | high | medium | low
  - progress (number): 0-100
  - assigned_agent_id (number): Reassign
  - title, description (strings)
```

### complete_task
Mark task as completed.
```
Parameters:
  - task_id (number, required)
  - completion_notes (string): Summary of work done
```

### delete_task
Permanently delete task and subtasks.
```
Parameters:
  - task_id (number, required)
WARNING: Irreversible
```

---

## Subtask (Task Items) Management

### list_task_items
Get checklist items for a task.
```
Parameters:
  - task_id (number, required)
  - include_completed (boolean): Default true
```

### create_task_items
Create subtasks for granular tracking.
```
Parameters:
  - task_id (number, required)
  - items (array, required):
    - title (string): What needs to be done
    - description (string): Optional details
    - estimated_minutes (number): Time estimate
```

### complete_task_item
Mark subtask as done. **Auto-updates parent task progress.**
```
Parameters:
  - task_id (number, required)
  - item_id (number, required)
  - actual_minutes (number): Time spent
  - notes (string): Completion notes
```

### update_task_item
Modify subtask details.
```
Parameters:
  - task_id (number, required)
  - item_id (number, required)
  - title, description, notes (strings)
  - is_completed (boolean)
```

### delete_task_item
Remove a subtask.
```
Parameters:
  - task_id (number, required)
  - item_id (number, required)
```

---

## Sprint Management

### list_sprints
List project phases with progress.
```
Parameters:
  - project_id (number, required)
  - status: planned | active | completed | cancelled
```

### create_sprint
Create new project phase.
```
Parameters:
  - project_id (number, required)
  - name (string, required): e.g., "Phase 1 - Planning"
  - phase_type: planning | development | testing | deployment | maintenance | custom
  - phase_order (number): Order in timeline
  - start_date, end_date (strings): YYYY-MM-DD
  - goal (string): Sprint goal
  - velocity, capacity (numbers)
  - status: planned | active | completed | cancelled
```

### update_sprint
Update sprint details/status.
```
Parameters:
  - sprint_id (number, required)
  - name, goal, phase_type (strings)
  - phase_order, velocity (numbers)
  - start_date, end_date, status (strings)
```

### delete_sprint
Remove sprint (tasks keep sprint_id = NULL).
```
Parameters:
  - sprint_id (number, required)
```

---

## Epic Management

### list_epics
List feature groups for a project.
```
Parameters:
  - project_id (number, required)
  - status: open | in_progress | completed | cancelled
```

### create_epic
Create new epic within a sprint.
```
Parameters:
  - project_id (number, required)
  - name (string, required): e.g., "User Authentication"
  - sprint_id (number): Parent sprint
  - description, color (strings)
  - start_date, target_date (strings): YYYY-MM-DD
  - status: open | in_progress | completed | cancelled
```

### update_epic
Update epic details.
```
Parameters:
  - epic_id (number, required)
  - name, description, color (strings)
  - sprint_id (number): Move to different phase
  - start_date, target_date, status (strings)
```

### delete_epic
Remove epic (tasks keep epic_id = NULL).
```
Parameters:
  - epic_id (number, required)
```

---

## Agent Management

### list_agents
List all SOLARIA AI agents.
```
Parameters:
  - status: active | busy | inactive
  - role (string): developer, architect, tester, etc.

Returns: Agent list with tasks_assigned, tasks_completed, current_tasks
```

### get_agent
Get agent details.
```
Parameters:
  - agent_id (number, required)
```

### get_agent_tasks
Get tasks assigned to agent.
```
Parameters:
  - agent_id (number, required)
```

### update_agent_status
Change agent status.
```
Parameters:
  - agent_id (number, required)
  - status: active | busy | inactive | error | maintenance
```

**Claude Code Agent ID: 11**

---

## Memory System

### memory_create
Store important information persistently.
```
Parameters:
  - content (string, required): Text, notes, code, decisions
  - summary (string): Short summary (max 500 chars)
  - tags (array): ["decision", "architecture", "bug", etc.]
  - importance (number): 0-1, default 0.5
  - metadata (object): Additional data
```

### memory_list
List memories with filters.
```
Parameters:
  - query (string): Text search
  - tags (array): Filter by tags
  - sort_by: importance | created_at | updated_at | access_count
  - limit (number): Default 20
  - offset (number): Pagination
```

### memory_get
Retrieve specific memory. **Increments access count.**
```
Parameters:
  - memory_id (number, required)
```

### memory_update
Update existing memory.
```
Parameters:
  - memory_id (number, required)
  - content, summary (strings)
  - tags (array): Replaces existing
  - importance (number)
  - metadata (object): Merged with existing
```

### memory_delete
Remove memory and cross-references.
```
Parameters:
  - memory_id (number, required)
```

### memory_search
Full-text search (MySQL FULLTEXT BOOLEAN MODE).
```
Parameters:
  - query (string, required)
  - tags (array)
  - min_importance (number): 0-1
  - limit (number): Default 10
```

### memory_semantic_search
AI-powered vector search for conceptual similarity.
**Hybrid scoring: 60% semantic + 40% keyword.**
```
Parameters:
  - query (string, required): Natural language
  - min_similarity (number): 0-1, default 0.5
  - include_fulltext (boolean): Default true
  - limit (number): Default 10
```

### memory_boost
Increase importance score when memory proves useful.
```
Parameters:
  - memory_id (number, required)
  - boost_amount (number): Default 0.1, max 0.5
```

### memory_tags
List available tags with usage counts.
```
Returns: All tags with id, name, description, usage_count
```

### memory_stats
Get memory system statistics.
```
Returns: Counts, top tags, recent activity
```

### memory_related
Get cross-referenced memories.
```
Parameters:
  - memory_id (number, required)
  - relationship_type: related | depends_on | contradicts | supersedes | child_of
```

### memory_link
Create cross-reference between memories.
```
Parameters:
  - source_id (number, required)
  - target_id (number, required)
  - relationship_type: related | depends_on | contradicts | supersedes | child_of
```

---

## Document Management

### list_docs
List all project documentation.
```
Parameters:
  - project_id (number): Filter by project
```

### get_project_documents
Get all documents for a project.
```
Parameters:
  - project_id (number, required)
```

### create_project_document
Add external document reference.
```
Parameters:
  - project_id (number, required)
  - name (string, required)
  - url (string, required)
  - type: spec | contract | manual | design | report | other
  - description (string)
```

### Inline Documents

#### create_inline_document
Store markdown content directly.
```
Parameters:
  - name (string, required): Min 3 chars
  - content_md (string, required): Markdown content
  - project_id (number): Required for remote
  - type: plan | spec | report | manual | adr | roadmap | audit | other
```

#### get_inline_document
Retrieve document with content.
```
Parameters:
  - document_id (number, required)
  - project_id (number)
```

#### update_inline_document
Update document. **Creates new version.**
```
Parameters:
  - document_id (number, required)
  - content_md (string)
  - name, type, change_summary (strings)
  - project_id (number)
```

#### list_inline_documents
List inline docs for project.
```
Parameters:
  - project_id (number)
  - type (string)
```

#### delete_inline_document
Soft delete (marks inactive).
```
Parameters:
  - document_id (number, required)
  - project_id (number)
```

#### search_documents
Full-text search across documents.
```
Parameters:
  - query (string, required): Min 2 chars
  - project_id (number)
  - type (string)
  - limit (number): Default 20
```

---

## Client & Request Management

### get_project_client
Get client info for project.
```
Parameters:
  - project_id (number, required)
```

### update_project_client
Update/create client info.
```
Parameters:
  - project_id (number, required)
  - name (string, required)
  - fiscal_name, rfc, address (strings)
  - contact_name, contact_email, contact_phone (strings)
  - website (string)
```

### get_project_requests
Get client requests/petitions.
```
Parameters:
  - project_id (number, required)
  - status: pending | approved | in_review | in_progress | completed | rejected
  - priority: low | medium | high | critical
```

### create_project_request
Create client request.
```
Parameters:
  - project_id (number, required)
  - text (string, required): Request description
  - requested_by (string): Person name
  - priority: low | medium | high | critical
```

### update_project_request
Update request status.
```
Parameters:
  - project_id (number, required)
  - request_id (number, required)
  - status: pending | approved | in_review | in_progress | completed | rejected
  - priority: low | medium | high | critical
  - notes (string)
```

---

## Activity Logging

### get_activity_logs
Get recent system activity.
```
Parameters:
  - limit (number): Default 50
  - project_id (number)
  - level: info | warning | error | critical
```

### log_activity
Log an activity.
```
Parameters:
  - action (string, required): Action description
  - category (string)
  - level: info | warning | error (default: info)
  - agent_id (number)
  - project_id (number)
```

---

## Dashboard

### get_dashboard_overview
Executive dashboard with KPIs.
```
Returns: Project metrics, agent status, task summaries
```

### get_dashboard_alerts
Get active alerts.
```
Parameters:
  - severity: critical | warning | info
```
