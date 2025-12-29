"use client"

import * as React from "react"
import { Search, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { autocompleteMedicines } from "@/lib/api/public"

interface ExpandableSearchBarProps {
    onSearch?: (term: string) => void
    currentQuery?: string
    onClear?: () => void
}

export function ExpandableSearchBar({ onSearch, currentQuery = "", onClear }: ExpandableSearchBarProps) {
    const [expanded, setExpanded] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<string[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        if (currentQuery) {
            setQuery(currentQuery)
            setExpanded(true)
        } else if (!expanded) {
            setQuery("")
        }
    }, [currentQuery])

    React.useEffect(() => {
        if (expanded && inputRef.current) {
            inputRef.current.focus()
        }
    }, [expanded])

    React.useEffect(() => {
        const fetchAutocomplete = async () => {
            if (query.length < 2) {
                setResults([])
                return
            }

            // Don't autocomplete if query matches current confirmed search exactly
            if (query === currentQuery) return

            setIsLoading(true)
            try {
                const response = await autocompleteMedicines(query)
                if (response.data) {
                    const flatResults: string[] = []
                    Object.values(response.data).forEach(group => {
                        group.forEach(item => {
                            if (!flatResults.includes(item.name)) {
                                flatResults.push(item.name)
                            }
                        })
                    })
                    setResults(flatResults.slice(0, 5))
                }
            } catch (error) {
                console.error("Autocomplete failed:", error)
            } finally {
                setIsLoading(false)
            }
        }

        const timeoutId = setTimeout(fetchAutocomplete, 300)
        return () => clearTimeout(timeoutId)
    }, [query, currentQuery])

    const handleSearch = (term: string) => {
        if (onSearch) {
            onSearch(term)
            // Keep expanded to show the result
            setExpanded(true)
            setResults([])
        }
    }

    const handleClear = () => {
        setQuery("")
        setResults([])
        if (inputRef.current) inputRef.current.focus()

        if (onClear) onClear()

        // If we are just clearing text but not closing (user might want to type new search)
        // But if it was an active search (currentQuery), we called onClear which resets parent.
    }

    return (
        <div className="relative flex items-center justify-start transition-all duration-300 ease-in-out w-full">
            {!expanded ? (
                <button
                    onClick={() => setExpanded(true)}
                    className="flex items-center gap-2 text-sm font-medium text-[#E91E63] hover:bg-pink-50 px-3 py-1.5 rounded-full transition-colors w-full justify-center"
                >
                    <Search className="h-4 w-4" />
                    <span className="hidden min-[380px]:inline">Search</span>
                </button>
            ) : (
                <div className="relative flex items-center w-full animate-in fade-in slide-in-from-right-10 duration-200">
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
                        className="h-9 pl-9 pr-8 rounded-full bg-gray-50 border-gray-200 text-sm focus-visible:ring-1 focus-visible:ring-[#E91E63] w-full"
                        onBlur={() => {
                            // Delay to allow click on results
                            setTimeout(() => {
                                if (!query && !results.length) setExpanded(false)
                            }, 200)
                        }}
                    />
                    {isLoading && (
                        <div className="absolute right-8 top-1/2 -translate-y-1/2">
                            <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                        </div>
                    )}
                    <button
                        onMouseDown={(e) => {
                            e.preventDefault()
                            handleClear()
                        }}
                        className="absolute right-2 p-1 text-gray-400 hover:text-gray-600 rounded-full"
                    >
                        <X className="h-3 w-3" />
                    </button>

                    {/* Autocomplete */}
                    {results.length > 0 && query.length > 0 && (
                        <div className="absolute top-full right-0 left-0 mt-2 bg-white shadow-lg rounded-xl border border-gray-100 p-2 z-50">
                            <div className="px-2 py-1.5 text-xs text-gray-500 font-medium">Results</div>
                            {results.map(item => (
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
