# Pharmacy API Documentation

## Setup Instructions

Run the following commands to set up the application:

1. `composer install`
2. `php artisan key:generate`
3. `php artisan jwt:secret`
4. `php artisan migrate`
5. `php artisan db:seed`
6. `php artisan test`

---

## Public Routes

### 1. Register

**Endpoint:** `POST /api/v1/auth/register`

**Request Body:**
```json
{
  "name": "Test2 User",
  "email": "test2@example.com",
  "password": "password123",
  "phone": "123582",
  "password_confirmation": "password123",
  "role": "pharmacist"
}
```

**Response:**
```json
{
  "status": true,
  "message": "User registered successfully",
  "data": {
    "id": 6,
    "name": "Test User",
    "email": "test@example.com",
    "role": "pharmacist",
    "phone": "123582"
  },
  "errors": null
}
```

---

### 2. Login

**Endpoint:** `POST /api/v1/auth/login`

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Login successful",
  "data": {
    "access_token": "xxxx",
    "token_type": "bearer",
    "expires_in": 3600,
    "user": {
      "id": 4,
      "name": "Test User",
      "email": "test@example.com",
      "role": "user",
      "phone": null
    }
  },
  "errors": null
}
```

---

### 3. Pharmacies List

**Endpoint:** `GET /api/v1/pharmacies`

**Query Parameters (Optional):**
- `verified` - Values: `0` or `1`
- Example: `http://localhost:8000/api/v1/pharmacies?verified=1`

**Note:** Not verified includes pending, rejected, etc.

**Response:**
```json
{
  "status": true,
  "message": "Pharmacies list",
  "data": {
    "data": [],
    "path": "http://127.0.0.1:8000/api/v1/pharmacies",
    "per_page": 10,
    "to": 1,
    "total": 1
  },
  "errors": null
}
```

---

### 4. Top Rated Pharmacies

**Endpoint:** `GET /api/v1/pharmacies/top-rated`

**Response:**
```json
{
  "status": true,
  "message": "Top rated pharmacies",
  "data": [
    {
      "id": 1,
      "name": "Best Care Pharmacy",
      "address": "123 Health St, City",
      "phone": "555-0123",
      "verified": true,
      "license_number": "RX123456",
      "latitude": "40.7128000",
      "longitude": "-74.0060000",
      "verification_status": "verified",
      "rating": "4.50"
    }
  ],
  "errors": null
}
```

---

### 5. Get Pharmacy by ID

**Endpoint:** `GET /api/v1/pharmacies/{id}`

**Response:**
```json
{
  "status": true,
  "message": "Pharmacy details",
  "data": {
    "id": 1,
    "name": "Best Care Pharmacy",
    "address": "123 Health St, City",
    "phone": "555-0123",
    "verified": true,
    "license_number": "RX123456",
    "latitude": "40.7128000",
    "longitude": "-74.0060000",
    "verification_status": "verified",
    "rating": "4.50"
  },
  "errors": null
}
```

---

### 6. Search Medicines by Name

**Endpoint:** `GET /api/v1/medicines/search?name={med-name}`

**Response:**
```json
{
  "status": true,
  "message": "Search results",
  "data": [
    {
      "id": 96,
      "name": "Medicine 76",
      "generic_name": "Generic 76",
      "category": "General",
      "description": "Description for medicine 76",
      "pharmacies": []
    }
  ],
  "errors": null
}
```

---

### 7. Auto Complete

**Endpoint:** `GET /api/v1/medicines/autocomplete?query={med-name}`

**Query Parameters:**
- `query` - Example: `?query=par`

**Response:**
```json
{
  "status": true,
  "message": "Autocomplete results",
  "data": {
    "Analgesic": [
      {
        "name": "Paracetamol",
        "category": "Analgesic"
      }
    ]
  },
  "errors": null
}
```

---

### 8. Find Nearest Pharmacy With Medicine

**Endpoint:** `POST /api/v1/medicines/nearest`

**Query Parameters:**
- `name` (string) - Medicine name
- `lat` (numeric) - Latitude
- `lng` (numeric) - Longitude

