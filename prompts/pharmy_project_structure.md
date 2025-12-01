# Pharmy - Next.js 16+ Project Structure

A comprehensive Next.js 16+ project structure for the Pharmy medicine availability platform, designed to support multi-role authentication, real-time medicine search, pharmacy management, and administrative verification workflows.

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript (v5.1+)
- **Bundler**: Turbopack (Default)
- **UI Library**: React 19 + shadcn/ui
- **Backend API**: Laravel (separate service)
- **Database**: PostgreSQL with PostGIS
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS + CSS Modules
- **State Management**: Zustand / Context API
- **Data Fetching**: React Query + Fetch API
- **Maps Integration**: Google Maps API / Mapbox
- **Form Handling**: React Hook Form + Zod
- **Testing**: Vitest + Playwright

## Core Features

### User Roles & Access Levels
1. **Public Users**: Medicine search, pharmacy location viewing
2. **Patients**: Dashboard, report submission, favorites management
3. **Pharmacies**: Inventory management, stock updates, bulk uploads
4. **Administrators**: Pharmacy verification, report management, system analytics

### Primary Features
- **Medicine Search**: Real-time search with autocomplete and filtering
- **Interactive Maps**: Pharmacy locations with availability status
- **Inventory Management**: Manual updates and CSV/Excel bulk uploads
- **Verification System**: Admin approval workflow for pharmacy registrations
- **Report System**: User-submitted reports with type categorization and status tracking
- **Document Management**: Pharmacy license and verification document uploads
- **Multi-level Authentication**: Role-based access control

## Project Directory Structure

```
pharmy/
├── public/                           # Static assets
│   ├── images/                       # App images, logos, medicine placeholders
│   ├── icons/                        # Favicons, PWA icons
│   ├── maps/                         # Custom map markers and overlays
│   └── documents/                    # Static PDFs, guidelines
├── src/
│   ├── app/                          # App Router (Next.js 16+)
│   │   ├── (public)/                 # Public routes (no authentication required)
│   │   │   ├── page.tsx              # Landing/home page
│   │   │   ├── search/               # Medicine search interface
│   │   │   ├── map/                  # Pharmacy map view
│   │   │   └── about/                # About and informational pages
│   │   ├── (auth)/                   # Authentication flow
│   │   │   ├── login/                # Multi-role login
│   │   │   ├── register/
│   │   │   │   ├── patient/          # Patient registration
│   │   │   │   └── pharmacy/         # Pharmacy registration with document upload
│   │   │   ├── verify-email/         # Email verification
│   │   │   └── forgot-password/      # Password recovery
│   │   ├── (patient)/                # Patient dashboard (protected)
│   │   │   ├── dashboard/            # Patient overview
│   │   │   ├── reports/              # Submitted reports history
│   │   │   ├── favorites/            # Saved pharmacies/medicines
│   │   │   └── profile/              # Account settings
│   │   ├── (pharmacy)/               # Pharmacy dashboard (protected)
│   │   │   ├── dashboard/            # Pharmacy overview
│   │   │   ├── inventory/            # Medicine inventory management
│   │   │   │   ├── add/              # Add new medicine
│   │   │   │   ├── bulk-upload/      # CSV/Excel upload interface
│   │   │   │   └── [id]/             # Edit specific medicine
│   │   │   ├── profile/              # Pharmacy settings
│   │   │   ├── documents/            # License and verification documents
│   │   │   └── reports/              # Reports received
│   │   ├── (admin)/                  # Admin panel (protected)
│   │   │   ├── dashboard/            # Admin overview
│   │   │   ├── pharmacies/           # Pharmacy management
│   │   │   │   ├── pending/          # Pending verification queue
│   │   │   │   ├── verified/         # Verified pharmacies
│   │   │   │   ├── rejected/         # Rejected applications
│   │   │   │   └── [id]/             # Individual review
│   │   │   ├── medicines/            # Medicine database management
│   │   │   ├── reports/              # Report management
│   │   │   │   ├── pending/
│   │   │   │   ├── resolved/
│   │   │   │   └── [id]/
│   │   │   ├── users/                # User management
│   │   │   └── analytics/            # System insights
│   │   ├── api/                      # Route Handlers (proxy to Laravel)
│   │   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── medicines/            # Medicine CRUD and search
│   │   │   ├── pharmacies/           # Pharmacy endpoints and nearby search
│   │   │   ├── inventory/            # Stock updates and bulk uploads
│   │   │   ├── reports/              # Report submission and management
│   │   │   ├── verification/         # Pharmacy verification
│   │   │   └── upload/               # File upload handling
│   │   ├── _actions/                 # Server Actions (private)
│   │   ├── _lib/                     # Server-side utilities (API client, auth helpers)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   └── instrumentation.ts
│   ├── components/                   # React components
│   │   ├── ui/                       # shadcn/ui base components
│   │   ├── layout/                   # Header, footer, sidebar, navigation
│   │   ├── forms/                    # All form components (login, registration, search, reports, etc.)
│   │   ├── medicine/                 # Medicine-specific components (cards, lists, search, filters, badges)
│   │   ├── pharmacy/                 # Pharmacy components (cards, lists, markers, ratings, info windows)
│   │   ├── map/                      # Map components (main map, controls, location picker, distance calc)
│   │   ├── admin/                    # Admin-specific (verification queue, document viewer, analytics)
│   │   ├── inventory/                # Inventory components (tables, toggles, CSV preview, history)
│   │   ├── common/                   # Shared components (loading, errors, empty states, dialogs)
│   │   └── providers/                # Context providers (auth, theme, map, query)
│   ├── hooks/                        # Custom React hooks
│   │   ├── auth/                     # Authentication and role-based hooks
│   │   ├── api/                      # Data fetching hooks (medicines, pharmacies, inventory, reports, verification)
│   │   ├── map/                      # Map-related hooks (geolocation, nearby search, bounds, directions)
│   │   ├── ui/                       # UI state hooks (toast, modal, pagination)
│   │   └── utils/                    # Utility hooks (debounce, local storage, media queries)
│   ├── lib/                          # Client-side utilities
│   │   │                             # API client, auth helpers, validation schemas,
│   │   │                             # constants, map config, file upload utilities
│   ├── store/                        # State management (Zustand)
│   │   ├── slices/                   # State slices (auth, search, map, UI preferences)
│   │   └── providers/                # Store providers and configuration
│   ├── types/                        # TypeScript definitions
│   │   │                             # All entity types: User, Medicine, Pharmacy, Inventory,
│   │   │                             # Report, Document, Verification, API, Map/Location, Global
│   ├── styles/                       # CSS files
│   │   ├── globals.css               # Global styles and Tailwind imports
│   │   ├── components.css
│   │   └── themes/                   # Light/dark theme definitions
│   └── utils/                        # Pure utility functions
│       │                             # Date, string, distance calculations, coordinate conversions,
│       │                             # CSV parsing, data formatting
├── middleware.ts                     # Auth middleware and role-based routing
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind + shadcn configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies and scripts
├── .env.local                        # Environment variables
├── .env.example                      # Environment template
└── README.md                         # Project documentation
```

