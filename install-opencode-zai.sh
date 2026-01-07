#!/bin/bash

set -e

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
OPENCODE_CONFIG="$HOME/.config/crush"
OPENCODE_CONFIG_JSON="$OPENCODE_CONFIG/opencode.json"

echo "================================================================"
echo "       OpenCode Installer con Oh My OpenCode + Z.AI GLM4.7"
echo "================================================================"
echo ""
echo "Modo de instalación:"
echo ""
echo "  [1] Directo (asume soporte nativo en Crush)"
echo "  [2] Con proxy Z.ai2api (recomendado)"
echo ""
read -p "Selecciona modo [1/2, default=1]: " INSTALL_MODE

if [ -z "$INSTALL_MODE" ]; then
  INSTALL_MODE=1
fi

echo ""

# Paso 1: Verificar OpenCode instalado
if command -v opencode &> /dev/null; then
  OPENCODE_VERSION=$(opencode --version)
  echo "✓ OpenCode detectado: $OPENCODE_VERSION"
else
  echo "✗ Error: OpenCode no instalado"
  echo "  Instalar: curl -fsSL https://opencode.ai/install | bash"
  exit 1
fi

# Paso 2: Configurar modelo GLM4.7
echo ""
echo "Configurando modelo Z.AI GLM4.7 Coding Plan..."
ZAI_MODEL="zai/glm-4.7"

echo "  ✓ Modelo configurado: $ZAI_MODEL"

# Modo específico según selección
if [ "$INSTALL_MODE" = "1" ]; then
  # Modo 1: Directo (asume soporte nativo)
  echo ""
  echo "  Usando configuración directa para Z.AI GLM4.7"
  echo "  Nota: Asume que Crush tiene soporte nativo para zai/glm-4.7"
else
  # Modo 2: Con proxy Z.ai2api
  echo ""
  echo "  Instalando proxy Z.ai2api..."
  echo ""

  # Pedir API Key
  echo "Obtén tu API key de: https://open.bigmodel.cn/usercenter/apikey"
  read -p "Zhipu AI API Key (o presiona Enter para modo anónimo): " ZAI_TOKEN

  if [ -z "$ZAI_TOKEN" ]; then
    echo "  ⚠ Modo anónimo activado (limitado - sin subida de archivos)"
    ANONYMOUS_MODE="true"
  else
    ANONYMOUS_MODE="false"
    echo "  ✓ Token configurado"
  fi

  # Crear directorio Z.ai2api si no existe
  ZAI2API_DIR="$REPO_ROOT/zai2api"

  if [ ! -d "$ZAI2API_DIR" ]; then
    echo "  Clonando Z.ai2api..."
    git clone https://github.com/hmjz100/Z.ai2api.git "$ZAI2API_DIR" 2>/dev/null || {
      echo "  ✗ Error al clonar Z.ai2api"
      exit 1
    }
  fi

  # Configurar .env
  cat > "$ZAI2API_DIR/.env" << EOF
BASE=https://chat.z.ai
PORT=8080
MODEL=glm-4.7
TOKEN=$ZAI_TOKEN
ANONYMOUS_MODE=$ANONYMOUS_MODE
THINK_TAGS_MODE=reasoning
DEBUG_MODE=false
EOF

  echo "  ✓ .env creado en $ZAI2API_DIR/.env"

  # Instalar dependencias Python
  if [ ! -d "$ZAI2API_DIR/venv" ]; then
    echo "  Creando entorno virtual Python..."
    python3 -m venv "$ZAI2API_DIR/venv"
  fi

  echo "  Instalando dependencias..."
  source "$ZAI2API_DIR/venv/bin/activate"
  pip install -q -r "$ZAI2API_DIR/requirements.txt"

  # Iniciar proxy en background
  echo "  Iniciando proxy Z.ai2api en background..."
  python3 "$ZAI2API_DIR/app.py" > /dev/null 2>&1 &
  PROXY_PID=$!

  sleep 3

  # Verificar que el proxy esté corriendo
  if curl -s http://localhost:8080/v1/models > /dev/null 2>&1; then
    echo "  ✓ Proxy iniciado en http://localhost:8080"
  else
    echo "  ✗ Error: Proxy no inició correctamente"
    echo "  Revisa logs en: $ZAI2API_DIR"
    exit 1
  fi

  # Configurar Crush con proxy local
  echo ""
  echo "  Configurando Crush para usar proxy local..."

  mkdir -p "$OPENCODE_CONFIG"

  # Leer configuración existente o crear nueva
  if [ -f "$OPENCODE_CONFIG_JSON" ]; then
    CRUSH_CONFIG=$(cat "$OPENCODE_CONFIG_JSON")
  else
    CRUSH_CONFIG='{"$schema":"https://charm.land/crush.json"}'
  fi

  # Añadir/actualizar proveedor zai con proxy local
  if echo "$CRUSH_CONFIG" | grep -q '"zai"'; then
    # Proveedor ya existe - actualizar base_url
    UPDATED_CONFIG=$(echo "$CRUSH_CONFIG" | sed 's|"base_url"[^,]*}/|"base_url": "http:\/\/localhost:8080\/v1",/')
  else
    # Proveedor nuevo - añadir completo
    UPDATED_CONFIG=$(echo "$CRUSH_CONFIG" | sed 's/}\(, \?"}/,  "providers": \{  "zai": \{    "name": "Z.AI GLM",    "type": "openai-compat",    "base_url": "http:\/\/localhost:8080\/v1",    "api_key": "",    "models": \[      \{        "id": "glm-4.7",        "name": "GLM 4.7 (Coding)",        "cost_per_1m_in": 0,        "cost_per_1m_out": 0,        "cost_per_1m_in_cached": 0,        "context_window": 128000,        "default_max_tokens": 4000      \},      \{        "id": "glm-4.6",        "name": "GLM 4.6 (Coding)",        "cost_per_1m_in": 0,        "cost_per_1m_out": 0,        "cost_per_1m_in_cached": 0,        "context_window": 128000,        "default_max_tokens": 4000      \}    \]  \}  \}/')
  fi

  echo "$UPDATED_CONFIG" > "$OPENCODE_CONFIG_JSON"
  echo "  ✓ Configuración de Crush actualizada"

  echo ""
  echo "  Info:"
  echo "    Proxy ID: $PROXY_PID"
  echo "    Para detener proxy: kill $PROXY_PID"
