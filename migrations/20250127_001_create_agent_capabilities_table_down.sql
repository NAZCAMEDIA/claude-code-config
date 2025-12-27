-- ============================================================================
-- Migration Rollback: 20250127_001_create_agent_capabilities_table_down.sql
-- Description: Drop agent_capabilities table and related constraints
-- Author: ECO-Lambda | DFO Enhancement Plan
-- Date: 2025-12-27
-- ============================================================================

-- Migration DOWN
START TRANSACTION;

-- Step 1: Drop foreign key constraint first
ALTER TABLE agent_capabilities
    DROP FOREIGN KEY IF EXISTS fk_agent_capabilities_agents;

-- Step 2: Drop indexes explicitly (best practice)
DROP INDEX IF EXISTS idx_agent_capabilities_agent_id ON agent_capabilities;
DROP INDEX IF EXISTS idx_agent_capabilities_skill_name ON agent_capabilities;
DROP INDEX IF EXISTS idx_agent_capabilities_active ON agent_capabilities;
DROP INDEX IF EXISTS idx_agent_capabilities_skill_version ON agent_capabilities;
DROP INDEX IF EXISTS idx_agent_capabilities_covering ON agent_capabilities;

-- Step 3: Drop the table
DROP TABLE IF EXISTS agent_capabilities;

-- Step 4: Remove migration record
DELETE FROM schema_migrations
WHERE version = '20250127_001';

COMMIT;

-- Verification
SELECT 'Table dropped successfully' as status;
SELECT COUNT(*) as table_exists FROM information_schema.tables
WHERE table_schema = DATABASE() AND table_name = 'agent_capabilities';
