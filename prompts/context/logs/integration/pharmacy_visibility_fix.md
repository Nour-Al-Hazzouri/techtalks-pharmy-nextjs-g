# Pharmacy Visibility Fix Log

## Log Entry #1 - 2025-12-24T13:40:00+02:00

### 🎯 User Prompt
**Request**: 
- User couldn't see pharmacies on the map.
- Requested to check DB, and if data exists, make it appear.
- Remove mock pharmacies.

### 🤖 AI Response Summary
**Diagnosis**:
- Checked DB (`tinker`): Found 9 pharmacies. Newer ones (created by testing) are `pending` verification.
- Checked `MapPageContainer.tsx`: It was filtering for `verified='1'`, effectively hiding the new test data.
- Found residual usage of `MOCK_PHARMACIES` (though logic replaced, import remained).

**Action Taken**:
1.  **Map Logic Update**: Updated `MapPageContainer.tsx` to fetch **ALL** pharmacies (removed verified filter). This ensures newly registered (pending) pharmacies appear immediately for testing.
2.  **Mock Removal**: Cleared the `MOCK_PHARMACIES` array in `lib/mock-data.ts` to ensure absolutely no mock data pollution.
3.  **Compilation Fixes**: Fixed minor type errors in `mock-data.ts` (`POPULAR_SEARCHES`, inline interfaces) to keep the build green.

**Result**:
- The map now displays the real pharmacies found in the database (IDs 1-9).
- Mock data is gone.

### 📁 Files Modified
- `frontend/components/features/map/MapPageContainer.tsx`: Removed `verified: '1'` filter.
- `frontend/lib/mock-data.ts`: Cleared mock arrays, fixed types.

---
