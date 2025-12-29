# Running Guide for Windows (Laragon)

Follow these steps to run the Laravel Pharmacy API project.

## Prerequisites

1.  **Laragon**: Ensure Laragon is running (Nginx/Apache & PostgreSQL).
2.  **PostgreSQL**: Ensure PostgreSQL is started.
3.  **Composer**: Ensure composer is installed and accessible in the terminal.

## Step-by-Step Installation

Open your terminal (PowerShell or Command Prompt) and navigate to the project root:
`cd d:\Laragon\laragon\www\backend`

### 1. Install Dependencies

Install PHP dependencies defined in `composer.json`.

```powershell
composer install
```

### 2. Configure Environment

Create the `.env` file from the example.

```powershell
copy .env.example .env
```

Open `.env` and verify your database config matches your Laragon PostgreSQL settings:

```ini
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=pharmnezz
DB_USERNAME=postgres
DB_PASSWORD=root  # Or whatever your password is (default often root or empty)
```

Generate the application encryption key:

```powershell
php artisan key:generate
```

Generate the JWT secret key:

```powershell
php artisan jwt:secret
```

### 3. Setup Database

Create the database if it doesn't exist (you might need to do this via valid SQL client like HeidiSQL or PgAdmin if the command fails, but Laravel can sometimes handle it if configured).

Run migrations to create tables:

```powershell
php artisan migrate
```

Seed the database with initial data (Admin, Medicines, Pharmacies):

```powershell
php artisan db:seed
```

### 4. Run the Server

Start the Laravel development server:

```powershell
php artisan serve
```

The API will be available at `http://localhost:8000/api/v1`.

### 5. Verification

You can test the API using CURL or Postman.

**Health Check (Get Public Pharmacies):**

```powershell
curl http://localhost:8000/api/v1/pharmacies
```

**Login as Admin:**

```powershell
curl -X POST http://localhost:8000/api/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"admin@example.com", "password":"password"}'
```

**Search Medicines:**

```powershell
curl "http://localhost:8000/api/v1/medicines/search?name=Para"
```

## Running Tests

To ensure everything is working correctly, run the test suite:

```powershell
php artisan test
```
