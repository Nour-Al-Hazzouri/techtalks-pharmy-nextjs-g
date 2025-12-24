
export interface MedicineStock {
    name: string
    stock: "In Stock" | "Low Stock" | "Out of Stock"
    quantity: string
}

export interface Pharmacy {
    id: string
    name: string
    address: string;
    distance: string
    rating: number
    phone: string
    status: "Open" | "Closing soon" | "Closed"
    closingTime?: string
    coordinates: [number, number] // [lat, lng]
    email?: string
    workingHours?: string
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
