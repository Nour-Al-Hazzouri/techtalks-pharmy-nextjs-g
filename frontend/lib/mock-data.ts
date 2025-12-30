
export interface MedicineStock {
    name: string
    generic_name?: string
    category?: string
    description?: string
    stock: "In Stock" | "Low Stock" | "Out of Stock"
    quantity: string | number
    price?: number
    expires_at?: string
}

export interface Pharmacy {
    id: string
    name: string
    address: string;
    phone: string
    license_number?: string
    verification_status?: string
    total_reports?: number
    distance?: number
    coordinates: [number, number] // [lat, lng]
    availability?: MedicineStock[]
    isCheapest?: boolean
}
