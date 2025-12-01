# Pharmy - Product Requirements Document (PRD)

**Version:** 1.1  
**Date:** November 30, 2025  
**Owner:** Product Team  
**Status:** Draft

---

## Document Overview

### Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-30 | Product Team | Initial PRD creation |
| 1.1 | 2025-11-30 | Product Team | Updated MVP scope: Moved email verification and password recovery to Post-MVP; Updated timeline to 5-week sprint plan (34 days) to align with Jira implementation |

### Stakeholders

- **Product Owner:** TechTalks Internships Team
- **Development:** Frontend (Next.js), Backend (Laravel), Database (PostgreSQL)
- **Design:** UX/UI Design Team
- **End Users:** Patients, Pharmacies, System Administrators

---

## Executive Summary

Pharmy is a **map-based medicine availability platform** designed to solve the critical problem of medicine shortages in Lebanon by connecting patients with nearby pharmacies that have their needed medications in stock. The platform is fundamentally a **map application** with integrated search, inventory management, and verification features—not simply a search tool with map integration.

The MVP focuses on real-time medicine availability through an interactive map interface, multi-role authentication (patients, pharmacies, administrators), pharmacy verification system, and credibility tracking to ensure data trustworthiness.

**Key Differentiator:** Unlike traditional pharmacy locators, Pharmy is map-first, displaying real-time medicine availability geographically, enabling patients to visually identify the nearest pharmacy with their required medication in stock.

---

## 1. Problem Statement

### The Problem

Lebanon faces a severe medicine shortage crisis affecting patients' ability to access essential medications. Current challenges include:

- **Medicine Unavailability:** Patients cannot easily find pharmacies that have specific medicines in stock
- **Time Waste:** Patients must physically visit multiple pharmacies or make numerous phone calls
- **Outdated Information:** No centralized, real-time system for medicine availability
- **Lack of Trust:** Patients cannot verify if pharmacy information is accurate or current
- **Geographic Inefficiency:** No visual map tool to identify nearest available pharmacy

### User Pain Points

**Patients:**
- Spend hours searching for critical medicines
- Waste transportation costs visiting pharmacies without stock
- Cannot compare availability across multiple locations
- Lack trust in outdated online information

**Pharmacies:**
- Receive excessive phone calls for stock inquiries
- Lose potential customers due to visibility issues
- Lack simple tools to update availability
- Face credibility issues from unverified competitors

**Healthcare System:**
- No data visibility into medicine shortage patterns
- Cannot track distribution inefficiencies
- No mechanism to verify legitimate pharmacies

---

## 2. Vision & Strategic Goals

### Product Vision

To become Lebanon's primary map-based platform for real-time medicine discovery, connecting patients with verified pharmacies through an interactive, trustworthy, and user-friendly interface that eliminates the medicine search burden.

### Strategic Goals

1. **Accessibility:** Enable any patient to find medicine availability within 3 seconds via map visualization
2. **Credibility:** Establish trust through pharmacy verification badges and timestamped updates
3. **Efficiency:** Reduce pharmacy call volume by 60% through accurate availability data
4. **Scalability:** Support expansion to cover all Lebanese governorates with 500+ verified pharmacies
5. **Data Insights:** Provide administrators with shortage analytics for healthcare planning

---

## 3. Target Audience & User Personas

### Primary Users

#### 1. Patients (End Users)
**Demographics:**
- Age: 18-65+
- Location: Urban and suburban Lebanon
- Tech Proficiency: Basic to intermediate smartphone users

**Needs:**
- Quickly find nearby pharmacies with specific medicines
- View availability status visually on a map
- Get directions to nearest pharmacy
- Report inaccurate information
- Save favorite pharmacies for repeat visits

**Behaviors:**
- Mobile-first users (70% mobile, 30% desktop)
- Search during urgent medical needs
- Value visual/geographic information over text lists
- Trust verified sources over unverified data

---

#### 2. Pharmacies (Stock Managers)
**Demographics:**
- Licensed pharmacies in Lebanon
- Range: Small independent to large chains
- Staff: Pharmacists and pharmacy assistants

**Needs:**
- Simple dashboard to manage medicine inventory
- Quick toggle for availability (Available/Not Available)
- Bulk upload capability for PMS integration
- Verification badge for credibility
- View submitted reports about their pharmacy

**Behaviors:**
- Limited time for complex systems
- Update stocks 1-3 times per day
- Prefer mobile-friendly interfaces for quick updates
- Value credibility indicators to attract customers

**Constraints:**
- Focus on 20-30 shortage-prone medicines (not full inventory)
- May use Pharmacy Management Systems (PMS) requiring CSV export compatibility

---

#### 3. Administrators (System Managers)
**Demographics:**
- Platform moderators
- Healthcare regulatory personnel
- Technical support staff