## Directory Organization Principles

### Route Groups by Role
- **`(public)/`**: Unauthenticated access for medicine search and pharmacy discovery
- **`(auth)/`**: Authentication flows for all user types
- **`(patient)/`**: Patient-specific features and dashboard
- **`(pharmacy)/`**: Pharmacy management and inventory tools
- **`(admin)/`**: Administrative verification and system management

### Component Organization Strategy
Components are organized by feature domain rather than technical function:
- **`medicine/`**: All medicine-related UI components (search, display, filters)
- **`pharmacy/`**: Pharmacy display components (cards, lists, map integration)
- **`map/`**: Map-specific components (controls, markers, location services)
- **`admin/`**: Administrative tools (verification, document review, analytics)
- **`inventory/`**: Inventory management UI (stock updates, bulk uploads)
- **`forms/`**: All form components across the application
- **`common/`**: Shared, reusable components used across features

### API Route Structure
All API routes proxy requests to the Laravel backend:
- **`auth/`**: Login, registration, password management
- **`medicines/`**: Search, list, and retrieve medicine data
- **`pharmacies/`**: Pharmacy data with geolocation support
- **`inventory/`**: Stock updates, bulk uploads
- **`reports/`**: Report submission and management
- **`verification/`**: Pharmacy verification workflows
- **`upload/`**: Document and file upload handling

### Custom Hooks Pattern
Hooks are organized by domain and responsibility:
- **`auth/`**: Authentication state, user data, role checking
- **`api/`**: Data fetching for each entity (medicines, pharmacies, reports, etc.)
- **`map/`**: Geolocation, proximity search, map state management
- **`ui/`**: UI state (modals, toasts, pagination)
- **`utils/`**: General-purpose hooks (debounce, storage, media queries)

