# OpenCode + Z.AI GLM Configuration

Configuración completa de **Oh My OpenCode** con **Z.AI GLM4.7 Coding Plan** para el repositorio NAZCAMEDIA/claude-code-config.

## Resumen

Cuando se instala este repositorio en OpenCode, se configura automáticamente:
- **Oh My OpenCode** (v2.14.0+) con Sisyphus Agent Harness
- Todos los agentes usando el mismo modelo: **Z.AI GLM4.7** (Coding Plan)
- Configuración unificada para máxima consistencia

## Instalación

### Script Automático

```bash
# 1. Clonar repositorio
git clone https://github.com/NAZCAMEDIA/claude-code-config.git
cd claude-code-config

# 2. Ejecutar instalador de OpenCode
./install-opencode-zai.sh
```

### Qué hace el script

1. **Verifica** que OpenCode esté instalado
2. **Configura** automáticamente el modelo Z.AI GLM4.7 Coding Plan
3. **Instala** Oh My OpenCode (sin configurar Claude, ChatGPT, Gemini)
4. **Crea** `~/.config/opencode/oh-my-opencode.json` con todos los agentes usando `zai/glm-4.7`
5. **Configura** Sisyphus y Ralph Loop activados por defecto

### Modelo Configurado

**Z.AI GLM4.7 Coding Plan**
- Modelo en OpenCode: `zai/glm-4.7`
- Todos los agentes usan el mismo modelo para consistencia

Si necesitas cambiar el modelo:
```bash
nano ~/.config/opencode/oh-my-opencode.json
```

## Agentes Configurados

Todos los agentes usan el **mismo modelo Z.AI GLM4.7**:

| Agente | Rol en el equipo | Configuración |
|---------|------------------|---------------|
| **Sisyphus** | Orquestador principal | `model: "zai/glm-4.7"` |
| **Oracle** | Arquitectura y code review | `model: "zai/glm-4.7"` |
| **Librarian** | Documentación y codebase | `model: "zai/glm-4.7"` |
| **Explore** | Exploración rápida | `model: "zai/glm-4.7"` |
| **Frontend UI/UX Engineer** | Desarrollo frontend | `model: "zai/glm-4.7"` |
| **Document Writer** | Escritura técnica | `model: "zai/glm-4.7"` |
| **Multimodal Looker** | Contenido visual | `model: "zai/glm-4.7"` |
| **build** | Builder por defecto | `model: "zai/glm-4.7"` |
| **plan** | Planner por defecto | `model: "zai/glm-4.7"` |

## Características Activadas

### Sisyphus Agent (Orquestador)
```json
{
  "sisyphus_agent": {
    "disabled": false,
    "default_builder_enabled": false,
    "planner_enabled": true,
    "replace_plan": true
  }
}
```

### Ralph Loop
```json
{
  "ralph_loop": {
    "enabled": true,
    "default_max_iterations": 100
  }
}
```

### Background Tasks
```json
{
  "background_task": {
    "defaultConcurrency": 5
  }
}
```

### MCPs Desactivados (configurables)
```json
{
  "disabled_mcps": ["websearch", "context7", "grep_app"]
}
```

Para activar:
```json
{
  "disabled_mcps": ["context7", "grep_app"]  // Solo websearch desactivado
}
```

## Uso

### Iniciar OpenCode

```bash
opencode
```

### Modos Especiales

**Modo Ultrawork (Máximo Rendimiento):**
```
"Implementa sistema de autenticación con ultrawork"
```
O abreviado:
```
"Implementa con ulw"
```

**Modo Search (Exploración Profunda):**
```
"Buscar todas las implementaciones de esto"
"find policy for feature X"
```

**Modo Analyze (Análisis Detallado):**
```
"Analizar rendimiento de este código"
"investigate memory leak"
```

### Llamar Agentes Específicos

```
"@oracle revisa esta arquitectura"
"@librarian cómo se implementa esto"
"@explore política de esta característica"
```