**Needs:**
- Verify pharmacy license legitimacy
- Review and approve pharmacy registrations
- Manage user-submitted reports
- Access system analytics and shortage patterns
- Monitor platform credibility

**Behaviors:**
- Desktop-first users
- Review applications daily
- Cross-reference with MOPH/OPL databases
- Prioritize data integrity and compliance

---

### Secondary Users

- **Future Mobile App Users:** Patients requiring offline access
- **Healthcare Authorities:** Data consumers for policy decisions
- **Medicine Distributors:** Potential partners for restocking insights

---

## 4. Product Scope

### In Scope (MVP Features)

#### Core Map Experience
- ✅ Interactive map interface (Google Maps/Mapbox)
- ✅ Pharmacy location markers with availability indicators
- ✅ Real-time GPS location detection
- ✅ Distance calculation from user to pharmacies
- ✅ Map-based medicine search results visualization
- ✅ Pharmacy clustering for dense areas
- ✅ Directions integration to pharmacy locations

#### Medicine Search & Discovery
- ✅ Medicine name search with autocomplete
- ✅ Real-time search results displayed on map
- ✅ Availability status (Available/Not Available)
- ✅ Official medicine database (20-30 critical medicines)
- ✅ Medicine categorization by type
- ✅ Generic name mapping

#### Multi-Role Authentication
- ✅ Patient registration and login
- ✅ Pharmacy registration with document upload
- ✅ Administrator login system
- ✅ Role-based access control (RBAC)
- ✅ JWT token-based authentication (Laravel Sanctum)

#### Pharmacy Management Dashboard
- ✅ Manual stock updates (toggle Available/Not Available)
- ✅ CSV/Excel bulk upload for inventory
- ✅ Medicine list management (20-30 medicines)
- ✅ Pharmacy profile editing
- ✅ License document management
- ✅ View received reports

#### Admin Verification System
- ✅ Pharmacy registration approval queue
- ✅ License verification workflow
- ✅ Document review interface
- ✅ Approval/rejection with reason notes
- ✅ Verified badge assignment
- ✅ Account status management (active/suspended/flagged)

#### Reporting System
- ✅ User report submission (wrong availability, location, contact)
- ✅ Report categorization by type
- ✅ Admin report review dashboard
- ✅ Report status tracking (pending/resolved/dismissed)
- ✅ Resolution notes logging

#### Credibility Features
- ✅ Timestamp tracking for all updates
- ✅ Verification badges for approved pharmacies
- ✅ Update history logging
- ✅ Trust indicators display

---

### Out of Scope (Post-MVP)

#### Not Included in MVP
- ❌ Email verification (simple registration only for MVP)
- ❌ Password recovery/reset functionality
- ❌ Barcode scanning for medicine lookup
- ❌ Medicine price comparison
- ❌ Alternative medicine recommendations
- ❌ AI-powered shortage predictions
- ❌ Advanced analytics dashboards
- ❌ Native mobile applications (iOS/Android)
- ❌ In-app pharmacy ratings/reviews
- ❌ Medicine reservation/booking system
- ❌ Push notifications for availability
- ❌ Multi-language support (Arabic/French)
- ❌ Pharmacy-to-pharmacy medicine transfer
- ❌ Integration with health insurance systems
- ❌ Prescription upload and validation
- ❌ Medicine interaction warnings
- ❌ Patient medication history tracking

---

## 5. User Stories & Use Cases

### Patient User Stories

**US-P1: Basic Medicine Search**
> As a patient,  
> I want to search for a medicine by name,  
> So that I can find nearby pharmacies that have it in stock.

**Acceptance Criteria:**
- Search autocomplete appears within 1 second
- Results display on map with availability markers
- Distance from current location shown
- Minimum 3-character search trigger

---

**US-P2: Map-Based Pharmacy Discovery**
> As a patient,  
> I want to view all pharmacies on a map,  
> So that I can visually identify the closest pharmacy with my medicine.

**Acceptance Criteria:**
- Map loads within 2 seconds
- Pharmacy markers indicate availability (green=available, red=not available)
- Tap marker to view pharmacy details
- Get directions button functional

---

**US-P3: Report Inaccurate Information**
> As a patient,  
> I want to report incorrect pharmacy information,  
> So that the platform maintains accurate data.

**Acceptance Criteria:**
- Report form accessible from pharmacy detail view
- Multiple report types available (availability, location, contact)
- Confirmation message after submission
- Report tracked by status

---

**US-P4: Save Favorite Pharmacies**
> As a patient,  
> I want to save my preferred pharmacies,  
> So that I can quickly check their stock in the future.

**Acceptance Criteria:**
- "Add to Favorites" button on pharmacy profiles
- Favorites accessible from patient dashboard
- Quick availability check from favorites list

