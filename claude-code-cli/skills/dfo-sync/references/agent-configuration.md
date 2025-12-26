# DFO Sync Agent Configuration

## Agent Types for Background Sync

### 1. DFO Status Agent

**Purpose:** Quick status check without full sync

**Invocation:**
```
Use Task tool with subagent_type="general-purpose"
Prompt: "Check DFO status for current project and report executive summary"
```

**Expected Output:**
- Project completion percentage
- Current task status
- Blockers count
- Next priority items

---

### 2. DFO Full Sync Agent

**Purpose:** Complete bidirectional synchronization

**Invocation:**
```
Use Task tool with subagent_type="general-purpose"
run_in_background: true
Prompt: "Perform full DFO sync:
1. Get work context
2. List all in_progress and pending tasks
3. Compare with current TodoList
4. Update any discrepancies
5. Return sync report"
```

**Expected Output:**
- Items synced count
- New items discovered
- Completed items updated
- Discrepancies resolved

---

### 3. DFO Memory Agent

**Purpose:** Store and retrieve project context

**Invocation for Save:**
```
Use Task tool with subagent_type="general-purpose"
Prompt: "Save current session context to DFO memory:
- Project: [project_name]
- Current task: [task_title]
- Key decisions made: [decisions]
- Blockers: [blockers]
Tags: session, context
Importance: 0.7"
```

**Invocation for Recall:**
```
Use Task tool with subagent_type="general-purpose"
Prompt: "Search DFO memory for context about [topic].
Use memory_semantic_search for best results.
Return relevant memories with summaries."
```

---

## Background Sync Pattern

For long-running sessions, use this pattern:

```javascript
// Start background sync every 30 minutes
const syncAgent = Task({
  subagent_type: "general-purpose",
  run_in_background: true,
  prompt: `
    Background DFO sync loop:
    1. Get current work context
    2. Update task progress based on completed items
    3. Check for new high-priority tasks
    4. Return brief status update
  `
});

// Check results periodically
const result = await TaskOutput({
  task_id: syncAgent.id,
  block: false
});
```

---

## Integration with TodoWrite

### Sync TodoList → DFO

When TodoWrite is called, automatically consider:

1. **New todos added** → Create in DFO if not exists
2. **Todos marked complete** → complete_task_item in DFO
3. **Todos removed** → Check if should delete from DFO

### Sync DFO → TodoList

When DFO changes detected:

1. **New tasks assigned** → Add to TodoList
2. **Task status changed** → Update TodoList status
3. **Task completed elsewhere** → Remove from TodoList

---

## Agent Handoff Protocol

When switching between development work and DFO management:

### From Dev to DFO Sync

```
1. Pause current development work
2. Save progress notes to memory
3. Invoke DFO sync agent
4. Wait for sync completion
5. Resume development with updated context
```

### From DFO to Dev

```
1. Complete DFO management task
2. Get fresh work context
3. Load highest priority task
4. Update TodoList
5. Resume development focus
```

---

## Error Handling Agents

### Connection Recovery Agent

```
Use Task tool with subagent_type="general-purpose"
Prompt: "DFO connection recovery:
1. Test list_projects for connectivity
2. If fail, wait 5 seconds and retry
3. On success, perform full sync
4. Report connection status and any lost updates"
```

### Data Reconciliation Agent

```
Use Task tool with subagent_type="general-purpose"
Prompt: "DFO data reconciliation:
1. Get all tasks for current project
2. Compare with local TodoList state
3. Identify conflicts (different status, missing items)
4. Propose resolution strategy
5. Execute resolutions (DFO as source of truth)
6. Report reconciliation results"
```

---

## Slash Command Implementations

### /dfo sync

```
Invoke DFO full sync:
1. set_project_context (if needed)
2. get_work_context
3. list_tasks (in_progress + pending)
4. Reconcile with TodoList
5. Report status
```

### /dfo status

```
Quick status check:
1. get_work_context
2. Format executive summary
3. Return immediately (no TodoList changes)
```

### /dfo next

```
Get next priority task:
1. get_work_context
2. list_tasks (pending, high priority first)
3. Select top unassigned/unstarted task
4. Propose starting this task
```

### /dfo complete

```
Mark current task complete:
1. Get current in_progress task
2. complete_task with notes
3. get_work_context for next task
4. Update TodoList
5. Report completion + next
```

### /dfo memory [query]

```
Search project memories:
1. memory_semantic_search with query
2. Return top relevant memories
3. Boost accessed memories
```

### /dfo save

```
Save session context:
1. Sync all pending updates
2. Create session memory
3. Report saved state
```
