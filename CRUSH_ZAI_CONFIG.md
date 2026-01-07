# Z.AI (Zhipu AI) + Crush Configuration

Configuración completa para integrar **GLM4.7 de Zhipu AI** con **Crush**.

## Resumen

Zhipu AI (Z.AI) no tiene soporte nativo en Crush, pero usaremos el proxy **Z.ai2api** que:
- Convierte la API de Zhipu AI a formato **OpenAI-compatible**
- Soporta GLM-4.5, GLM-4.6, GLM-4.7, etc.
- Funciona como servidor local que Crush puede usar

## Endpoints de Z.AI

### Base API
```
https://chat.z.ai
```

### Endpoint Principal (Chat Completions)
```
POST https://chat.z.ai/api/paas/v4/chat/completions
```

### Modelos Disponibles

| Modelo | ID en API | Uso Recomendado |
|---------|--------------|-------------------|
| GLM-4.7 | glm-4.7 | Coding/Development general |
| GLM-4.6 | glm-4.6 | Coding/Development general |
| GLM-4.5 | glm-4.5 | Coding/Development general |

### Formato OpenAI-Compatible

Z.ai2api responde a requests estándar OpenAI, permitiendo:

**Request:**
```json
{
  "model": "glm-4.7",
  "messages": [
    {
      "role": "user",
      "content": "Escribe una función en Python"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 4000
}
```

**Response:**
```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "glm-4.7",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 50,
    "completion_tokens": 100,
    "total_tokens": 150
  }
}
```

## Configuración en Crush

### Paso 1: Clonar e Instalar Z.ai2api

```bash
# Clonar repositorio
git clone https://github.com/hmjz100/Z.ai2api.git
cd Z.ai2api

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno (.env)
nano .env
```

### Paso 2: Crear Archivo .env

```bash
# Z.ai2api Configuration
BASE=https://chat.z.ai
PORT=8080
MODEL=glm-4.7
ANONYMOUS_MODE=false
THINK_TAGS_MODE=reasoning
DEBUG_MODE=false
```

**Variables de Configuración:**

| Variable | Descripción | Default |
|----------|-------------|----------|
| `BASE` | Dominio base de API | `https://chat.z.ai` |
| `PORT` | Puerto del proxy local | `8080` |
| `MODEL` | Modelo a usar si no se especifica | `glm-4.7` |
| `TOKEN` | Token de Zhipu AI | (obligatorio) |
| `ANONYMOUS_MODE` | Modo visitante (token aleatorio) | `false` |
| `THINK_TAGS_MODE` | Formato de thinking chain | `reasoning` |
| `DEBUG_MODE` | Mostrar logs de debug | `false` |

### Paso 3: Iniciar el Proxy

```bash
# Iniciar servidor local
python app.py

# El servidor correrá en http://localhost:8080
# Compatible con formato OpenAI standard
```

### Paso 4: Configurar Crush

Crear o editar archivo `~/.config/crush/crush.json`:

```json
{
  "$schema": "https://charm.land/crush.json",
  "providers": {
    "zai": {
      "name": "Z.AI GLM",
      "type": "openai-compat",
      "base_url": "http://localhost:8080/v1",
      "api_key": "",
      "models": [
        {
          "id": "glm-4.7",
          "name": "GLM 4.7 (Coding)",
          "cost_per_1m_in": 0,
          "cost_per_1m_out": 0,
          "cost_per_1m_in_cached": 0,
          "context_window": 128000,
          "default_max_tokens": 4000
        },
        {
          "id": "glm-4.6",
          "name": "GLM 4.6 (Coding)",
          "cost_per_1m_in": 0,
          "cost_per_1m_out": 0,
          "cost_per_1m_in_cached": 0,
          "context_window": 128000,
          "default_max_tokens": 4000
        },
        {
          "id": "glm-4.5",
          "name": "GLM 4.5 (Coding)",
          "cost_per_1m_in": 0,
          "cost_per_1m_out": 0,
          "cost_per_1m_in_cached": 0,
          "context_window": 128000,
          "default_max_tokens": 4000
        }
      ]
    }
  }
}
```