---

### Pharmacy User Stories

**US-PH1: Quick Stock Update**
> As a pharmacy staff member,  
> I want to toggle medicine availability with one click,  
> So that I can update stock quickly during busy hours.

**Acceptance Criteria:**
- Toggle switch for each medicine
- Immediate update reflection (< 1 second)
- Timestamp automatically recorded
- Mobile-friendly interface

---

**US-PH2: Bulk Inventory Upload**
> As a pharmacy manager,  
> I want to upload inventory via CSV file,  
> So that I can sync data from my Pharmacy Management System.

**Acceptance Criteria:**
- CSV template provided for download
- Upload validation with error messages
- Preview changes before confirming
- Support Excel (.xlsx) and CSV (.csv) formats

---

**US-PH3: Registration with Verification**
> As a new pharmacy,  
> I want to register and upload my license documents,  
> So that I can get verified and listed on the platform.

**Acceptance Criteria:**
- Multi-step registration form
- Document upload (PDF, JPG, PNG)
- Application status tracking
- Email notification upon approval/rejection

---

**US-PH4: View Credibility Indicators**
> As a pharmacy owner,  
> I want to display my verification badge,  
> So that patients trust my availability data.

**Acceptance Criteria:**
- Verified badge visible on map markers
- Badge shown on pharmacy profile page
- Timestamp of last update displayed

---

### Administrator User Stories

**US-A1: Pharmacy Verification Workflow**
> As an administrator,  
> I want to review pharmacy applications,  
> So that only legitimate pharmacies are verified.

**Acceptance Criteria:**
- Pending queue with application count
- Document viewer within the dashboard
- License number validation against MOPH/OPL records
- Approve/reject with mandatory reason notes
- Email notification sent to pharmacy

---

**US-A2: Report Management**
> As an administrator,  
> I want to review user-submitted reports,  
> So that I can maintain data accuracy.

**Acceptance Criteria:**
- Report dashboard with filter by status/type
- Pharmacy contact information for follow-up
- Resolve/dismiss with notes
- Report history tracking

---

**US-A3: Account Moderation**
> As an administrator,  
> I want to suspend or flag pharmacy accounts,  
> So that I can prevent abuse or misinformation.

**Acceptance Criteria:**
- Account status update (active/suspended/flagged)
- Reason logging for moderation actions
- Suspension removes pharmacy from public map
- Reactivation workflow

---

## 6. Functional Requirements

### 6.1 Map & Location Services

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-MAP-001 | Integrate Google Maps or Mapbox API | Critical | Required |
| FR-MAP-002 | Display pharmacy markers with custom icons | Critical | Required |
| FR-MAP-003 | Color-code markers by availability (green/red/grey) | Critical | Required |
| FR-MAP-004 | Detect user's current GPS location | Critical | Required |
| FR-MAP-005 | Calculate distance from user to pharmacies | High | Required |
| FR-MAP-006 | Cluster pharmacy markers in dense areas | High | Required |
| FR-MAP-007 | Provide "Get Directions" functionality | High | Required |
| FR-MAP-008 | Support map zoom and pan controls | Medium | Required |
| FR-MAP-009 | Filter pharmacies by availability on map | Medium | Future |

---

### 6.2 Medicine Search

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-SRCH-001 | Real-time search with autocomplete | Critical | Required |
| FR-SRCH-002 | Search triggers after 3 characters | High | Required |
| FR-SRCH-003 | Display results on map with markers | Critical | Required |
| FR-SRCH-004 | Show pharmacy name, address, distance | Critical | Required |
| FR-SRCH-005 | Support generic name search | High | Required |
| FR-SRCH-006 | Medicine categorization filtering | Medium | Future |
| FR-SRCH-007 | Search history for logged-in users | Low | Future |

---

### 6.3 Authentication & Authorization

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-AUTH-001 | Multi-role registration (patient/pharmacy) | Critical | Required |
| FR-AUTH-002 | Email and password login | Critical | Required |
| FR-AUTH-003 | Email verification via link | Medium | Post-MVP |
| FR-AUTH-004 | Password recovery flow | Medium | Post-MVP |
| FR-AUTH-005 | JWT token-based authentication | Critical | Required |
| FR-AUTH-006 | Role-based access control (RBAC) | Critical | Required |
| FR-AUTH-007 | Session timeout after 7 days | Medium | Required |
| FR-AUTH-008 | Two-factor authentication (2FA) | Low | Future |

---

