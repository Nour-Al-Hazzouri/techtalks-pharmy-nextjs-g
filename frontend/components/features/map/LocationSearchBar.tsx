"use client"

import * as React from "react"
import { MapPin, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
import { geocodeSearch, GeocodeResult } from "@/lib/api/public"

export interface SelectedLocation {
    label: string
    lat: number
    lng: number
}

interface LocationSearchBarProps {
    value: SelectedLocation | null
    onSelect: (location: SelectedLocation) => void
    onClear: () => void
}

export function LocationSearchBar({ value, onSelect, onClear }: LocationSearchBarProps) {
    const [query, setQuery] = React.useState("")
    const debouncedQuery = useDebounce(query, 300)
    const [loading, setLoading] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    const [results, setResults] = React.useState<GeocodeResult[]>([])

    React.useEffect(() => {
        if (value?.label) {
            setQuery(value.label)
        }
    }, [value?.label])

    React.useEffect(() => {
        const run = async () => {
            if (!open) return
            if (value) return
            if (debouncedQuery.trim().length < 3) {
                setResults([])
                return
            }

            try {
                setLoading(true)
                const res = await geocodeSearch(debouncedQuery)
                setResults(res.data ?? [])
            } catch (e) {
                console.error("Geocode search failed", e)
                setResults([])
            } finally {
                setLoading(false)
            }
        }

        run()
    }, [debouncedQuery, open, value])

    const handleSelect = (r: GeocodeResult) => {
        const lat = r.lat ? parseFloat(r.lat) : NaN
        const lng = r.lon ? parseFloat(r.lon) : NaN
        if (!r.display_name || Number.isNaN(lat) || Number.isNaN(lng)) return

        onSelect({
            label: r.display_name,
            lat,
            lng,
        })

        setOpen(false)
    }

    const handleClear = () => {
        setQuery("")
        setResults([])
        setOpen(false)
        onClear()
    }

    return (
        <div className="relative">
            <div className="relative flex items-center">
                <MapPin className="absolute left-3 text-gray-400 h-4 w-4" />
                <Input
                    value={query}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setQuery(e.target.value)
                        if (value) onClear()
                    }}
                    onFocus={() => setOpen(true)}
                    onBlur={() => {
                        setTimeout(() => setOpen(false), 150)
                    }}
                    placeholder="Search location..."
                    className="h-9 pl-9 pr-8 rounded-full bg-gray-50 border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-[#E91E63] w-48 sm:w-64"
                />

                {(query.length > 0 || value) && (
                    <button
                        onMouseDown={(e) => {
                            e.preventDefault()
                            handleClear()
                        }}
                        className="absolute right-2 p-1 text-gray-400 hover:text-gray-600 rounded-full"
                        title="Clear location"
                    >
                        <X className="h-3 w-3" />
                    </button>
                )}
            </div>

            {open && !value && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg rounded-xl border border-gray-100 p-2 z-50">
                    <div className="flex items-center justify-between px-2 py-1.5">
                        <div className="text-xs text-gray-500 font-medium">Locations</div>
                        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" />}
                    </div>

                    <div className={cn("max-h-64 overflow-y-auto", results.length === 0 && "pb-1")}> 
                        {results.map((r) => (
                            <div
                                key={String(r.place_id ?? r.display_name)}
                                onMouseDown={(e) => {
                                    e.preventDefault()
                                    handleSelect(r)
                                }}
                                className="px-2 py-2 hover:bg-gray-50 rounded-lg text-sm cursor-pointer text-gray-700"
                            >
                                <div className="text-sm text-gray-800 line-clamp-2">{r.display_name}</div>
                                {(r.type || r.lat || r.lon) && (
                                    <div className="text-[11px] text-gray-400 mt-0.5">
                                        {r.type ? r.type : ""}
                                    </div>
                                )}
                            </div>
                        ))}

                        {!loading && debouncedQuery.trim().length >= 3 && results.length === 0 && (
                            <div className="px-2 py-2 text-sm text-gray-500">No results</div>
                        )}

                        {debouncedQuery.trim().length < 3 && (
                            <div className="px-2 py-2 text-sm text-gray-500">Type at least 3 characters</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
