"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface ExpandableSearchBarProps {
    onSearch?: (term: string) => void
}

export function ExpandableSearchBar({ onSearch }: ExpandableSearchBarProps) {
    const [expanded, setExpanded] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        if (expanded && inputRef.current) {
            inputRef.current.focus()
        }
    }, [expanded])

    const handleSearch = (term: string) => {
        if (onSearch) {
            onSearch(term)
            setExpanded(false) // Collapse on search? optional. Let's keep it open or close depending on UX. 
            // User requirement: "Return to main search screen" was cleared, now filtering.
            // Let's close it to show the header text update.
            setExpanded(false)
            setQuery("") // Clear input since it moves to header "Searching for..."
        }
    }

    return (
        <div className="relative flex items-center justify-end transition-all duration-300 ease-in-out">
            {!expanded ? (
                <button
                    onClick={() => setExpanded(true)}
                    className="flex items-center gap-2 text-sm font-medium text-[#E91E63] hover:bg-pink-50 px-3 py-1.5 rounded-full transition-colors"
                >
                    <Search className="h-4 w-4" />
                    <span className="hidden min-[380px]:inline">Search</span>
                </button>
            ) : (
                <div className="relative flex items-center w-48 sm:w-64 animate-in fade-in slide-in-from-right-10 duration-200">
                    <Search className="absolute left-3 text-gray-400 h-4 w-4" />
                    <Input
                        ref={inputRef}
                        value={query}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch(query)
                            }
                        }}
                        placeholder="Search medicine..."
                        className="h-9 pl-9 pr-8 rounded-full bg-gray-50 border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-[#E91E63]"
                        onBlur={() => {
                            // Delay to allow click on results
                            setTimeout(() => {
                                if (!query) setExpanded(false)
                            }, 200)
                        }}
                    />
                    <button
                        onMouseDown={(e) => {
                            e.preventDefault()
                            setQuery("")
                            setExpanded(false)
                        }}
                        className="absolute right-2 p-1 text-gray-400 hover:text-gray-600 rounded-full"
                    >
                        <X className="h-3 w-3" />
                    </button>

                    {/* Minimal Autocomplete */}
                    {query.length > 0 && (
                        <div className="absolute top-full right-0 left-0 mt-2 bg-white shadow-lg rounded-xl border border-gray-100 p-2 z-50">
                            <div className="px-2 py-1.5 text-xs text-gray-500 font-medium">Results</div>
                            {['Panadol', 'Aspirin', 'Insulin', 'Amoxicillin'].filter(i => i.toLowerCase().includes(query.toLowerCase())).map(item => (
                                <div
                                    key={item}
                                    onClick={() => handleSearch(item)}
                                    className="px-2 py-1.5 hover:bg-gray-50 rounded-lg text-sm cursor-pointer text-gray-700"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