**Example:** `http://localhost:8000/api/v1/medicines/nearest?name=Ibuprofen&lat=33.8547&lng=35.8623`

---

## Authenticated Routes

### 9. Logout

**Endpoint:** `POST /api/v1/auth/logout`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": true,
  "message": "Successfully logged out",
  "data": [],
  "errors": null
}
```

---

### 10. My Reports List

**Endpoint:** `GET /api/v1/reports/my-reports`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": true,
  "message": "My Reports",
  "data": {
    "data": [],
    "links": {
      "first": "http://127.0.0.1:8000/api/v1/reports/my-reports?page=1",
      "last": "http://127.0.0.1:8000/api/v1/reports/my-reports?page=1",
      "prev": null,
      "next": null
    },
    "meta": {
      "current_page": 1,
      "from": null,
      "last_page": 1,
      "path": "http://127.0.0.1:8000/api/v1/reports/my-reports",
      "per_page": 10,
      "to": null,
      "total": 0
    }
  },
  "errors": null
}
```

---

### 11. Refresh Token

**Endpoint:** `POST /api/v1/auth/refresh`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": true,
  "message": "Token refreshed",
  "data": {
    "access_token": "new_token",
    "token_type": "bearer",
    "expires_in": 3600
  },
  "errors": null
}
```

---

### 12. Get My Profile

**Endpoint:** `GET /api/v1/profile`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": true,
  "message": "User profile",
  "data": {
    "id": 4,
    "name": "Test User",
    "email": "test@example.com",
    "role": "user",
    "phone": null
  },
  "errors": null
}
```

---

### 13. Update Profile

**Endpoint:** `PUT/PATCH /api/v1/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "pharmacist 1"
}
```

**Note:** Only `name` and `phone` fields can be changed.

**Response:**
```json
{
  "status": true,
  "message": "Profile updated",
  "data": {
    "id": 6,
    "name": "pharmacist 1",
    "email": "test2@example.com",
    "role": "pharmacist",
    "phone": "123582"
  },
  "errors": null
}
```

---

### 14. Change Password

**Endpoint:** `PUT /api/v1/profile/password`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "old_password": "password123",
  "new_password": "password1234",
  "new_password_confirmation": "password1234"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## Pharmacist Routes

**Role Required:** `pharmacist`

### 15. Register Pharmacy

**Endpoint:** `POST /api/v1/pharmacy/register`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Pharma Plus",
  "phone": "78945612",
  "address": "Main Street",
  "latitude": 33.1234,
  "longitude": 35.7890,
  "license_number": "10"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Pharmacy registered successfully",
  "data": {
    "id": 3,
    "name": "Pharma Plus",
    "address": "Main Street",
    "phone": "78945612",
    "verified": null,
    "license_number": "10",
    "latitude": "33.1234000",
    "longitude": "35.7890000",
    "verification_status": "pending",
    "rating": null
  },
  "errors": null
}
```

---

### 16. My Pharmacy Profile

**Endpoint:** `GET /api/v1/pharmacy/profile`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": true,
  "message": "Pharmacy Profile",
  "data": {
    "id": 3,
    "name": "Pharma Plus",
    "address": "Main Street",
    "phone": "78945612",
    "verified": false,
    "license_number": "10",
    "latitude": "33.1234000",
    "longitude": "35.7890000",
    "verification_status": "pending",
    "rating": null
  },
  "errors": null
}
```

---

### 17. Update Pharmacy Profile

**Endpoint:** `PUT /api/v1/pharmacy/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Updated Pharmacy",
  "phone": "70000000"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Pharmacy Updated",
  "data": {
    "id": 3,
    "name": "Updated Pharmacy",
    "address": "seconde Street",
    "phone": "70000000",
    "verified": false,
    "license_number": "10",
    "latitude": "33.1234000",
    "longitude": "35.7890000",
    "verification_status": "pending",
    "rating": null
  },
  "errors": null
}
```

---

### 18. Pharmacy Dashboard Stats

