---
name: agent-coordinator
description: Coordinates multi-agent workflows in SOLARIA Construction Office with 10 specialized AI agents. This skill should be used when orchestrating complex development tasks across agents including project manager, architect, developer, tester, analyst, designer, DevOps, technical writer, security auditor, and deployment specialist.
---

# Agent Coordinator

This skill coordinates the 10 specialized AI agents in SOLARIA Construction Office for automated software construction.

## Agent Roster

| Agent | Role | Responsibilities |
|-------|------|------------------|
| **Project Manager** | Orchestration | Task breakdown, scheduling, progress tracking |
| **Architect** | Design | System design, patterns, technical decisions |
| **Developer** | Implementation | Code writing, debugging, refactoring |
| **Tester** | Quality | Test creation, execution, coverage |
| **Analyst** | Requirements | Spec analysis, user stories, acceptance criteria |
| **Designer** | UI/UX | Interface design, prototypes, accessibility |
| **DevOps** | Infrastructure | CI/CD, deployment, monitoring |
| **Technical Writer** | Documentation | Docs, API specs, user guides |
| **Security Auditor** | Security | Vulnerability assessment, compliance |
| **Deployment Specialist** | Release | Production deployment, rollback plans |

## Agent Communication Protocol

```
┌────────────────────────────────────────────────────┐
│                PROJECT MANAGER                      │
│              (Central Orchestrator)                 │
└─────────────────────┬──────────────────────────────┘
                      │
    ┌─────────────────┼─────────────────┐
    │                 │                 │
    ▼                 ▼                 ▼
┌─────────┐    ┌───────────┐    ┌──────────┐
│ Analyst │───▶│ Architect │───▶│ Developer│
└─────────┘    └───────────┘    └────┬─────┘
                                      │
              ┌───────────────────────┼────────────────┐
              │                       │                │
              ▼                       ▼                ▼
        ┌──────────┐           ┌──────────┐    ┌───────────┐
        │ Designer │           │  Tester  │    │  DevOps   │
        └──────────┘           └──────────┘    └─────┬─────┘
                                                      │
                                    ┌─────────────────┼─────────────────┐
                                    │                 │                 │
                                    ▼                 ▼                 ▼
                              ┌──────────┐    ┌───────────┐    ┌───────────┐
                              │ Security │    │  Tech     │    │ Deploy    │
                              │ Auditor  │    │  Writer   │    │ Specialist│
                              └──────────┘    └───────────┘    └───────────┘
```

## Task Assignment Algorithm

```python
def assign_task(task):
    # Determine agent based on task type
    agent_map = {
        'requirements': 'analyst',
        'design': 'architect',
        'ui_design': 'designer',
        'implementation': 'developer',
        'testing': 'tester',
        'infrastructure': 'devops',
        'documentation': 'technical_writer',
        'security_review': 'security_auditor',
        'deployment': 'deployment_specialist',
    }

    # Check agent availability
    agent = agent_map.get(task.type)
    if agent and is_available(agent):
        return assign(task, agent)

    # Queue if busy
    return queue_task(task, agent)
```

## Workflow States

| State | Description |
|-------|-------------|
| `pending` | Task created, not assigned |
| `assigned` | Assigned to agent |
| `in_progress` | Agent working on task |
| `review` | Awaiting review |
| `blocked` | Waiting for dependency |
| `completed` | Task finished |
| `failed` | Task failed, needs attention |

## Standard Workflows

### Feature Development
```
1. Analyst      → Requirements analysis
2. Architect    → Technical design
3. Designer     → UI/UX mockups (if applicable)
4. Developer    → Implementation
5. Tester       → Test creation & execution
6. Security     → Security review
7. Tech Writer  → Documentation
8. DevOps       → CI/CD setup
9. Deploy Spec  → Production deployment
```

### Bug Fix
```
1. Analyst      → Bug analysis
2. Developer    → Fix implementation
3. Tester       → Regression testing
4. Deploy Spec  → Hotfix deployment
```

### Infrastructure Change
```
1. Architect    → Infrastructure design
2. DevOps       → Implementation
3. Security     → Security review
4. Deploy Spec  → Rollout
```

## Agent Messages

### Task Assignment
```json
{
  "type": "task_assignment",
  "task_id": "TASK-001",
  "agent": "developer",
  "title": "Implement user authentication",
  "description": "...",
  "dependencies": ["TASK-000"],
  "deadline": "2024-01-15T18:00:00Z"
}
```

### Status Update
```json
{
  "type": "status_update",
  "task_id": "TASK-001",
  "agent": "developer",
  "status": "in_progress",
  "progress": 60,
  "notes": "Completed login, working on registration"
}
```

### Handoff
```json
{
  "type": "handoff",
  "from_agent": "developer",
  "to_agent": "tester",
  "task_id": "TASK-001",
  "artifacts": ["src/auth/*", "tests/auth/*"],
  "notes": "Ready for testing, see test plan in docs/"
}
```

## Coordination Commands

```bash
# Start project
bash scripts/start-project.sh "Project Name"

# Assign task
bash scripts/assign-task.sh developer "TASK-001"

# Check agent status
bash scripts/agent-status.sh

# View project dashboard
bash scripts/dashboard.sh
```

## Database Schema

```sql
-- Agent states
CREATE TABLE agent_states (
  id INT PRIMARY KEY,
  agent_name VARCHAR(50),
  status ENUM('available', 'busy', 'offline'),
  current_task_id INT,
  updated_at TIMESTAMP
);

-- Tasks
CREATE TABLE tasks (
  id INT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  status VARCHAR(20),
  assigned_agent VARCHAR(50),
  created_at TIMESTAMP,
  completed_at TIMESTAMP
);

-- Activity logs
CREATE TABLE activity_logs (
  id INT PRIMARY KEY,
  agent_name VARCHAR(50),
  action VARCHAR(100),
  task_id INT,
  details JSON,
  created_at TIMESTAMP
);
```

## Best Practices

1. **Clear handoffs** - Document what's done and what's next
2. **Status updates** - Regular progress reports
3. **Dependency tracking** - Know what blocks what
4. **Parallel execution** - Run independent tasks simultaneously
5. **Audit trail** - Log all agent actions

## Resources

- [Agent Definitions](references/agent-definitions.md)
- [Workflow Templates](references/workflow-templates.md)
- [Message Schemas](references/message-schemas.md)
