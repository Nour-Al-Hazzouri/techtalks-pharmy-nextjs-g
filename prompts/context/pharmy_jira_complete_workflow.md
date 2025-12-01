# Pharmy Project - Complete Jira Workflow Guide

**Last Updated:** November 29, 2024  
**Document Version:** 1.1  
**Prepared for:** Pharmy Project Team  
**Project Deadline:** January 1, 2025

> [!IMPORTANT]
> The project deadline is January 1, 2025. There will be no formal presentation - the final deliverable is a working deployed application showcased during a Google Meet session.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Epic Structure](#epic-structure)
3. [Stories and Tasks](#stories-and-tasks)
4. [Jira Configuration](#jira-configuration)
5. [Daily Workflow](#daily-workflow)
6. [Critical Success Factors](#critical-success-factors)
7. [Database Reference](#database-tables-reference)
8. [Technology Stack](#technology-stack)
9. [Label Reference](#quick-label-reference)
10. [Project Timeline](#project-timeline-summary)

---

## Project Overview

**Pharmy** is a platform that helps patients find pharmacies with available medicines using an interactive map interface. The project includes:

- Patient interface for searching medicines on a map
- Pharmacy management system for inventory
- Admin approval system for pharmacy verification
- Reports system for data accuracy

---

## Epic Structure

The project is organized into 8 epics across 5 sprints:

| Epic ID | Epic Name | Sprint | Story Points | Description |
|---------|-----------|--------|--------------|-------------|
| **PHARMY-1** | Foundation & Setup | Sprint 0 | 21 | Initialize project, set up repositories, database, and deployment pipelines |
| **PHARMY-2** | Authentication System | Sprint 1 | 34 | Implement secure JWT-based authentication for all user roles |
| **PHARMY-3** | Map Implementation | Sprint 1 | 21 | Integrate Google Maps/Mapbox with pharmacy markers and geolocation |
| **PHARMY-4** | Medicine Search | Sprint 2 | 34 | Build medicine search functionality with map integration |
| **PHARMY-5** | Pharmacy Management | Sprint 3 | 34 | Pharmacy registration, admin approval, and inventory management |
| **PHARMY-6** | Reports System | Sprint 4 | 21 | Allow users to report inaccuracies and admins to review them |
| **PHARMY-7** | Admin Features | Sprint 3-4 | 21 | Admin dashboard, pharmacy approval, and report management |
| **PHARMY-8** | Testing, Polish & Deployment | Sprint 4 | 26 | Final testing, polish, deployment, and demo preparation |

**Total Story Points:** 212  
**Total Duration:** 34 days (Nov 29, 2024 - Jan 1, 2025)

---

## Stories and Tasks

### Sprint 0: Foundation & Setup (Nov 29 - Dec 5, 2024)

#### STORY 1: Project Initialization & Setup

**Epic:** Foundation & Setup (PHARMY-1)  
**Story Points:** 21  
**Labels:** `setup`, `sprint-0`, `must-have`

**User Story:**
> As a developer  
> I want a fully initialized development environment  
> So that I can start building features immediately

**Acceptance Criteria:**
- ✅ Git repository created with proper branching strategy
- ✅ Frontend and backend projects initialized
- ✅ Database schema created and migrated
- ✅ All team members can run the project locally
- ✅ CI/CD pipeline configured

##### Tasks

**Task 1.1: Initialize Git repository and branching strategy**
- **Story Points:** 2
- **Labels:** `setup`, `devops`, `sprint-0`, `must-have`
- **Description:** Create GitHub repository. Set up branch protection rules. Create `main`, `development`, and `staging` branches. Add `.gitignore` files. Initialize README with project overview.

**Task 1.2: Set up Next.js frontend project**
- **Story Points:** 3
- **Labels:** `frontend`, `setup`, `sprint-0`, `must-have`
- **Description:** Initialize Next.js 14+ with TypeScript. Install shadcn/ui and Tailwind CSS. Configure folder structure (`app/`, `components/`, `lib/`, `types/`). Set up ESLint and Prettier.

**Task 1.3: Set up Laravel backend project**
- **Story Points:** 3
- **Labels:** `backend`, `setup`, `sprint-0`, `must-have`
- **Description:** Initialize Laravel project. Configure environment variables (`.env`). Set up folder structure (`app/Http/Controllers/`, `app/Models/`, `routes/api.php`). Install JWT authentication package.

**Task 1.4: Create database schema in PostgreSQL**
- **Story Points:** 5
- **Labels:** `database`, `setup`, `sprint-0`, `must-have`
- **Description:** Review database design from Pharmy.sql. Create migrations for: `users`, `pharmacies`, `medicines`, `inventory`, `reports`, `inventory_history`. Define relationships and foreign keys.

**Task 1.5: Configure development environment**
- **Story Points:** 3
- **Labels:** `devops`, `setup`, `sprint-0`, `must-have`
- **Description:** Write setup documentation in README. Configure Docker Compose (optional). Set up local PostgreSQL database. Document environment variables needed. Ensure all team members can run locally.

**Task 1.6: Set up CI/CD pipeline basics**
- **Story Points:** 3
- **Labels:** `devops`, `setup`, `sprint-0`, `must-have`
- **Description:** Configure GitHub Actions for automated testing. Set up linting checks on pull requests. Configure deployment to staging environment (Railway/Render). Document CI/CD workflow.

**Task 1.7: Create project documentation structure**
- **Story Points:** 2
- **Labels:** `documentation`, `setup`, `sprint-0`, `must-have`
- **Description:** Create `/docs` folder. Write API documentation template. Write database schema documentation. Write development guidelines (code style, PR process, testing requirements).

---

### Sprint 1: Authentication & Map (Dec 6 - Dec 12, 2024)

#### STORY 2: User Authentication - Registration

**Epic:** Authentication System (PHARMY-2)  
**Story Points:** 13  
**Labels:** `authentication`, `backend`, `sprint-1`, `must-have`

**User Story:**
> As a new user  
> I want to register an account with my role (Patient, Pharmacy, Admin)  
> So that I can access the platform

**Acceptance Criteria:**
- ✅ Patient can register with basic info (name, email, password, phone)
- ✅ Pharmacy can register with business info (name, email, password, phone, address, coordinates)
- ✅ Password validation enforced (min 8 characters)
- ✅ Email uniqueness validated
- ✅ User record created in database
- ✅ Appropriate error messages for validation failures

##### Tasks

**Task 2.1: Create User model and migration**
- **Story Points:** 3
- **Labels:** `backend`, `database`, `authentication`, `sprint-1`, `must-have`
- **Description:** Create `User` model with fields: `id`, `name`, `email`, `password`, `phone`, `role`, `created_at`, `updated_at`. Hash passwords using bcrypt. Define fillable fields and hidden fields (password).

**Task 2.2: Create registration API endpoint**
- **Story Points:** 5
- **Labels:** `backend`, `authentication`, `sprint-1`, `must-have`
- **Description:** Create `POST /api/register` endpoint. Validate input data (name, email, password, phone, role). Check email uniqueness. Hash password before saving. Return JWT token and user data. Handle errors (duplicate email, validation failures).

**Task 2.3: Create registration form UI**
- **Story Points:** 5
- **Labels:** `frontend`, `authentication`, `sprint-1`, `must-have`
- **Description:** Create registration form component. Add fields: name, email, password, confirm password, phone, role selector. Implement form validation (email format, password strength, required fields). Display error messages. Redirect to dashboard after successful registration.

---

#### STORY 3: User Authentication - Login

**Epic:** Authentication System (PHARMY-2)  
**Story Points:** 8  
**Labels:** `authentication`, `backend`, `frontend`, `sprint-1`, `must-have`

**User Story:**
> As a registered user  
> I want to log in with my email and password  
> So that I can access my account

**Acceptance Criteria:**
- ✅ User can log in with valid credentials
- ✅ JWT token generated and returned
- ✅ Invalid credentials show appropriate error
- ✅ Token stored securely in frontend
- ✅ User redirected to role-appropriate dashboard

##### Tasks

**Task 3.1: Create login API endpoint**
- **Story Points:** 3
- **Labels:** `backend`, `authentication`, `sprint-1`, `must-have`
- **Description:** Create `POST /api/login` endpoint. Validate email and password. Check if user exists. Verify password hash. Generate JWT token with user data. Return token and user info.

**Task 3.2: Create login form UI**
- **Story Points:** 3
- **Labels:** `frontend`, `authentication`, `sprint-1`, `must-have`
- **Description:** Create login form component. Add email and password fields. Implement form validation. Display error messages for invalid credentials. Store JWT token in localStorage/cookies. Redirect based on user role (Patient, Pharmacy, Admin).

**Task 3.3: Set up authentication context**
- **Story Points:** 2
- **Labels:** `frontend`, `authentication`, `sprint-1`, `must-have`
- **Description:** Create React Context for authentication state. Store user info and token. Provide login/logout functions. Create protected route component. Add authentication check on app load (check if token exists and is valid).

---

#### STORY 4: User Profile Management

**Epic:** Authentication System (PHARMY-2)  
**Story Points:** 13  
**Labels:** `authentication`, `frontend`, `backend`, `sprint-1`, `should-have`

**User Story:**
> As a logged-in user  
> I want to view and update my profile information  
> So that I can keep my account details current

**Acceptance Criteria:**
- ✅ User can view their profile information
- ✅ User can update name, phone, and address (if pharmacy)
- ✅ Email cannot be changed (security)
- ✅ Password change requires current password verification
- ✅ Changes saved successfully with confirmation message

##### Tasks

**Task 4.1: Create profile view/edit API endpoints**
- **Story Points:** 5
- **Labels:** `backend`, `authentication`, `sprint-1`, `should-have`
- **Description:** Create `GET /api/profile` endpoint (returns current user info). Create `PUT /api/profile` endpoint (update name, phone). Create `PUT /api/profile/password` endpoint (verify current password, update to new password). Validate input data.

**Task 4.2: Create profile UI components**
- **Story Points:** 5
- **Labels:** `frontend`, `authentication`, `sprint-1`, `should-have`
- **Description:** Create profile view page showing user info. Create edit form for name, phone, address. Create separate password change form. Implement validation. Show success/error messages. Update auth context with new user data.

**Task 4.3: Add profile navigation to dashboard**
- **Story Points:** 3
- **Labels:** `frontend`, `authentication`, `sprint-1`, `should-have`
- **Description:** Add "Profile" link to navigation menu. Create route for profile page. Ensure only logged-in users can access. Add breadcrumbs for navigation.

---

#### STORY 5: Map Integration

**Epic:** Map Implementation (PHARMY-3)  
**Story Points:** 21  
**Labels:** `map`, `frontend`, `integration`, `sprint-1`, `must-have`

**User Story:**
> As a patient  
> I want to see a map with pharmacy locations  
> So that I can visually identify nearby pharmacies

**Acceptance Criteria:**
- ✅ Map displays centered on user's location (with permission)
- ✅ Pharmacy markers shown on map with custom icons
- ✅ Map is interactive (pan, zoom)
- ✅ Clicking marker shows pharmacy basic info (name, address)
- ✅ Map matches Figma prototype design

##### Tasks

**Task 5.1: Set up Google Maps/Mapbox integration**
- **Story Points:** 5
- **Labels:** `frontend`, `map`, `integration`, `sprint-1`, `must-have`
- **Description:** Choose between Google Maps or Mapbox. Obtain API key. Install map library (`@react-google-maps/api` or `mapbox-gl`). Create basic map component. Configure initial center and zoom level.

**Task 5.2: Implement user geolocation**
- **Story Points:** 3
- **Labels:** `frontend`, `map`, `sprint-1`, `must-have`
- **Description:** Request user's location permission. Get current coordinates using browser geolocation API. Center map on user location if permission granted. Handle permission denial gracefully (default to city center).

**Task 5.3: Create pharmacy markers on map**
- **Story Points:** 5
- **Labels:** `frontend`, `map`, `sprint-1`, `must-have`
- **Description:** Fetch pharmacy list from API (`GET /api/pharmacies`). Parse pharmacy coordinates. Create markers for each pharmacy. Use custom pharmacy icon. Ensure markers are clickable.

**Task 5.4: Add info window for pharmacy details**
- **Story Points:** 5
- **Labels:** `frontend`, `map`, `sprint-1`, `must-have`
- **Description:** Create info window component. Display pharmacy name, address, phone. Show on marker click. Close when clicking another marker or map. Style to match Figma prototype.

**Task 5.5: Style map to match Figma design**
- **Story Points:** 3
- **Labels:** `frontend`, `map`, `design`, `sprint-1`, `must-have`
- **Description:** Apply custom map styling (colors, road styles). Match Figma prototype colors and UI. Add controls (zoom buttons, fullscreen). Make map responsive for mobile.

---

### Sprint 2: Medicine Search (Dec 13 - Dec 19, 2024)

#### STORY 6: Medicine Search - Backend

**Epic:** Medicine Search (PHARMY-4)  
**Story Points:** 13  
**Labels:** `search`, `backend`, `database`, `sprint-2`, `must-have`

**User Story:**
> As a backend developer  
> I want a robust medicine search API  
> So that patients can find medicines by name across all pharmacies

**Acceptance Criteria:**
- ✅ API endpoint accepts search query
- ✅ Search is case-insensitive and supports partial matches
- ✅ Returns list of pharmacies that have the medicine in stock
- ✅ Includes medicine availability and quantity
- ✅ Optimized for performance (indexed search)

##### Tasks

**Task 6.1: Create Medicine model and seed database**
- **Story Points:** 5
- **Labels:** `backend`, `database`, `sprint-2`, `must-have`
- **Description:** Create `Medicine` model with fields: `id`, `name`, `description`, `category`. Create seeder with common medicines (100+ entries). Create database index on medicine name for faster search.

**Task 6.2: Create medicine search API endpoint**
- **Story Points:** 5
- **Labels:** `backend`, `search`, `sprint-2`, `must-have`
- **Description:** Create `GET /api/medicines/search?query={name}` endpoint. Implement case-insensitive partial match search (`LIKE '%query%'`). Join with `inventory` table to get pharmacy stock info. Return: medicine info, pharmacy details, quantity available, last updated.

**Task 6.3: Optimize search performance**
- **Story Points:** 3
- **Labels:** `backend`, `database`, `optimization`, `sprint-2`, `should-have`
- **Description:** Add database index on `medicines.name`. Implement query result caching (Redis optional). Add pagination (limit 50 results). Test with large dataset.

---

#### STORY 7: Medicine Search - Frontend

**Epic:** Medicine Search (PHARMY-4)  
**Story Points:** 21  
**Labels:** `search`, `frontend`, `map`, `sprint-2`, `must-have`

**User Story:**
> As a patient  
> I want to search for a medicine by name  
> So that I can see which nearby pharmacies have it in stock

**Acceptance Criteria:**
- ✅ Search bar prominently displayed
- ✅ Search results show pharmacies with availability
- ✅ Map updates to show only pharmacies with searched medicine
- ✅ Clicking result focuses map on that pharmacy
- ✅ Clear "no results" message when medicine not found

##### Tasks

**Task 7.1: Create medicine search bar component**
- **Story Points:** 5
- **Labels:** `frontend`, `search`, `sprint-2`, `must-have`
- **Description:** Create search input component with autocomplete. Debounce search input (300ms). Display loading indicator while searching. Match Figma design. Position prominently on map page.

**Task 7.2: Implement search results display**
- **Story Points:** 5
- **Labels:** `frontend`, `search`, `sprint-2`, `must-have`
- **Description:** Create results list component. Display pharmacy name, address, quantity available. Show distance from user (calculate using coordinates). Add "View on map" button. Show "No results found" when empty.

**Task 7.3: Integrate search with map markers**
- **Story Points:** 8
- **Labels:** `frontend`, `search`, `map`, `integration`, `sprint-2`, `must-have`
- **Description:** Filter map markers based on search results. Update markers when search changes. Highlight markers for pharmacies with medicine. Clicking result centers map on pharmacy and opens info window. Clear search shows all pharmacies again.

**Task 7.4: Add autocomplete suggestions**
- **Story Points:** 3
- **Labels:** `frontend`, `search`, `sprint-2`, `should-have`
- **Description:** Create `GET /api/medicines/autocomplete?q={query}` endpoint. Show dropdown with medicine name suggestions as user types. Limit to 10 suggestions. Clicking suggestion performs full search.

---

### Sprint 3: Pharmacy & Inventory (Dec 20 - Dec 26, 2024)

#### STORY 8: Pharmacy Registration with Admin Approval

**Epic:** Pharmacy Management (PHARMY-5)  
**Story Points:** 13  
**Labels:** `pharmacy`, `authentication`, `admin`, `sprint-3`, `must-have`

**User Story:**
> As a pharmacy owner  
> I want to register my pharmacy with business details  
> So that I can be listed on the platform after admin approval

**Acceptance Criteria:**
- ✅ Pharmacy can submit registration with business info
- ✅ Registration creates pharmacy record with `pending` status
- ✅ Coordinates can be set via map click or address entry
- ✅ Required fields validated (name, license, address, coordinates)
- ✅ Admin receives notification of new registration (optional)

##### Tasks

**Task 8.1: Create Pharmacy model and registration endpoint**
- **Story Points:** 5
- **Labels:** `backend`, `pharmacy`, `database`, `sprint-3`, `must-have`
- **Description:** Create `Pharmacy` model with fields: `id`, `user_id`, `name`, `license_number`, `address`, `latitude`, `longitude`, `status` (pending/approved/rejected), `created_at`. Create `POST /api/pharmacies/register` endpoint. Link to authenticated user. Set initial status to `pending`.

**Task 8.2: Create pharmacy registration form UI**
- **Story Points:** 5
- **Labels:** `frontend`, `pharmacy`, `sprint-3`, `must-have`
- **Description:** Create multi-step registration form: Step 1 (business info: name, license), Step 2 (address, map for coordinates), Step 3 (review and submit). Implement form validation. Show map for selecting location. Submit to API and show confirmation message.

**Task 8.3: Admin approval workflow backend**
- **Story Points:** 3
- **Labels:** `backend`, `admin`, `pharmacy`, `sprint-3`, `must-have`
- **Description:** Create `PUT /api/admin/pharmacies/{id}/approve` endpoint (sets status to `approved`). Create `PUT /api/admin/pharmacies/{id}/reject` endpoint (sets status to `rejected`). Add admin middleware to protect these endpoints.

---

#### STORY 9: Pharmacy Inventory Management

**Epic:** Pharmacy Management (PHARMY-5)  
**Story Points:** 21  
**Labels:** `inventory`, `pharmacy`, `frontend`, `backend`, `sprint-3`, `must-have`

**User Story:**
> As a pharmacy owner  
> I want to manage my medicine inventory  
> So that patients can see what medicines I have in stock

**Acceptance Criteria:**
- ✅ Pharmacy can view all inventory items
- ✅ Pharmacy can add new medicine to inventory
- ✅ Pharmacy can update quantity of existing medicine
- ✅ Pharmacy can remove medicine from inventory
- ✅ Inventory changes are tracked in history table

##### Tasks

**Task 9.1: Create Inventory model and API endpoints**
- **Story Points:** 8
- **Labels:** `backend`, `inventory`, `database`, `sprint-3`, `must-have`
- **Description:** Create `Inventory` model with fields: `id`, `pharmacy_id`, `medicine_id`, `quantity`, `updated_at`. Create CRUD endpoints: `GET /api/pharmacy/inventory` (list), `POST /api/pharmacy/inventory` (add), `PUT /api/pharmacy/inventory/{id}` (update), `DELETE /api/pharmacy/inventory/{id}` (remove). Validate pharmacy owns inventory item.

**Task 9.2: Create inventory management UI**
- **Story Points:** 8
- **Labels:** `frontend`, `inventory`, `pharmacy`, `sprint-3`, `must-have`
- **Description:** Create inventory table component showing: medicine name, quantity, last updated. Add "Add Medicine" button (opens modal). Add inline edit for quantity. Add delete button with confirmation. Implement search/filter for large inventories.

**Task 9.3: Create inventory history tracking**
- **Story Points:** 5
- **Labels:** `backend`, `database`, `inventory`, `sprint-3`, `should-have`
- **Description:** Create `InventoryHistory` model: `id`, `inventory_id`, `previous_quantity`, `new_quantity`, `action` (add/update/delete), `created_at`. Create trigger/observer to log all inventory changes. Create `GET /api/pharmacy/inventory/history` endpoint (paginated).

---

#### STORY 10: Admin Dashboard - Pharmacy Approval

**Epic:** Admin Features (PHARMY-7)  
**Story Points:** 13  
**Labels:** `admin`, `frontend`, `backend`, `sprint-3`, `must-have`

**User Story:**
> As an admin  
> I want to review and approve/reject pending pharmacy registrations  
> So that only legitimate pharmacies are listed on the platform

**Acceptance Criteria:**
- ✅ Admin can see list of pending pharmacy registrations
- ✅ Admin can view pharmacy details (name, license, address, coordinates on map)
- ✅ Admin can approve pharmacy (status changes to `approved`)
- ✅ Admin can reject pharmacy (status changes to `rejected`)
- ✅ Pharmacy appears on map only when approved

##### Tasks

**Task 10.1: Create admin pharmacy list API**
- **Story Points:** 3
- **Labels:** `backend`, `admin`, `sprint-3`, `must-have`
- **Description:** Create `GET /api/admin/pharmacies?status={pending|approved|rejected}` endpoint. Filter by status. Return pharmacy info with user details. Add admin middleware protection.

**Task 10.2: Create admin dashboard UI**
- **Story Points:** 5
- **Labels:** `frontend`, `admin`, `sprint-3`, `must-have`
- **Description:** Create admin dashboard page. Show tabs: Pending, Approved, Rejected. Display pharmacy cards with: name, license, address, registration date. Add "View Details" button.

**Task 10.3: Create pharmacy approval/rejection UI**
- **Story Points:** 5
- **Labels:** `frontend`, `admin`, `sprint-3`, `must-have`
- **Description:** Create pharmacy detail modal showing: all registration info, map with pharmacy location. Add "Approve" and "Reject" buttons. Show confirmation dialog. Update list after action. Send approval/rejection to API.

---

### Sprint 4: Reports, Polish & Deploy (Dec 27 - Jan 1, 2025)

#### STORY 11: Reports System - Backend

**Epic:** Reports System (PHARMY-6)  
**Story Points:** 13  
**Labels:** `reports`, `backend`, `database`, `sprint-4`, `should-have`

**User Story:**
> As a backend developer  
> I want a robust reports system  
> So that users can submit reports and admins can review them

**Acceptance Criteria:**
- ✅ API to submit report with details
- ✅ API to list reports (with filters)
- ✅ API to update report status
- ✅ Reports linked to pharmacy and medicine
- ✅ Report types supported: out of stock, incorrect price, closed pharmacy

##### Tasks

**Task 11.1: Create Report model and API endpoints**
- **Story Points:** 8
- **Labels:** `backend`, `reports`, `database`, `sprint-4`, `should-have`
- **Description:** Create `Report` model: `id`, `user_id`, `pharmacy_id`, `medicine_id`, `type` (out_of_stock/incorrect_price/closed), `description`, `status` (pending/reviewed/resolved), `created_at`. Create endpoints: `POST /api/reports` (submit), `GET /api/reports` (list with filters), `PUT /api/reports/{id}/status` (admin only).

**Task 11.2: Add report validation and business logic**
- **Story Points:** 5
- **Labels:** `backend`, `reports`, `sprint-4`, `should-have`
- **Description:** Validate report submission: user logged in, pharmacy exists, medicine exists (if applicable). Prevent duplicate reports (same user, pharmacy, medicine within 24 hours). Send email notification to pharmacy owner (optional). Create helper methods for report statistics.

---

#### STORY 12: Reports System - Frontend

**Epic:** Reports System (PHARMY-6)  
**Story Points:** 8  
**Labels:** `reports`, `frontend`, `sprint-4`, `should-have`

**User Story:**
> As a patient  
> I want to report inaccuracies about pharmacy or medicine availability  
> So that the platform data stays accurate

**Acceptance Criteria:**
- ✅ Report button visible on pharmacy info window
- ✅ Report form with type selection and description
- ✅ Report submitted successfully with confirmation
- ✅ User can view their submitted reports
- ✅ Clear error messages for validation failures

##### Tasks

**Task 12.1: Create report submission form**
- **Story Points:** 5
- **Labels:** `frontend`, `reports`, `sprint-4`, `should-have`
- **Description:** Create report modal component. Add report type dropdown (Out of Stock, Incorrect Price, Closed). Add description textarea. Add medicine selector if applicable. Validate required fields. Submit to API and show success message.

**Task 12.2: Add report button to pharmacy info**
- **Story Points:** 3
- **Labels:** `frontend`, `reports`, `map`, `sprint-4`, `should-have`
- **Description:** Add "Report Issue" button to pharmacy info window on map. Add "Report" button on pharmacy detail page. Open report modal when clicked. Pre-fill pharmacy and medicine info if context available.

---

#### STORY 13: Admin Dashboard - Reports Management

**Epic:** Admin Features (PHARMY-7)  
**Story Points:** 8  
**Labels:** `admin`, `reports`, `frontend`, `sprint-4`, `should-have`

**User Story:**
> As an admin  
> I want to review user-submitted reports  
> So that I can take action on data inaccuracies

**Acceptance Criteria:**
- ✅ Admin can see list of all reports
- ✅ Admin can filter reports by status and type
- ✅ Admin can view report details
- ✅ Admin can mark report as reviewed or resolved
- ✅ Admin can see report statistics (total, pending, resolved)

##### Tasks

**Task 13.1: Create admin reports dashboard UI**
- **Story Points:** 5
- **Labels:** `frontend`, `admin`, `reports`, `sprint-4`, `should-have`
- **Description:** Create reports list page for admin. Show table with: report type, pharmacy, medicine, status, date. Add filters: status (pending/reviewed/resolved), type. Add "View Details" button. Show statistics cards: total reports, pending, resolved.

**Task 13.2: Create report detail and action UI**
- **Story Points:** 3
- **Labels:** `frontend`, `admin`, `reports`, `sprint-4`, `should-have`
- **Description:** Create report detail modal showing: full description, reporter info, pharmacy/medicine details. Add status change buttons: "Mark as Reviewed", "Mark as Resolved". Update report status via API. Refresh list after action.

---

#### STORY 14: CSV Bulk Upload for Inventory

**Epic:** Pharmacy Management (PHARMY-5)  
**Story Points:** 13  
**Labels:** `inventory`, `backend`, `frontend`, `sprint-4`, `could-have`

**User Story:**
> As a pharmacy owner  
> I want to upload my inventory via CSV file  
> So that I can quickly populate my inventory instead of adding items one by one

**Acceptance Criteria:**
- ✅ CSV template available for download
- ✅ Pharmacy can upload CSV file
- ✅ System validates CSV format and data
- ✅ Valid entries added to inventory
- ✅ Errors reported with line numbers
- ✅ Summary shown: X items added, Y items failed

##### Tasks

**Task 14.1: Create CSV upload API endpoint**
- **Story Points:** 8
- **Labels:** `backend`, `inventory`, `sprint-4`, `could-have`
- **Description:** Create `POST /api/pharmacy/inventory/upload` endpoint. Accept CSV file. Parse CSV (columns: medicine_name, quantity). Validate: medicine exists, quantity is number. Bulk insert valid entries. Return summary: total processed, successful, failed (with errors). Create sample CSV template for download.

**Task 14.2: Create CSV upload UI component**
- **Story Points:** 5
- **Labels:** `frontend`, `inventory`, `sprint-4`, `could-have`
- **Description:** Add "Bulk Upload" button to inventory page. Create file upload component accepting `.csv` only. Add "Download Template" link. Show progress indicator during upload. Display upload summary: success count, error list with line numbers. Refresh inventory after successful upload.

---

#### STORY 15: UI Polish & Responsiveness

**Epic:** Testing, Polish & Deployment (PHARMY-8)  
**Story Points:** 8  
**Labels:** `frontend`, `design`, `testing`, `sprint-4`, `must-have`

**User Story:**
> As a user  
> I want the application to look professional and work on all devices  
> So that I have a great user experience

**Acceptance Criteria:**
- ✅ All pages match Figma design closely
- ✅ Application is fully responsive (mobile, tablet, desktop)
- ✅ Consistent color scheme and typography
- ✅ Loading states for all async operations
- ✅ Error messages are user-friendly
- ✅ Smooth transitions and animations

##### Tasks

**Task 15.1: Review and match Figma design**
- **Story Points:** 3
- **Labels:** `frontend`, `design`, `sprint-4`, `must-have`
- **Description:** Compare all pages with Figma prototype. Adjust colors, fonts, spacing, button styles. Ensure shadcn/ui components styled correctly. Fix any visual discrepancies. Add brand logo and favicon.

**Task 15.2: Implement responsive design**
- **Story Points:** 3
- **Labels:** `frontend`, `design`, `sprint-4`, `must-have`
- **Description:** Test on mobile, tablet, desktop breakpoints. Make map responsive (full height on mobile). Adjust navigation for mobile (hamburger menu). Ensure forms are mobile-friendly. Test on actual devices (iOS Safari, Android Chrome).

**Task 15.3: Add loading states and error handling**
- **Story Points:** 2
- **Labels:** `frontend`, `sprint-4`, `must-have`
- **Description:** Add loading spinners for all API calls. Show skeleton loaders for data tables. Display user-friendly error messages (not technical errors). Add toast notifications for success/error. Handle network errors gracefully (retry option).

---

#### STORY 16: Testing & Quality Assurance

**Epic:** Testing, Polish & Deployment (PHARMY-8)  
**Story Points:** 13  
**Labels:** `testing`, `qa`, `backend`, `frontend`, `sprint-4`, `must-have`

**User Story:**
> As the development team  
> I want comprehensive testing of all features  
> So that we deliver a bug-free application

**Acceptance Criteria:**
- ✅ All API endpoints tested (manual or automated)
- ✅ All user flows tested end-to-end
- ✅ Cross-browser testing completed (Chrome, Firefox, Safari)
- ✅ Mobile device testing completed
- ✅ All critical bugs fixed
- ✅ Test results documented

##### Tasks

**Task 16.1: API endpoint testing**
- **Story Points:** 5
- **Labels:** `backend`, `testing`, `sprint-4`, `must-have`
- **Description:** Test all API endpoints using Postman/Insomnia. Verify: authentication works, authorization correct, validation working, error responses correct. Test edge cases (empty data, invalid IDs, unauthorized access). Document test results.

**Task 16.2: End-to-end user flow testing**
- **Story Points:** 5
- **Labels:** `frontend`, `testing`, `qa`, `sprint-4`, `must-have`
- **Description:** Test complete user journeys: Patient (register, login, search medicine, view pharmacy, report issue). Pharmacy (register, await approval, manage inventory, upload CSV). Admin (approve pharmacy, review reports). Document all bugs found.

**Task 16.3: Cross-browser and device testing**
- **Story Points:** 3
- **Labels:** `frontend`, `testing`, `qa`, `sprint-4`, `must-have`
- **Description:** Test on browsers: Chrome, Firefox, Safari, Edge. Test on devices: iPhone (iOS Safari), Android phone (Chrome), iPad, desktop. Verify map works everywhere. Check responsive layouts. Fix browser-specific issues.

---

#### STORY 17: Production Deployment

**Epic:** Testing, Polish & Deployment (PHARMY-8)  
**Story Points:** 21  
**Labels:** `deployment`, `devops`, `backend`, `frontend`, `sprint-4`, `must-have`

**User Story:**
> As the development team  
> I want to deploy the application to production  
> So that users can access the live application

**Acceptance Criteria:**
- ✅ Frontend deployed to Netlify
- ✅ Backend deployed to Railway/Render
- ✅ PostgreSQL database set up on hosting platform
- ✅ Environment variables configured correctly
- ✅ HTTPS enabled
- ✅ Custom domain configured (if available)
- ✅ Application fully functional in production

##### Tasks

**Task 17.1: Set up production database**
- **Story Points:** 3
- **Labels:** `deployment`, `database`, `devops`, `sprint-4`, `must-have`
- **Description:** Create PostgreSQL database on Railway/Render/Supabase. Run migrations on production database. Seed with initial data (medicines, admin user). Verify database connection works. Back up database credentials securely.

**Task 17.2: Configure production environment variables**
- **Story Points:** 2
- **Labels:** `deployment`, `devops`, `setup`, `security`, `sprint-4`, `must-have`
- **Description:** Set all environment variables on hosting platforms: DB credentials, JWT secret, API keys (maps), CORS origins, APP_KEY. Verify all are set correctly.

**Task 17.3: Deploy backend API to production**
- **Story Points:** 5
- **Labels:** `deployment`, `backend`, `devops`, `sprint-4`, `must-have`
- **Description:** Configure Laravel for production (`APP_ENV=production`, `APP_DEBUG=false`). Set up database connection. Configure CORS for frontend domain. Deploy to Railway/Render. Test API endpoints. Verify database seeded with production data.

**Task 17.4: Deploy frontend to Netlify**
- **Story Points:** 3
- **Labels:** `deployment`, `frontend`, `devops`, `sprint-4`, `must-have`
- **Description:** Configure Next.js build settings. Set API base URL to production backend. Deploy to Netlify. Set up custom domain if available. Enable HTTPS.

**Task 17.5: Test deployed application thoroughly**
- **Story Points:** 5
- **Labels:** `deployment`, `testing`, `qa`, `sprint-4`, `must-have`
- **Description:** Test complete user flows on production: registration, login, map display, search, inventory management, admin features. Test on multiple devices and browsers.

**Task 17.6: Fix deployment-specific issues**
- **Story Points:** 3
- **Labels:** `deployment`, `bug`, `devops`, `sprint-4`
- **Description:** Fix any issues that only appear in production: CORS errors, asset loading issues, API connection problems, routing issues, database connection errors.

---

#### STORY 18: Demo Preparation

**Epic:** Testing, Polish & Deployment (PHARMY-8)  
**Story Points:** 8  
**Labels:** `documentation`, `testing`, `sprint-4`, `must-have`

**User Story:**
> As a team  
> I want to prepare for the demo showcase  
> So that we can effectively present our project during the Google Meet

**Acceptance Criteria:**
- ✅ Demo flow script prepared
- ✅ All demo scenarios tested and working
- ✅ Production environment ready with sample data
- ✅ Team practiced demo at least once

##### Tasks

**Task 18.1: Prepare demo flow script**
- **Story Points:** 2
- **Labels:** `documentation`, `sprint-4`, `must-have`
- **Description:** Write step-by-step demo script covering: user registration/login, medicine search on map, pharmacy inventory management, admin approval workflow. Keep it concise for Google Meet showcase.

**Task 18.2: Test all demo scenarios**
- **Story Points:** 3
- **Labels:** `testing`, `sprint-4`, `must-have`
- **Description:** Run through complete demo flow: patient searching for medicine, pharmacy managing inventory, admin approving pharmacies. Ensure everything works smoothly end-to-end.

**Task 18.3: Prepare production environment for demo**
- **Story Points:** 2
- **Labels:** `deployment`, `database`, `sprint-4`, `must-have`
- **Description:** Clear test/dummy data from production. Add realistic sample data (medicines, pharmacies, inventory). Ensure production is stable and ready for showcase.

**Task 18.4: Practice demo walkthrough**
- **Story Points:** 1
- **Labels:** `sprint-4`, `must-have`
- **Description:** Practice demo flow at least once as a team. Assign roles for who demonstrates what. Ensure smooth transitions. Test screen sharing on Google Meet.

---

## Jira Configuration

### Workflow States

1. **To Do** - Task created, not started
2. **In Progress** - Actively being worked on
3. **Code Review** - Waiting for peer review
4. **Testing** - Being tested
5. **Done** - Completed and verified

### Components to Create

- Frontend (Next.js)
- Backend (Laravel)
- Database (PostgreSQL)
- DevOps & Deployment
- Documentation

### Custom Fields (Optional)

- **Priority:** Must Have / Should Have / Could Have
- **Sprint Goal:** Brief description
- **Blocked By:** Track dependencies

### Estimation Guidelines

- **1-2 points:** Small UI fix, minor documentation
- **3-5 points:** Medium feature, standard CRUD API
- **8 points:** Complex integration, major feature
- **13 points:** Very complex system, multiple integrations

---

## Daily Workflow

### Every Morning

- 15-minute standup via Google Meet
- Each member shares: what I did yesterday, what I'm doing today, any blockers

### Throughout the Day

- Update task status in Jira as you work
- Move tasks: To Do → In Progress → Code Review → Testing → Done
- Add comments to tasks with progress updates

### When Blocked

- Mark task with `blocked` label
- Post immediately in Discord/Slack #blockers channel
- Tag relevant team member who can help

### Before Merging Code

- Get at least one code review approval
- Ensure all tests pass
- Update Jira task to "Done"

### End of Sprint

- **Sprint Review:** Demo completed features
- **Sprint Retrospective:** What went well, what to improve

---

## Critical Success Factors

### Must Have Features (Non-negotiable)

- ✅ User registration/login (all roles)
- ✅ Map-based interface matching prototype
- ✅ Medicine search with map integration
- ✅ Pharmacy display on map with availability
- ✅ Pharmacy registration with admin verification
- ✅ Basic inventory management
- ✅ Admin dashboard

### Should Have (Cut if behind schedule)

- ⚠️ CSV bulk upload
- ⚠️ Reports system
- ⚠️ Inventory history tracking

### Could Have (Nice to have)

- 💡 Email notifications
- 💡 Password reset
- 💡 Advanced filters

---

## Database Tables Reference

1. **users** - All user accounts (patients, pharmacies, admins)
2. **pharmacies** - Pharmacy business information
3. **medicines** - Master list of medicines
4. **inventory** - Pharmacy medicine inventory (what each pharmacy has)
5. **reports** - User-submitted reports about pharmacy inaccuracies
6. **inventory_history** - Audit log of inventory changes

---

## Technology Stack

### Frontend

- Next.js 14+ with TypeScript
- shadcn/ui component library
- Tailwind CSS
- Google Maps / Mapbox
- React Context for auth

### Backend

- Laravel (PHP)
- JWT authentication
- RESTful API

### Database

- PostgreSQL

### Deployment

- **Frontend:** Netlify
- **Backend:** Railway / Render
- **Database:** Railway / Render / Supabase

### Tools

- Git & GitHub
- Jira (project management)
- Discord/Slack (communication)
- Google Meet (standups)
- Figma (design)

---

## Quick Label Reference

### Mandatory Labels for Every Task

1. **At least ONE technology label:** `frontend`, `backend`, `database`, `integration`, or `devops`
2. **At least ONE sprint label:** `sprint-0`, `sprint-1`, `sprint-2`, `sprint-3`, `sprint-4`, `deployment`, or `presentation`
3. **At least ONE priority label:** `must-have`, `should-have`, or `could-have`

### Optional but Recommended

**Feature domain:** `authentication`, `map`, `search`, `inventory`, `reports`, `admin`, `pharmacy`

**Work type:** `setup`, `design`, `documentation`, `testing`, `bug`, `refactor`, `optimization`

**Special:** `urgent`, `blocked`, `pair-programming`, `ai-assisted`, `learning`, `security`, `performance`

### Label Filtering Tips

**See all authentication work:**
```
label = authentication
```

**See Sprint 2 incomplete tasks:**
```
label = sprint-2 AND status != Done
```

**See critical/urgent items:**
```
label IN (urgent, must-have)
```

**See backend bugs:**
```
label = bug AND label = backend
```

**See blocked items:**
```
label = blocked
```

**See available frontend tasks:**
```
label = frontend AND status = "To Do"
```

---

## Project Timeline Summary

| Sprint | Duration | Days | Focus |
|--------|----------|------|-------|
| **Sprint 0** | Nov 29 - Dec 5 | 7 | Foundation & Setup |
| **Sprint 1** | Dec 6 - Dec 12 | 7 | Authentication + Map |
| **Sprint 2** | Dec 13 - Dec 19 | 7 | Medicine Search |
| **Sprint 3** | Dec 20 - Dec 26 | 7 | Pharmacy + Inventory |
| **Sprint 4** | Dec 27 - Jan 1 | 6 | Reports + Polish + Deploy + Demo Prep |

**Total:** 34 days

---

## Notes for Jira Setup

1. **Create Epics First** - All 8 epics (PHARMY-1 through PHARMY-8)
2. **Create All Labels** - Use the labels library above
3. **Create Sprints** - Sprint 0 through Sprint 4
4. **Add Stories to Epics** - 18 stories total across 8 epics
5. **Add Tasks to Stories** - Each task linked to parent story
6. **Assign Labels** - Use the label assignments provided for each task
7. **Set Story Points** - Use the points provided for each story/task
8. **Configure Workflow** - Set up the 5 workflow states
9. **Start Sprint 0** - Activate Sprint 0 and begin work!

---

## End of Document

This complete workflow guide contains all information needed to set up and manage the Pharmy project in Jira. Keep this document handy throughout the project for reference on sprint goals, task details, labels, and workflow guidelines.
