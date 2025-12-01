# Next.js v16+ Best Practices for Pharmy Project

**Version:** Next.js 16+ (Released October 21, 2025)  
**Project:** Pharmy - Medicine Availability Platform  
**Last Updated:** November 30, 2025

---

## 1. Server vs Client Components Separation (Avoiding Hydration Errors)

### Core Principle
**Default to Server Components unless interactivity is required.** This is the #1 rule for Next.js 16+.

### Server Components Requirements

**Use Server Components for:**
- Database queries and API calls to Laravel backend
- Fetching pharmacy locations and medicine inventory
- User authentication checks
- SEO-critical content (pharmacy listings, medicine search results)
- Static layouts (headers, footers, navigation)

**Examples in Pharmy:**
- `app/page.tsx` (homepage with map)
- `app/(patient)/pharmacies/[id]/page.tsx` (pharmacy details page)
- `app/(pharmacy)/inventory/page.tsx` (inventory list)
- All data fetching components

**Requirements:**
- ✅ No `'use client'` directive
- ✅ Can be async functions
- ✅ Access backend resources directly
- ✅ Zero JavaScript shipped to client

---

### Client Components Requirements

**Use `'use client'` ONLY for:**
- Interactive map components (Google Maps/Mapbox)
- Search autocomplete with state
- Form inputs with validation
- Toggle switches (medicine availability)
- Modal dialogs
- Dropdowns and filters
- Any component using `useState`, `useEffect`, `onClick`, etc.

**Examples in Pharmy:**
- Map component with pharmacy markers
- Medicine search bar with autocomplete
- Stock availability toggle switches
- Report submission forms
- File upload components (pharmacy documents)

**Requirements:**
- ✅ Add `'use client'` at top of file
- ✅ Keep components small and focused
- ✅ Receive data as props from Server Components
- ❌ Never fetch data directly (receive from parent Server Component)
- ❌ Never access backend resources or secrets

---

### Composition Pattern (Most Important)

**Best Practice: Nest Client Components inside Server Components**

```tsx
// ✅ CORRECT PATTERN
// app/map/page.tsx (Server Component)
import { getPharmacies } from '@/lib/api/pharmacies';
import { InteractiveMap } from '@/components/map/InteractiveMap'; // Client Component

export default async function MapPage() {
  // Fetch data on server
  const pharmacies = await getPharmacies();
  
  return (
    <div>
      <h1>Find Pharmacies</h1>
      {/* Pass data to client component */}
      <InteractiveMap pharmacies={pharmacies} />
    </div>
  );
}
```

```tsx
// ❌ WRONG PATTERN
// app/map/page.tsx (Client Component - unnecessary)
'use client';

import { useState, useEffect } from 'react';

export default function MapPage() {
  const [pharmacies, setPharmacies] = useState([]);
  
  useEffect(() => {
    // Bad: Client-side data fetching when server-side is better
    fetchPharmacies().then(setPharmacies);
  }, []);
  
  return <InteractiveMap pharmacies={pharmacies} />;
}
```

---

### Avoiding Hydration Errors

**What Causes Hydration Errors:**
1. Using `new Date()` or `Math.random()` directly in JSX
2. Accessing `window`, `localStorage`, or browser APIs during SSR
3. Invalid HTML nesting (`<p>` inside `<p>`, `<div>` inside `<p>`)
4. Third-party libraries that manipulate DOM
5. Different content on server vs client

**Solutions:**

**1. Use `useEffect` for Client-Only Content**
```tsx
'use client';

export function ClientOnlyTimestamp() {
  const [time, setTime] = useState<string | null>(null);
  
  useEffect(() => {
    setTime(new Date().toLocaleString());
  }, []);
  
  // Prevents hydration error by rendering null on server
  if (!time) return null;
  
  return <span>{time}</span>;
}
```

**2. Disable SSR for Map Components**
```tsx
'use client';

import dynamic from 'next/dynamic';

// Google Maps requires browser APIs
const MapComponent = dynamic(
  () => import('@/components/map/GoogleMap'),
  { ssr: false, loading: () => <div>Loading map...</div> }
);
```

**3. Ensure Valid HTML Structure**
```tsx
// ❌ BAD: Will cause hydration error
<p>
  <div>Pharmacy details</div>
</p>

// ✅ GOOD
<div>
  <p>Pharmacy details</p>
</div>
```

---

## 2. Modular Architecture Requirements

### Page Structure

**Rule: `page.tsx` should only import components, not contain logic**

