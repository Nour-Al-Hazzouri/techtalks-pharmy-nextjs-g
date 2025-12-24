"use client"

import * as React from "react"
import { Plus, Search, Save, Trash2, XCircle, Loader2 } from "lucide-react"
import { addRecentActivityEntries } from "@/lib/pharmacy-recent-activity"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { updateInventoryItem, deleteInventoryItem, addInventoryItem } from "@/lib/api/pharmacy"
import type { InventoryDisplayItem } from "./InventoryContent"

type InventoryTableProps = {
    items: InventoryDisplayItem[]
    onItemsChange: React.Dispatch<React.SetStateAction<InventoryDisplayItem[]>>
    onRefresh?: () => void
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

function statusKey(item: { available: boolean; quantity: number }) {
    if (!item.available) return "out_of_stock" as const
    if (item.quantity <= 0) return "out_of_stock" as const
    if (item.quantity <= 5) return "low_stock" as const
    return "in_stock" as const
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

export function InventoryTable({ items, onItemsChange, onRefresh }: InventoryTableProps) {
    const [query, setQuery] = React.useState("")
    const [addQuery, setAddQuery] = React.useState("")
    const [saving, setSaving] = React.useState(false)

    const [pending, setPending] = React.useState<Record<string, PendingUpdate>>({})

    const filtered = React.useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return items
        return items.filter((i) => i.name.toLowerCase().includes(q))
    }, [items, query])

    const pendingCount = Object.keys(pending).length

    const getEffective = React.useCallback(
        (item: InventoryDisplayItem) => {
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
                    available: items.find((i) => i.id === id)?.available ?? false,
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

    const handleSave = async () => {
        const now = new Date().toISOString()
        const ids = Object.keys(pending)

        if (ids.length === 0) return

        setSaving(true)

        try {
            // Save each pending update to the API
            for (const id of ids) {
                const item = items.find((i) => i.id === id)
                const update = pending[id]

                if (!item || !update) continue

                // Extract the numeric ID from the string (e.g., "inv-123" -> 123)
                const numericId = parseInt(id.replace('inv-', ''), 10)

                await updateInventoryItem(numericId, {
                    quantity: update.quantity,
                    available: update.available,
                })
            }

            // Log activity entries
            const entries = ids
                .map((id) => {
                    const initial = items.find((i) => i.id === id)
                    const update = pending[id]
                    if (!initial || !update) return null

                    const next = {
                        available: update.available,
                        quantity: normalizeQuantity(update.quantity),
                    }

                    const label = statusLabel(next)
                    const status = statusKey(next)

                    let action = "Updated"
                    if (!next.available) action = "Marked as Unavailable"
                    else if (label === "Out of stock") action = "Updated to Out of Stock"
                    else if (label === "Low stock") action = "Marked as Low Stock"
                    else if (label === "In stock") action = "Updated to In Stock"

                    const changedAvailability = initial.available !== next.available
                    const changedQuantity = initial.quantity !== next.quantity

                    if (!changedAvailability && changedQuantity) {
                        action = `Updated quantity to ${next.quantity}`
                    }

                    return {
                        medicineName: initial.name,
                        action,
                        status,
                    }
                })
                .filter(
                    (entry): entry is {
                        medicineName: string
                        action: string
                        status: "in_stock" | "low_stock" | "out_of_stock"
                    } => entry !== null
                )

            if (entries.length > 0) addRecentActivityEntries(entries, now)

            // Update local state
            onItemsChange((prev) =>
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

            setPending({})

            // Refresh data from server
            if (onRefresh) onRefresh()
        } catch (error) {
            console.error("Failed to save inventory updates:", error)
            alert("Failed to save changes. Please try again.")
        } finally {
            setSaving(false)
        }
    }

    const handleAdd = async () => {
        const term = addQuery.trim()
        if (!term) return

        setSaving(true)

        try {
            await addInventoryItem({
                name: term,
                quantity: 0,
                price: 0,
            })

            setAddQuery("")

            // Refresh to get the new item
            if (onRefresh) onRefresh()
        } catch (error) {
            console.error("Failed to add item:", error)
            alert("Failed to add item. Please try again.")
        } finally {
            setSaving(false)
        }
    }

    const handleRemove = async (id: string) => {
        const item = items.find((i) => i.id === id)
        if (!item) return

        const ok = window.confirm(`Remove ${item.name} from inventory?`)
        if (!ok) return

        setSaving(true)

        try {
            const numericId = parseInt(id.replace('inv-', ''), 10)
            await deleteInventoryItem(numericId)

            onItemsChange((prev) => prev.filter((i) => i.id !== id))
            setPending((prev) => {
                const { [id]: _, ...rest } = prev
                return rest
            })
        } catch (error) {
            console.error("Failed to remove item:", error)
            alert("Failed to remove item. Please try again.")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-2 w-full sm:max-w-md">
                    <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search medicines..."
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Plus className="h-4 w-4 text-gray-400" />
                        <Input
                            value={addQuery}
                            onChange={(e) => setAddQuery(e.target.value)}
                            placeholder="Add medicine by name..."
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleAdd}
                            disabled={!addQuery.trim() || saving}
                        >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                        </Button>
                    </div>
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
                        disabled={pendingCount === 0 || saving}
                    >
                        <XCircle className="h-4 w-4" />
                        Discard
                    </Button>
                    <Button onClick={handleSave} disabled={pendingCount === 0 || saving}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save
                    </Button>
                </div>
            </div>

            {/* Mobile list */}
            <div className="md:hidden p-4 space-y-3">
                {filtered.map((item) => {
                    const effective = getEffective(item)
                    const label = statusLabel(effective)

                    return (
                        <div
                            key={item.id}
                            className="rounded-xl border border-gray-100 bg-white p-4"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="text-sm font-semibold text-gray-900 truncate">
                                        {item.name}
                                    </div>
                                    <div className="mt-2">
                                        <span
                                            className={
                                                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium " +
                                                statusClasses(label)
                                            }
                                        >
                                            {label}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={effective.available}
                                        onCheckedChange={(v) =>
                                            handleToggleAvailable(item.id, Boolean(v))
                                        }
                                    />
                                    <span className="text-xs text-gray-600">
                                        {effective.available ? "Yes" : "No"}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-3">
                                <div>
                                    <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                                        Quantity
                                    </div>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={String(effective.quantity)}
                                        onChange={(e) =>
                                            handleQuantityChange(item.id, e.target.value)
                                        }
                                        disabled={!effective.available}
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                                        Last updated
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500 break-words">
                                        {effective.updatedAt}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleRemove(item.id)}
                                    className="w-full"
                                    disabled={saving}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    )
                })}

                {filtered.length === 0 && (
                    <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500">
                        No medicines in your inventory.
                    </div>
                )}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-auto">
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
                                Expiry Date
                            </th>
                            <th className="text-left font-semibold px-4 py-3">
                                Last updated
                            </th>
                            <th className="text-right font-semibold px-4 py-3">
                                Actions
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
                                                {effective.available ? "Yes" : "No"}
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
                                        {item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : "No Expiry"}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                        {effective.updatedAt}
                                    </td>
                                    <td className="px-4 py-3 text-right whitespace-nowrap">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => handleRemove(item.id)}
                                            disabled={saving}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Remove
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                        {filtered.length === 0 && (
                            <tr className="border-t border-gray-100">
                                <td
                                    className="px-4 py-10 text-center text-gray-500"
                                    colSpan={6}
                                >
                                    No medicines in your inventory.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
