"use client"

import * as React from "react"
import { Search, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useDebounce } from "@/hooks/use-debounce"
import { autocompleteMedicines, getMedicineSuggestions } from "@/lib/api/public"

export function MedicineSearchBar() {
    const router = useRouter()
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<string[]>([])
    const [suggestions, setSuggestions] = React.useState<string[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [showResults, setShowResults] = React.useState(false)

    const debouncedQuery = useDebounce(query, 300)

    React.useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const response = await getMedicineSuggestions(8)
                if (response.data) {
                    setSuggestions(response.data.map((s) => s.name).filter(Boolean).slice(0, 8))
                }
            } catch (error) {
                console.error("Failed to load suggestions:", error)
            }
        }

        fetchSuggestions()
    }, [])

    React.useEffect(() => {
        const fetchAutocomplete = async () => {
            if (debouncedQuery.length < 2) {
                setResults([])
                setShowResults(false)
                return
            }

            setIsLoading(true)
            try {
                const response = await autocompleteMedicines(debouncedQuery)
                if (response.data) {
                    // Flatten the grouped response directly to strings for the dropdown
                    const flatResults: string[] = []
                    Object.values(response.data).forEach(group => {
                        group.forEach(item => {
                            if (!flatResults.includes(item.name)) {
                                flatResults.push(item.name)
                            }
                        })
                    })
                    setResults(flatResults.slice(0, 10)) // Limit to 10
                    setShowResults(true)
                }
            } catch (error) {
                console.error("Autocomplete failed:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAutocomplete()
    }, [debouncedQuery])

    const handleSearch = (term: string) => {
        setQuery(term)
        setShowResults(false)
        console.log("Searching for:", term)
        router.push(`/map?q=${encodeURIComponent(term)}`)
    }

    return (
        <Card className="w-full max-w-lg shadow-xl bg-white border-0 py-6 px-4 rounded-3xl">
            <CardHeader className="text-center space-y-2 pb-6">
                <div className="mx-auto bg-[#E91E63] w-12 h-12 rounded-full flex items-center justify-center mb-2 shadow-lg shadow-pink-200">
                    <Search className="text-white h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">Find Your Medicine</CardTitle>
                <CardDescription className="text-gray-500">
                    Search for medicine to find nearby pharmacies
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                        type="text"
                        placeholder="Enter medicine name..."
                        className="pl-10 h-12 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-[#E91E63]"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value)
                            if (e.target.value.length === 0) setShowResults(false)
                        }}
                        onFocus={() => {
                            if (results.length > 0) setShowResults(true)
                        }}
                    />
                    {isLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2 className="h-4 w-4 animate-spin text-[#E91E63]" />
                        </div>
                    )}

                    {/* Autocomplete Dropdown */}
                    {showResults && results.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50 max-h-60 overflow-y-auto">
                            {results.map((result, index) => (
                                <button
                                    key={index}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 text-sm transition-colors border-b border-gray-50 last:border-0"
                                    onClick={() => handleSearch(result)}
                                >
                                    {result}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <Button
                    className="w-full h-12 bg-[#E91E63] hover:bg-[#D81B60] text-white font-semibold rounded-xl text-base shadow-lg shadow-pink-200"
                    onClick={() => handleSearch(query)}
                >
                    Search Pharmacies
                </Button>

                <div className="space-y-3 pt-2">
                    {suggestions.length > 0 && (
                        <>
                            <p className="text-xs text-gray-500 font-medium">Suggestions:</p>
                            <div className="flex flex-wrap gap-2">
                                {suggestions.map((term) => (
                                    <button
                                        key={term}
                                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs rounded-lg transition-colors"
                                        onClick={() => handleSearch(term)}
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
