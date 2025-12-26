---
name: mysql-schema-designer
description: Designs MySQL 8.0 database schemas with proper indexing, relationships, constraints, and migrations. This skill should be used when creating database structures, optimizing queries, implementing audit trails, or planning database migrations for SOLARIA projects.
---

# MySQL Schema Designer

This skill designs production-ready MySQL 8.0 schemas with proper indexing, relationships, and migration strategies.

## Quick Reference

### Data Types

| Use Case | Recommended Type |
|----------|------------------|
| Primary Key | `BIGINT UNSIGNED AUTO_INCREMENT` |
| UUID | `BINARY(16)` or `CHAR(36)` |
| Money | `DECIMAL(19,4)` |
| Email | `VARCHAR(255)` |
| URL | `VARCHAR(2048)` |
| Text | `TEXT` (long) or `VARCHAR(n)` |
| Boolean | `TINYINT(1)` |
| Timestamp | `TIMESTAMP` or `DATETIME` |
| JSON | `JSON` |
| Enum | `ENUM('a','b','c')` |

## Schema Template

```sql
-- Enable strict mode
SET sql_mode = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION';

-- Base table template
CREATE TABLE table_name (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    -- columns here
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,  -- Soft delete

    INDEX idx_created_at (created_at),
    INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Common Patterns

### Users Table
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid BINARY(16) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
    email_verified_at TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,

    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### One-to-Many Relationship
```sql
-- Posts belong to Users
CREATE TABLE posts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_posts_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_user_id (user_id),
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_published_at (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Many-to-Many Relationship
```sql
-- Posts have many Tags, Tags have many Posts
CREATE TABLE tags (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE post_tags (
    post_id BIGINT UNSIGNED NOT NULL,
    tag_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (post_id, tag_id),

    CONSTRAINT fk_post_tags_post FOREIGN KEY (post_id)
        REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_post_tags_tag FOREIGN KEY (tag_id)
        REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Audit Trail
```sql
CREATE TABLE audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    action ENUM('create', 'update', 'delete') NOT NULL,
    table_name VARCHAR(64) NOT NULL,
    record_id BIGINT UNSIGNED NOT NULL,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_user_id (user_id),
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_created_at (created_at),

    CONSTRAINT fk_audit_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Indexing Strategy

### When to Add Indexes
- Columns in WHERE clauses
- Columns in JOIN conditions
- Columns in ORDER BY
- Columns in GROUP BY
- Foreign key columns

### Index Types
```sql
-- B-Tree (default) - Most queries
INDEX idx_name (column_name)

-- Unique index
UNIQUE INDEX idx_email (email)

-- Composite index (order matters!)
INDEX idx_user_status (user_id, status)

-- Full-text search
FULLTEXT INDEX ft_content (title, content)

-- Partial index (MySQL 8.0.13+)
INDEX idx_active ((CASE WHEN deleted_at IS NULL THEN 1 END))
```

## Migration Template

```sql
-- Migration: YYYYMMDDHHMMSS_description.sql

-- Up
START TRANSACTION;

ALTER TABLE users
    ADD COLUMN phone VARCHAR(20) NULL AFTER email,
    ADD INDEX idx_phone (phone);

COMMIT;

-- Down (in separate file or comment)
-- ALTER TABLE users DROP COLUMN phone;
```

## Query Optimization

### Use EXPLAIN
```sql
EXPLAIN SELECT * FROM posts WHERE user_id = 1 AND status = 'published';
```

### Avoid
```sql
-- Bad: Function on indexed column
SELECT * FROM users WHERE YEAR(created_at) = 2024;

-- Good: Range query
SELECT * FROM users WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';
```

### Use Covering Indexes
```sql
-- Index covers all needed columns
CREATE INDEX idx_covering ON posts(user_id, status, title);

-- Query uses only indexed columns
SELECT title FROM posts WHERE user_id = 1 AND status = 'published';
```

## Best Practices

1. **Always use InnoDB** engine
2. **utf8mb4** for full Unicode support
3. **Soft deletes** with `deleted_at` column
4. **Timestamps** on every table
5. **Foreign keys** with proper ON DELETE
6. **Never use reserved words** as column names
7. **Use meaningful names** (not `col1`, `data`)

## Scripts

```bash
# Generate migration
bash scripts/new-migration.sh "add_phone_to_users"

# Run migrations
bash scripts/migrate.sh

# Generate schema diagram
bash scripts/schema-diagram.sh
```

## Resources

- [Schema Templates](references/schema-templates.md)
- [Index Guide](references/indexing-guide.md)
- [Migration Scripts](scripts/)