### 6.4 Pharmacy Management

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-PHRM-001 | Dashboard with inventory overview | Critical | Required |
| FR-PHRM-002 | Toggle medicine availability (Available/Not Available) | Critical | Required |
| FR-PHRM-003 | CSV/Excel bulk upload | High | Required |
| FR-PHRM-004 | Edit pharmacy profile (address, phone, hours) | High | Required |
| FR-PHRM-005 | Upload verification documents | Critical | Required |
| FR-PHRM-006 | View received reports | High | Required |
| FR-PHRM-007 | Update history log | Medium | Required |
| FR-PHRM-008 | Medicine stock quantity tracking | Low | Future |

---

### 6.5 Admin Verification System

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-ADMN-001 | Pharmacy approval queue | Critical | Required |
| FR-ADMN-002 | Document viewer and download | Critical | Required |
| FR-ADMN-003 | License number validation | Critical | Required |
| FR-ADMN-004 | Approve pharmacy with verification badge | Critical | Required |
| FR-ADMN-005 | Reject pharmacy with reason notes | Critical | Required |
| FR-ADMN-006 | Email notification on approval/rejection | High | Required |
| FR-ADMN-007 | Account status management | High | Required |
| FR-ADMN-008 | Report management dashboard | High | Required |
| FR-ADMN-009 | System analytics dashboard | Medium | Future |

---

### 6.6 Reporting System

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-RPRT-001 | User report submission form | High | Required |
| FR-RPRT-002 | Report type selection (availability, location, contact, other) | High | Required |
| FR-RPRT-003 | Report status tracking | High | Required |
| FR-RPRT-004 | Admin report resolution workflow | High | Required |
| FR-RPRT-005 | Resolution notes logging | Medium | Required |
| FR-RPRT-006 | Report history for pharmacies | Medium | Required |

---

## 7. Non-Functional Requirements

### 7.1 Performance

| ID | Requirement | Target | Priority |
|----|-------------|--------|----------|
| NFR-PERF-001 | Map load time | < 2 seconds | Critical |
| NFR-PERF-002 | Search results display | < 3 seconds | Critical |
| NFR-PERF-003 | Dashboard page load | < 2 seconds | High |
| NFR-PERF-004 | Stock update response | < 1 second | Critical |
| NFR-PERF-005 | API response time | < 500ms (avg) | High |
| NFR-PERF-006 | Concurrent user support | 1,000+ users | High |
| NFR-PERF-007 | Database query optimization | < 100ms | Medium |

---

### 7.2 Security

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-SEC-001 | HTTPS encryption for all communications | Critical |
| NFR-SEC-002 | Password hashing (bcrypt) | Critical |
| NFR-SEC-003 | SQL injection prevention (prepared statements) | Critical |
| NFR-SEC-004 | XSS protection (input sanitization) | Critical |
| NFR-SEC-005 | CSRF token protection for mutations | Critical |
| NFR-SEC-006 | File upload validation (type, size, content) | Critical |
| NFR-SEC-007 | Rate limiting on authentication endpoints | High |
| NFR-SEC-008 | RBAC enforcement on all protected routes | Critical |
| NFR-SEC-009 | GDPR compliance for user data | Medium |

---

### 7.3 Reliability & Availability

| ID | Requirement | Target | Priority |
|----|-------------|--------|----------|
| NFR-REL-001 | System uptime | 99% | Critical |
| NFR-REL-002 | Automated database backups | Daily | Critical |
| NFR-REL-003 | Error logging and monitoring | Real-time | High |
| NFR-REL-004 | Graceful degradation on API failure | - | High |
| NFR-REL-005 | Disaster recovery plan | < 24hr recovery | Medium |

---

### 7.4 Usability

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-USE-001 | Responsive design (mobile, tablet, desktop) | Critical |
| NFR-USE-002 | Mobile-first interface design | Critical |
| NFR-USE-003 | Accessibility compliance (WCAG 2.1 AA) | High |
| NFR-USE-004 | Intuitive navigation (< 3 clicks to any feature) | High |
| NFR-USE-005 | Clear error messages and validation feedback | High |
| NFR-USE-006 | Loading states and progress indicators | Medium |

---

### 7.5 Scalability

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-SCAL-001 | Support for 500+ pharmacies at launch | High |
| NFR-SCAL-002 | Horizontal scaling capability | Medium |
| NFR-SCAL-003 | Database partitioning readiness | Low |
| NFR-SCAL-004 | CDN for static assets | Medium |

---

## 8. Technical Architecture

### 8.1 Technology Stack

**Frontend:**
- **Framework:** Next.js 16+ with App Router
- **Language:** TypeScript 5.1+
- **Bundler:** Turbopack
- **UI Library:** React 19 + shadcn/ui
- **Styling:** Tailwind CSS + CSS Modules
- **State Management:** Zustand / Context API
- **Data Fetching:** React Query (TanStack Query) + Fetch API
- **Maps:** Google Maps API / Mapbox GL JS
- **Form Handling:** React Hook Form + Zod validation
- **Package Manager:** pnpm

