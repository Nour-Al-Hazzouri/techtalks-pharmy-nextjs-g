"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { InventoryTable } from "@/components/features/pharmacy/InventoryTable"
import { getInventory, type InventoryItem, type PaginatedResponse } from "@/lib/api/pharmacy"

export interface InventoryDisplayItem {
    id: string
    medicineId: number
    name: string
    available: boolean
    quantity: number
    price: string
    updatedAt: string
}

export function InventoryContent() {
    const [items, setItems] = React.useState<InventoryDisplayItem[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)

    const fetchInventory = React.useCallback(async () => {
        try {
            setLoading(true)
            const response = await getInventory()
            const inventoryItems = response.data.data.map((item: InventoryItem) => ({
                id: `inv-${item.id}`,
                medicineId: item.medicine_id,
                name: item.medicine_name,
                available: item.available,
                quantity: item.quantity,
                price: item.price,
                updatedAt: item.updated_at,
            }))
            setItems(inventoryItems)
        } catch (err) {
            console.error("Failed to fetch inventory:", err)
            setError("Failed to load inventory")
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchInventory()
    }, [fetchInventory])

    const total = items.length
    const available = items.filter((i) => i.available).length
    const unavailable = total - available
    const lowStock = items.filter((i) => i.available && i.quantity > 0 && i.quantity <= 5).length

    if (loading) {
        return (
            <div className="flex-1 bg-gray-50 px-4 py-4 pt-20 pb-24 md:p-6 md:pt-6 md:pb-6 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#E91E63]" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex-1 bg-gray-50 px-4 py-4 pt-20 pb-24 md:p-6 md:pt-6 md:pb-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                    {error}
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 bg-gray-50 px-4 py-4 pt-20 pb-24 md:p-6 md:pt-6 md:pb-6 overflow-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
                <p className="text-gray-500">
                    Update medicine availability and quantity for your pharmacy.
                </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Total Medicines
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{total}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Available
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{available}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Unavailable
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{unavailable}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Low Stock (≤ 5)
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{lowStock}</p>
                </div>
            </div>

            <InventoryTable items={items} onItemsChange={setItems} onRefresh={fetchInventory} />
        </div>
    )
}
