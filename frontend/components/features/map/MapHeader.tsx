"use client"

import { MapPin, X } from "lucide-react"
import { ExpandableSearchBar } from "./ExpandableSearchBar"

interface MapHeaderProps {
    searchQuery: string
    onSearch: (term: string) => void
    onClear: () => void
}

export function MapHeader({ searchQuery, onSearch, onClear }: MapHeaderProps) {
    return (
        <header className="w-full h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 relative z-20 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="bg-[#E91E63] p-1.5 rounded-lg">
                    <MapPin className="text-white h-5 w-5" />
                </div>

                {searchQuery ? (
                    <div className="flex items-center gap-2">
                        <div>
                            <h1 className="text-sm font-semibold text-gray-900">Pharmacy Finder</h1>
                            <p className="text-xs text-gray-500">Searching for: <span className="font-medium text-gray-700">{searchQuery}</span></p>
                        </div>
                        <button
                            onClick={onClear}
                            className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                            title="Clear Search"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <div>
                        <h1 className="text-sm font-semibold text-gray-900">Pharmacy Finder</h1>
                        <p className="text-xs text-gray-500">Find nearby pharmacies</p>
                    </div>
                )}
            </div>
            <div>
                <ExpandableSearchBar onSearch={onSearch} />
            </div>
        </header>
    )
}
