# How to Deploy This Project

A step-by-step guide to get your Cordillera Heritage app live on the internet.

---

## What you’re deploying

Your app has **two parts** that run in different places:

| Part | What it is | Where it runs |
|------|------------|----------------|
| **Frontend** | React app (pages, UI, forms) in `frontend/` | **Vercel** – serves the website people visit |
| **Backend** | Laravel API (auth, database, logic) in `backend/` | **Railway** – runs the server and MySQL |

- People open your **Vercel URL** (e.g. `https://case-study-bice.vercel.app`).
- The React app loads in their browser, then calls your **Railway API** for data (login, products, orders, etc.).
- So you deploy **both**: frontend first, then backend, then connect them with two URLs.

---

## Part A: Deploy the frontend (Vercel)

### What Vercel does

Vercel builds your React app into static files (HTML, CSS, JS) and serves them on a global CDN. Every time you push to GitHub, it can rebuild and update the site.

### Steps

1. **Push your code to GitHub**  
   Make sure your project is in a repo (e.g. `github.com/Impenggg/CaseStudy`).

2. **Go to [vercel.com](https://vercel.com)**  
   Sign in with GitHub.

3. **New Project**  
   - Click **Add New…** → **Project**.  
   - Import your GitHub repo (e.g. **CaseStudy**).  
   - If asked for framework, leave **Vite** (Vercel usually detects it).

4. **Configure the project**
   - **Root Directory:** click **Edit** and set to **`frontend`**.  
     (So Vercel only builds the `frontend/` folder.)
   - **Build Command:** `npm run build` (default).  
   - **Output Directory:** `dist` (default).  
   - **Environment variables:** add one:
     - **Name:** `VITE_API_BASE_URL`  
     - **Value:** you’ll set this after the backend is deployed (e.g. `https://your-app.up.railway.app/api`).  
     You can add a placeholder now and change it later.

5. **Deploy**  
   Click **Deploy**. Wait for the build to finish.

6. **Your site is live**  
   Vercel gives you a URL like `https://case-study-bice.vercel.app`.  
   Until you set `VITE_API_BASE_URL` and deploy the backend, the site will load but API calls (login, data) will fail. That’s expected.

---

## Part B: Deploy the backend (Railway)

### What Railway does

Railway runs your Laravel app and a MySQL database on their servers. It builds your code, runs migrations, and gives your API a public URL.

### Steps

1. **Go to [railway.com](https://railway.com)**  
   Sign in (e.g. with GitHub).

2. **New project from GitHub**
   - **New Project** → **Deploy from GitHub repo**.  
   - Select the same repo (**CaseStudy**).  
   - Railway creates one service linked to that repo.

3. **Tell Railway where the backend code is**
   - Click the **service** that was created.  
   - Open **Settings**.  
   - Find **Root Directory** (under Source/Build).  
   - Set it to **`backend`** and save.  
   Now Railway builds and runs only the `backend/` folder (Laravel).

4. **Add a MySQL database**
   - In the same project, click **+ New** (or **Add service**).  
   - Choose **Database** → **MySQL**.  
   - Wait until the MySQL service is running.  
   Railway creates the database and exposes variables like `MYSQLHOST`, `MYSQLUSER`, etc.

5. **Set environment variables for the Laravel service**
   - Click your **Laravel service** (the one from GitHub).  
   - Open the **Variables** tab.  
   - Add these (use **Raw Editor** to paste many at once):

   **App**
   - `APP_NAME` = `Cordillera Heritage API`
   - `APP_ENV` = `production`
   - `APP_DEBUG` = `false`
   - `APP_KEY` = run locally in `backend/`: `php artisan key:generate --show` and paste the `base64:...` value.
   - `APP_URL` = leave empty for now (you’ll set it after generating a domain).
   - `FRONTEND_URL` = `https://case-study-bice.vercel.app`  
     (so the API allows requests from your Vercel site – CORS).

   **Database**  
   Replace `MySQL` with your MySQL service name if it’s different.
   - `DB_CONNECTION` = `mysql`
   - `DB_HOST` = `${{MySQL.MYSQLHOST}}`
   - `DB_PORT` = `${{MySQL.MYSQLPORT}}`
   - `DB_DATABASE` = `${{MySQL.MYSQLDATABASE}}`
   - `DB_USERNAME` = `${{MySQL.MYSQLUSER}}`
   - `DB_PASSWORD` = `${{MySQL.MYSQLPASSWORD}}`

   **Optional**
   - `LOG_CHANNEL` = `stderr` (so logs show in Railway’s dashboard).

6. **Run migrations on every deploy**
   - In the Laravel service, **Settings** → find **Pre-Deploy Command** (under Deploy).  
   - Set it to:
     ```bash
     composer install --no-dev --optimize-autoloader && php artisan migrate --force && php artisan config:cache
     ```
   - Save.

7. **Get a public URL for the API**
   - In the Laravel service, **Settings** → **Networking** (or **Public Networking**).  
   - Click **Generate Domain**.  
   - Railway gives you a URL like `https://case-study-production-xxxx.up.railway.app`.  
   - Copy it.  
   - In **Variables**, set **`APP_URL`** to that URL (e.g. `https://case-study-production-xxxx.up.railway.app`).  
   - Trigger a **Redeploy** so the app uses the new `APP_URL`.

8. **Optional: seed the database**
   - In the Laravel service you can run a one-off command (e.g. **Shell** or **Run command**):  
     `php artisan db:seed`  
   Only if your seeders are safe for production.

Your API is now live at **`<APP_URL>/api`** (e.g. `https://case-study-production-xxxx.up.railway.app/api`).

---

## Part C: Connect frontend and backend

1. **Set the API URL in Vercel**
   - Vercel project → **Settings** → **Environment Variables**.  
   - Add or edit:
     - **Name:** `VITE_API_BASE_URL`  
     - **Value:** your Railway API URL **including** `/api`, e.g.  
       `https://case-study-production-xxxx.up.railway.app/api`  
   - Save.

2. **Redeploy the frontend**
   - Vercel → **Deployments** → open the **⋯** menu on the latest deployment → **Redeploy**.  
   - Vite bakes `VITE_API_BASE_URL` into the build at **build time**, so a redeploy is required for the new URL to take effect.

3. **Test**
   - Open your Vercel URL (e.g. `https://case-study-bice.vercel.app`).  
   - Try logging in, loading products, etc.  
   - If something fails, check the browser’s Network tab (F12) to see if requests go to your Railway URL and what status they return.

---

## Summary: order of operations

1. Push code to GitHub.  
2. Deploy **frontend** on Vercel (root = `frontend`, add `VITE_API_BASE_URL` when you have the API URL).  
3. Deploy **backend** on Railway (root = `backend`, add MySQL, set variables, Pre-Deploy command, generate domain).  
4. Set **`VITE_API_BASE_URL`** in Vercel to `https://YOUR-RAILWAY-DOMAIN.up.railway.app/api`.  
5. Redeploy the frontend.  
6. Use your Vercel URL; the app will call the Railway API automatically.

---

## Troubleshooting

| Problem | What to check |
|--------|----------------|
| Frontend loads but login/data doesn’t work | Is `VITE_API_BASE_URL` set in Vercel and did you redeploy after setting it? |
| “CORS error” in the browser | Is `FRONTEND_URL` in Railway set to your exact Vercel URL (e.g. `https://case-study-bice.vercel.app`)? |
| Railway build fails | Is **Root Directory** set to `backend`? Check build logs. |
| Railway “No application to run” or 502 | Did you set **Pre-Deploy Command** and generate a **domain**? |
| Database errors on Railway | Are `DB_*` variables set and referencing the MySQL service (e.g. `${{MySQL.MYSQLHOST}}`)? |

---

## More detail

- **Backend only (Railway):** see **`RAILWAY_DEPLOY.md`**.  
- **Deployment overview and Vercel+Forge:** see **`DEPLOYMENT_REVIEW.md`**.
