# Agent Capabilities MCP Endpoints Specification

**Author:** ECO-Lambda
**Date:** 2025-12-27
**Task:** DFN-001

---

## Endpoints Overview

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `register_agent_capabilities` | POST | Register/update skills for an agent |
| `get_agent_capabilities` | GET | Retrieve all skills for an agent |
| `list_all_capabilities` | GET | List all capabilities across agents |
| `deactivate_capability` | PATCH | Mark a capability as inactive |

---

## 1. register_agent_capabilities

### Parameters

```typescript
interface RegisterCapabilitiesParams {
  agent_id: number;           // Required: Agent ID
  capabilities: Array<{
    skill_name: string;       // Required: e.g., "payload-cms-setup"
    version: string;          // Required: semver (e.g., "1.2.0")
    active?: boolean;         // Optional: default true
    metadata?: object;        // Optional: additional info
  }>;
  upsert?: boolean;          // Optional: update if exists (default: true)
}
```

### Response

```typescript
interface RegisterCapabilitiesResponse {
  success: boolean;
  agent_id: number;
  capabilities_registered: number;
  capabilities_updated: number;
  capabilities: Array<{
    id: number;
    skill_name: string;
    version: string;
    active: boolean;
    registered_at: string;
  }>;
  message: string;
}
```

### SQL Logic

```sql
-- Use INSERT ... ON DUPLICATE KEY UPDATE for upsert behavior
INSERT INTO agent_capabilities
  (agent_id, skill_name, version, active, metadata)
VALUES
  (?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
  version = VALUES(version),
  active = VALUES(active),
  metadata = VALUES(metadata),
  updated_at = CURRENT_TIMESTAMP;
```

### Example Request

```json
{
  "agent_id": 11,
  "capabilities": [
    {
      "skill_name": "payload-cms-setup",
      "version": "1.2.0",
      "active": true,
      "metadata": {
        "category": "backend",
        "language": "Node.js"
      }
    },
    {
      "skill_name": "tdd-workflow",
      "version": "2.0.1",
      "active": true
    }
  ],
  "upsert": true
}
```

### Example Response

```json
{
  "success": true,
  "agent_id": 11,
  "capabilities_registered": 2,
  "capabilities_updated": 0,
  "capabilities": [
    {
      "id": 1,
      "skill_name": "payload-cms-setup",
      "version": "1.2.0",
      "active": true,
      "registered_at": "2025-12-27T10:00:00Z"
    },
    {
      "id": 2,
      "skill_name": "tdd-workflow",
      "version": "2.0.1",
      "active": true,
      "registered_at": "2025-12-27T10:00:01Z"
    }
  ],
  "message": "Registered 2 capabilities for agent 11"
}
```

---

## 2. get_agent_capabilities

### Parameters

```typescript
interface GetCapabilitiesParams {
  agent_id: number;           // Required: Agent ID
  active_only?: boolean;      // Optional: filter active (default: true)
  skill_name?: string;        // Optional: filter by skill
  format?: 'json' | 'human';  // Optional: response format (default: 'json')
}
```

### Response

```typescript
interface GetCapabilitiesResponse {
  success: boolean;
  agent_id: number;
  capabilities: Array<{
    id: number;
    skill_name: string;
    version: string;
    active: boolean;
    metadata?: object;
    registered_at: string;
    updated_at: string;
  }>;
  total_count: number;
  active_count: number;
}
```

### SQL Query

```sql
SELECT
  id,
  skill_name,
  version,
  active,
  metadata,
  registered_at,
  updated_at
FROM agent_capabilities
WHERE agent_id = ?
  AND (? IS NULL OR active = ?)
  AND (? IS NULL OR skill_name = ?)
ORDER BY skill_name ASC, version DESC;
```

### Example Request

```json
{
  "agent_id": 11,
  "active_only": true
}
```

### Example Response

```json
{
  "success": true,
  "agent_id": 11,
  "capabilities": [
    {
      "id": 1,
      "skill_name": "docker-compose-builder",
      "version": "2.3.0",
      "active": true,
      "metadata": {
        "category": "devops"
      },
      "registered_at": "2025-12-20T10:00:00Z",
      "updated_at": "2025-12-27T09:00:00Z"
    },
    {
      "id": 2,
      "skill_name": "payload-cms-setup",
      "version": "1.2.0",
      "active": true,
      "metadata": {
        "category": "backend",
        "language": "Node.js"
      },
      "registered_at": "2025-12-27T10:00:00Z",
      "updated_at": "2025-12-27T10:00:00Z"
    }
  ],
  "total_count": 2,
  "active_count": 2
}
```