### Type Definitions
TypeScript types mirror database entities and API contracts:
- Entity types for all database tables (User, Medicine, Pharmacy, Inventory, Report, Document)
- Enum types for statuses (verification, account, report types)
- API request/response interfaces
- Map and location data types
- Global shared types

### State Management
- **Server State**: React Query for all API data (caching, optimistic updates)
- **Client State**: Zustand for UI preferences, search filters, map state
- **Form State**: React Hook Form for all forms
- **URL State**: Next.js search params for shareable search states

## Environment Variables

```bash
# Laravel Backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
API_SECRET_KEY=your-secret-key

# Maps Integration
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
# or
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_MIME_TYPES=application/pdf,image/jpeg,image/png
```

## Database Entities (PostgreSQL with PostGIS)

### Core Tables
- **users**: Multi-role accounts (patient, pharmacist, admin)
- **pharmacies**: Pharmacy information with PostGIS geometry for locations
- **medicines**: Official medicine catalog with categories
- **pharmacy_medicines**: Many-to-many inventory relationship
- **pharmacy_documents**: License and verification document storage
- **pharmacy_reports**: User-submitted reports with categorization

### Custom Enum Types
- **verification_status**: pending, verified, rejected
- **account_status**: active, suspended, flagged
- **report_status**: pending, resolved, dismissed
- **report_type**: wrong_availability, wrong_location, wrong_contact, other

## Key Workflows

### Medicine Search Flow
1. User enters medicine name in search component
2. Real-time autocomplete suggestions from medicines API
3. Results display pharmacies with availability status
4. Map view shows pharmacy locations with stock indicators
5. Distance calculated from user's current location

### Pharmacy Verification Flow
1. Pharmacy registers with license number and documents
2. Documents uploaded to storage via upload API
3. Admin reviews application in verification queue
4. License validated against official records
5. Approval/rejection with reasons stored in database
6. Pharmacy receives verified badge upon approval

### Inventory Management Flow
1. Pharmacy logs into dashboard
2. Manual updates: Toggle availability for individual medicines
3. Bulk updates: Upload CSV/Excel file from PMS
4. CSV parsed and validated on client before submission
5. API updates pharmacy_medicines table
6. Changes timestamped for credibility tracking

### Report Submission Flow
1. User encounters incorrect information
2. Selects report type (availability, location, contact, other)
3. Submits report with details
4. Report stored with pending status
5. Admin reviews and resolves/dismisses
6. Resolution notes added to report

## Security Implementation

### Authentication & Authorization
- Multi-level role-based access control (RBAC)
- Protected routes using Next.js middleware
- JWT tokens from Laravel Sanctum
- Role verification on server and client

### Data Protection
- HTTPS for all communications
- Input validation with Zod schemas
- File upload scanning and type validation
- CSRF protection for all mutations

### Pharmacy Credibility
- License number verification required
- Document review before approval
- Verified badges for trusted pharmacies
- Timestamp audit trails on all updates

## Performance Considerations

### Next.js 16+ Optimizations
- Turbopack for fast development and production builds
- React 19 server components by default
- Partial Pre-Rendering (PPR) for search pages
- Image optimization for pharmacy photos
- Route prefetching for instant navigation

### Caching Strategy
- React Query for API response caching with stale-while-revalidate
- Static generation for medicine catalog pages
- Dynamic rendering for real-time availability data
- Map tile caching for faster load times

### Map Performance
- Marker clustering for dense pharmacy areas
- Lazy loading for pharmacy details
- Viewport-based data fetching
- Debounced map movement updates

## Development Best Practices

### Code Organization
- Feature-based component folders
- Colocation of related code
- Consistent naming conventions
- TypeScript strict mode enabled

### Error Handling
- Error boundaries for component errors
- API error interceptors with user-friendly messages
- Form validation with inline error display
- Toast notifications for user feedback

### Testing Strategy
- Unit tests for utilities and hooks (Vitest)
- Component tests for critical UI (Vitest + Testing Library)
- E2E tests for user flows (Playwright)
- API testing via Postman

### Accessibility
- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader friendly components
- Color contrast compliance

This structure provides a scalable foundation for the Pharmy platform while maintaining flexibility for future enhancements like barcode scanning, price comparison, and mobile app development.
