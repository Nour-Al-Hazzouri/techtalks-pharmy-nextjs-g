"use client"

import * as React from "react"
import { Plus, Search, Save, Trash2, XCircle } from "lucide-react"
import { MOCK_MEDICINES, type PharmacyInventoryItem } from "@/lib/mock-data"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

type InventoryTableProps = {
    items: PharmacyInventoryItem[]
    onItemsChange: React.Dispatch<React.SetStateAction<PharmacyInventoryItem[]>>
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

function normalizeName(value: string) {
    return value.trim().toLowerCase()
}

export function InventoryTable({ items, onItemsChange }: InventoryTableProps) {
    const [query, setQuery] = React.useState("")

    const [addQuery, setAddQuery] = React.useState("")
    const [addSelected, setAddSelected] = React.useState<string | null>(null)
    const [showAddResults, setShowAddResults] = React.useState(false)

    const [pending, setPending] = React.useState<Record<string, PendingUpdate>>(
        {}
    )

    const filtered = React.useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return items
        return items.filter((i) => i.name.toLowerCase().includes(q))
    }, [items, query])

    const addResults = React.useMemo(() => {
        const q = normalizeName(addQuery)
        if (!q) return []

        const existing = new Set(items.map((i) => normalizeName(i.name)))

        return MOCK_MEDICINES.filter((m) => {
            const key = normalizeName(m)
            return key.includes(q) && !existing.has(key)
        }).slice(0, 8)
    }, [addQuery, items])

    const canAdd = React.useMemo(() => {
        const term = addSelected ?? addQuery
        const normalized = normalizeName(term)
        if (!normalized) return false

        const match = MOCK_MEDICINES.find(
            (m) => normalizeName(m) === normalized
        )
        if (!match) return false

        return !items.some((i) => normalizeName(i.name) === normalizeName(match))
    }, [addQuery, addSelected, items])

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

        const ids = Object.keys(pending)
        console.log("[pharmacy][inventory] save", {
            updates: ids.map((id) => ({ id, ...pending[id] })),
        })

        setPending({})
    }

    const handleAdd = () => {
        const term = addSelected ?? addQuery.trim()
        if (!term) return

        const match = MOCK_MEDICINES.find(
            (m) => normalizeName(m) === normalizeName(term)
        )
        if (!match) return

        const exists = items.some((i) => normalizeName(i.name) === normalizeName(match))
        if (exists) return

        const now = new Date().toISOString()

        onItemsChange((prev) => [
            ...prev,
            {
                id: `med-${Date.now()}-${Math.random().toString(16).slice(2)}`,
                name: match,
                available: true,
                quantity: 0,
                updatedAt: now,
            },
        ])

        setAddQuery("")
        setAddSelected(null)
        setShowAddResults(false)
    }

    const handleRemove = (id: string) => {
        const item = items.find((i) => i.id === id)
        if (!item) return

        const ok = window.confirm(`Remove ${item.name} from inventory?`)
        if (!ok) return

        onItemsChange((prev) => prev.filter((i) => i.id !== id))
        setPending((prev) => {
            const { [id]: _, ...rest } = prev
            return rest
        })
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

                    <div className="relative flex items-center gap-2">
                        <Plus className="h-4 w-4 text-gray-400" />
                        <Input
                            value={addQuery}
                            onChange={(e) => {
                                setAddQuery(e.target.value)
                                setAddSelected(null)
                                setShowAddResults(true)
                            }}
                            onFocus={() => {
                                if (addQuery.trim().length > 0) setShowAddResults(true)
                            }}
                            onBlur={() => {
                                setTimeout(() => setShowAddResults(false), 150)
                            }}
                            placeholder="Add medicine from list..."
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleAdd}
                            disabled={!canAdd}
                        >
                            Add
                        </Button>

                        {showAddResults && addResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50 max-h-56 overflow-y-auto">
                                {addResults.map((result) => (
                                    <button
                                        key={result}
                                        type="button"
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 text-sm transition-colors border-b border-gray-50 last:border-0"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => {
                                            setAddSelected(result)
                                            setAddQuery(result)
                                            setShowAddResults(false)
                                        }}
                                    >
                                        {result}
                                    </button>
                                ))}
                            </div>
                        )}
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
                        No medicines match your search.
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
                                    <td className="px-4 py-3 text-right whitespace-nowrap">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => handleRemove(item.id)}
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
