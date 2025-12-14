export interface MedicineStock {
    name: string
    stock: "In Stock" | "Low Stock" | "Out of Stock"
    quantity: string
}

export interface Pharmacy {
    id: string
    name: string
    address: string
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

export const MOCK_PHARMACIES: Pharmacy[] = [
    {
        id: "1",
        name: "Aster Pharmacy",
        address: "123 Main Street, Downtown",
        distance: "0.5 km",
        rating: 4.8,
        phone: "+971 4 123 4567",
        status: "Open",
        closingTime: "22:00",
        coordinates: [33.8938, 35.5018],
        email: "aster.downtown@pharmacy.ae",
        workingHours: "08:00 - 22:00",
        availability: [
            { name: "Insulin Apidra", stock: "In Stock", quantity: "2/2" },
            { name: "Paracetamol 500mg", stock: "In Stock", quantity: "10/10" },
            { name: "Amoxicillin", stock: "Low Stock", quantity: "1/5" }
        ]
    },
    {
        id: "2",
        name: "HealthPlus Pharmacy",
        address: "456 Oak Avenue, City Center",
        distance: "1.2 km",
        rating: 4.6,
        phone: "+1 234 567 8901",
        status: "Open",
        closingTime: "20:00",
        coordinates: [33.8886, 35.4955],
        email: "healthplus@pharmacy.com",
        workingHours: "09:00 - 20:00",
        availability: [
            { name: "Panadol Extra", stock: "In Stock", quantity: "20+" },
            { name: "Vitamin C", stock: "Out of Stock", quantity: "0" }
        ]
    },
    {
        id: "3",
        name: "MediQuick Pharmacy",
        address: "789 Park Road, Westside",
        distance: "1.8 km",
        rating: 4.9,
        phone: "+1 234 567 8902",
        status: "Closing soon",
        coordinates: [33.8900, 35.4800],
        email: "info@mediquick.com",
        workingHours: "24 Hours",
        availability: [
            { name: "Aspirin", stock: "In Stock", quantity: "50+" }
        ]
    },
    {
        id: "4",
        name: "WellCare Pharmacy",
        address: "321 Elm Street, Eastside",
        distance: "2.3 km",
        rating: 4.5,
        phone: "+1 234 567 8903",
        status: "Open",
        closingTime: "21:00",
        coordinates: [33.8950, 35.5100],
        email: "contact@wellcare.com",
        workingHours: "08:00 - 21:00",
        availability: []
    },
    {
        id: "5",
        name: "QuickMed Pharmacy",
        address: "654 Pine Avenue, North District",
        distance: "2.7 km",
        rating: 4.7,
        phone: "+1 234 567 8904",
        status: "Closed",
        coordinates: [33.9000, 35.5000],
        email: "support@quickmed.com",
        workingHours: "08:00 - 18:00",
        availability: []
    },
    {
        id: "6",
        name: "FamilyFirst Pharmacy",
        address: "987 Maple Drive, South District",
        distance: "3.1 km",
        rating: 4.4,
        phone: "+1 234 567 8905",
        status: "Open",
        closingTime: "23:00",
        coordinates: [33.8800, 35.5050],
        email: "family@pharmacy.com",
        workingHours: "10:00 - 23:00",
        availability: []
    },
]

export const MOCK_MEDICINES = [
    "Panadol",
    "Panadol Extra",
    "Panadol Cold & Flu",
    "Panadol Night",
    "Paracetamol",
    "Paracetamol 500mg",
    "Insulin",
    "Insulin Aspart",
    "Insulin Apidra",
    "Insulin Lispro",
    "Ibuprofen",
    "Aspirin",
    "Amoxicillin",
    "Augmentin",
    "Vitamin C",
    "Vitamin D",
    "Vitamin B12",
    "Zinc",
    "Magnesium",
    "Omeprazole",
    "Metformin",
    "Atorvastatin",
]

export const POPULAR_SEARCHES = ["Insulin", "Paracetamol", "Aspirin", "Amoxicillin"]

// Dashboard Mock Data
export const MOCK_DASHBOARD_STATS = {
    totalMedicines: 28,
    inStock: 22,
    lowStock: 4,
    outOfStock: 2,
}

export interface RecentActivity {
    id: string
    medicineName: string
    action: string
    timestamp: string
    status: "in_stock" | "low_stock" | "out_of_stock"
}

export const MOCK_RECENT_ACTIVITY: RecentActivity[] = [
    {
        id: "1",
        medicineName: "Insulin Apidra",
        action: "Updated to In Stock",
        timestamp: "2 mins ago",
        status: "low_stock",
    },
    {
        id: "2",
        medicineName: "Paracetamol 500mg",
        action: "Updated to In Stock",
        timestamp: "15 mins ago",
        status: "low_stock",
    },
    {
        id: "3",
        medicineName: "Amoxicillin",
        action: "Marked as Low Stock",
        timestamp: "1 hour ago",
        status: "low_stock",
    },
]

// Current Pharmacy Info (for logged-in pharmacy user)
export const MOCK_CURRENT_PHARMACY = {
    id: "1",
    name: "ASTER PHARMACY",
    location: "Dubai, International City, T-8601",
    email: "aster.downtown@pharmacy.ae",
    phone: "+971 4 123 4567",
    licenseNumber: "PH-2024-001",
    verified: true,
}

// Mock User Accounts for Testing
export interface MockUser {
    email: string
    password: string
    role: "patient" | "pharmacy" | "admin"
    name: string
}

export const MOCK_USERS: MockUser[] = [
    {
        email: "patient@test.com",
        password: "patient123",
        role: "patient",
        name: "Test Patient",
    },
    {
        email: "pharmacy@test.com",
        password: "pharmacy123",
        role: "pharmacy",
        name: "Aster Pharmacy",
    },
    {
        email: "admin@test.com",
        password: "admin123",
        role: "admin",
        name: "Admin User",
    },
]

export interface PharmacyInventoryItem {
    id: string
    name: string
    available: boolean
    quantity: number
    updatedAt: string
}

export const MOCK_PHARMACY_INVENTORY: PharmacyInventoryItem[] = [
    {
        id: "med-1",
        name: "Insulin Apidra",
        available: true,
        quantity: 12,
        updatedAt: "2025-12-14T06:55:00+02:00",
    },
    {
        id: "med-2",
        name: "Paracetamol 500mg",
        available: true,
        quantity: 48,
        updatedAt: "2025-12-14T06:50:00+02:00",
    },
    {
        id: "med-3",
        name: "Amoxicillin",
        available: true,
        quantity: 4,
        updatedAt: "2025-12-14T06:40:00+02:00",
    },
    {
        id: "med-4",
        name: "Panadol Extra",
        available: true,
        quantity: 0,
        updatedAt: "2025-12-14T06:35:00+02:00",
    },
    {
        id: "med-5",
        name: "Ibuprofen",
        available: false,
        quantity: 0,
        updatedAt: "2025-12-14T06:20:00+02:00",
    },
    {
        id: "med-6",
        name: "Vitamin C",
        available: true,
        quantity: 7,
        updatedAt: "2025-12-14T06:15:00+02:00",
    },
    {
        id: "med-7",
        name: "Aspirin",
        available: true,
        quantity: 19,
        updatedAt: "2025-12-14T06:10:00+02:00",
    },
]