**Backend:**
- **Framework:** Laravel 11+
- **Authentication:** Laravel Sanctum (JWT tokens)
- **Database:** PostgreSQL 15+ with PostGIS extension
- **File Storage:** Local storage / AWS S3 (future)
- **API Architecture:** RESTful API

**DevOps & Tools:**
- **Version Control:** Git + GitHub
- **Project Management:** Jira
- **API Testing:** Postman
- **Testing:** Vitest (unit) + Playwright (E2E)
- **CI/CD:** GitHub Actions (future)
- **Hosting:** TBD (Vercel for frontend, DigitalOcean/AWS for backend)

---

### 8.2 System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     Client Layer                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│  │  Patient   │  │  Pharmacy  │  │   Admin    │         │
│  │  Web App   │  │  Web App   │  │  Web App   │         │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘         │
│         │                │                │               │
└─────────┼────────────────┼────────────────┼───────────────┘
          │                │                │
          │    HTTPS/JSON API Calls         │
          │                │                │
┌─────────▼────────────────▼────────────────▼───────────────┐
│              Next.js Frontend (Port 3000)                  │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  App Router (Route Groups by Role)                   │ │
│  │  - (public): Home, Search, Map                       │ │
│  │  - (auth): Login, Register, Verify                   │ │
│  │  - (patient): Dashboard, Reports, Favorites          │ │
│  │  - (pharmacy): Inventory, Documents, Dashboard       │ │
│  │  - (admin): Verification, Reports, Analytics         │ │
│  └──────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  API Route Handlers (Proxy to Laravel)               │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────┬───────────────────────────────────┘
                         │
                         │  REST API Calls
                         │
┌────────────────────────▼───────────────────────────────────┐
│              Laravel Backend (Port 8000)                   │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  API Controllers                                      │ │
│  │  - AuthController (Login, Register, Verify)          │ │
│  │  - MedicineController (Search, List, CRUD)           │ │
│  │  - PharmacyController (CRUD, Nearby Search)          │ │
│  │  - InventoryController (Update, Bulk Upload)         │ │
│  │  - ReportController (Submit, Review, Resolve)        │ │
│  │  - VerificationController (Approve, Reject)          │ │
│  └──────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Middleware (Auth, RBAC, Rate Limiting)              │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────┬───────────────────────────────────┘
                         │
                         │  SQL Queries (PostGIS)
                         │
┌────────────────────────▼───────────────────────────────────┐
│              PostgreSQL + PostGIS Database                 │
│  - users                                                   │
│  - pharmacies (with geometry column for location)          │
│  - medicines                                               │
│  - pharmacy_medicines (inventory)                          │
│  - pharmacy_documents                                      │
│  - pharmacy_reports                                        │
└────────────────────────────────────────────────────────────┘

