# 🚀 QUICK RESTORE GUIDE - Post Format

Esta es tu guía rápida para restaurar todo después de formatear la computadora.

## 1️⃣ Clone el repo de configuración
```bash
git clone https://github.com/NAZCAMEDIA/claude-code-config.git
cd claude-code-config
```

## 2️⃣ Restaurar SSH Keys (CRÍTICO)
```bash
cd .ssh-backup

# Desencriptar y extraer
mkdir -p ~/.ssh
openssl enc -d -aes-256-cbc -in ssh_backup_*.tar.gz.enc | tar xz -C ~/.ssh

# IMPORTANTE: Ajustar permisos
chmod 600 ~/.ssh/*_key
chmod 700 ~/.ssh
chmod 644 ~/.ssh/*.pub

# Verificar
ssh-keygen -l -f ~/.ssh/nemesis_cmdr_key
```

## 3️⃣ Restaurar Warp + AntiGravity
```bash
cd ../.devtools-backup

# Desencriptar
openssl enc -d -aes-256-cbc -in devtools_config_*.tar.gz.enc | tar xz -C ~

# Instalar herramientas
brew install warp antigravity

# Abrir e iniciar
warp &
open /Applications/Antigravity.app
```

## 4️⃣ Clonar Repositorios Principales
```bash
cd ~/Documents/GitHub

# SOLARIA Projects
git clone https://github.com/NAZCAMEDIA/SOLARIA-CEPCOMUNICACION.git
git clone https://github.com/SOLARIA-AGENCY/PRILABSA-WEBSITE-2025-PROD.git
git clone https://github.com/SOLARIA-AGENCY/PRILABSA-WEBSITE-2025-PROD-BACKEND-WORDPRESS-CMS.git

# Otros
git clone https://github.com/NAZCAMEDIA/BRIK-64.git
git clone https://github.com/NAZCAMEDIA/luxe.git
git clone https://github.com/NAZCAMEDIA/DIGITAL-CIRCUITALITY.git

# ... resto de repos
```

## 5️⃣ Configurar Claude Code (SI APLICA)
```bash
cd ~/Documents/GitHub/claude-code-config

# Lee el CLAUDE.md para setup
cat CLAUDE.md

# O simplemente
code .
```

## ⚠️ Contraseñas Críticas
Necesitarás las contraseñas que ingresaste para:
- SSH backup (`ssh_backup_*.tar.gz.enc`)
- Warp+AntiGravity backup (`devtools_config_*.tar.gz.enc`)

Sin ellas no puedes desencriptar los archivos.

**Ubicación:** Guarda tus contraseñas en 1Password, Keepass, o lugar seguro.

## ✅ Checklist Post-Restauración
- [ ] SSH keys restauradas y con permisos correctos
- [ ] Puedes conectar a mac-mini-drake: `ssh mac-mini-drake "whoami"`
- [ ] GitHub SSH funciona: `ssh -T git@github.com`
- [ ] Warp abierto con tema CORSAIR+
- [ ] AntiGravity abierto con config cargada
- [ ] Repositorios clonados en ~/Documents/GitHub/
- [ ] Claude Code configurado

## 🔧 Troubleshooting

### SSH
```bash
# Si "bad decrypt"
openssl enc -d -aes-256-cbc -in ssh_backup_*.tar.gz.enc
# Re-ingresa contraseña

# Si "Permission denied"
chmod 600 ~/.ssh/nemesis_cmdr_key
chmod 700 ~/.ssh
```

### Warp
```bash
# Si temas no cargan
killall Warp
chmod 644 ~/.warp/themes/*.yaml
warp
# Settings → Appearance → Theme → CORSAIR HUD+
```

### AntiGravity
```bash
# Si config no carga
killall Antigravity
open /Applications/Antigravity.app
# Settings → File → Preferences → Restaurar desde settings.json manual
```

---

**Timestamp:** 2026-01-14
**Contraseñas:** Guardadas en lugar seguro ✓
**Backups:** Encriptados en GitHub ✓

