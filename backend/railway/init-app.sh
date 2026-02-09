#!/usr/bin/env sh
# Run before deploy on Railway: install deps, migrate, cache config.
# Use as Pre-Deploy Command: chmod +x railway/init-app.sh && ./railway/init-app.sh
# Or use the one-liner in RAILWAY_DEPLOY.md instead.
set -e
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
