# Deploy Backend to Railway

Step-by-step guide to deploy the **Laravel API** (in `backend/`) to [Railway](https://railway.com) with MySQL, then connect your Vercel frontend.

---

## 1. Create a Railway project

1. Go to [railway.com](https://railway.com) and sign in (GitHub is easiest).
2. Click **New Project**.
3. Choose **Deploy from GitHub repo**.
4. Select your repo: **Impenggg/CaseStudy** (or your fork).
5. Railway will add one service from the repo. We’ll configure it as the Laravel backend and add MySQL next.

---

## 2. Set the backend as the service root (monorepo)

Your Laravel app is in the **`backend/`** folder, so Railway must use that as the app root:

1. Open the service that was created (the one linked to your repo).
2. Go to **Settings**.
3. Find **Root Directory** (under **Source** or **Build**).
4. Set it to: **`backend`**.
5. Save.

Railway will now build and run only the `backend/` directory (Laravel).

---

## 3. Add MySQL

1. In the same project, click **+ New** (or **Add service**).
2. Choose **Database** → **MySQL** (or **Add MySQL** from the template/catalog).
3. Wait until the MySQL service is running.
4. You don’t need to change any MySQL settings; Railway creates the database and exposes variables you’ll use in the next step.

---

## 4. Configure variables for the Laravel service

1. Click your **Laravel service** (the one from GitHub with Root Directory `backend`).
2. Open the **Variables** tab.
3. Add the variables below. Use **Raw Editor** if you prefer pasting.

**Required:**

| Variable | Value |
|----------|--------|
| `APP_NAME` | `Cordillera Heritage API` |
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_KEY` | Generate with `php artisan key:generate --show` locally (in `backend/`) and paste the `base64:...` value. |
| `APP_URL` | Leave empty for now; we’ll set it after generating a domain (e.g. `https://your-api.up.railway.app`). |
| `FRONTEND_URL` | `https://case-study-bice.vercel.app` |

**Database (reference the MySQL service):**

Railway exposes MySQL as a separate service. Reference its variables like `${{MySQL.MYSQLHOST}}` (replace `MySQL` with your MySQL service name if different).

| Variable | Value |
|----------|--------|
| `DB_CONNECTION` | `mysql` |
| `DB_HOST` | `${{MySQL.MYSQLHOST}}` |
| `DB_PORT` | `${{MySQL.MYSQLPORT}}` |
| `DB_DATABASE` | `${{MySQL.MYSQLDATABASE}}` |
| `DB_USERNAME` | `${{MySQL.MYSQLUSER}}` |
| `DB_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |

**Optional (recommended for Railway):**

| Variable | Value |
|----------|--------|
| `LOG_CHANNEL` | `stderr` |

4. Save. If **APP_URL** is still empty, that’s fine; set it after you generate a domain in step 5.

---

## 5. Build and start commands (avoid “secret APP_KEY: not found”)

Railway does **not** pass service variables (like `APP_KEY`) to the **build** step. If the build runs `php artisan` or composer scripts that need Laravel, you get **“secret APP_KEY: not found”**. Use this setup so the build does not need `APP_KEY`:

1. **Pre-Deploy Command:** leave **empty** (do not run migrate or config:cache here).
2. **Build:** In **Settings** → **Build**, set **Custom Build Command** (if available) to:
   ```bash
   composer install --no-dev --optimize-autoloader --no-scripts
   ```
   (`--no-scripts` avoids Laravel bootstrap during build.)
3. **Start:** In **Settings** → **Deploy** (or **Start**), set **Custom Start Command** to:
   ```bash
   sh railway/start.sh
   ```
   The script `backend/railway/start.sh` runs `migrate`, `config:cache`, then starts PHP-FPM (variables are available at runtime).

If your Railway UI does not have a Custom Build Command, leave the build as default and only set the **Custom Start Command** above; if the build still fails with “secret APP_KEY: not found”, the builder may be requesting `APP_KEY`—in that case, try creating a new service or contacting Railway support.

---

## 6. Generate a public URL for the API

1. In the **Laravel service**, go to **Settings** → **Networking** (or **Public Networking**).
2. Click **Generate Domain** (or **Add domain**).
3. Railway will assign a URL like `https://case-study-production-xxxx.up.railway.app`.
4. Copy that URL. Then:
   - In **Variables**, set **`APP_URL`** to that URL (e.g. `https://case-study-production-xxxx.up.railway.app`).
   - **Redeploy** the service so the new `APP_URL` is used.

Your API base URL for the frontend will be: **`<APP_URL>/api`** (e.g. `https://case-study-production-xxxx.up.railway.app/api`).

---

## 7. Connect the Vercel frontend to the Railway API

1. Open your **Vercel** project (the one for https://case-study-bice.vercel.app).
2. Go to **Settings** → **Environment Variables**.
3. Add (or update):
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** `https://YOUR-RAILWAY-DOMAIN.up.railway.app/api`  
     (use the exact domain from step 6, with `/api` at the end.)
4. Save, then **Redeploy** the frontend so the new API URL is baked into the build.

---

## 8. (Optional) Seed the database

To load sample data (e.g. test users, products):

1. In Railway, open the **Laravel service**.
2. Use **Settings** → **Shell** or the **Run command** (or CLI: `railway run php artisan db:seed`) and run once:

```bash
php artisan db:seed
```

(Only if your seeders are safe for production; otherwise skip or run a custom seeder.)

---

## Summary checklist

- [ ] New Railway project from GitHub repo **CaseStudy**.
- [ ] **Root Directory** = `backend` on the Laravel service.
- [ ] **MySQL** service added in the same project.
- [ ] **Variables** set: `APP_KEY`, `APP_URL`, `FRONTEND_URL`, `DB_*` (or `DB_URL`), and optionally `LOG_CHANNEL=stderr`.
- [ ] **Pre-Deploy Command**: `composer install --no-dev --optimize-autoloader && php artisan migrate --force && php artisan config:cache`.
- [ ] **Generate Domain** for the Laravel service and set `APP_URL` to that URL.
- [ ] **Vercel** env: `VITE_API_BASE_URL` = `https://YOUR-RAILWAY-DOMAIN.up.railway.app/api`, then redeploy.

After that, https://case-study-bice.vercel.app will use your Railway Laravel API. CORS is already configured in `backend/config/cors.php` for `FRONTEND_URL` and `*.vercel.app`.

For more: [Railway Laravel guide](https://docs.railway.com/guides/laravel), [Railway MySQL](https://docs.railway.com/databases/mysql), [Railway monorepo](https://docs.railway.com/deployments/monorepo).
