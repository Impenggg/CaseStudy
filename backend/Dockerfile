# Use PHP 8.2; no Railpack = no APP_KEY required at build time.
FROM php:8.2-cli-bookworm

# Install system deps and extensions Laravel often needs
RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip libzip-dev libpng-dev libonig-dev \
    && docker-php-ext-install zip pdo_mysql mbstring exif pcntl bcmath \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy app (no .env; use runtime env)
COPY . .

# Install PHP deps only; no scripts so no APP_KEY needed
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

# Railway sets PORT at runtime
EXPOSE 8080

# Migrate + cache config at startup (when APP_KEY and DB_* exist), then serve
CMD sh -c 'php artisan migrate --force && \
  php artisan config:cache && \
  php artisan route:cache && \
  (php artisan view:cache 2>/dev/null || true) && \
  exec php artisan serve --host=0.0.0.0 --port=${PORT:-8080}'