External Services:
┌─────────────────┐
│  Google Maps /  │────► Map rendering, geocoding
│  Mapbox API     │      directions, distance matrix
└─────────────────┘
```

---

### 8.3 Database Schema

**See full schema in:** [db-v2.sql](file:///media/al_hazzouri/New%20Volume/Backup/Projects/Nextjs%20Projects/TechTalks%20Internships/Pharmy/prompts/db-v2.sql)

**Key Tables:**

1. **users**
   - Multi-role accounts (patient, pharmacist, admin)
   - Fields: id, name, email, password, role, phone, timestamps

2. **pharmacies**
   - Pharmacy information with geolocation
   - Fields: id, pharmacist_id, name, address, location (PostGIS geometry), phone, license_number, verification_status, rating, account_status, timestamps

3. **medicines**
   - Official medicine catalog
   - Fields: id, name, generic_name, category, description, created_at

4. **pharmacy_medicines**
   - Many-to-many inventory relationship
   - Fields: pharmacy_id, medicine_id, quantity, price, available

5. **pharmacy_documents**
   - License and verification documents
   - Fields: id, pharmacy_id, file_path, doc_type, created_at

6. **pharmacy_reports**
   - User-submitted reports
   - Fields: id, pharmacy_id, user_id, reason, report_type, report_status, resolution_notes, timestamps

**Custom Enum Types:**
- `verification_status`: pending, verified, rejected
- `account_status`: active, suspended, flagged
- `report_status`: pending, resolved, dismissed
- `report_type`: wrong_availability, wrong_location, wrong_contact, other

---

### 8.4 API Endpoints

#### Authentication
```
POST   /api/auth/register        - User/pharmacy registration
POST   /api/auth/login           - Login (returns JWT token)
POST   /api/auth/verify-email    - Email verification
POST   /api/auth/forgot-password - Password recovery
POST   /api/auth/reset-password  - Password reset
GET    /api/auth/user            - Get current user
POST   /api/auth/logout          - Logout
```

#### Medicines
```
GET    /api/medicines                    - List all medicines
GET    /api/medicines/search?q={query}   - Search with autocomplete
GET    /api/medicines/{id}               - Get medicine details
POST   /api/medicines                    - Create medicine (admin)
PUT    /api/medicines/{id}               - Update medicine (admin)
DELETE /api/medicines/{id}               - Delete medicine (admin)
```

#### Pharmacies
```
GET    /api/pharmacies                              - List all pharmacies
GET    /api/pharmacies/nearby?lat={lat}&lng={lng}   - Nearby pharmacies
GET    /api/pharmacies/{id}                         - Pharmacy details
POST   /api/pharmacies                              - Register pharmacy
PUT    /api/pharmacies/{id}                         - Update pharmacy
DELETE /api/pharmacies/{id}                         - Delete pharmacy (admin)
```

#### Inventory
```
GET    /api/pharmacies/{id}/inventory                - Get pharmacy inventory
PUT    /api/pharmacies/{id}/inventory/{medicine_id}  - Update single medicine
POST   /api/pharmacies/{id}/inventory/bulk-upload    - CSV bulk upload
GET    /api/pharmacies/{id}/inventory/history        - Update history
```

#### Reports
```
GET    /api/reports                  - List all reports (admin)
GET    /api/reports/{id}             - Report details
POST   /api/reports                  - Submit report
PUT    /api/reports/{id}/resolve     - Resolve report (admin)
PUT    /api/reports/{id}/dismiss     - Dismiss report (admin)
```

#### Verification
```
GET    /api/admin/pharmacies/pending    - Pending verification queue
PUT    /api/admin/pharmacies/{id}/approve - Approve pharmacy
PUT    /api/admin/pharmacies/{id}/reject  - Reject pharmacy
GET    /api/admin/pharmacies/{id}/documents - Get documents
```

#### File Upload
```
POST   /api/upload/document         - Upload verification document
POST   /api/upload/pharmacy-image   - Upload pharmacy photo
```

---

### 8.5 Data Flow Examples

#### Medicine Search Flow
```
1. User enters "Panadol" in search box
2. Frontend debounces input (300ms) and calls GET /api/medicines/search?q=Panadol
3. Laravel queries medicines table with LIKE/ILIKE
4. Returns matching medicines with available pharmacies
5. Frontend displays results on map with pharmacy markers
6. User clicks marker to see pharmacy details
7. User clicks "Get Directions" to open Google Maps
```

#### Stock Update Flow
```
1. Pharmacy logs in to dashboard
2. Views inventory list (GET /api/pharmacies/{id}/inventory)
3. Toggles "Available" for "Panadol"
4. Frontend sends PUT /api/pharmacies/{id}/inventory/{medicine_id}
   Body: { "available": true }
5. Laravel updates pharmacy_medicines table
6. Updates `updated_at` timestamp
7. Returns success response
8. Frontend shows toast notification "Stock updated successfully"
```

#### Pharmacy Verification Flow
```
1. Pharmacy registers (POST /api/auth/register with role=pharmacy)
2. Uploads license documents (POST /api/upload/document)
3. Document paths saved to pharmacy_documents table
4. Pharmacy status set to "pending"
5. Admin views pending queue (GET /api/admin/pharmacies/pending)
6. Admin reviews documents and license number
7. Admin approves (PUT /api/admin/pharmacies/{id}/approve)
   Body: { "verification_status": "verified" }
