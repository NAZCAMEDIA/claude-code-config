/**
 * Agent Capabilities MCP Endpoints Test Suite
 *
 * @author ECO-Lambda | DFO Enhancement Plan
 * @date 2025-12-27
 * @task DFN-001
 *
 * Test coverage: Registration, queries, validation, error handling, performance
 * Target: ≥75% code coverage
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { z } from 'zod';
import {
  registerAgentCapabilities,
  getAgentCapabilities,
  listAllCapabilities,
  deactivateCapability,
} from './agent-capabilities-implementation';

// ============================================================================
// Mock Database
// ============================================================================

const mockDb = {
  query: jest.fn(),
  results: [] as any[],
};

// Mock the database import
jest.mock('../database', () => ({
  db: mockDb,
}));

// ============================================================================
// Test Data
// ============================================================================

const validAgent = {
  id: 11,
  name: 'Claude Code',
};

const validCapabilities = [
  {
    skill_name: 'payload-cms-setup',
    version: '1.2.0',
    active: true,
    metadata: {
      category: 'backend',
      language: 'Node.js',
    },
  },
  {
    skill_name: 'tdd-workflow',
    version: '2.0.1',
    active: true,
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

function mockAgentExists(agentId: number = 11) {
  mockDb.query.mockResolvedValueOnce([{ id: agentId }]);
}

function mockAgentNotFound() {
  mockDb.query.mockResolvedValueOnce([]);
}

function mockInsertResult(affectedRows: number = 1) {
  mockDb.query.mockResolvedValueOnce({ affectedRows });
}

function mockCapabilityResult(capability: any) {
  mockDb.query.mockResolvedValueOnce([capability]);
}

// ============================================================================
// Tests: register_agent_capabilities
// ============================================================================

describe('register_agent_capabilities', () => {
  beforeEach(() => {
    mockDb.query.mockClear();
  });

  it('should register a single capability successfully', async () => {
    mockAgentExists();
    mockInsertResult(1); // INSERT
    mockCapabilityResult({
      id: 1,
      skill_name: 'payload-cms-setup',
      version: '1.2.0',
      active: true,
      registered_at: '2025-12-27T10:00:00Z',
    });

    const result = await registerAgentCapabilities.execute({
      agent_id: 11,
      capabilities: [validCapabilities[0]],
      upsert: true,
    });

    expect(result.success).toBe(true);
    expect(result.capabilities_registered).toBe(1);
    expect(result.capabilities_updated).toBe(0);
    expect(result.capabilities).toHaveLength(1);
    expect(result.capabilities[0].skill_name).toBe('payload-cms-setup');
  });

  it('should register multiple capabilities in bulk', async () => {
    mockAgentExists();

    // First capability
    mockInsertResult(1);
    mockCapabilityResult({
      id: 1,
      skill_name: 'payload-cms-setup',
      version: '1.2.0',
      active: true,
      registered_at: '2025-12-27T10:00:00Z',
    });

    // Second capability
    mockInsertResult(1);
    mockCapabilityResult({
      id: 2,
      skill_name: 'tdd-workflow',
      version: '2.0.1',
      active: true,
      registered_at: '2025-12-27T10:00:01Z',
    });

    const result = await registerAgentCapabilities.execute({
      agent_id: 11,
      capabilities: validCapabilities,
      upsert: true,
    });

    expect(result.success).toBe(true);
    expect(result.capabilities_registered).toBe(2);
    expect(result.capabilities).toHaveLength(2);
  });

  it('should update existing capability when upsert=true', async () => {
    mockAgentExists();
    mockInsertResult(2); // affectedRows=2 means UPDATE
    mockCapabilityResult({
      id: 1,
      skill_name: 'payload-cms-setup',
      version: '1.3.0', // version bumped
      active: true,
      registered_at: '2025-12-27T10:00:00Z',
    });

    const result = await registerAgentCapabilities.execute({
      agent_id: 11,
      capabilities: [
        {
          skill_name: 'payload-cms-setup',
          version: '1.3.0', // version bump
          active: true,
        },
      ],
      upsert: true,
    });

    expect(result.success).toBe(true);
    expect(result.capabilities_registered).toBe(0);
    expect(result.capabilities_updated).toBe(1);
  });

  it('should fail when agent does not exist', async () => {
    mockAgentNotFound();

    const result = await registerAgentCapabilities.execute({
      agent_id: 999,
      capabilities: [validCapabilities[0]],
      upsert: true,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('AGENT_NOT_FOUND');
    expect(result.message).toContain('Agent with ID 999 not found');
  });

  it('should fail when duplicate exists and upsert=false', async () => {
    mockAgentExists();
    mockDb.query.mockRejectedValueOnce({
      code: 'ER_DUP_ENTRY',
      message: 'Duplicate entry',
    });

    const result = await registerAgentCapabilities.execute({
      agent_id: 11,
      capabilities: [validCapabilities[0]],
      upsert: false,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('DUPLICATE_CAPABILITY');
    expect(result.message).toContain('already exists');
    expect(result.message).toContain('Use upsert=true');
  });

  it('should validate semantic version format', async () => {
    await expect(
      registerAgentCapabilities.execute({
        agent_id: 11,
        capabilities: [
          {
            skill_name: 'invalid-version',
            version: '1.2', // INVALID: missing PATCH
            active: true,
          },
        ],
        upsert: true,
      })
    ).rejects.toThrow(); // Zod validation error
  });

  it('should handle metadata as optional', async () => {
    mockAgentExists();
    mockInsertResult(1);
    mockCapabilityResult({
      id: 1,
      skill_name: 'tdd-workflow',
      version: '2.0.1',
      active: true,
      registered_at: '2025-12-27T10:00:00Z',
    });

    const result = await registerAgentCapabilities.execute({
      agent_id: 11,
      capabilities: [
        {
          skill_name: 'tdd-workflow',
          version: '2.0.1',
          active: true,
          // No metadata
        },
      ],
      upsert: true,
    });

    expect(result.success).toBe(true);
  });
});

// ============================================================================
// Tests: get_agent_capabilities
// ============================================================================

describe('get_agent_capabilities', () => {
  beforeEach(() => {
    mockDb.query.mockClear();
  });

  const mockCapabilities = [
    {
      id: 1,
      skill_name: 'docker-compose-builder',
      version: '2.3.0',
      active: true,
      metadata: JSON.stringify({ category: 'devops' }),
      registered_at: '2025-12-20T10:00:00Z',
      updated_at: '2025-12-27T09:00:00Z',
    },
    {
      id: 2,
      skill_name: 'payload-cms-setup',
      version: '1.2.0',
      active: true,
      metadata: JSON.stringify({ category: 'backend', language: 'Node.js' }),
      registered_at: '2025-12-27T10:00:00Z',
      updated_at: '2025-12-27T10:00:00Z',
    },
  ];

  it('should retrieve all active capabilities for an agent', async () => {
    mockAgentExists();
    mockDb.query.mockResolvedValueOnce(mockCapabilities);

    const result = await getAgentCapabilities.execute({
      agent_id: 11,
      active_only: true,
      format: 'json',
    });

    expect(result.success).toBe(true);
    expect(result.agent_id).toBe(11);
    expect(result.total_count).toBe(2);
    expect(result.active_count).toBe(2);
    expect(result.capabilities).toHaveLength(2);
    expect(result.capabilities[0].metadata).toEqual({ category: 'devops' });
  });

  it('should filter by skill_name', async () => {
    mockAgentExists();
    mockDb.query.mockResolvedValueOnce([mockCapabilities[0]]);

    const result = await getAgentCapabilities.execute({
      agent_id: 11,
      active_only: true,
      skill_name: 'docker-compose-builder',
      format: 'json',
    });

    expect(result.success).toBe(true);
    expect(result.capabilities).toHaveLength(1);
    expect(result.capabilities[0].skill_name).toBe('docker-compose-builder');
  });

  it('should return human-readable format when requested', async () => {
    mockAgentExists();
    mockDb.query.mockResolvedValueOnce(mockCapabilities);

    const result = await getAgentCapabilities.execute({
      agent_id: 11,
      active_only: true,
      format: 'human',
    });

    expect(result.success).toBe(true);
    expect(result.formatted).toBeDefined();
    expect(result.formatted).toContain('Agent 11 Capabilities:');
    expect(result.formatted).toContain('Total: 2 | Active: 2');
    expect(result.formatted).toContain('✓ docker-compose-builder v2.3.0');
    expect(result.formatted).toContain('✓ payload-cms-setup v1.2.0');
  });

  it('should include inactive capabilities when active_only=false', async () => {
    mockAgentExists();
    const withInactive = [
      ...mockCapabilities,
      {
        id: 3,
        skill_name: 'deprecated-skill',
        version: '0.1.0',
        active: false,
        metadata: null,
        registered_at: '2024-01-01T10:00:00Z',
        updated_at: '2025-12-27T10:00:00Z',
      },
    ];
    mockDb.query.mockResolvedValueOnce(withInactive);

    const result = await getAgentCapabilities.execute({
      agent_id: 11,
      active_only: false,
      format: 'json',
    });

    expect(result.success).toBe(true);
    expect(result.total_count).toBe(3);
    expect(result.active_count).toBe(2);
  });

  it('should fail when agent does not exist', async () => {
    mockAgentNotFound();

    const result = await getAgentCapabilities.execute({
      agent_id: 999,
      active_only: true,
      format: 'json',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('AGENT_NOT_FOUND');
  });
});

// ============================================================================
// Tests: list_all_capabilities
// ============================================================================

describe('list_all_capabilities', () => {
  beforeEach(() => {
    mockDb.query.mockClear();
  });

  const mockAllCapabilities = [
    {
      skill_name: 'payload-cms-setup',
      version: '1.2.0',
      agent_count: 2,
      agents: JSON.stringify([
        { agent_id: 11, agent_name: 'Claude Code', active: true },
        { agent_id: 5, agent_name: 'Backend Architect', active: true },
      ]),
    },
    {
      skill_name: 'tdd-workflow',
      version: '2.0.1',
      agent_count: 3,
      agents: JSON.stringify([
        { agent_id: 11, agent_name: 'Claude Code', active: true },
        { agent_id: 2, agent_name: 'Developer', active: true },
        { agent_id: 3, agent_name: 'Tester', active: false },
      ]),
    },
  ];

  it('should list all capabilities across agents', async () => {
    mockDb.query.mockResolvedValueOnce(mockAllCapabilities);

    const result = await listAllCapabilities.execute({
      active_only: true,
    });

    expect(result.success).toBe(true);
    expect(result.total_skills).toBe(2);
    expect(result.capabilities).toHaveLength(2);
    expect(result.capabilities[0].agents).toHaveLength(2);
  });

  it('should filter by skill_name', async () => {
    mockDb.query.mockResolvedValueOnce([mockAllCapabilities[0]]);

    const result = await listAllCapabilities.execute({
      skill_name: 'payload-cms-setup',
      active_only: true,
    });

    expect(result.success).toBe(true);
    expect(result.capabilities).toHaveLength(1);
    expect(result.capabilities[0].skill_name).toBe('payload-cms-setup');
  });

  it('should filter by version', async () => {
    mockDb.query.mockResolvedValueOnce([mockAllCapabilities[1]]);

    const result = await listAllCapabilities.execute({
      version: '2.0.1',
      active_only: true,
    });

    expect(result.success).toBe(true);
    expect(result.capabilities[0].version).toBe('2.0.1');
  });

  it('should group by skill when requested', async () => {
    const groupedBySkill = [
      {
        skill_name: 'payload-cms-setup',
        version: null, // When grouped by skill, version is aggregated
        agent_count: 3,
        agents: JSON.stringify([
          { agent_id: 11, agent_name: 'Claude Code', active: true },
          { agent_id: 5, agent_name: 'Backend Architect', active: true },
          { agent_id: 8, agent_name: 'API Builder', active: true },
        ]),
      },
    ];

    mockDb.query.mockResolvedValueOnce(groupedBySkill);

    const result = await listAllCapabilities.execute({
      group_by: 'skill',
      active_only: true,
    });

    expect(result.success).toBe(true);
    expect(result.capabilities[0].agent_count).toBe(3);
  });
});

// ============================================================================
// Tests: deactivate_capability
// ============================================================================

describe('deactivate_capability', () => {
  beforeEach(() => {
    mockDb.query.mockClear();
  });

  it('should deactivate a capability successfully', async () => {
    mockAgentExists();
    mockDb.query.mockResolvedValueOnce({ affectedRows: 1 });

    const result = await deactivateCapability.execute({
      agent_id: 11,
      skill_name: 'payload-cms-setup',
    });

    expect(result.success).toBe(true);
    expect(result.agent_id).toBe(11);
    expect(result.skill_name).toBe('payload-cms-setup');
    expect(result.message).toContain('deactivated');
  });

  it('should fail when capability does not exist', async () => {
    mockAgentExists();
    mockDb.query.mockResolvedValueOnce({ affectedRows: 0 });

    const result = await deactivateCapability.execute({
      agent_id: 11,
      skill_name: 'non-existent-skill',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('CAPABILITY_NOT_FOUND');
    expect(result.message).toContain('not found');
  });

  it('should fail when agent does not exist', async () => {
    mockAgentNotFound();

    const result = await deactivateCapability.execute({
      agent_id: 999,
      skill_name: 'payload-cms-setup',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('AGENT_NOT_FOUND');
  });
});

// ============================================================================
// Performance Tests
// ============================================================================

describe('Performance Tests', () => {
  beforeEach(() => {
    mockDb.query.mockClear();
  });

  it('should handle bulk registration of 100+ capabilities', async () => {
    const bulkCapabilities = Array.from({ length: 150 }, (_, i) => ({
      skill_name: `skill-${i}`,
      version: '1.0.0',
      active: true,
    }));

    mockAgentExists();

    // Mock all INSERT and SELECT operations
    for (let i = 0; i < 150; i++) {
      mockInsertResult(1);
      mockCapabilityResult({
        id: i + 1,
        skill_name: `skill-${i}`,
        version: '1.0.0',
        active: true,
        registered_at: new Date().toISOString(),
      });
    }

    const startTime = Date.now();
    const result = await registerAgentCapabilities.execute({
      agent_id: 11,
      capabilities: bulkCapabilities,
      upsert: true,
    });
    const duration = Date.now() - startTime;

    expect(result.success).toBe(true);
    expect(result.capabilities_registered).toBe(150);
    expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
  });

  it('should efficiently query capabilities with large dataset', async () => {
    const largeMockData = Array.from({ length: 200 }, (_, i) => ({
      id: i + 1,
      skill_name: `skill-${i}`,
      version: '1.0.0',
      active: i % 10 !== 0, // 10% inactive
      metadata: JSON.stringify({ index: i }),
      registered_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    mockAgentExists();
    mockDb.query.mockResolvedValueOnce(largeMockData);

    const startTime = Date.now();
    const result = await getAgentCapabilities.execute({
      agent_id: 11,
      active_only: false,
      format: 'json',
    });
    const duration = Date.now() - startTime;

    expect(result.success).toBe(true);
    expect(result.total_count).toBe(200);
    expect(duration).toBeLessThan(1000); // Should complete within 1 second
  });
});

// ============================================================================
// Edge Cases & Error Handling
// ============================================================================

describe('Edge Cases', () => {
  beforeEach(() => {
    mockDb.query.mockClear();
  });

  it('should handle database connection errors gracefully', async () => {
    mockAgentExists();
    mockDb.query.mockRejectedValueOnce(new Error('Connection timeout'));

    const result = await registerAgentCapabilities.execute({
      agent_id: 11,
      capabilities: [validCapabilities[0]],
      upsert: true,
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('DATABASE_ERROR');
  });

  it('should handle empty metadata correctly', async () => {
    mockAgentExists();
    mockDb.query.mockResolvedValueOnce([
      {
        id: 1,
        skill_name: 'test-skill',
        version: '1.0.0',
        active: true,
        metadata: null,
        registered_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    const result = await getAgentCapabilities.execute({
      agent_id: 11,
      active_only: true,
      format: 'json',
    });

    expect(result.success).toBe(true);
    expect(result.capabilities[0].metadata).toBeNull();
  });

  it('should validate required fields are present', async () => {
    await expect(
      registerAgentCapabilities.execute({
        agent_id: 11,
        capabilities: [
          {
            // Missing skill_name
            version: '1.0.0',
            active: true,
          } as any,
        ],
        upsert: true,
      })
    ).rejects.toThrow();
  });
});
