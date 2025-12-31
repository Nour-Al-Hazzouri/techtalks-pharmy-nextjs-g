# Pharmy

Pharmy is a **map-based medicine availability platform** that helps patients quickly find nearby pharmacies that have a specific medicine in stock.

The platform supports three roles:

- **Patient/User**: search medicines and discover pharmacies on an interactive map.
- **Pharmacy/Pharmacist**: manage inventory availability and submit verification documents.
- **Admin**: verify pharmacies and manage reports and the medicine catalog.

## Monorepo Structure

- **`frontend/`**: Next.js (App Router) web app.
- **`backend/`**: Laravel REST API (JWT auth).

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Laravel (PHP 8.2+), JWT authentication (`php-open-source-saver/jwt-auth`)
- **Database**: PostgreSQL

## Key Features

### Public / Patient

- **Medicine search** (autocomplete/search)
- **Map-first pharmacy discovery** (interactive map + list)
- **Report inaccurate information**

### Pharmacy Dashboard

- **Profile + registration**
- **Inventory management**
- **CSV bulk upload** and export/template endpoints
- **Verification workflow** (submit/cancel verification + document upload)

### Admin Dashboard

- **Verify / approve / reject** pharmacies
- **View pharmacy documents**
- **Manage user reports**
- **Manage medicine catalog**

## API Overview

The backend API is served under:

- **`/api/v1`**

Examples (see `backend/routes/api.php` for the full list):

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/pharmacies`
- `GET /api/v1/medicines/search`

Authenticated routes use the `Authorization: Bearer <token>` header.

## Local Development

### 1) Backend (Laravel)

Requirements:

- PHP 8.2+
- Composer
- PostgreSQL

Setup:

1. Create the environment file:

   ```bash
   cp backend/.env.example backend/.env
   ```

2. Configure database credentials in `backend/.env` (PostgreSQL recommended):

   - `DB_HOST`
   - `DB_PORT`
   - `DB_DATABASE`
   - `DB_USERNAME`
   - `DB_PASSWORD`

3. Install dependencies and generate app/JWT keys:

Run the following commands to set up the application:

1. `composer install`
2. `php artisan key:generate`
3. `php artisan jwt:secret`
4. `php artisan migrate`
5. `php artisan db:seed`

All commands should be run from the backend directory.

By default, the API will be available at `http://localhost:8000`.

### 2) Frontend (Next.js)

Requirements:

- Node.js 18+
- pnpm

Setup:

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set the API base URL (optional, defaults to `http://localhost:8000/api/v1`):

   Create `frontend/.env.local`:

   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

3. Run the dev server:

   ```bash
   pnpm dev
   ```

All commands should be run from the backend directory.
Frontend will run at `http://localhost:3000`.

## Deployment Notes

- **Frontend** is configured for Netlify (`frontend/netlify.toml`).
- **Backend** can be deployed on Render using `render.yaml` (Docker runtime).

## Branding

The app logo use:

- `frontend/public/pharmy_logo.jpg`

## Reference Docs

- Product requirements: `prompts/context/pharmy_prd.md`
