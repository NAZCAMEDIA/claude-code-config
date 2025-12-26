---
name: payload-cms-setup
description: Configures Payload CMS projects with collections, access control, hooks, and API patterns. This skill should be used when building headless CMS backends with Node.js, creating content management systems, or implementing role-based access control for admin panels.
---

# Payload CMS Setup

This skill configures production-ready Payload CMS projects with collections, RBAC, hooks, and best practices.

## Quick Start

```bash
npx create-payload-app@latest my-cms
cd my-cms
npm run dev
```

## Project Structure

```
my-cms/
├── src/
│   ├── collections/      # Collection definitions
│   │   ├── Users.ts
│   │   ├── Posts.ts
│   │   └── Media.ts
│   ├── globals/          # Global configs
│   │   └── Settings.ts
│   ├── hooks/            # Reusable hooks
│   │   ├── beforeChange/
│   │   └── afterChange/
│   ├── access/           # Access control functions
│   │   ├── isAdmin.ts
│   │   └── isOwner.ts
│   ├── fields/           # Reusable field configs
│   ├── endpoints/        # Custom endpoints
│   ├── payload.config.ts
│   └── server.ts
├── .env
└── package.json
```

## Collection Template

```typescript
// src/collections/Posts.ts
import { CollectionConfig } from 'payload/types'
import { isAdmin, isAdminOrOwner } from '../access'

const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'author', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdminOrOwner,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        if (req.user && !data.author) {
          data.author = req.user.id
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title.toLowerCase().replace(/\s+/g, '-')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}

export default Posts
```

## Access Control Patterns

### Admin Only
```typescript
// src/access/isAdmin.ts
import { Access } from 'payload/types'

export const isAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'admin'
}
```

### Admin or Owner
```typescript
// src/access/isAdminOrOwner.ts
import { Access } from 'payload/types'

export const isAdminOrOwner: Access = ({ req: { user }, id }) => {
  if (user?.role === 'admin') return true
  return {
    author: {
      equals: user?.id,
    },
  }
}
```

### Role-Based
```typescript
// src/access/hasRole.ts
import { Access } from 'payload/types'

export const hasRole = (...roles: string[]): Access => {
  return ({ req: { user } }) => {
    return roles.includes(user?.role)
  }
}

// Usage:
access: {
  read: hasRole('admin', 'editor', 'viewer'),
  create: hasRole('admin', 'editor'),
  update: hasRole('admin', 'editor'),
  delete: hasRole('admin'),
}
```

## Common Hooks

### Auto-generate Slug
```typescript
const generateSlug = ({ value, data }) => {
  if (!value && data?.title) {
    return data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  return value
}
```

### Set Author
```typescript
const setAuthor = ({ req, data }) => {
  if (req.user && !data.author) {
    data.author = req.user.id
  }
  return data
}
```

### Send Notification
```typescript
const sendNotification = async ({ doc, operation }) => {
  if (operation === 'create') {
    await sendEmail({
      to: 'admin@example.com',
      subject: `New ${doc.title} created`,
    })
  }
}
```

## Payload Config

```typescript
// src/payload.config.ts
import { buildConfig } from 'payload/config'
import path from 'path'

import Users from './collections/Users'
import Posts from './collections/Posts'
import Media from './collections/Media'

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- My CMS',
    },
  },
  collections: [Users, Posts, Media],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
})
```

## API Usage

### REST API
```bash
# Get all posts
GET /api/posts

# Get single post
GET /api/posts/:id

# Create post (authenticated)
POST /api/posts
Content-Type: application/json
Authorization: Bearer <token>

# Update post
PATCH /api/posts/:id

# Delete post
DELETE /api/posts/:id
```

### GraphQL
```graphql
query GetPosts {
  Posts {
    docs {
      id
      title
      content
      author {
        name
      }
    }
  }
}
```

## Commands

```bash
npm run dev           # Development
npm run build         # Build
npm run serve         # Production
npm run generate:types # Generate TypeScript types
```

## Resources

- [Collection Templates](references/collection-templates.md)
- [Access Control Patterns](references/access-patterns.md)
- [Hook Examples](references/hook-examples.md)
