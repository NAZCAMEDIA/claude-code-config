---
name: nemesis-network-ops
description: Manages operations across the NEMESIS VPN network for SOLARIA infrastructure. This skill should be used for SSH connections, deployments, cross-device orchestration, and remote command execution across the Tailscale-based private network.
---

# NEMESIS Network Operations

This skill manages operations across the NEMESIS DEL TIEMPO VPN network, enabling secure communication between all SOLARIA infrastructure devices.

## Network Overview

| Device | IP Tailscale | System | Role |
|--------|--------------|--------|------|
| origin-command01 | 100.122.193.83 | macOS Sequoia | Command Center |
| Mac-Mini-DRAKE | 100.79.246.5 | macOS (M2) | Dev/Prod Server |
| DRAKE-COMMAND01 | 100.64.226.80 | Linux | Automation |
| Acer-Drake | 100.73.198.55 | Linux | Heavy Tasks |
| iMac-400i | 100.117.182.103 | macOS | Graphics |
| iPad-Drake-Command | 100.87.12.24 | iOS | Mobile Command |
| iPhone-400i | 100.112.92.21 | iOS | Mobile Command |

## SSH Aliases

```bash
# Network devices
ssh origin-command01      # 100.122.193.83
ssh mac-mini-drake        # 100.79.246.5 (carlosjperez)
ssh mac-mini-cmdr         # 100.79.246.5 (cmdr)
ssh drake-command01       # 100.64.226.80
ssh acer-drake            # 100.73.198.55
ssh imac-400i             # 100.117.182.103

# Production servers
ssh solaria-hetzner-prod  # 46.62.222.138 (root)
ssh nemesis-server        # 148.230.118.124 (root)
```

## Common Operations

### Check Network Status
```bash
# Verify Tailscale
tailscale status

# Test all connections
bash scripts/test-connections.sh
```

### Deploy to Mac Mini
```bash
# Sync project
rsync -avz --exclude node_modules \
  ./project/ mac-mini-drake:~/projects/project/

# Run remote command
ssh mac-mini-drake "cd ~/projects/project && npm run build"
```

### Deploy to Production (Hetzner)
```bash
# Full deploy
ssh solaria-hetzner-prod "
  cd /var/www/solaria && \
  git pull && \
  npm ci && \
  npm run build && \
  pm2 restart all
"

# Check services
ssh solaria-hetzner-prod "pm2 status"
ssh solaria-hetzner-prod "systemctl status apache2"
```

### Port Forwarding
```bash
# Forward remote port locally
ssh -L 9229:localhost:9229 mac-mini-drake  # Debugging
ssh -L 3000:localhost:3000 mac-mini-drake  # Dev server
ssh -L 5432:localhost:5432 solaria-hetzner-prod  # PostgreSQL
```

## Scripts

### Test All Connections
```bash
#!/bin/bash
HOSTS=(
  "mac-mini-drake"
  "drake-command01"
  "solaria-hetzner-prod"
)

for host in "${HOSTS[@]}"; do
  echo -n "Testing $host... "
  if ssh -o ConnectTimeout=5 "$host" "echo OK" 2>/dev/null; then
    echo "✓ Connected"
  else
    echo "✗ Failed"
  fi
done
```

### Sync Project
```bash
#!/bin/bash
PROJECT=$1
TARGET=${2:-mac-mini-drake}

rsync -avz \
  --exclude node_modules \
  --exclude .git \
  --exclude dist \
  --exclude .env \
  "./$PROJECT/" "$TARGET:~/projects/$PROJECT/"

echo "Synced $PROJECT to $TARGET"
```

### Remote Execute
```bash
#!/bin/bash
HOST=$1
shift
COMMAND="$@"

ssh "$HOST" "$COMMAND"
```

## Troubleshooting

### SSH Connection Issues
```bash
# Debug connection
ssh -vvv mac-mini-drake

# Reset host key
ssh-keygen -R 100.79.246.5

# Force key authentication
ssh -i ~/.ssh/nemesis_cmdr_key -o PubkeyAuthentication=yes mac-mini-drake
```

### Tailscale Issues
```bash
# Check status
tailscale status

# Reconnect
tailscale up

# Check logs
tailscale bugreport
```

### Permission Issues
```bash
# Fix SSH permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/nemesis_cmdr_key
```

## Security

- All connections use Ed25519 keys
- No password authentication
- Tailscale provides WireGuard encryption
- Keys stored in `~/.ssh/`

## Resources

- [SSH Config](references/ssh-config.md)
- [Deployment Scripts](scripts/)
- [Network Topology](references/network-topology.md)
