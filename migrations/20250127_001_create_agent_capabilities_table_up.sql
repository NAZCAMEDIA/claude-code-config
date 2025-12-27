-- ============================================================================
-- Migration: 20250127_001_create_agent_capabilities_table_up.sql
-- Description: Create agent_capabilities table with indexes and constraints
-- Author: ECO-Lambda | DFO Enhancement Plan
-- Date: 2025-12-27
-- MySQL Version: 8.0+
-- ============================================================================

-- Migration UP
START TRANSACTION;

-- Step 1: Create the table
CREATE TABLE IF NOT EXISTS agent_capabilities (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    agent_id BIGINT UNSIGNED NOT NULL,
    skill_name VARCHAR(255) NOT NULL COMMENT 'Unique skill identifier (e.g., payload-cms-setup, tdd-workflow)',
    version VARCHAR(20) NOT NULL DEFAULT '1.0.0' COMMENT 'Semantic version: MAJOR.MINOR.PATCH',
    active BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Skill active status',
    metadata JSON DEFAULT NULL COMMENT 'Additional skill metadata (dependencies, config, etc.)',
    registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE KEY uk_agent_skill (agent_id, skill_name),
    CONSTRAINT chk_semver_format CHECK (version REGEXP '^[0-9]+\\.[0-9]+\\.[0-9]+$')

) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci
  COMMENT='Agent skills/capabilities registry with versioning';

-- Step 2: Create indexes
CREATE INDEX idx_agent_capabilities_agent_id ON agent_capabilities(agent_id);
CREATE INDEX idx_agent_capabilities_skill_name ON agent_capabilities(skill_name);
CREATE INDEX idx_agent_capabilities_active ON agent_capabilities(agent_id, active);
CREATE INDEX idx_agent_capabilities_skill_version ON agent_capabilities(skill_name, version);
CREATE INDEX idx_agent_capabilities_covering ON agent_capabilities(agent_id, skill_name, active, version);

-- Step 3: Add foreign key constraint
ALTER TABLE agent_capabilities
    ADD CONSTRAINT fk_agent_capabilities_agents
    FOREIGN KEY (agent_id)
    REFERENCES agents(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- Step 4: Insert migration record
INSERT INTO schema_migrations (version, description, executed_at)
VALUES ('20250127_001', 'Create agent_capabilities table', NOW());

COMMIT;

-- Verification queries
SELECT 'Table created successfully' as status;
SHOW CREATE TABLE agent_capabilities;
SELECT COUNT(*) as index_count FROM information_schema.statistics
WHERE table_schema = DATABASE() AND table_name = 'agent_capabilities';
