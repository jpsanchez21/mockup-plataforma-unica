#!/usr/bin/env bash
# Promueve la ultima version de GitHub (main) a produccion en este servidor.
# Uso: ./deploy.sh   (correr manualmente por SSH desde /home/jpsanchez/apps/mockup-plataforma-unica)
set -euo pipefail
cd "$(dirname "$0")"

git pull --ff-only
npm install
npm run build

mkdir -p /var/www/sandbox
rsync -a --delete --exclude='data' dist/ /var/www/sandbox/

echo "Deploy completo: $(date -u +%FT%TZ)"