```tsx
// ❌ BAD: All code in page.tsx
// app/(pharmacy)/inventory/page.tsx
export default function InventoryPage() {
  return (
    <div>
      <header>...</header>
      <table>...</table>
      <form>...</form>
      <footer>...</footer>
    </div>
  );
}
```

```tsx
// ✅ GOOD: Modular components
// app/(pharmacy)/inventory/page.tsx
import { InventoryHeader } from '@/components/features/inventory/InventoryHeader';
import { InventoryTable } from '@/components/features/inventory/InventoryTable';
import { BulkUploadForm } from '@/components/features/inventory/BulkUploadForm';
import { getInventory } from '@/lib/api/inventory';

export default async function InventoryPage() {
  const inventory = await getInventory();
  
  return (
    <div>
      <InventoryHeader />
      <InventoryTable items={inventory} />
      <BulkUploadForm />
    </div>
  );
}
```

### Code Reusability Requirements

**1. Create Reusable Hooks**
```typescript
// hooks/useMedicineSearch.ts
export function useMedicineSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const debouncedSearch = useMemo(
    () => debounce(async (q: string) => {
      if (q.length >= 3) {
        const data = await searchMedicines(q);
        setResults(data);
      }
    }, 300),
    []
  );
  
  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);
  
  return { query, setQuery, results };
}
```

**2. Create Shared Types**
```typescript
// types/pharmacy.ts
export interface Pharmacy {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  verified: boolean;
  medicines: Medicine[];
}

// types/medicine.ts
export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  available: boolean;
  lastUpdated: Date;
}
```

**3. Use Barrel Exports**
```typescript
// components/features/map/index.ts
export { InteractiveMap } from './InteractiveMap';
export { PharmacyMarker } from './PharmacyMarker';
export { MapControls } from './MapControls';

// Usage
import { InteractiveMap, PharmacyMarker } from '@/components/features/map';
```

---

## 3. Production-Ready Code Practices

### Environment Variables

**Requirements:**
✅ All secrets in `.env.local`  
✅ Never commit `.env.local`  
✅ Provide `.env.example` template  
✅ Validate env vars at build time  
✅ Only use `NEXT_PUBLIC_` prefix for truly public variables

```bash
# .env.local
# Backend API
API_BASE_URL=http://localhost:8000/api
API_KEY=secret_key_here

# Maps (public - needed in browser)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key

# Database (server-side only)
DATABASE_URL=postgresql://...
```

```typescript
// lib/config/env.ts
const requiredEnvVars = {
  apiBaseUrl: process.env.API_BASE_URL,
  apiKey: process.env.API_KEY,
  mapsKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
} as const;

// Validate at build time
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const env = requiredEnvVars;
```

---

### Type Safety Requirements

**All API responses must be typed:**

```typescript
// types/api.ts
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

// services/api/pharmacies.ts
import type { ApiResponse } from '@/types/api';
import type { Pharmacy } from '@/types/pharmacy';

export async function getNearbyPharmacies(
  lat: number,
  lng: number
): Promise<ApiResponse<Pharmacy[]>> {
  const res = await fetch(
    `${env.apiBaseUrl}/pharmacies/nearby?lat=${lat}&lng=${lng}`
  );
  return res.json();
}
```

---

### Input Validation

**All user inputs must be validated with Zod**

```typescript
// lib/validation/pharmacy.ts
import { z } from 'zod';

export const pharmacyRegistrationSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^\+961[0-9]{8}$/, 'Invalid Lebanese phone number'),
  licenseNumber: z.string().min(1, 'License number required'),
  address: z.string().min(10, 'Full address required'),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
});

export type PharmacyRegistration = z.infer<typeof pharmacyRegistrationSchema>;
```

---

### Error Handling Requirements

