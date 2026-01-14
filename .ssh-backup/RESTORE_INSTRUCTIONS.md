# 🔐 SSH Keys Backup - Restoration Guide

## Descripción
Backup encriptado con **OpenSSL AES-256-CBC** de todas tus claves SSH.

**Contenido:**
- nemesis_cmdr_key (CLAVE MAESTRA)
- id_ed25519, id_nemesis_server
- cepcomunicacion, adepac_deploy_auto, prilabsa-github-actions
- solaria-hetzner/* (servidor producción)
- ~/.ssh/config (configuración de hosts)

## Restauración en Nueva Computadora

### 1️⃣ Descargar repo
```bash
git clone https://github.com/NAZCAMEDIA/claude-code-config.git
cd claude-code-config/.ssh-backup
```

### 2️⃣ Desencriptar
```bash
mkdir -p ~/.ssh
openssl enc -d -aes-256-cbc -in ssh_backup_*.tar.gz.enc | tar xz -C ~/.ssh
```

O en dos pasos:
```bash
openssl enc -d -aes-256-cbc -in ssh_backup_*.tar.gz.enc -out ssh_backup.tar.gz
tar xzf ssh_backup.tar.gz -C ~/.ssh
```

### 3️⃣ Permisos (CRÍTICO)
```bash
chmod 600 ~/.ssh/nemesis_cmdr_key
chmod 600 ~/.ssh/id_*
chmod 600 ~/.ssh/*_key
chmod 700 ~/.ssh
chmod 644 ~/.ssh/*.pub
```

### 4️⃣ Verificar
```bash
ssh mac-mini-drake "whoami"
ssh -T git@github.com
ssh-keygen -l -f ~/.ssh/nemesis_cmdr_key
```

## ⚠️ Seguridad
- La contraseña es crítica - sin ella no puedes restaurar
- Guárdala en 1Password/Keepass
- El archivo .enc está protegido por la contraseña

## Troubleshooting
- "bad decrypt": Contraseña incorrecta
- "Permission denied": Falta `chmod 600` después de restaurar
