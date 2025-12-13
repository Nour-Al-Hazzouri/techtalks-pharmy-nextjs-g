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
        <header className="w-full h-16 bg-white border-b border-gray-100 flex items-center justify-between px-3 sm:px-6 shrink-0 relative z-20 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 mr-2">
                <div className="bg-[#E91E63] p-1.5 rounded-lg shrink-0">
                    <MapPin className="text-white h-5 w-5" />
                </div>

                {searchQuery ? (
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="min-w-0 flex-1">
                            <h1 className="text-sm font-semibold text-gray-900 truncate hidden sm:block">Pharmacy Finder</h1>
                            <p className="text-xs text-gray-500 truncate">
                                <span className="hidden sm:inline">Searching for: </span>
                                <span className="sm:hidden">For: </span>
                                <span className="font-medium text-gray-700">{searchQuery}</span>
                            </p>
                        </div>
                        <button
                            onClick={onClear}
                            className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                            title="Clear Search"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <div className="min-w-0 flex-1">
                        <h1 className="text-sm font-semibold text-gray-900 truncate">Pharmacy Finder</h1>
                        <p className="text-xs text-gray-500 truncate">Find nearby pharmacies</p>
                    </div>
                )}
            </div>
            <div className="shrink-0">
                <ExpandableSearchBar onSearch={onSearch} />
            </div>
        </header>
    )
}
