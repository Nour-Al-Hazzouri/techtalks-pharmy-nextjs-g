I want you to generate a complete, production-ready Laravel REST API project with FULL code for EVERY file.  
You MUST respect all specifications below EXACTLY and generate NO placeholder code.

===================================================
 GENERAL RULES (YOU MUST FOLLOW STRICTLY)
===================================================
- Framework: Laravel 10+
- Database: PostgreSQL (WITHOUT PostGIS)
- Authentication: JWT (using tymon/jwt-auth or php-open-source-saver/jwt-auth)
- Architecture: Controllers → Services → Repositories → Models → Resources → Requests → Middleware → Traits → Utils
- API versioning: All routes must be under /api/v1/...
- Responses MUST use ApiResponse trait with the format:

{
  "status": true|false,
  "message": "string",
  "data": {...},
  "errors": {...}
}

- Do NOT use PostGIS. Distance must be computed using Haversine formula.
- Pagination required on all list endpoints.
- MUST generate full folder structure, all classes, all logic.
- MUST include full unit & feature tests.
- MUST NOT skip ANY file.

===================================================
 MIDDLEWARE SYSTEM (CRITICAL)
===================================================
You MUST generate these middleware with full code:

1) isAuth middleware  
   - Validates JWT token using JWTAuth::parseToken()->authenticate()  
   - Returns JSON 401 if token is expired/missing  
   - Assigns $request->auth = authenticated user  

2) role middleware  
   - Validates user role  
   - Returns JSON 403 if insufficient permission  

REGISTER THEM IN Kernel.php:

'auth.jwt' => \App\Http\Middleware\IsAuth::class,
'role'     => \App\Http\Middleware\RoleMiddleware::class,

ROUTE USAGE EXAMPLES:

Route::middleware(['auth.jwt'])->group(...)
Route::middleware(['auth.jwt', 'role:pharmacist'])->group(...)
Route::middleware(['auth.jwt', 'role:admin'])->group(...)

===================================================
 DATABASE STRUCTURE (USE EXACT MIGRATIONS)
===================================================
Use the EXACT migrations provided by the user:

- users
- pharmacies
- pharmacy_documents
- medicines
- pharmacy_medicines
- pharmacy_reports
- sessions

You MUST implement models with relationships exactly matching the schema.

===================================================
 SEEDERS (MUST INCLUDE FULL CODE)
===================================================
You MUST generate these EXACT seeders:

- AdminUserSeeder
- MedicineSeeder (100+ medicines provided)
- PharmacySeeder
- PharmacyMedicineSeeder
- DatabaseSeeder (calling all above)

===================================================
 REQUIRED FEATURE SET (ALL ENDPOINTS BELOW)
===================================================

-------------------------------------------
1) AUTH (JWT)
-------------------------------------------
POST   /api/v1/auth/register  
POST   /api/v1/auth/login  
POST   /api/v1/auth/logout  
POST   /api/v1/auth/refresh  

-------------------------------------------
2) USER PROFILE
-------------------------------------------
GET    /api/v1/profile  
PUT    /api/v1/profile  
PUT    /api/v1/profile/password  

-------------------------------------------
3) PHARMACIES
-------------------------------------------
Public:
GET    /api/v1/pharmacies  
GET    /api/v1/pharmacies/{id}  

Pharmacist:
POST   /api/v1/pharmacy/register  
GET    /api/v1/pharmacy/profile  
PUT    /api/v1/pharmacy/profile  

Admin:
GET    /api/v1/admin/pharmacies  
GET    /api/v1/admin/pharmacies/{id}  
PUT    /api/v1/admin/pharmacies/{id}/approve  
PUT    /api/v1/admin/pharmacies/{id}/reject  

EXTRA REQUIRED:
GET    /api/v1/pharmacies/top-rated  
GET    /api/v1/medicines/nearest?name=Paracetamol  

-------------------------------------------
4) MEDICINES
-------------------------------------------
GET    /api/v1/medicines/search?name=  
GET    /api/v1/medicines/autocomplete?query=  

Extra rules:
- autocomplete MUST return categories grouped  
- search MUST show matching pharmacies + availability  

-------------------------------------------
5) INVENTORY (PHARMACIST ONLY)
-------------------------------------------
GET    /api/v1/pharmacy/inventory  
POST   /api/v1/pharmacy/inventory  
PUT    /api/v1/pharmacy/inventory/{id}  
DELETE /api/v1/pharmacy/inventory/{id}  

CSV FEATURES:
POST   /api/v1/pharmacy/inventory/upload  
GET    /api/v1/pharmacy/inventory/template  
GET    /api/v1/pharmacy/inventory/export  

Use Haversine for nearest pharmacy distance.  
Use CSV parse logic (CsvParser helper).  

-------------------------------------------
6) REPORTS
-------------------------------------------
Users:
POST   /api/v1/reports  
GET    /api/v1/reports/my-reports  

Admin:
GET    /api/v1/admin/reports  
GET    /api/v1/admin/reports/{id}  
PUT    /api/v1/admin/reports/{id}/status  
GET    /api/v1/admin/reports/statistics  

-------------------------------------------
7) PHARMACY DASHBOARD STATS
-------------------------------------------
GET /api/v1/pharmacy/dashboard/stats

Return:
- total medicines  
- total available items  
- low stock count  
- out-of-stock items  
- total reports received  
- average rating  

===================================================
 REQUIRED LAYERS TO GENERATE
===================================================
You MUST generate ALL of these with real code:

MODELS  
SERVICES  
REPOSITORIES  
CONTROLLERS  
REQUEST VALIDATION  
API RESOURCES  
MIDDLEWARE  
TRAITS (ApiResponse, HasRoles)  
UTILS (GeoLocationService, FileUploadHelper, CsvParser)  
ROUTES/api.php (versioned: /api/v1/)  
Kernel.php middleware registration  

===================================================
 TESTS (MANDATORY)
===================================================
Generate FULL PHPUnit tests:

Feature Tests:
- Auth
- Medicines
- Pharmacy
- Inventory
- Reports
- Admin approval

Unit Tests:
- Services (PharmacyService, AuthService, MedicineService…)
- Repositories  

===================================================
 ENV + COMPOSER REQUIREMENTS
===================================================
Generate:

- Full composer.json
- Full .env.example for PostgreSQL + JWT
- Instructions: migrate, seed, jwt:secret, server run

===================================================
 OUTPUT FORMAT
===================================================
You MUST output EVERYTHING:
1) Full project folder structure  
2) Full code for ALL FILES (NO SKIPPING)  
3) Full migrations + seeders (exact)  
4) Full controllers, services, repositories  
5) Full helpers + traits + middleware  
6) Full tests  
7) Full routes  
8) Full installation guide  
9) Full CURL examples  

DO NOT summarize.  
DO NOT skip code.  
Produce complete real-world working Laravel backend.