---

## 3. list_all_capabilities

### Parameters

```typescript
interface ListAllCapabilitiesParams {
  skill_name?: string;         // Optional: filter by skill
  version?: string;            // Optional: filter by version
  active_only?: boolean;       // Optional: filter active (default: true)
  group_by?: 'skill' | 'agent'; // Optional: grouping (default: null)
}
```

### Response

```typescript
interface ListAllCapabilitiesResponse {
  success: boolean;
  capabilities: Array<{
    skill_name: string;
    version: string;
    agent_count: number;
    agents: Array<{
      agent_id: number;
      agent_name: string;
      active: boolean;
    }>;
  }>;
  total_skills: number;
}
```

### SQL Query

```sql
SELECT
  ac.skill_name,
  ac.version,
  COUNT(DISTINCT ac.agent_id) as agent_count,
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'agent_id', ac.agent_id,
      'agent_name', a.name,
      'active', ac.active
    )
  ) as agents
FROM agent_capabilities ac
JOIN agents a ON ac.agent_id = a.id
WHERE (? IS NULL OR ac.skill_name = ?)
  AND (? IS NULL OR ac.version = ?)
  AND (? IS NULL OR ac.active = ?)
GROUP BY ac.skill_name, ac.version
ORDER BY ac.skill_name ASC, ac.version DESC;
```

---

## 4. deactivate_capability

### Parameters

```typescript
interface DeactivateCapabilityParams {
  agent_id: number;            // Required
  skill_name: string;          // Required
}
```

### Response

```typescript
interface DeactivateCapabilityResponse {
  success: boolean;
  agent_id: number;
  skill_name: string;
  message: string;
}
```

### SQL Logic

```sql
UPDATE agent_capabilities
SET active = FALSE, updated_at = CURRENT_TIMESTAMP
WHERE agent_id = ? AND skill_name = ?;
```

---

## Error Handling

### Error Codes

| Code | Message | HTTP Status |
|------|---------|-------------|
| `AGENT_NOT_FOUND` | Agent with ID {id} not found | 404 |
| `INVALID_SEMVER` | Invalid semantic version format | 400 |
| `DUPLICATE_CAPABILITY` | Capability already exists (use upsert) | 409 |
| `DATABASE_ERROR` | Database operation failed | 500 |

### Example Error Response

```json
{
  "success": false,
  "error": "INVALID_SEMVER",
  "message": "Invalid semantic version format: '1.2'. Expected format: 'MAJOR.MINOR.PATCH'",
  "details": {
    "provided": "1.2",
    "expected": "1.2.0"
  }
}
```

---

## Integration with claude-code-config

### Skill dfo-sync Enhancement

```typescript
// In skill: dfo-sync.md

// Register Agent 11's capabilities on startup
async function syncCapabilities() {
  const skills = [
    { skill_name: 'payload-cms-setup', version: '1.2.0' },
    { skill_name: 'tdd-workflow', version: '2.0.1' },
    { skill_name: 'react-vite-setup', version: '3.1.0' },
    // ... all 23 skills
  ];

  await dfo.register_agent_capabilities({
    agent_id: 11,
    capabilities: skills,
    upsert: true
  });
}

// Query capabilities
const myCapabilities = await dfo.get_agent_capabilities({
  agent_id: 11,
  active_only: true
});
```

---

## Testing Checklist

- [ ] Register single capability
- [ ] Register multiple capabilities (bulk)
- [ ] Update existing capability (version bump)
- [ ] Activate/deactivate capability
- [ ] Query capabilities (all filters)
- [ ] List all capabilities grouped by skill
- [ ] Error handling (invalid semver, agent not found)
- [ ] Performance test (1000 capabilities)
- [ ] Concurrent registration (race conditions)
- [ ] Foreign key constraint (delete agent cascades)

---

## Next Steps

1. Implement endpoints in DFO MCP server
2. Add validation middleware
3. Create tests (Jest/Mocha)
4. Update OpenAPI/Swagger docs
5. Integrate with claude-code-config skill
