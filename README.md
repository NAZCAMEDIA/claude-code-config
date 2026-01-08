# 🤖 Claude Code Configuration Sync

> **Drake Corsair Edition** - Complete Claude Code CLI and Desktop configuration backup and synchronization solution

![Claude Code](https://img.shields.io/badge/Claude%20Code-CLI-orange?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Linux-000000?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 📦 What's Included

This repository contains a complete backup and sync solution for:

### Claude Code CLI
- ⚙️ **Configuration Files**: `claude_code_config.json`, `settings.json`
- 🎨 **Status Line**: Custom statusline script with comprehensive system info
- 🤖 **Agents**: Custom AI agents for various domains (React, PostgreSQL, Security, etc.)
- 🔧 **Skills**: Specialized tools and workflows
- 🌐 **MCP Servers**: Multiple MCP server configurations (sequential-thinking, sequential-thinking, etc.)
- 🔌 **Plugins**: 29 enabled plugins (including ralph-wiggum)
- ⚡ **Commands**: Slash commands for model switching, Ralph loops, DFO sync

### Claude Desktop
- 🖥️ **Desktop Configuration**: Main config with MCP servers
- 📦 **Extensions**: Complete list of installed extensions

## 🚀 Quick Install

### OpenCode Installation (Z.AI GLM)

Para usar este repositorio en OpenCode con Z.AI GLM4.7:

```bash
# Clone repository
git clone https://github.com/NAZCAMEDIA/claude-code-config.git
cd claude-code-config

# Run OpenCode installer with Oh My OpenCode + Z.AI GLM
./install-opencode-zai.sh
```

Este script configura:
- **Oh My OpenCode** (Sisyphus Agent Harness)
- Z.AI GLM4.7 con dos modos:
  - **[1] Directo** (asume soporte nativo en Crush)
  - **[2] Con Proxy** (usa Z.ai2api - OpenAI-compatible)
- Todos los agentes usando `zai/glm-4.7`

### Claude Code CLI Installation

#### One-Line Install (macOS)

```bash
curl -fsSL https://raw.githubusercontent.com/NAZCAMEDIA/claude-code-config/main/scripts/install.sh | bash
```

#### Manual Install

```bash
# Clone repository
git clone https://github.com/NAZCAMEDIA/claude-code-config.git
cd claude-code-config

# Run install script
./scripts/install.sh
```

## 📁 Repository Structure

```
claude-code-config/
├── README.md
├── OPENCODE_ZAI_SETUP.md          # OpenCode + Z.AI GLM docs
├── install-opencode-zai.sh         # OpenCode installer script
├── .opencode/
│   └── oh-my-opencode.json        # Oh My OpenCode config template
├── claude-code-cli/
│   ├── claude_code_config.json      # MCP servers configuration
│   ├── settings.json               # Main settings with plugins/permissions
│   ├── statusline-comprehensive.sh   # Custom statusline script
│   ├── agents/                    # Custom AI agents
│   └── skills/                    # Custom skills and workflows
├── claude-desktop/
│   ├── config.json                 # Desktop configuration
│   └── extensions-installations.json # Installed extensions
└── scripts/
    ├── install.sh                  # Installation script
    ├── backup.sh                  # Backup configuration
    ├── auto-sync.sh               # Real-time auto-sync
    └── setup-auto-sync.sh         # Setup automatic sync
```

## 🦾 OpenCode Configuration (Z.AI GLM)

### Oh My OpenCode + Z.AI GLM Setup

Este repositorio incluye configuración para usar **Oh My OpenCode** con **Z.AI GLM** (Code API) en OpenCode.

**Agente Principal: Sisyphus**
- Orquestador potente para OpenCode
- Planifica, delega y ejecuta tareas complejas
- Usa subagentes especializados en paralelo
- Incluye keyword `ultrawork` (ulw) para máximo rendimiento

**Agentes Especializados (todos con Z.AI GLM):**

| Agente | Función |
|---------|---------|
| **Sisyphus** | Orquestador principal - Planificación y coordinación |
| **Oracle** | Arquitectura, code review, estrategia |
| **Librarian** | Multi-repo analysis, doc lookup, implementaciones |
| **Explore** | Exploración rápida de codebase (contextual grep) |
| **Frontend UI/UX Engineer** | Desarrollo frontend/UI |
| **Document Writer** | Escritura técnica y documentación |
| **Multimodal Looker** | Contenido visual (PDFs, imágenes, diagramas) |

### Características Activadas

- ✅ **Background Agents**: Ejecuta agentes en paralelo
- ✅ **LSP/AST Tools**: Refactorización determinista
- ✅ **Todo Continuation Enforcer**: Fuerza completar tareas
- ✅ **Comment Checker**: Reduce comentarios excesivos
- ✅ **Context Window Monitor**: Manejo de límites de contexto
- ✅ **Keyword Detector**: Detecta `ultrawork`, `search`, `analyze`

### Configuración

**Archivo de configuración:**
```
~/.config/opencode/oh-my-opencode.json
```

**Para cambiar el modelo Z.AI:**
```json
{
  "agents": {
    "Sisyphus": {
      "model": "zai/glm-code"  // Reemplazar con modelo correcto
    },
    "oracle": {
      "model": "zai/glm-code"
    },
    // ... todos los agentes
  }
}
```

### Uso

```bash
# Iniciar OpenCode
opencode

# Agregar 'ultrawork' o 'ulw' para modo máximo
"Implementa REST API con ultrawork"

# Usar agentes específicos
"@oracle revisa esta arquitectura"
"@librarian busca implementaciones de esto"
"@explora política de esta característica"
```

### 🔄 Ralph-Wiggum Plugin - Autonomous Iterative Loops

**Plugin oficial de Anthropic** para Claude Code que implementa bucles iterativos autónomos.

Claude trabaja automáticamente en la misma tarea, refinando su trabajo, hasta cumplir criterios específicos.

#### Instalación

✅ **Ya habilitado en esta configuración**

```bash
# Para aplicar en tu sistema:
./sync-config.sh
# Luego reinicia Claude Code
```

#### Uso

```bash
# Iniciar loop autónomo
/ralph-loop "Criterio de completación"

# Ejemplos:
/ralph-loop "Implementar JWT auth. Criterio: Tests >80% coverage, Lighthouse >90"
/ralph-loop "Completar DFO-547. Criterio: todos los tests verdes + PR lista"
/ralph-loop "Resolver bug production. Criterio: issue reproducido, fix implementado, tests pasen"

# Cancelar si algo falla
/cancel-ralph
```

#### Documentación Completa

Consulta **[RALPH_PLUGIN.md](./RALPH_PLUGIN.md)** para:
- 📋 Ejemplos detallados
- 🎯 Cómo escribir criterios efectivos
- 🔧 Troubleshooting y best practices
- 🔗 Integración con DFO + TodoWrite
- ⚡ Performance tips

## ⚡ Custom Commands - Model Switcher

**NEW**: Comandos personalizados para cambiar rápidamente entre modelos.

### Model Switching Commands

Cambia de modelo sin reiniciar Claude Code:

```bash
/haiku    # Cambiar a Haiku 4.5 (rápido, barato)
/sonnet   # Cambiar a Sonnet 4.5 (equilibrio recomendado)
/opus     # Cambiar a Opus 4.5 (máxima capacidad)
```

| Modelo | Velocidad | Capacidad | Costo | Ideal Para |
|--------|-----------|-----------|-------|-----------|
| **Haiku** | ⚡⚡⚡ | ⭐⭐ | 💰 | Git, búsqueda, tareas rápidas |
| **Sonnet** | ⚡⚡ | ⭐⭐⭐ | 💰💰 | Desarrollo (RECOMENDADO) |
| **Opus** | ⚡ | ⭐⭐⭐⭐⭐ | 💰💰💰 | Arquitectura, estrategia |

### Flujo de Trabajo

**Desarrollo simple:**
```
/sonnet
# Escribir código, tests, validar
```

**Tarea de arquitectura:**
```
/opus
# Diseñar, planificar, estrategia
/sonnet
# Implementar
```

**Operación rápida:**
```
/haiku
# Git, búsqueda, operaciones mecánicas
```

### Documentación Completa

Ver **[COMMANDS_REFERENCE.md](./COMMANDS_REFERENCE.md)** para:
- 📊 Comparativa detallada de modelos
- 🎯 Cuándo usar cada modelo
- 💰 Precios y costos
- 🔗 Integración con ECO
- 🚀 Flujos de trabajo recomendados

---

## 🔄 Auto-Sync

### Enable Automatic Sync

Run the setup script to enable automatic synchronization:

```bash
./scripts/setup-auto-sync.sh
```

This will:
- **macOS**: Create a launchd agent that runs in the background
- **Linux**: Create a cron job that runs every 5 minutes

### How Auto-Sync Works

1. **Monitors** configuration files for changes
2. **Detects** modifications to:
   - MCP server configurations
   - Settings files
   - Agents and skills
   - Extension installations
3. **Automatically** backs up changes to this repository
4. **Commits** and **pushes** to GitHub

### Sync Across Multiple Machines

1. Clone this repository on each machine
2. Run `./scripts/install.sh` to setup
3. Run `./scripts/setup-auto-sync.sh` to enable auto-sync
4. Any changes on one machine will be automatically synced to all others

## ⚙️ Configuration Details

### MCP Servers (Current Setup)

| Server | Type | Description |
|--------|------|-------------|
| `solaria-dfo` | HTTP | SOLARIA Digital Factory Operations |
| `sequential-thinking` | Command | Enhanced reasoning and Chain-of-Thought |
| `claude-in-chrome` | Browser | Browser automation (Playwright-based) |

### Enabled Plugins

#### From Official Marketplaces

**Anthropic Official** (`anthropics-claude-plugins-official`):
- 🔄 **ralph-wiggum** - Autonomous iterative development loops

**Claude Code Plus** (`claude-code-plugins-plus`):
- 🔒 Security tools (penetration-tester, secret-scanner, owasp-compliance-checker, etc.)
- 🚀 DevOps tools (ci-cd-pipeline-builder, monitoring-stack-deployer, docker-compose-generator, etc.)
- 📡 API tools (api-sdk-generator, rest-api-generator, graphql-server-builder, etc.)
- 💾 Database tools (database-schema-designer, database-migration-manager, query-performance-analyzer, etc.)
- ♿ Accessibility tools (accessibility-test-scanner, etc.)

**Total: 29 plugins enabled**

#### Quick Reference

| Category | Plugins |
|----------|---------|
| **Autonomous** | ralph-wiggum |
| **Security** | penetration-tester, secret-scanner, security-audit-reporter, container-security-scanner |
| **API** | rest-api-generator, graphql-server-builder, api-rate-limiter, api-mock-server |
| **Database** | database-migration-manager, database-schema-designer |
| **Infrastructure** | infrastructure-as-code-generator, ci-cd-pipeline-builder, docker-compose-generator |
| **Monitoring** | monitoring-stack-deployer, query-performance-analyzer |

### Agents Available

- `analytics-metrics` - Analytics and metrics expert
- `bullmq-worker-automation` - BullMQ worker automation
- `db-postgresql` - PostgreSQL database specialist
- `frontend-react` - React frontend expert
- `infra-devops-architect` - Infrastructure and DevOps
- `llm-ingestion` - LLM data ingestion
- `payload-cms-architect` - Payload CMS specialist
- `security-gdpr-compliance` - Security and GDPR expert
- And more...

### 🎨 Specialized Skills

#### iOS 26 Design System (Sketch via MCP)

**NEW**: Programmatic iOS screen design capability using Sketch MCP server.

**Capabilities:**
- Generate complete iOS screens programmatically (login, signup, dashboards, etc.)
- Full iOS 26 design system compliance (8pt grid, safe areas, typography)
- Component library: buttons, inputs, text, navigation, cards
- Automated layout with native Sketch grid systems
- SF Pro typography with correct weights and sizes
- iOS semantic color system implementation

**Key Technical Achievements:**
- 6 validated patterns documented (shape creation, text centering, button padding)
- 6 antipatterns identified (missing fillType, background assignment, etc.)
- 8+ reusable component templates
- 13 iterations to perfect implementation
- 1,500+ lines of validated Sketch JavaScript code

**Files:**
- Skill definition: `claude-code-cli/skills/ios26-sketch-designer/skill.md`
- Ultra-optimized prompt: `/tmp/IOS26_DESIGNER_ULTRA_PROMPT.md`
- Working examples: `/tmp/create_login_*.js`

**Usage Example:**
```bash
# ECO can now generate complete iOS screens via:
# - Direct MCP calls to Sketch
# - Validated component templates
# - Automated grid and layout configuration
```

**Learnings Documented:**
- ShapePath vs Shape distinction
- fillType requirement for all fills
- Background property assignment timing
- fixedWidth property for text centering
- Button padding calculation patterns
- Grid 8pt alignment formulas
- MCP response handling (isError vs text)

#### iOS 26 Liquid Glass — World-Class Design

**NEW**: Apple-grade design system for iOS 26 Liquid Glass material implementation.

**Capabilities:**
- Complete semantic token system (colors, typography, spacing, materials, motion)
- Component library with perfect "Golden Sample" (Glass Pill Button)
- Semantic material mapping (glass/bar, glass/control, glass/sheet, glass/overlay)
- PASS/FAIL QA criteria for production readiness
- SwiftUI/UIKit implementation-ready (not concept, but production)
- Full light/dark mode + complex background variations

**Key Features:**
- 6 mandatory rules (Liquid Glass as functional layer, not decoration)
- Material tokens with explicit "when to use" / "when NOT to use"
- Golden Sample with 3 variants × 4 states
- MVP validation (Home Dashboard with all components)
- QA rubric: consistency, hierarchy, legibility, states, semantics, implementability

**Deliverables:**
- SKILL_SPEC (rules + material mapping + components)
- TOKEN PACK (complete table with usage guidelines)
- COMPONENT LIBRARY (Golden Sample + detailed specs)
- MVP (light + dark validation screens)
- QA REPORT (PASS/FAIL with documented corrections)

**Files:**
- Skill definition: `claude-code-cli/skills/ios26-liquid-glass-designer/skill.md`

**Excellence Criterion:**
- Golden Sample must be PERFECT (legible on 3 backgrounds: light, dark, photo)
- Hit targets ≥ 44x44pt
- States distinguishable WITHOUT animation
- 80%+ implementable with native SwiftUI/UIKit components
- If Golden Sample fails QA → NOT READY

**Critical Prohibition:**
❌ Do not use Liquid Glass as aesthetic makeup without functional purpose

**Usage Example:**
```bash
# ECO can now design world-class iOS 26 systems via:
# - Complete semantic token systems
# - Production-ready component libraries
# - PASS/FAIL QA validation
# - SwiftUI/UIKit implementation specs
```

#### Apple Multiplatform Systems Engineer — Swift 6

**NEW**: Staff/Principal Engineer-level multiplatform implementation with Swift 6 + SwiftUI.

**Capabilities:**
- Multiplatform architecture (iOS/macOS/visionOS/watchOS/tvOS)
- Shared core + platform-specific adapters (#if os(...))
- Modern concurrency (async/await, structured concurrency, @MainActor, strict concurrency)
- Modern state management (@Observable for iOS 17+, ObservableObject fallback)
- Mandatory testing (Swift Testing preferred, XCTest fallback)
- CLI build + test automation (xcodebuild) with QA gates

**Quality Gates:**
- G1: No advance without compiling + tests passing (CLI validation)
- G2: No main thread blocking (all IO/latency with async/await)
- G3: Single source of truth for UI state (no duplication)
- G4: Concurrency safe (@MainActor, strict concurrency, no data races)
- G5: SwiftUI + standard APIs first (UIKit/AppKit only as adapters)
- G6: Document decisions and trade-offs (SPEC mandatory)

**Platform Matrix:**
| Platform | Input | Navigation | Key Adaptations |
|----------|-------|------------|-----------------|
| iOS/iPadOS | Touch + keyboard/pointer | NavigationStack, sheets | Size classes, adaptive layouts |
| macOS | Pointer + keyboard shortcuts | Windows/scenes, menu/commands | Dense layouts, multiple windows, ⌘ shortcuts |
| visionOS | Spatial (gaze + gesture) | Spatial navigation | No mobile patterns, 3D legibility, depth |
| watchOS | Digital Crown + tap | Simplified, short lists | Energy critical, brief interactions, max 5 items |
| tvOS | Remote + focus engine | Focus-based | Directional navigation, focus hierarchy, grids |

**Architecture Default:**
```
Shared/
  ├── Domain/      (models, errors, protocols)
  ├── UseCases/    (app logic)
  └── Data/        (repos, services)
Platforms/
  ├── iOS/, macOS/, visionOS/, watchOS/, tvOS/
Features/<Name>/
  ├── UI/          (SwiftUI views)
  ├── State/       (Store/ViewModel)
  └── Routing/
CompositionRoot/   (DI)
```

**Golden Sample: "Items" Feature**
- List + detail with async load (simulated latency)
- Add item, toggle completed
- States: loading / empty / error + retry
- Shared repository protocol + InMemory implementation
- Platform adaptations:
  - macOS: Command shortcuts (⌘N for new)
  - watchOS: List limited to 5 items
  - tvOS: Focus-based grid layout
  - visionOS: Spatial depth, hover effects

**Deliverables:**
1. SPEC (max 50 lines): architecture + data flow + concurrency + testing + platform adaptations
2. Files List (created/modified with line counts)
3. Code (by files, only necessary)
4. CLI Commands (executed + results: xcodebuild build/test)
5. QA Report (PASS/FAIL for 8 criteria)

**QA Criteria:**
- Compiles iOS ✅ / ❌
- Tests iOS ✅ / ❌ (min 6 tests: 3 repo + 1 store)
- Compiles macOS ✅ / ❌
- Tests macOS ✅ / ❌
- Previews ✅ / ❌ (4 states: loading/empty/error/content)
- Concurrency ✅ / ❌ (no main thread blocking)
- Single Source ✅ / ❌ (no state duplication)
- Platform Adapt ✅ / ❌ (reasonable adaptations)

**Files:**
- Skill definition: `claude-code-cli/skills/apple-multiplatform-swift-engineer/skill.md`

**Excellence Criterion:**
- Golden Sample must be IMPECCABLE: compiles + tests pass + previews work + correct state + reasonable adaptations
- If fails → NOT READY, iterate until PASS

**Usage Example:**
```bash
# ECO can now implement production-ready multiplatform features:
# - Build + test verified via xcodebuild CLI
# - Swift 6 concurrency patterns (@MainActor, async/await)
# - @Observable state management (iOS 17+)
# - Platform-specific UI adaptations
# - Mandatory testing (Swift Testing / XCTest)
```

## 🛠️ Manual Operations

### Backup Configuration

```bash
./scripts/backup.sh
```

This will:
- Copy all configuration files from your system to the repository
- Show git status
- Prompt you to commit and push changes

### Manual Sync

```bash
# From the repository directory
git add -A
git commit -m "Update configuration"
git push
```

### View Sync Logs

```bash
# macOS
tail -f ~/.claude/sync.log

# Linux (if using file watchers)
tail -f ~/.claude/sync.log
```

## 📚 Additional Documentation

### OpenCode + Z.AI GLM Configuration

Para configuración detallada de OpenCode con Oh My OpenCode y Z.AI GLM:

📖 **[OPENCODE_ZAI_SETUP.md](./OPENCODE_ZAI_SETUP.md)**

Incluye:
- Instalación automática
- Descripción de todos los agentes
- Configuración de permisos
- Solución de problemas
- Referencias

### Crush + Z.AI GLM (Proxy Local)

Para configuración avanzada con Z.ai2api (proxy local) que convierte Zhipu AI a formato OpenAI-compatible:

📖 **[CRUSH_ZAI_CONFIG.md](./CRUSH_ZAI_CONFIG.md)**

Incluye:
- Endpoints de Z.AI (chat.z.ai)
- Instalación del proxy Z.ai2api
- Configuración de Crush con proveedor personalizado
- Modos de thinking chain
- Troubleshooting

## 🔐 Security Notes

- **API Keys**: Some configuration files contain API keys. Make sure this repository is **private**
- **Sensitive Data**: Review `settings.json` and `claude_code_config.json` before committing
- **Environment Variables**: Use `settings.local.json` for machine-specific settings (not synced)

## 📝 License

MIT License - Feel free to use and modify!

---

*Made with 🧡 for the Drake Corsair community*
