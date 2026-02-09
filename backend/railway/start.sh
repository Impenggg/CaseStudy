#!/usr/bin/env sh
# Run at container start: migrate and cache config (needs APP_KEY and DB_* from env).
# Then start the web server. Use as Custom Start Command: sh railway/start.sh
set -e
php artisan migrate --force
php artisan config:cache
# Start PHP-FPM (Railway/Nixpacks default for PHP)
exec php-fpm
