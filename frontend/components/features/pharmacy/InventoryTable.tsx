"use client"

import * as React from "react"
import { Search, Save, XCircle } from "lucide-react"
import type { PharmacyInventoryItem } from "@/lib/mock-data"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

type InventoryTableProps = {
    initialItems: PharmacyInventoryItem[]
}

type PendingUpdate = {
    available: boolean
    quantity: number
}

function normalizeQuantity(value: number) {
    if (!Number.isFinite(value)) return 0
    return Math.max(0, Math.floor(value))
}

function statusLabel(item: { available: boolean; quantity: number }) {
    if (!item.available) return "Unavailable"
    if (item.quantity <= 0) return "Out of stock"
    if (item.quantity <= 5) return "Low stock"
    return "In stock"
}

function statusClasses(label: string) {
    switch (label) {
        case "Unavailable":
            return "bg-gray-100 text-gray-700"
        case "Out of stock":
            return "bg-red-50 text-red-700"
        case "Low stock":
            return "bg-amber-50 text-amber-700"
        default:
            return "bg-green-50 text-green-700"
    }
}

export function InventoryTable({ initialItems }: InventoryTableProps) {
    const [query, setQuery] = React.useState("")

    const [items, setItems] = React.useState<PharmacyInventoryItem[]>(
        () => initialItems
    )

    const [pending, setPending] = React.useState<Record<string, PendingUpdate>>(
        {}
    )

    const filtered = React.useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return items
        return items.filter((i) => i.name.toLowerCase().includes(q))
    }, [items, query])

    const pendingCount = Object.keys(pending).length

    const getEffective = React.useCallback(
        (item: PharmacyInventoryItem) => {
            const p = pending[item.id]
            if (!p) return item
            return { ...item, ...p }
        },
        [pending]
    )

    const markPending = React.useCallback(
        (
            id: string,
            updater: (current: { available: boolean; quantity: number }) => {
                available: boolean
                quantity: number
            }
        ) => {
            setPending((prev) => {
                const current = prev[id]
                const base = current ?? {
                    available:
                        items.find((i) => i.id === id)?.available ?? false,
                    quantity: items.find((i) => i.id === id)?.quantity ?? 0,
                }

                const next = updater(base)

                const initial = items.find((i) => i.id === id)
                if (
                    initial &&
                    initial.available === next.available &&
                    initial.quantity === next.quantity
                ) {
                    const { [id]: _, ...rest } = prev
                    return rest
                }

                return {
                    ...prev,
                    [id]: {
                        available: next.available,
                        quantity: normalizeQuantity(next.quantity),
                    },
                }
            })
        },
        [items]
    )

    const handleToggleAvailable = (id: string, checked: boolean) => {
        markPending(id, (current) => {
            const available = checked
            const quantity = available ? current.quantity : 0
            return { available, quantity }
        })
    }

    const handleQuantityChange = (id: string, value: string) => {
        const parsed = Number(value)
        markPending(id, (current) => ({
            available: current.available,
            quantity: Number.isFinite(parsed) ? parsed : 0,
        }))
    }

    const handleDiscard = () => {
        setPending({})
    }

    const handleSave = () => {
        const now = new Date().toISOString()

        setItems((prev) =>
            prev.map((item) => {
                const update = pending[item.id]
                if (!update) return item
                return {
                    ...item,
                    available: update.available,
                    quantity: normalizeQuantity(update.quantity),
                    updatedAt: now,
                }
            })
        )

        const ids = Object.keys(pending)
        console.log("[pharmacy][inventory] save", {
            updates: ids.map((id) => ({ id, ...pending[id] })),
        })

        setPending({})
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 w-full sm:max-w-md">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search medicines..."
                    />
                </div>

                <div className="flex items-center gap-2 justify-end">
                    {pendingCount > 0 && (
                        <span className="text-xs text-gray-500">
                            {pendingCount} unsaved change
                            {pendingCount === 1 ? "" : "s"}
                        </span>
                    )}
                    <Button
                        variant="outline"
                        onClick={handleDiscard}
                        disabled={pendingCount === 0}
                    >
                        <XCircle className="h-4 w-4" />
                        Discard
                    </Button>
                    <Button onClick={handleSave} disabled={pendingCount === 0}>
                        <Save className="h-4 w-4" />
                        Save
                    </Button>
                </div>
            </div>

            <div className="overflow-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="text-left font-semibold px-4 py-3">
                                Medicine
                            </th>
                            <th className="text-left font-semibold px-4 py-3">
                                Status
                            </th>
                            <th className="text-left font-semibold px-4 py-3">
                                Available
                            </th>
                            <th className="text-left font-semibold px-4 py-3">
                                Quantity
                            </th>
                            <th className="text-left font-semibold px-4 py-3">
                                Last updated
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((item) => {
                            const effective = getEffective(item)
                            const label = statusLabel(effective)

                            return (
                                <tr
                                    key={item.id}
                                    className="border-t border-gray-100 hover:bg-gray-50/50"
                                >
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {item.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={
                                                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium " +
                                                statusClasses(label)
                                            }
                                        >
                                            {label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={effective.available}
                                                onCheckedChange={(v) =>
                                                    handleToggleAvailable(
                                                        item.id,
                                                        Boolean(v)
                                                    )
                                                }
                                            />
                                            <span className="text-gray-600">
                                                {effective.available
                                                    ? "Yes"
                                                    : "No"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Input
                                            type="number"
                                            min={0}
                                            value={String(effective.quantity)}
                                            onChange={(e) =>
                                                handleQuantityChange(
                                                    item.id,
                                                    e.target.value
                                                )
                                            }
                                            disabled={!effective.available}
                                            className="w-28"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                        {effective.updatedAt}
                                    </td>
                                </tr>
                            )
                        })}
                        {filtered.length === 0 && (
                            <tr className="border-t border-gray-100">
                                <td
                                    className="px-4 py-10 text-center text-gray-500"
                                    colSpan={5}
                                >
                                    No medicines match your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
