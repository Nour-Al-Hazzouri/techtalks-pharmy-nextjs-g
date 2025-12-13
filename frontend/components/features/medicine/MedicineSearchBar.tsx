"use client"

import * as React from "react"
import { Search, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useDebounce } from "@/hooks/use-debounce"

// Mock data for autocomplete
const MOCK_MEDICINES = [
    "Panadol",
    "Panadol Extra",
    "Panadol Cold & Flu",
    "Panadol Night",
    "Paracetamol",
    "Insulin",
    "Insulin Aspart",
    "Ibuprofen",
    "Aspirin",
    "Amoxicillin",
    "Augmentin",
    "Vitamin C",
    "Vitamin D",
    "Zinc",
    "Magnesium",
]

const POPULAR_SEARCHES = ["Insulin", "Paracetamol", "Aspirin", "Amoxicillin"]

export function MedicineSearchBar() {
    const router = useRouter()
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<string[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [showResults, setShowResults] = React.useState(false)

    const debouncedQuery = useDebounce(query, 300)

    React.useEffect(() => {
        if (debouncedQuery.length < 3) {
            setResults([])
            setShowResults(false)
            return
        }

        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            const filtered = MOCK_MEDICINES.filter((medicine) =>
                medicine.toLowerCase().includes(debouncedQuery.toLowerCase())
            )
            setResults(filtered)
            setIsLoading(false)
            setShowResults(true)
        }, 500)
    }, [debouncedQuery])

    const handleSearch = (term: string) => {
        setQuery(term)
        setShowResults(false)
        // TODO: Navigate to search results page
        console.log("Searching for:", term)
        // router.push(`/search?q=${term}`)
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
                    <p className="text-xs text-gray-500 font-medium">Popular searches:</p>
                    <div className="flex flex-wrap gap-2">
                        {POPULAR_SEARCHES.map((term) => (
                            <button
                                key={term}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs rounded-lg transition-colors"
                                onClick={() => handleSearch(term)}
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
