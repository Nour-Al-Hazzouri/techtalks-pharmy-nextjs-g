# Task PHAR-45 Development Log - Fullscreen Map Interface

## Log Entry #1 - 2025-12-13T09:45:00+02:00

### 🎯 User Prompt
**Context**: User started Task 5.1 (Map Integration) on branch `PHAR-45-...`.
**Request**: 
```
working on a new branch for the initial map fullscreen interface... @[...task 5.1...] 
Before we start, do you suggest we start trying to make a real map integration... or mock map...?
```
**Attachments**: Design image `uploaded_image_1765611712329.png`.

### 🤖 AI Response Summary
**Analysis of Design**:
- **Layout**: Full-screen split view (Map Left, List Right).
- **Header**: Compact header with "Pharmacy Finder", Search query display, and "New Search" action.
- **Map**: Pins (Red/Gray/Orange), Zoom controls, User location button.
- **List**: "Available at X Pharmacies", Sorting options.
- **Cards**: Pharmacy info (Name, Address, Distance, Phone, Rating, Status Badge).

**Recommendation Strategy**:
- **Approach**: Suggest **Real Map Component** (Leaflet/Mapbox) + **Mock Data** (Markers).
- **Reasoning**: 
    1.  The core value of this feature is *interactivity* (panning, clicking pins). A static mock map (image) fails to deliver this.
    2.  Frontend map libraries don't need a backend API to function; they just need a tile provider.
    3.  Mocking the *data* (pharmacies.json) is sufficient to decouple from the backend while keeping the UI realistic.
-   **Tech Choice**: Recommending **Leaflet (react-leaflet)** as the default "zero-configuration" option (free, no key needed) unless the user has a Mapbox/Google key ready.

### 📝 Plan
1.  Components: `MapContainer`, `PharmacyList`, `PharmacyCard`, `MapHeader`.
2.  Layout: `app/(public)/map/page.tsx` (New route or replace home? Probably `/map`).
