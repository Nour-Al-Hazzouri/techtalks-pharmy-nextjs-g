# Laravel Pharmacy API

## Installation

1. **Clone the repository**
2. **Install Dependencies**
    ```bash
    composer install
    ```
3. **Environment Setup**

    ```bash
    cp .env.example .env
    php artisan key:generate
    php artisan jwt:secret
    ```

    _Configure your DB settings in `.env`_

4. **Database Setup**

    ```bash
    php artisan migrate
    php artisan db:seed
    ```

5. **Run Server**
    ```bash
    php artisan serve
    ```

## Features

-   **Auth**: JWT Authentication (Register, Login, Refresh, Logout)
-   **Roles**: Admin, Pharmacist, User
-   **Pharmacies**: Browsing, searching, registration, admin approval.
-   **Medicines**: Search, Autocomplete, Nearest Pharmacy (Haversine).
-   **Inventory**: Pharmacist management, CSV Upload.
-   **Reports**: User reporting, Admin resolution.

## API Documentation

All routes are prefixed with `/api/v1`.

### Example: Search Medicines

`GET /api/v1/medicines/search?name=Para`

### Example: Nearest Pharmacy

`GET /api/v1/medicines/nearest?name=Paracetamol&lat=40.7128&lng=-74.0060`
