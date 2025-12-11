# API Testing Guide

Base URL: `http://localhost:8000/api/v1`

## Authentication

### 1. Register User

**POST** `/auth/register`

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password",
    "role": "user"
  }'
```

_Roles: `user`, `pharmacist`_

### 2. Login

**POST** `/auth/login`

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password"
  }'
```

**Response:** Save the `access_token` for subsequent requests.

### 3. Get User Profile (Protected)

**GET** `/profile`

```bash
curl http://localhost:8000/api/v1/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Logout

**POST** `/auth/logout`

```bash
curl -X POST http://localhost:8000/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Medicines (Public)

### 5. Search Medicines

**GET** `/medicines/search?name={name}`

```bash
curl "http://localhost:8000/api/v1/medicines/search?name=Para"
```

### 6. Autocomplete

**GET** `/medicines/autocomplete?query={query}`

```bash
curl "http://localhost:8000/api/v1/medicines/autocomplete?query=Asp"
```

### 7. Nearest Pharmacy with Medicine

**GET** `/medicines/nearest`

```bash
curl "http://localhost:8000/api/v1/medicines/nearest?name=Paracetamol&lat=40.7128&lng=-74.0060"
```

---

## Pharmacies (Public)

### 8. List Pharmacies

**GET** `/pharmacies`

```bash
curl http://localhost:8000/api/v1/pharmacies
```

### 9. Top Rated Pharmacies

**GET** `/pharmacies/top-rated`

```bash
curl http://localhost:8000/api/v1/pharmacies/top-rated
```

### 10. Pharmacy Details

**GET** `/pharmacies/{id}`

```bash
curl http://localhost:8000/api/v1/pharmacies/1
```

---

## Pharmacist Features (Requires Pharmacist Token)

### 11. Register Pharmacy

**POST** `/pharmacy/register`

```bash
curl -X POST http://localhost:8000/api/v1/pharmacy/register \
  -H "Authorization: Bearer PHARMACIST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My New Pharmacy",
    "address": "123 Market St",
    "license_number": "LIC-999",
    "latitude": 40.75,
    "longitude": -73.98
  }'
```

### 12. Get Pharmacy Inventory

**GET** `/pharmacy/inventory`

```bash
curl http://localhost:8000/api/v1/pharmacy/inventory \
  -H "Authorization: Bearer PHARMACIST_TOKEN"
```

### 13. Add Item to Inventory

**POST** `/pharmacy/inventory`

```bash
curl -X POST http://localhost:8000/api/v1/pharmacy/inventory \
  -H "Authorization: Bearer PHARMACIST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "medicine_id": 1,
    "quantity": 50,
    "price": 12.50
  }'
```

---

## Reports (User)

### 14. Create Report

**POST** `/reports`

```bash
curl -X POST http://localhost:8000/api/v1/reports \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pharmacy_id": 1,
    "report_type": "wrong_availability",
    "reason": "Item was out of stock despite showing available"
  }'
```

---

## Admin Features (Requires Admin Token)

### 15. List All Pharmacies (Admin)

**GET** `/admin/pharmacies`

```bash
curl http://localhost:8000/api/v1/admin/pharmacies \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 16. Approve Pharmacy

**PUT** `/admin/pharmacies/{id}/approve`

```bash
curl -X PUT http://localhost:8000/api/v1/admin/pharmacies/2/approve \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### 17. Report Statistics

**GET** `/admin/reports/statistics`

```bash
curl http://localhost:8000/api/v1/admin/reports/statistics \
  -H "Authorization: Bearer ADMIN_TOKEN"
```
