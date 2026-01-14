# 🛠️ Development Tools Config - Restoration Guide

## Contenido del Backup

### Warp Terminal
- `~/.warp/keybindings.yaml` - Atajos personalizados
- `~/.warp/themes/corsairhud.yaml` - Tema Corsair HUD
- `~/.warp/themes/corsairhudplus.yaml` - Tema Corsair HUD+

### AntiGravity IDE
- `~/.antigravity/argv.json` - Argumentos de lanzamiento
- `~/.antigravity/antigravity/` - Configuración principal

## Restauración en Nueva Computadora

### 1️⃣ Descargar repo
```bash
git clone https://github.com/NAZCAMEDIA/claude-code-config.git
cd claude-code-config/.devtools-backup
```

### 2️⃣ Desencriptar
```bash
mkdir -p ~/.warp ~/.antigravity
openssl enc -d -aes-256-cbc -in devtools_config_*.tar.gz.enc | tar xz -C ~
```

### 3️⃣ Instalar herramientas
```bash
brew install warp
brew install antigravity
```

### 4️⃣ Cargar configuraciones
```bash
# Warp
warp

# AntiGravity
open /Applications/Antigravity.app
```

Los temas y configuraciones deberían cargarse automáticamente.

### 5️⃣ Verificar Warp
```bash
# Settings → Appearance → Theme → CORSAIR HUD+
```

## Troubleshooting
- Warp no carga temas: `chmod 644 ~/.warp/themes/*.yaml` y reinicia
- AntiGravity: Los settings globales en ~/Library/Application Support/Antigravity/User/ pueden necesitar restauración manual