**Nota Importante:**
- `api_key` está vacío porque el proxy local maneja la autenticación
- `base_url` apunta al proxy local en `localhost:8080`
- `type: "openai-compat"` es CLAVE para que Crush sepa que es compatible con OpenAI

## Integración con Oh My OpenCode

Actualizar `.opencode/oh-my-opencode.json` para usar Z.AI GLM vía proxy local:

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  "comment": "Oh My OpenCode configurado para Z.AI GLM4.7 vía proxy local Z.ai2api",
  "google_auth": false,
  "agents": {
    "Sisyphus": {
      "model": "zai/glm-4.7",
      "comment": "Modelo principal - Z.AI GLM4.7 Coding via proxy local"
    },
    "oracle": {
      "model": "zai/glm-4.7",
      "comment": "Arquitectura, code review, estrategia"
    },
    "librarian": {
      "model": "zai/glm-4.7",
      "comment": "Multi-repo analysis, doc lookup"
    },
    "explore": {
      "model": "zai/glm-4.7",
      "comment": "Codebase exploration rápido"
    },
    "frontend-ui-ux-engineer": {
      "model": "zai/glm-4.7",
      "comment": "Desarrollo frontend"
    },
    "document-writer": {
      "model": "zai/glm-4.7",
      "comment": "Escritura técnica"
    },
    "multimodal-looker": {
      "model": "zai/glm-4.7",
      "comment": "Contenido visual"
    },
    "build": {
      "model": "zai/glm-4.7",
      "comment": "Agente builder por defecto"
    },
    "plan": {
      "model": "zai/glm-4.7",
      "comment": "Agente planner por defecto"
    }
  },
  "sisyphus_agent": {
    "disabled": false,
    "default_builder_enabled": false,
    "planner_enabled": true,
    "replace_plan": true
  },
  "ralph_loop": {
    "enabled": true,
    "default_max_iterations": 100
  },
  "background_task": {
    "defaultConcurrency": 5
  },
  "disabled_mcps": ["websearch", "context7", "grep_app"]
}
```

## Flujo Completo

```bash
# 1. Clonar e instalar Z.ai2api
git clone https://github.com/hmjz100/Z.ai2api.git
cd Z.ai2api
pip install -r requirements.txt

# 2. Configurar .env
cat > .env << 'EOF'
BASE=https://chat.z.ai
PORT=8080
MODEL=glm-4.7
ANONYMOUS_MODE=false
THINK_TAGS_MODE=reasoning
DEBUG_MODE=false
# Obtener TOKEN de https://open.bigmodel.cn/usercenter/apikey
TOKEN=tu_token_aqui
EOF

# 3. Iniciar proxy en background
python app.py &
sleep 3
echo "Proxy Z.ai2api iniciado en http://localhost:8080"

# 4. Iniciar Crush
crush
# Z.AI GLM4.7 estará disponible como "zai/glm-4.7"
```

## Modos de Thinking Chain

Z.ai2api soporta diferentes formatos para la thinking chain:

| Modo | Efecto |
|-------|---------|
| `reasoning` | Mantiene tags thinking con contenido detallado |
| `think` | Tags simples `<think>...</think>` |
| `strip` | Solo contenido, sin tags de thinking |
| `details` | Tags `<details type="reasoning">` con summary |

Configurado en `.env` como:
```bash
THINK_TAGS_MODE=reasoning  # Default recomendado
```

## Notas Importantes

### Autenticación

1. **Obtener API Key:**
   - Visitar: https://open.bigmodel.cn/usercenter/apikey
   - Crear cuenta o iniciar sesión
   - Copiar el API key generado

2. **Configurar TOKEN:**
   ```bash
   # Editar .env
   TOKEN=tu_api_key_aqui
   ```

3. **Modo Anónimo:**
   ```bash
   # Para testing sin token (limitado)
   ANONYMOUS_MODE=true
   # Modo anónimo NO soporta subida de archivos
   ```

### Limitaciones

- **Modo anónimo:** No soporta subida de archivos/visuales
- **Multimodal:** Solo disponible después de iniciar sesión con token válido
- **Context Window:** 128k tokens (depende del modelo específico)
- **Rate Limits:** Aplicados según tipo de cuenta de Zhipu AI

### Troubleshooting

#### Proxy no se inicia

```bash
# Verificar puerto
lsof -i :8080