fi

# Paso 3: Instalar oh-my-opencode
echo ""
echo "Instalando Oh My OpenCode..."
bunx oh-my-opencode install --no-tui --claude=no --chatgpt=no --gemini=no

# Paso 4: Crear directorio de configuración
mkdir -p "$OPENCODE_CONFIG"

# Paso 5: Copiar configuración personalizada
OPL_CONFIG_FILE="$REPO_ROOT/.opencode/oh-my-opencode.json"

if [ -f "$OPL_CONFIG_FILE" ]; then
  cp "$OPL_CONFIG_FILE" "$OPENCODE_CONFIG/oh-my-opencode.json"
  echo "  ✓ Configuración copiada: $OPENCODE_CONFIG/oh-my-opencode.json"
else
  echo "  ✗ Error: No se encontró configuración en $OPL_CONFIG_FILE"
  exit 1
fi

# Paso 6: Verificar configuración en opencode.json
if [ -f "$OPENCODE_CONFIG_JSON" ]; then
  # Verificar si oh-my-opencode está en plugins
  if grep -q "oh-my-opencode" "$OPENCODE_CONFIG_JSON"; then
    echo "  ✓ oh-my-opencode ya configurado en crush.json"
  else
    echo "  ⚠ Agrega 'oh-my-opencode' a la sección 'plugin' en:"
    echo "    $OPENCODE_CONFIG_JSON"
  fi
else
  echo "  ⚠ Configuración base opencode.json no encontrada en:"
  echo "    $OPENCODE_CONFIG/opencode.json"
fi

echo ""
echo "================================================================"
echo "                      ¡INSTALACIÓN COMPLETADA!"
echo "================================================================"
echo ""
echo "Componentes instalados:"
if [ "$INSTALL_MODE" = "1" ]; then
  echo "  ✓ Oh My OpenCode (Sisyphus + Agentes especializados)"
  echo "  ✓ Modelo configurado: Z.AI GLM4.7 (asume soporte nativo)"
  echo "  ✓ Configuración en: $OPENCODE_CONFIG/oh-my-opencode.json"
else
  echo "  ✓ Oh My OpenCode (Sisyphus + Agentes especializados)"
  echo "  ✓ Z.ai2api proxy local"
  echo "  ✓ Configuración de Crush para usar proxy"
  echo "  ✓ Todos los agentes usando: zai/glm-4.7 vía proxy"
  echo "  ✓ Proxy corriendo en: http://localhost:8080 (PID: $PROXY_PID)"
fi
echo ""
echo "Agentes disponibles:"
echo "  • Sisyphus - Orquestador principal"
echo "  • Oracle - Arquitectura y code review"
echo "  • Librarian - Documentación y codebase exploration"
echo "  • Explore - Exploración rápida"
echo "  • Frontend UI/UX Engineer - Desarrollo frontend"
echo "  • Document Writer - Escritura técnica"
echo "  • Multimodal Looker - Contenido visual"
echo ""
echo "Uso:"
echo "  opencode                    # Iniciar Crush"
echo "  Agregar 'ultrawork' o 'ulw' para modo máximo rendimiento"
echo ""
if [ "$INSTALL_MODE" = "2" ]; then
  echo "Notas:"
  echo "  • El proxy Z.ai2api corre en background"
  echo "  • Para detener el proxy: kill $PROXY_PID"
  echo "  • Logs del proxy: $ZAI2API_DIR"
  echo "  • Configuración .env: $ZAI2API_DIR/.env"
  echo "  • Para cambiar el token, edita el .env y reinicia el proxy"
fi
echo ""
echo "Configuración manual:"
echo "  Editar: $OPENCODE_CONFIG/oh-my-opencode.json"
echo ""
echo "Documentación:"
echo "  • Oh My OpenCode: https://github.com/code-yeongyu/oh-my-opencode"
echo "  • Z.ai2api Proxy: https://github.com/hmjz100/Z.ai2api"
echo "  • Zhipu AI Console: https://open.bigmodel.cn/usercenter/apikey"
echo ""
echo "================================================================"
