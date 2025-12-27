/**
 * Agent Capabilities MCP Endpoints Implementation
 *
 * @author ECO-Lambda | DFO Enhancement Plan
 * @date 2025-12-27
 * @task DFN-001
 *
 * This file contains the implementation of agent capabilities endpoints
 * for the SOLARIA DFO MCP server.
 *
 * INTEGRATION INSTRUCTIONS:
 * 1. Add this file to DFO server: /src/mcp/tools/agent-capabilities.ts
 * 2. Import in main MCP tools registry
 * 3. Run migration: 20250127_001_create_agent_capabilities_table_up.sql
 * 4. Test with provided test suite
 */

import { z } from 'zod';
import { db } from '../database';
import { Tool } from '../types/mcp';

// ============================================================================
// Validation Schemas
// ============================================================================

const SemverSchema = z.string().regex(
  /^[0-9]+\.[0-9]+\.[0-9]+$/,
  'Invalid semantic version format. Expected: MAJOR.MINOR.PATCH (e.g., 1.2.0)'
);

const CapabilitySchema = z.object({
  skill_name: z.string().min(1).max(255),
  version: SemverSchema,
  active: z.boolean().default(true),
  metadata: z.record(z.any()).optional(),
});

const RegisterCapabilitiesSchema = z.object({
  agent_id: z.number().int().positive(),
  capabilities: z.array(CapabilitySchema).min(1),
  upsert: z.boolean().default(true),
});

const GetCapabilitiesSchema = z.object({
  agent_id: z.number().int().positive(),
  active_only: z.boolean().default(true),
  skill_name: z.string().optional(),
  format: z.enum(['json', 'human']).default('json'),
});

const ListAllCapabilitiesSchema = z.object({
  skill_name: z.string().optional(),
  version: SemverSchema.optional(),
  active_only: z.boolean().default(true),
  group_by: z.enum(['skill', 'agent']).optional(),
});

const DeactivateCapabilitySchema = z.object({
  agent_id: z.number().int().positive(),
  skill_name: z.string().min(1),
});

// ============================================================================
// Error Classes
// ============================================================================

class CapabilityError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'CapabilityError';
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

async function verifyAgentExists(agentId: number): Promise<void> {
  const agent = await db.query(
    'SELECT id FROM agents WHERE id = ?',
    [agentId]
  );

  if (agent.length === 0) {
    throw new CapabilityError(
      'AGENT_NOT_FOUND',
      `Agent with ID ${agentId} not found`,
      { agent_id: agentId }
    );
  }
}

// ============================================================================
// Endpoint: register_agent_capabilities
// ============================================================================

export const registerAgentCapabilities: Tool = {
  name: 'register_agent_capabilities',
  description: 'Register or update skills/capabilities for an agent',
  inputSchema: RegisterCapabilitiesSchema,

  async execute(params: z.infer<typeof RegisterCapabilitiesSchema>) {
    const { agent_id, capabilities, upsert } = params;

    try {
      // Verify agent exists
      await verifyAgentExists(agent_id);

      const results = {
        success: true,
        agent_id,
        capabilities_registered: 0,
        capabilities_updated: 0,
        capabilities: [] as any[],
        message: '',
      };

      // Process each capability
      for (const cap of capabilities) {
        const query = upsert
          ? `
            INSERT INTO agent_capabilities
              (agent_id, skill_name, version, active, metadata)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              version = VALUES(version),
              active = VALUES(active),
              metadata = VALUES(metadata),
              updated_at = CURRENT_TIMESTAMP
          `
          : `
            INSERT INTO agent_capabilities
              (agent_id, skill_name, version, active, metadata)
            VALUES (?, ?, ?, ?, ?)
          `;

        const metadata = cap.metadata ? JSON.stringify(cap.metadata) : null;

        try {
          const result = await db.query(query, [
            agent_id,
            cap.skill_name,
            cap.version,
            cap.active,
            metadata,
          ]);

          // Check if INSERT or UPDATE
          if (result.affectedRows === 1) {
            results.capabilities_registered++;
          } else if (result.affectedRows === 2) {
            // affectedRows === 2 means UPDATE
            results.capabilities_updated++;
          }

          // Fetch the capability
          const [capability] = await db.query(
            `SELECT id, skill_name, version, active, registered_at
             FROM agent_capabilities
             WHERE agent_id = ? AND skill_name = ?`,
            [agent_id, cap.skill_name]
          );

          results.capabilities.push(capability);
        } catch (error: any) {
          if (error.code === 'ER_DUP_ENTRY' && !upsert) {
            throw new CapabilityError(
              'DUPLICATE_CAPABILITY',
              `Capability '${cap.skill_name}' already exists for agent ${agent_id}. Use upsert=true to update.`,
              { skill_name: cap.skill_name, agent_id }
            );
          }
          throw error;
        }
      }

      results.message = `Registered ${results.capabilities_registered} new, updated ${results.capabilities_updated} existing capabilities for agent ${agent_id}`;

      return results;
    } catch (error: any) {
      if (error instanceof CapabilityError) {
        return {
          success: false,
          error: error.code,
          message: error.message,
          details: error.details,
        };
      }

      return {
        success: false,
        error: 'DATABASE_ERROR',
        message: 'Failed to register capabilities',
        details: { error: error.message },
      };
    }
  },
};

