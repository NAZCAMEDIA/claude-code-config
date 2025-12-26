---
name: react-vite-setup
description: Sets up React 18+ projects with Vite, TypeScript, and TailwindCSS following SOLARIA frontend standards. This skill should be used when creating new frontend projects, migrating existing ones, or establishing consistent project structure with proper linting, testing, and build configurations.
---

# React Vite Setup

This skill creates production-ready React projects with Vite, TypeScript, and TailwindCSS following SOLARIA frontend standards.

## Quick Start

```bash
bash scripts/init-react-project.sh my-app
cd my-app
npm run dev
```

## Standard Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2+ | UI Library |
| Vite | 5.0+ | Build Tool |
| TypeScript | 5.0+ | Type Safety |
| TailwindCSS | 3.4+ | Styling |
| React Router | 6.20+ | Routing |
| Axios | 1.6+ | HTTP Client |
| React Query | 5.0+ | Server State |
| Zustand | 4.4+ | Client State |
| Vitest | 1.0+ | Testing |

## Project Structure

```
my-app/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/           # Static assets
│   ├── components/       # Reusable components
│   │   ├── ui/           # Base UI components
│   │   └── layout/       # Layout components
│   ├── features/         # Feature modules
│   │   └── auth/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── services/
│   │       └── types.ts
│   ├── hooks/            # Shared hooks
│   ├── lib/              # Utilities
│   ├── services/         # API services
│   ├── stores/           # Zustand stores
│   ├── styles/           # Global styles
│   ├── types/            # TypeScript types
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── tests/
│   ├── unit/
│   └── integration/
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Configuration Files

### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Common Patterns

### API Service
```typescript
// src/services/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

### Zustand Store
```typescript
// src/stores/authStore.ts
import { create } from 'zustand'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}))
```

### Custom Hook
```typescript
// src/hooks/useApi.ts
import { useState, useCallback } from 'react'

export function useApi<T>(apiFunc: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiFunc()
      setData(result)
      return result
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiFunc])

  return { data, loading, error, execute }
}
```

## Scripts

### Initialize Project
```bash
bash scripts/init-react-project.sh my-app
```

### Add Feature Module
```bash
bash scripts/add-feature.sh auth
# Creates: src/features/auth/{components,hooks,services,types.ts}
```

## Environment Variables

```bash
# .env.example
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=My App
VITE_ENABLE_ANALYTICS=false
```

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run test       # Run Vitest
npm run test:ui    # Run Vitest UI
```

## Resources

- [Project Template](assets/project-template/)
- [Component Templates](references/component-templates.md)
- [Init Script](scripts/init-react-project.sh)