**Endpoint:** `GET /api/v1/pharmacy/dashboard/stats`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": true,
  "message": "Dashboard Stats",
  "data": {
    "total_medicines": 2,
    "total_available": 2,
    "low_stock_count": 0,
    "out_of_stock": 0,
    "total_reports": 1,
    "average_rating": null
  },
  "errors": null
}
```

---

## Inventory Routes (Pharmacist)

### 19. Inventory List

**Endpoint:** `GET /api/v1/pharmacy/inventory`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": true,
  "message": "Inventory",
  "data": {
    "data": [],
    "links": {
      "first": "http://localhost:8000/api/v1/pharmacy/inventory?page=1",
      "last": "http://localhost:8000/api/v1/pharmacy/inventory?page=1",
      "prev": null,
      "next": null
    },
    "meta": {
      "current_page": 1,
      "from": null,
      "last_page": 1,
      "path": "http://localhost:8000/api/v1/pharmacy/inventory",
      "per_page": 10,
      "to": null,
      "total": 0
    }
  },
  "errors": null
}
```

---

### 20. Add Inventory Item

**Endpoint:** `POST /api/v1/pharmacy/inventory`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Ibuprofen",
  "quantity": 20,
  "price": 5.5,
  "expires_at": "2025-01-01"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Item added to inventory",
  "data": [],
  "errors": null
}
```

---

### 21. Update Inventory Item

**Endpoint:** `PUT /api/v1/pharmacy/inventory/{med-id}`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "quantity": 10
}
```

**Response:**
```json
{
  "status": true,
  "message": "Item updated",
  "data": [],
  "errors": null
}
```

---

### 22. Delete Inventory Item

**Endpoint:** `DELETE /api/v1/pharmacy/inventory/{id}`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": true,
  "message": "Item removed from inventory",
  "data": [],
  "errors": null
}
```

---

## Inventory CSV (Pharmacist Routes)

### 23. Upload Inventory CSV

**Endpoint:** `POST /api/v1/pharmacy/inventory/upload`

**Headers:** `Authorization: Bearer <token>`

**Request Body:** `form-data`
- Key: `file`
- Type: File (`.txt`, `.csv`)

**File Content Template:**
```
medicine_name,quantity,price
Paracetamol,100,20.50
Amoxicillin,50,15.00
Ibuprofen,75,12.25
```

**Response:**
```json
{
  "status": true,
  "message": "CSV Processed",
  "data": [],
  "errors": null
}
```

---

### 24. Get CSV Template

**Endpoint:** `GET /api/v1/pharmacy/inventory/template`

**Headers:** `Authorization: Bearer <token>`

**Response (raw):**
```
medicine_name,quantity,price
Panadol,100,20.50
```

---

### 25. Export Inventory CSV

**Endpoint:** `GET /api/v1/pharmacy/inventory/export`

**Headers:** `Authorization: Bearer <token>`

**Response (raw):**
```
medicine_name,quantity,price,available
Paracetamol,100,20.50,yes
Ibuprofen,75,12.25,yes
Amoxicillin,50,15.00,yes
Cetirizine,26,50.99,yes
Aspirin,71,28.99,yes
Metformin,97,15.99,yes
```

---

## Report Routes (User Role)

### 26. Create Report

**Endpoint:** `POST /api/v1/reports`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "pharmacy_id": 3,
  "report_type": "other",
  "reason": "This medicine looks suspicious"
}
```

**Accepted `report_type` values:**
- `wrong_availability`
- `wrong_location`
- `wrong_contact`
- `other`

**Response:**
```json
{
  "status": true,
  "message": "Report submitted",
  "data": {
    "id": 1,
    "reason": "This medicine looks suspicious",
    "report_type": "other",
    "status": null,
    "resolution_notes": null,
    "created_at": "2025-12-20T12:47:41.000000Z"
  },
  "errors": null
}
```

---

## Admin Routes

**Role Required:** `admin`

### 27. Get All Pharmacies (Admin View)

