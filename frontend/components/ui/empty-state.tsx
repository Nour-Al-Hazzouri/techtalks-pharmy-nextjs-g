import { SearchX } from "lucide-react"

interface EmptyStateProps {
    title?: string
    description?: string
}

export function EmptyState({
    title = "No results found",
    description = "We couldn't find any pharmacies matching your search. Try adjusting your filters or area."
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50/50">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
                <SearchX className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
                {description}
            </p>
        </div>
    )
}