**1. Create Route-Level Error Boundaries**
```tsx
// app/(pharmacy)/inventory/error.tsx
'use client';

export default function InventoryError({ error, reset }: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="error-container">
      <h2>Failed to load inventory</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

**2. Create Custom 404 Pages**
```tsx
// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <Link href="/">Return Home</Link>
    </div>
  );
}
```

**3. API Error Handling Pattern**
```typescript
// lib/api/client.ts
export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${env.apiBaseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('API call failed:', error);
    return {
      success: false,
      data: null as any,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}
```

---

### Security Requirements

**1. Authentication**
- ✅ Use JWT tokens from Laravel Sanctum
- ✅ Store tokens in httpOnly cookies (not localStorage)
- ✅ Implement middleware for protected routes
- ✅ Verify user role before rendering admin/pharmacy content

**2. Input Sanitization**
- ✅ Validate all form inputs with Zod
- ✅ Sanitize user-generated content before display
- ✅ Never use `dangerouslySetInnerHTML` without sanitization

**3. File Upload Security**
- ✅ Validate file types (only PDF/JPG/PNG for documents)
- ✅ Limit file size (max 5MB)
- ✅ Scan uploaded files on backend
- ✅ Store files with hashed names

**4. Rate Limiting**
- ✅ Implement rate limiting on login/register
- ✅ Limit API calls per user (handled by Laravel backend)

---

## 4. Performance Optimization Requirements

### Image Optimization

**Always use `next/image` component:**

```tsx
import Image from 'next/image';

// Pharmacy logo
<Image
  src="/pharmacies/logo-123.jpg"
  alt="Pharmacy name"
  width={200}
  height={200}
  quality={85}
  loading="lazy"
/>

// Above-the-fold images
<Image
  src="/hero-map.jpg"
  alt="Map"
  width={1200}
  height={600}
  priority // Loads immediately
/>
```

---

### Code Splitting

**Lazy load heavy components:**

```tsx
import dynamic from 'next/dynamic';

// Google Maps is heavy - load only when needed
const MapComponent = dynamic(
  () => import('@/components/features/map/InteractiveMap'),
  {
    ssr: false,
    loading: () => <MapSkeleton />,
  }
);

// CSV parser library - load on demand
const BulkUploader = dynamic(
  () => import('@/components/features/inventory/BulkUploader')
);
```

---

### Caching Strategy (Next.js 16+)

**Use `use cache` directive for data that doesn't change often:**

```typescript
// lib/data/medicines.ts
'use cache';

export async function getAllMedicines() {
  const res = await fetch(`${env.apiBaseUrl}/medicines`);
  return res.json();
}

// Or with granular control
import { unstable_cache } from 'next/cache';

export const getCachedMedicines = unstable_cache(
  async () => {
    return await fetch(`${env.apiBaseUrl}/medicines`).then(r => r.json());
  },
  ['medicines-list'],
  { revalidate: 3600, tags: ['medicines'] } // Cache for 1 hour
);
```

---

### Font Optimization

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevents invisible text during load
  variable: '--font-inter',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

---

## 5. Pharmy-Specific Implementation Checklist

### Map Component Requirements
- [ ] Use Server Component for page, Client Component for map
- [ ] Disable SSR for map component (`ssr: false`)
- [ ] Load map library dynamically
- [ ] Fetch pharmacy data on server, pass as props
- [ ] Handle geolocation errors gracefully

### Search Component Requirements
- [ ] Server Component for search page
- [ ] Client Component for search input (autocomplete)
- [ ] Debounce search input (300ms minimum)
- [ ] Trigger search after 3 characters minimum
- [ ] Display results on map (Client Component)

### Inventory Management Requirements
- [ ] Server Component for inventory list page
- [ ] Client Component for toggle switches
- [ ] Client Component for CSV upload form
- [ ] Validate CSV structure before upload
- [ ] Show progress indicator during bulk operations

### Verification System Requirements
- [ ] Server Component for admin dashboard
- [ ] Client Component for document viewer
- [ ] Client Component for approve/reject modal
- [ ] Validate file uploads (type, size)
- [ ] Log all verification actions

### Authentication Requirements
- [ ] Server-side session validation
- [ ] Middleware protection for routes
- [ ] Role-based UI rendering
- [ ] Secure token storage (httpOnly cookies)
- [ ] Auto-redirect on unauthorized access

---

## 6. Summary: Critical Requirements

**Server/Client Separation:**
1. Default to Server Components
2. Use `'use client'` only for interactivity
3. Compose Client inside Server Components
4. Avoid hydration errors with proper patterns

**Modularity:**
1. No logic in `page.tsx` - only import components
2. Organize components by feature, not type
3. Create reusable hooks and utilities
4. Use TypeScript for all code

**Production Readiness:**
1. Validate all environment variables
2. Use Zod for input validation
3. Implement error boundaries
4. Secure file uploads and API calls
5. Add rate limiting and CSRF protection

**Performance:**
1. Use `next/image` for all images
2. Lazy load heavy components
3. Implement caching with `use cache`
4. Optimize fonts with `next/font`
5. Split code dynamically

---

**Research Sources:** Next.js 16 Official Documentation, React 19 Documentation, Next.js App Router Best Practices  
**Version:** Next.js 16.0.5 (October 2025)