**Endpoint:** `GET /api/v1/admin/pharmacies`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": true,
  "message": "Admin Pharmacies list",
  "data": {
    "data": [],
    "links": {
      "first": "http://localhost:8000/api/v1/admin/pharmacies?page=1",
      "last": "http://localhost:8000/api/v1/admin/pharmacies?page=1",
      "prev": null,
      "next": null
    },
    "meta": {
      "current_page": 1,
      "from": 1,
      "last_page": 1,
      "path": "http://localhost:8000/api/v1/admin/pharmacies",
      "per_page": 10,
      "to": 3,
      "total": 3
    }
  },
  "errors": null
}
```

---

### 28. Get Pharmacy Details (Admin)

**Endpoint:** `GET /api/v1/admin/pharmacies/{id}`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": true,
  "message": "Pharmacy details",
  "data": {
    "id": 1,
    "name": "Best Care Pharmacy",
    "address": "123 Health St, City",
    "phone": "555-0123",
    "verified": true,
    "license_number": "RX123456",
    "latitude": "40.7128000",
    "longitude": "-74.0060000",
    "verification_status": "verified",
    "rating": "4.50"
  },
  "errors": null
}
```

---

### 29. Approve Pharmacy

**Endpoint:** `PUT /api/v1/admin/pharmacies/{id}/approve`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": true,
  "message": "Pharmacy Approved",
  "data": {
    "id": 1,
    "name": "Best Care Pharmacy",
    "address": "123 Health St, City",
    "phone": "555-0123",
    "verified": true,
    "license_number": "RX123456",
    "latitude": "40.7128000",
    "longitude": "-74.0060000",
    "verification_status": "verified",
    "rating": "4.50"
  },
  "errors": null
}
```

---

### 30. Reject Pharmacy

**Endpoint:** `PUT /api/v1/admin/pharmacies/{id}/reject`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "reason": "Invalid license documents"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Pharmacy Rejected",
  "data": {
    "id": 2,
    "name": "New Life Pharmacy",
    "address": "456 Wellness Blvd",
    "phone": "555-0987",
    "verified": false,
    "license_number": "RX987654",
    "latitude": "40.7300000",
    "longitude": "-73.9900000",
    "verification_status": "rejected",
    "rejection_reason": "Invalid license documents",
    "rating": null
  },
  "errors": null
}
```

---

### 31. Get All Reports (Admin)

**Endpoint:** `GET /api/v1/admin/reports`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters (Optional):**
- `status` - Example: `pending`
- `pharmacy_id` - Example: `3`

**Response:**
```json
{
  "status": true,
  "message": "All Reports",
  "data": {
    "data": [],
    "links": {
      "first": "http://127.0.0.1:8000/api/v1/admin/reports?page=1",
      "last": "http://127.0.0.1:8000/api/v1/admin/reports?page=1",
      "prev": null,
      "next": null
    },
    "meta": {
      "current_page": 1,
      "from": null,
      "last_page": 1,
      "path": "http://127.0.0.1:8000/api/v1/admin/reports",
      "per_page": 10,
      "to": null,
      "total": 0
    }
  },
  "errors": null
}
```

---

### 32. Get Report Details (Admin)

**Endpoint:** `GET /api/v1/admin/reports/{id}`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": true,
  "message": "Report details",
  "data": {
    "id": 1,
    "reason": "This medicine looks suspicious",
    "report_type": "other",
    "status": "pending",
    "resolution_notes": null,
    "created_at": "2025-12-20T12:47:41.000000Z"
  },
  "errors": null
}
```

---

### 33. Update Report Status

**Endpoint:** `PUT /api/v1/admin/reports/{id}/status`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "resolved"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Report status updated",
  "data": {
    "id": 1,
    "reason": "This medicine looks suspicious",
    "report_type": "other",
    "status": "resolved",
    "resolution_notes": null,
    "created_at": "2025-12-20T12:47:41.000000Z"
  },
  "errors": null
}
```

---

### 34. Reports Statistics