### Ralph Loop

```bash
# Iniciar loop que corre hasta completar
/ralph-loop "Construye una API REST con auth JWT"

# Detecta <promise>DONE</promise> para saber cuándo terminar
# Cancelar con /cancel-ralph
```

## Archivos de Configuración

### Ubicación

```
~/.config/opencode/oh-my-opencode.json    # Configuración principal
~/.config/opencode/opencode.json          # Configuración global de OpenCode
```

### Configuración Base del Repositorio

```
claude-code-config/
├── .opencode/
│   └── oh-my-opencode.json             # Template de configuración
└── install-opencode-zai.sh             # Script de instalación
```

## Personalización

### Cambiar Modelo

Editar `~/.config/opencode/oh-my-opencode.json`:

```json
{
  "agents": {
    "Sisyphus": {
      "model": "nuevo-modelo-zai"
    }
    // Aplica a todos los agentes
  }
}
```

### Desactivar Agente

```json
{
  "disabled_agents": ["frontend-ui-ux-engineer", "multimodal-looker"]
}
```

### Configurar Permisos

```json
{
  "agents": {
    "explore": {
      "permission": {
        "edit": "ask",
        "bash": "allow",
        "webfetch": "allow"
      }
    }
  }
}
```

### Ajustar Concurrency

```json
{
  "background_task": {
    "defaultConcurrency": 3,  // Reducir para menos paralelismo
    "modelConcurrency": {
      "zai/glm-code": 2  // Máximo 2 tareas concurrentes del modelo GLM
    }
  }
}
```

## Hooks Disponibles

Oh My OpenCode incluye hooks automáticos:

| Hook | Función | Desactivar con |
|-------|----------|----------------|
| `todo-continuation-enforcer` | Fuerza completar TODOs | `disabled_hooks: ["todo-continuation-enforcer"]` |
| `comment-checker` | Reduce comentarios excesivos | `disabled_hooks: ["comment-checker"]` |
| `context-window-monitor` | Monitor de uso de contexto | `disabled_hooks: ["context-window-monitor"]` |
| `session-recovery` | Recupera sesiones con error | `disabled_hooks: ["session-recovery"]` |
| `grep-output-truncator` | Trunca grep masivo | `disabled_hooks: ["grep-output-truncator"]` |
| `keyword-detector` | Detecta ultrawork/search/analyze | `disabled_hooks: ["keyword-detector"]` |
| `ralph-loop` | Loop auto-referencial | `disabled_hooks: ["ralph-loop"]` |
| `preemptive-compaction` | Compactación preventiva | `disabled_hooks: ["preemptive-compaction"]` |

## Solución de Problemas

### Modelo no funciona

1. Verificar nombre correcto del modelo en OpenCode:
   ```bash
   opencode provider list  # Lista proveedores disponibles
   opencode model list zai  # Lista modelos Z.AI
   ```

2. Editar configuración:
   ```bash
   nano ~/.config/opencode/oh-my-opencode.json
   ```

### Agentes no aparecen

1. Verificar que `oh-my-opencode` esté en plugins:
   ```bash
   cat ~/.config/opencode/opencode.json | grep oh-my-opencode
   ```

2. Si no aparece, agregar manualmente:
   ```json
   {
     "plugin": ["oh-my-opencode"]
   }
   ```

### Sisyphus no se activa

Verificar configuración:
```bash
cat ~/.config/opencode/oh-my-opencode.json | grep sisyphus_agent
```

Debe mostrar:
```json
{
  "sisyphus_agent": {
    "disabled": false
  }
}
```

## Referencias

- **Oh My OpenCode**: https://github.com/code-yeongyu/oh-my-opencode
- **OpenCode Docs**: https://opencode.ai/docs
- **Z.AI GLM**: (documentación específica del proveedor)

## Actualización

```bash
# Actualizar Oh My OpenCode
bunx oh-my-opencode update

# Verificar versión
opencode --version  # Debe ser 1.0.150 o superior
```