8. Pharmacy receives email notification
9. Pharmacy badge updated on map markers
```

---

## 9. User Interface Design

### 9.1 Design Principles

1. **Map-First Interface:** Map should dominate the screen, not be a secondary element
2. **Visual Clarity:** Color-coded markers for instant recognition (green=available, red=unavailable)
3. **Mobile Optimization:** Touch-friendly controls, bottom sheets for mobile
4. **Progressive Disclosure:** Show essential info first, details on demand
5. **Trust Signals:** Prominently display verification badges and timestamps

---

### 9.2 Key Screens

#### Public Landing Page
- **Components:**
  - Full-screen map with pharmacy markers
  - Floating search bar at top
  - Sidebar (desktop) or bottom sheet (mobile) with results
  - Login/Register buttons in header
  
- **Interactions:**
  - Search triggers map marker filtering
  - Click marker to see pharmacy details
  - "Get Directions" button opens navigation
  - Guest users can search without login

---

#### Patient Dashboard
- **Components:**
  - Map view with saved favorites highlighted
  - Quick search bar
  - Favorites list sidebar
  - Recent searches
  - Submitted reports status

---

#### Pharmacy Dashboard
- **Components:**
  - Inventory table with toggle switches
  - "Bulk Upload" button
  - Verification status banner
  - Quick stats (views, reports received)
  - Document management section

---

#### Admin Verification Queue
- **Components:**
  - Table of pending pharmacies
  - Document viewer panel
  - License verification form
  - Approve/Reject action buttons
  - Reason notes textarea

---

### 9.3 Component Library (shadcn/ui)

**Core Components:**
- Button, Input, Select, Checkbox, Switch
- Card, Dialog, Sheet, Dropdown Menu
- Table, Pagination, Tabs
- Toast, Alert, Badge
- Form, Label, Error Message

**Custom Components:**
- MapContainer (Google Maps/Mapbox wrapper)
- PharmacyMarker (custom map marker)
- MedicineSearchBar (autocomplete search)
- AvailabilityToggle (pharmacy inventory toggle)
- VerificationBadge (trust indicator)
- CSVUploader (bulk upload with preview)

---

## 10. Success Metrics & KPIs

### 10.1 Launch Metrics (Month 1)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Registered Pharmacies | 50+ | Database count |
| Verified Pharmacies | 30+ | Verification rate |
| Active Patients | 500+ | User registrations |
| Daily Searches | 1,000+ | Search API calls |
| Average Search Time | < 3 seconds | Performance monitoring |
| Map Load Time | < 2 seconds | Performance monitoring |
| System Uptime | 99% | Monitoring tools |

---

### 10.2 Engagement Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Return User Rate | 40% | Analytics (7-day) |
| Average Session Duration | 5+ minutes | Analytics |
| Searches per Session | 2+ | Analytics |
| Pharmacy Update Frequency | 3x/week | Inventory update logs |
| Report Submission Rate | < 5% of searches | Report count vs searches |

---

### 10.3 Quality Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Data Accuracy Rate | 95% | Reports resolved/dismissed |
| Pharmacy Verification Time | < 48 hours | Admin workflow tracking |
| User Satisfaction (NPS) | > 50 | Surveys (future) |
| API Error Rate | < 1% | Error logging |
| Mobile Conversion Rate | 70%+ | Device analytics |

---

## 11. Assumptions & Constraints

### 11.1 Assumptions

1. **User Behavior:**
   - Patients are willing to create accounts for enhanced features
   - Pharmacies have basic computer/smartphone literacy
   - Patients have smartphones with GPS capability

2. **Data Availability:**
   - MOPH/OPL license databases are accessible for verification
   - Pharmacies can export inventory from PMS as CSV
   - Google Maps/Mapbox API quotas are sufficient

3. **Regulatory:**
   - No legal restrictions on displaying pharmacy locations
   - Medicine names can be publicly searchable
   - Pharmacy license verification is sufficient for credibility

4. **Technical:**
   - PostgreSQL with PostGIS handles geospatial queries efficiently
   - Next.js 16 and React 19 are stable for production
   - Laravel Sanctum provides adequate authentication

5. **Business:**
   - Platform is free for MVP (no monetization required)
   - No partnership agreements needed with pharmacies initially
   - Volunteer admins available for verification tasks

---

### 11.2 Constraints

#### 11.2.1 Technical Constraints
- **Medicine Scope:** Limited to 20-30 critical shortage-prone medicines (not full pharmacy inventory)
- **Map Provider:** Single map provider (Google Maps OR Mapbox, not both)
- **File Upload Size:** Max 5MB per document
- **Database:** PostgreSQL only (no NoSQL for MVP)
- **Authentication:** JWT tokens only (no OAuth social login in MVP)

#### 11.2.2 Resource Constraints
- **Development Team:** Small team (potentially 1-3 developers)
- **Timeline:** MVP delivery within 2-3 months
- **Budget:** Limited hosting budget (prefer cost-effective solutions)
- **Admin Capacity:** Manual verification (no automated license checking in MVP)

#### 11.2.3 Regulatory Constraints
- **Data Privacy:** Must comply with Lebanese data protection laws
- **Medical Liability:** Platform does not provide medical advice (disclaimer required)
- **Pharmacy Compliance:** Only licensed pharmacies allowed (verification mandatory)

#### 11.2.4 Business Constraints
- **No Monetization:** MVP is free (no payment gateway integration)
- **No Prescription Handling:** Platform does not validate prescriptions
- **Self-Service:** Pharmacies manage their own inventory (no manual data entry by admin)

---

## 12. Dependencies & Integrations

### 12.1 External Dependencies

1. **Google Maps API / Mapbox**
   - **Purpose:** Map rendering, geocoding, directions
   - **Risk:** API quota limits, cost scaling
   - **Mitigation:** Implement caching, optimize API calls, consider Mapbox as alternative

2. **Email Service (SMTP / SendGrid)**
   - **Purpose:** Email verification, notifications
   - **Risk:** Email deliverability issues
   - **Mitigation:** Use reputable SMTP provider, implement retry logic

3. **MOPH/OPL License Database**
   - **Purpose:** Pharmacy license verification
   - **Risk:** Manual verification if API unavailable
   - **Mitigation:** Admin manual cross-reference process

---

### 12.2 Internal Dependencies

1. **Frontend ↔ Backend API**
   - All frontend requests proxy through Next.js API routes to Laravel
   - JWT tokens required for authenticated endpoints
   - CORS configuration needed

2. **Database ↔ PostGIS Extension**
   - PostGIS required for geospatial queries
   - Proper indexing required for performance

---

## 13. Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Pharmacies don't update inventory regularly | High | Medium | Credibility timestamp display, email reminders, gamification (future) |
| Inaccurate license verification | High | Medium | Admin training, manual cross-reference, MOPH partnership (future) |
| Low pharmacy adoption | High | Medium | Marketing campaign, pharmacy outreach, value proposition demo |
| Map API cost overruns | Medium | Low | Implement caching, optimize API calls, set quota alerts |
| Data privacy breaches | Critical | Low | HTTPS, encryption, security audits, penetration testing |
| Scalability issues with user growth | Medium | Medium | Database indexing, API caching, horizontal scaling plan |
| User confusion with map-first interface | Medium | Low | Onboarding tutorial, help tooltips, user testing |
| Report spam/abuse | Medium | Medium | Rate limiting, admin moderation, user reputation system (future) |

---

## 14. Release Plan & Milestones

> **Note:** The original PRD outlined a 14-week timeline. The actual MVP implementation follows an **accelerated 5-week (34-day) sprint plan** from November 29, 2024 to January 1, 2025, as detailed in the Jira workflow.

### Sprint 0: Foundation & Setup (Nov 29 - Dec 5, 2024)
- ✅ Development environment setup
- ✅ Database schema design and creation
- ✅ Laravel API setup
- ✅ Next.js project structure
- ✅ Design system and documentation

---

### Sprint 1: Authentication & Map Interface (Dec 6 - Dec 12, 2024)
- ✅ User registration (patients, pharmacies)
- ✅ User login (all roles)
- ✅ Interactive map interface display
- ✅ Pharmacy markers with availability indicators
- ✅ GPS location detection

---

### Sprint 2: Medicine Search System (Dec 13 - Dec 19, 2024)
- ✅ Medicine search with autocomplete
- ✅ Map integration with search results
- ✅ Real-time search functionality
- ✅ Distance calculation (PostGIS)
- ✅ Pharmacy clustering on map

---

### Sprint 3: Pharmacy & Inventory Management (Dec 20 - Dec 26, 2024)
- ✅ Pharmacy registration & verification workflow
- ✅ Admin verification dashboard
- ✅ Inventory management dashboard
- ✅ CSV bulk upload for inventory
- ✅ Document upload system

---

### Sprint 4: Reports, Polish & Deployment (Dec 27 - Jan 1, 2025)
- ✅ User reporting system
- ✅ Admin reports management
- ✅ Comprehensive testing & bug fixes
- ✅ UI/UX polish
- ✅ Documentation & sample data
- ✅ Production deployment
- ✅ Demo preparation
---

## 16. Appendices

### Appendix A: Glossary

| Term | Definition |
|------|------------|
| **PMS** | Pharmacy Management System (software used by pharmacies for inventory) |
| **MOPH** | Ministry of Public Health (Lebanon) |
| **OPL** | Order of Pharmacists of Lebanon (regulatory body) |
| **PostGIS** | PostgreSQL extension for geospatial data |
| **RBAC** | Role-Based Access Control |
| **JWT** | JSON Web Token (authentication method) |
| **CSV** | Comma-Separated Values (file format for bulk uploads) |
| **Geocoding** | Converting addresses to geographic coordinates |
| **Marker Clustering** | Grouping nearby map markers to improve performance |

---

### Appendix B: Open Questions

1. **Map Provider Choice:** Google Maps vs Mapbox - need cost comparison
2. **Email Service:** Which SMTP provider for transactional emails?
3. **Hosting:** Where to host Laravel backend and PostgreSQL?
4. **Medicine Database:** How to obtain official medicine list (MOPH source)?
5. **Verification Process:** Can we automate license verification with MOPH API?
6. **Analytics:** Which tool for user behavior tracking (Google Analytics, Mixpanel)?

---

### Appendix C: Revision Notes

**Version 1.0 (2025-11-30):**
- Initial PRD creation based on system requirements, database schema, and project structure
- Defined MVP scope and post-MVP enhancements
- Established success metrics and KPIs
- Documented all functional and non-functional requirements
- Created technical architecture diagrams
- Outlined release plan with 14-week timeline
---

**End of Product Requirements Document**