# Verificar logs
python app.py
# Revisar .env
cat .env
```

#### Crush no detecta proveedor

```bash
# Verificar configuración
cat ~/.config/crush/crush.json | grep zai

# Restartar Crush
crush --debug
```

#### Error de conexión

```bash
# Verificar que el proxy esté corriendo
curl http://localhost:8080/v1/models

# Verificar configuración de API key
cat .env | grep TOKEN
```

## Referencias

- **Z.ai2api GitHub:** https://github.com/hmjz100/Z.ai2api
- **Crush Documentation:** https://github.com/charmbracelet/crush
- **Zhipu AI Console:** https://open.bigmodel.cn/usercenter/apikey
- **Zhipu API Docs:** https://open.bigmodel.cn/dev/api

## Actualización de Scripts del Repositorio

El script `install-opencode-zai.sh` usa directamente el proveedor `zai/glm-4.7` asumiendo que Crush tiene soporte nativo.

Para usar esta configuración con proxy local:

1. Instalar Z.ai2api primero (instrucciones arriba)
2. Actualizar `.opencode/oh-my-opencode.json` manualmente o
3. Asegurar que el proxy esté corriendo antes de iniciar Crush

### Script Actualizado (Opcional - Proxy Local)

Si prefieres un script automatizado para todo el flujo, crear `install-crush-zai-proxy.sh`:

```bash
#!/bin/bash
set -e

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
OPENCODE_CONFIG="$HOME/.config/crush"

echo "================================================================"
echo "       Crush + Z.AI GLM4.7 + Z.ai2api Proxy"
echo "================================================================"
echo ""

# Verificar Python
if ! command -v python3 &> /dev/null; then
  echo "✗ Python 3 no encontrado"
  exit 1
fi

# Pedir API Key
echo "Obtén tu API key de: https://open.bigmodel.cn/usercenter/apikey"
read -p "Zhipu AI API Key: " ZAI_TOKEN

# Configurar Z.ai2api
mkdir -p "$REPO_ROOT/zai2api"
cat > "$REPO_ROOT/zai2api/.env" << EOF
BASE=https://chat.z.ai
PORT=8080
MODEL=glm-4.7
TOKEN=$ZAI_TOKEN
ANONYMOUS_MODE=false
THINK_TAGS_MODE=reasoning
DEBUG_MODE=false
EOF

# Instalar Z.ai2api
if [ ! -d "$REPO_ROOT/zai2api/venv" ]; then
  python3 -m venv "$REPO_ROOT/zai2api/venv"
fi
source "$REPO_ROOT/zai2api/venv/bin/activate"
pip install -q -r "$REPO_ROOT/zai2api/requirements.txt"

# Crear configuración de Crush
mkdir -p "$OPENCODE_CONFIG"
cat > "$OPENCODE_CONFIG/crush.json" << JSONEOF
{
  "$schema": "https://charm.land/crush.json",
  "providers": {
    "zai": {
      "name": "Z.AI GLM",
      "type": "openai-compat",
      "base_url": "http://localhost:8080/v1",
      "api_key": "",
      "models": [
        {
          "id": "glm-4.7",
          "name": "GLM 4.7 (Coding)",
          "cost_per_1m_in": 0,
          "cost_per_1m_out": 0,
          "cost_per_1m_in_cached": 0,
          "context_window": 128000,
          "default_max_tokens": 4000
        }
      ]
    }
  }
}
JSONEOF

echo "✓ Configuración de Crush creada"

echo ""
echo "Para iniciar:"
echo "  1. Iniciar proxy: python3 $REPO_ROOT/zai2api/app.py &"
echo "  2. Iniciar Crush: crush"
echo ""
echo "================================================================"
```

## Alternativa: Sin Proxy

Si Z.ai agrega soporte nativo en el futuro, la configuración sería:

```json
{
  "providers": {
    "zai": {
      "name": "Z.AI GLM",
      "type": "openai-compat",
      "base_url": "https://chat.z.ai",
      "api_key": "$ZHIPU_API_KEY",
      "models": [...]
    }
  }
}
```

Usar variable de entorno `ZHIPU_API_KEY` con la API key de Zhipu AI.
