# Project Execution Log

## 2025-12-11 Project Implementation

### Initial Setup

1.  **Configuration**: Updated `composer.json` to include `php-open-source-saver/jwt-auth`. Configured `.env` and `.env.example`.
2.  **Clean Up**: Removed conflicting `setup_postgres_types_and_postgis.php` migration to respect the "WITHOUT PostGIS" rule.
3.  **Bootstrap**: Configured `bootstrap/app.php` for Laravel 11+ middleware aliases (`auth.jwt`, `role`).

### core Architecture

1.  **Traits**: Implemented `ApiResponse` and `HasRoles` traits.
2.  **Utils**: Created `GeoLocationService` (Haversine), `CsvParser`, and `FileUploadHelper`.
3.  **Middleware**: Implemented `IsAuth` (JWT) and `RoleMiddleware`.

### Domain Implementation

1.  **Models**: Updated `User` (JWTSubject), `Pharmacy`, `Medicine`, `PharmacyMedicine`, `PharmacyReport`, `PharmacyDocument` with strict types and relationships.
2.  **Repositories**: Implemented specific repositories for each domain (`Auth`, `Pharmacy`, `Medicine`, `Inventory`, `Report`).
3.  **Services**: Implemented business logic layers delegating to repositories.
4.  **Controllers**: Implemented standard REST controllers using `ApiResponse` trait.
5.  **Requests**: Implemented FormRequests for validation.
6.  **Resources**: Implemented API Resources for consistent JSON output.

### Testing & Debugging

1.  **Tests**: Created Feature tests (`Auth`, `Medicine`, `Pharmacy`) and Unit tests (`GeoLocation`).
2.  **Fixes Applied**:
    -   **Auth Guard**: Explicitly configured `api` guard with `jwt` driver in `config/auth.php`.
    -   **AuthController**: Explicitly used `auth('api')` and added fallback user retrieval to prevent `UserResource` null errors.
    -   **MedicineRepository**: Added conditional logic to use `LIKE` (SQLite) vs `ILIKE` (Postgres) for cross-database compatibility during testing.
    -   **Migrations**: Fixed primary key conflict in `pharmacy_medicines` table.

### Result

## 2025-12-20 Feature Implementation

### 1. Partial Updates (PATCH)

-   **Problem**: `PUT`/`PATCH` requests were enforcing strict requirements on all fields, preventing partial updates.
-   **Solution**:
    -   Modified `PharmacyRequest` and `InventoryRequest` to use `sometimes` rule conditionally when method is `PUT` or `PATCH`.
    -   Updated `MedicineService` and `InventoryRepository` (`updatePivot`) to handle partial attribute arrays safely without nulling missing columns.
    -   Updated `routes/api.php` to support `PATCH`.
    -   Verification: `tests/Feature/PartialUpdateTest.php`.

### 2. Pharmacy Documents

-   **Feature**: Pharmacists can upload verification documents; Admins can view them.
-   **Implementation**:
    -   **Endpoint**: `POST /pharmacy/documents` (Pharmacist), `GET /admin/pharmacies/{id}/documents` (Admin).
    -   **Pharmacist Management**: Added `GET /pharmacy/documents` (View), `POST /pharmacy/documents/{id}` (Update/Replace), `DELETE /pharmacy/documents/{id}` (Remove).
    -   **Request**: Created `PharmacyDocumentRequest` (PDF/Image, max 5MB).
    -   **Service**: Added `uploadDocument`, `getDocuments`, `updateDocument`, and `deleteDocument` to `PharmacyService`.
    -   Verification: `tests/Feature/PharmacyDocumentTest.php`.