**Endpoint:** `GET /api/v1/admin/reports/statistics`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": true,
  "message": "Report Statistics",
  "data": {
    "total": 1,
    "pending": 0,
    "resolved": 1
  },
  "errors": null
}
```

---

## Pharmacy Document Routes

### 35. Add Document (Pharmacist)

**Endpoint:** `POST /api/v1/pharmacy/documents`

**Headers:** `Authorization: Bearer <token>`

**Request Body:** `form-data`

| Key      | Type | Value Example  |
|----------|------|----------------|
| doc_type | Text | license        |
| file     | File | license.pdf    |

**Accepted `doc_type` values:**
- `license`
- `registration`
- `id_proof`
- `other`

**Response:**
```json
{
  "status": true,
  "message": "Document uploaded",
  "data": {
    "file_path": "documents/1/Z6YxWxDh81Pc3tArgpK4HXs2hKXGrcCpffvDeV5N.jpg",
    "doc_type": "id_proof",
    "pharmacy_id": 1,
    "updated_at": "2025-12-20T18:55:06.000000Z",
    "created_at": "2025-12-20T18:55:06.000000Z",
    "id": 1
  },
  "errors": null
}
```

---

### 36. Show Documents (Admin)

**Endpoint:** `GET /api/v1/admin/pharmacies/{id}/documents`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": true,
  "message": "Pharmacy Documents",
  "data": [
    {
      "id": 1,
      "pharmacy_id": 1,
      "file_path": "documents/1/Z6YxWxDh81Pc3tArgpK4HXs2hKXGrcCpffvDeV5N.jpg",
      "doc_type": "id_proof",
      "created_at": "2025-12-20T18:55:06.000000Z",
      "updated_at": "2025-12-20T18:55:06.000000Z"
    }
  ],
  "errors": null
}
```

---

### 37. Get All Documents (Admin)

**Endpoint:** `GET /api/v1/admin/documents`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": true,
  "message": "All Pharmacy Documents",
  "data": [
    {
      "id": 1,
      "pharmacy_id": 1,
      "file_path": "documents/1/Z6YxWxDh81Pc3tArgpK4HXs2hKXGrcCpffvDeV5N.jpg",
      "doc_type": "id_proof",
      "created_at": "2025-12-20T18:55:06.000000Z",
      "updated_at": "2025-12-20T18:55:06.000000Z",
      "pharmacy": {
        "id": 1,
        "name": "Best Care Pharmacy",
        "license_number": "RX123456"
      }
    }
  ],
  "errors": null
}
```

---

### 38. Get My Documents (Pharmacist)

**Endpoint:** `GET /api/v1/pharmacy/documents`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": true,
  "message": "My Documents",
  "data": [],
  "errors": null
}
```

---

### 39. Update Document (Pharmacist)

**Endpoint:** `POST /api/v1/pharmacy/documents/{id}`

**Headers:** `Authorization: Bearer <token>`

**Request Body:** `form-data`

| Key      | Type | Value Example  |
|----------|------|----------------|
| doc_type | Text | license        |
| file     | File | license.pdf    |

**Accepted `doc_type` values:**
- `license`
- `registration`
- `id_proof`
- `other`

**Response:**
```json
{
  "status": true,
  "message": "Document updated",
  "data": {
    "id": 1,
    "pharmacy_id": 1,
    "file_path": "documents/1/vHx96pqa4inPKAGOPHw2wa5VbwF2q4tQTQe3HCgG.png",
    "doc_type": "registration",
    "created_at": "2025-12-20T18:55:06.000000Z",
    "updated_at": "2025-12-20T20:02:00.000000Z"
  },
  "errors": null
}
```

---

### 40. Document Details (Pharmacist)

**Endpoint:** `GET /api/v1/pharmacy/documents/{id}`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": true,
  "message": "Document details",
  "data": {
    "id": 1,
    "pharmacy_id": 1,
    "file_path": "documents/1/RjuIxfuV0RIj0mqPMdOQpstx1EJMkM9wixfM6Q1q.png",
    "doc_type": "registration",
    "created_at": "2025-12-20T18:55:06.000000Z",
    "updated_at": "2025-12-20T21:15:11.000000Z"
  },
  "errors": null
}
```

---

### 41. Delete Document (Pharmacist)

**Endpoint:** `DELETE /api/v1/pharmacy/documents/{id}`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": true,
  "message": "Document deleted",
  "data": [],
  "errors": null
}
```