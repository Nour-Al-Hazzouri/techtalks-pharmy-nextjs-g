"use client"

import * as React from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { autocompleteMedicines } from "@/lib/api/public"

interface PharmacyMedicineSearchProps {
    onSelect: (medicine: { name: string, id?: number }) => void
    disabled?: boolean
}

export function PharmacyMedicineSearch({ onSelect, disabled }: PharmacyMedicineSearchProps) {
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<{ name: string, category: string }[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [showResults, setShowResults] = React.useState(false)

    React.useEffect(() => {
        const fetchAutocomplete = async () => {
            if (query.length < 2) {
                setResults([])
                setShowResults(false)
                return
            }

            setIsLoading(true)
            try {
                // Using the public autocomplete API which works for general medicine names
                const response = await autocompleteMedicines(query)
                if (response.data) {
                    const flatResults: { name: string, category: string }[] = []
                    Object.values(response.data).forEach(group => {
                        group.forEach(item => {
                            if (!flatResults.some(r => r.name === item.name)) {
                                flatResults.push(item)
                            }
                        })
                    })
                    setResults(flatResults.slice(0, 10))
                    setShowResults(true)
                }
            } catch (error) {
                console.error("Autocomplete failed:", error)
            } finally {
                setIsLoading(false)
            }
        }

        const timeoutId = setTimeout(fetchAutocomplete, 300)
        return () => clearTimeout(timeoutId)
    }, [query])

    const handleSelect = (item: { name: string }) => {
        onSelect(item)
        setQuery("")
        setShowResults(false)
    }

    return (
        <div className="relative w-full">
            <div className="relative">
                <Input
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        if (!e.target.value) setShowResults(false)
                    }}
                    placeholder="Search database to add..."
                    disabled={disabled}
                    className="pl-9"
                    onFocus={() => { if (results.length > 0) setShowResults(true) }}
                    onBlur={() => setTimeout(() => setShowResults(false), 200)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                {isLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                    </div>
                )}
            </div>

            {showResults && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-100 z-50 max-h-60 overflow-y-auto">
                    {results.map((item, i) => (
                        <button
                            key={i}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm border-b border-gray-50 last:border-0 flex items-center justify-between"
                            onMouseDown={(e) => {
                                e.preventDefault() // convert blur
                                handleSelect(item)
                            }}
                        >
                            <span className="font-medium text-gray-700">{item.name}</span>
                            <span className="text-xs text-gray-400">{item.category}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
