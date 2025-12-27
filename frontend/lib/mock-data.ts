
export interface MedicineStock {
    name: string
    generic_name?: string
    category?: string
    description?: string
    stock: "In Stock" | "Low Stock" | "Out of Stock"
    quantity: string | number
    expires_at?: string
}

export interface Pharmacy {
    id: string
    name: string
    address: string;
    rating: number
    phone: string
    license_number?: string
    verification_status?: string
    total_reports?: number
    distance?: number
    coordinates: [number, number] // [lat, lng]
    availability?: MedicineStock[]
}

export const MOCK_PHARMACIES: Pharmacy[] = []

export const MOCK_MEDICINES: any[] = []

export const POPULAR_SEARCHES = [
    "Panadol",
    "Advil",
    "Vitamin C",
    "Masks",
    "Sanitizer"
]

export const MOCK_DASHBOARD_STATS = {}
export const MOCK_RECENT_ACTIVITY: any[] = []
export const MOCK_CURRENT_PHARMACY = {}
export const MOCK_USERS: any[] = []
export const MOCK_PHARMACY_INVENTORY: any[] = []