// ============================================================================
// Endpoint: get_agent_capabilities
// ============================================================================

export const getAgentCapabilities: Tool = {
  name: 'get_agent_capabilities',
  description: 'Retrieve all skills/capabilities for a specific agent',
  inputSchema: GetCapabilitiesSchema,

  async execute(params: z.infer<typeof GetCapabilitiesSchema>) {
    const { agent_id, active_only, skill_name, format } = params;

    try {
      await verifyAgentExists(agent_id);

      let query = `
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
      `;

      const queryParams: any[] = [agent_id];

      if (active_only) {
        query += ' AND active = TRUE';
      }

      if (skill_name) {
        query += ' AND skill_name = ?';
        queryParams.push(skill_name);
      }

      query += ' ORDER BY skill_name ASC, version DESC';

      const capabilities = await db.query(query, queryParams);

      // Parse JSON metadata
      const parsedCapabilities = capabilities.map((cap: any) => ({
        ...cap,
        metadata: cap.metadata ? JSON.parse(cap.metadata) : null,
      }));

      const result = {
        success: true,
        agent_id,
        capabilities: parsedCapabilities,
        total_count: parsedCapabilities.length,
        active_count: parsedCapabilities.filter((c: any) => c.active).length,
      };

      // Human-readable format
      if (format === 'human') {
        const lines = [
          `Agent ${agent_id} Capabilities:`,
          `Total: ${result.total_count} | Active: ${result.active_count}`,
          '',
          ...parsedCapabilities.map((cap: any) =>
            `  ${cap.active ? '✓' : '✗'} ${cap.skill_name} v${cap.version}`
          ),
        ];

        return {
          ...result,
          formatted: lines.join('\n'),
        };
      }

      return result;
    } catch (error: any) {
      if (error instanceof CapabilityError) {
        return {
          success: false,
          error: error.code,
          message: error.message,
          details: error.details,
        };
      }

      return {
        success: false,
        error: 'DATABASE_ERROR',
        message: 'Failed to retrieve capabilities',
        details: { error: error.message },
      };
    }
  },
};

// ============================================================================
// Endpoint: list_all_capabilities
// ============================================================================

export const listAllCapabilities: Tool = {
  name: 'list_all_capabilities',
  description: 'List all capabilities across all agents with grouping options',
  inputSchema: ListAllCapabilitiesSchema,

  async execute(params: z.infer<typeof ListAllCapabilitiesSchema>) {
    const { skill_name, version, active_only, group_by } = params;

    try {
      let query = `
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
        WHERE 1=1
      `;

      const queryParams: any[] = [];

      if (skill_name) {
        query += ' AND ac.skill_name = ?';
        queryParams.push(skill_name);
      }

      if (version) {
        query += ' AND ac.version = ?';
        queryParams.push(version);
      }

      if (active_only) {
        query += ' AND ac.active = TRUE';
      }

      if (group_by === 'skill') {
        query += ' GROUP BY ac.skill_name';
      } else if (group_by === 'agent') {
        query += ' GROUP BY ac.agent_id';
      } else {
        query += ' GROUP BY ac.skill_name, ac.version';
      }

      query += ' ORDER BY ac.skill_name ASC, ac.version DESC';

      const capabilities = await db.query(query, queryParams);

      // Parse JSON agents array
      const parsedCapabilities = capabilities.map((cap: any) => ({
        ...cap,
        agents: JSON.parse(cap.agents),
      }));

      return {
        success: true,
        capabilities: parsedCapabilities,
        total_skills: parsedCapabilities.length,
      };
    } catch (error: any) {
      return {
        success: false,
        error: 'DATABASE_ERROR',
        message: 'Failed to list capabilities',
        details: { error: error.message },
      };
    }
  },
};

// ============================================================================
// Endpoint: deactivate_capability
// ============================================================================

export const deactivateCapability: Tool = {
  name: 'deactivate_capability',
  description: 'Mark a capability as inactive for an agent',
  inputSchema: DeactivateCapabilitySchema,

  async execute(params: z.infer<typeof DeactivateCapabilitySchema>) {
    const { agent_id, skill_name } = params;

    try {
      await verifyAgentExists(agent_id);

      const result = await db.query(
        `UPDATE agent_capabilities
         SET active = FALSE, updated_at = CURRENT_TIMESTAMP
         WHERE agent_id = ? AND skill_name = ?`,
        [agent_id, skill_name]
      );

      if (result.affectedRows === 0) {
        return {
          success: false,
          error: 'CAPABILITY_NOT_FOUND',
          message: `Capability '${skill_name}' not found for agent ${agent_id}`,
          details: { agent_id, skill_name },
        };
      }

      return {
        success: true,
        agent_id,
        skill_name,
        message: `Capability '${skill_name}' deactivated for agent ${agent_id}`,
      };
    } catch (error: any) {
      if (error instanceof CapabilityError) {
        return {
          success: false,
          error: error.code,
          message: error.message,
          details: error.details,
        };
      }

      return {
        success: false,
        error: 'DATABASE_ERROR',
        message: 'Failed to deactivate capability',
        details: { error: error.message },
      };
    }
  },
};

// ============================================================================
// Export all tools
// ============================================================================

export const agentCapabilityTools = [
  registerAgentCapabilities,
  getAgentCapabilities,
  listAllCapabilities,
  deactivateCapability,
];
