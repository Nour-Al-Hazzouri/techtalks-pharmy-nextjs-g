"use client"

import * as React from "react"
import { Search, Plus, Trash2 } from "lucide-react"

interface Medicine {
    id: string
    name: string
    genericName: string
    category: string
    addedDate: string
}

const CATEGORIES = [
    "Pain Relief",
    "Antibiotic",
    "Cardiovascular",
    "Diabetes",
    "Gastrointestinal",
    "Antihistamine",
    "Respiratory",
]

const MOCK_MEDICINES: Medicine[] = [
    { id: "1", name: "Paracetamol 500mg", genericName: "Acetaminophen", category: "Pain Relief", addedDate: "Jan 13, 2024" },
    { id: "2", name: "Amoxicillin", genericName: "Amoxicillin", category: "Antibiotic", addedDate: "Jan 12, 2024" },
    { id: "3", name: "Aspirin 100mg", genericName: "Acetylsalicylic Acid", category: "Cardiovascular", addedDate: "Jan 8, 2024" },
    { id: "4", name: "Metformin 500mg", genericName: "Metformin HCl", category: "Diabetes", addedDate: "Jan 25, 2024" },
    { id: "5", name: "Omeprazole 20mg", genericName: "Omeprazole", category: "Gastrointestinal", addedDate: "Jan 18, 2024" },
    { id: "6", name: "Amlodipine 5mg", genericName: "Amlodipine Besylate", category: "Cardiovascular", addedDate: "Jan 14, 2024" },
    { id: "7", name: "Atorvastatin 10mg", genericName: "Atorvastatin Calcium", category: "Cardiovascular", addedDate: "Jan 10, 2024" },
    { id: "8", name: "Cetirizine 10mg", genericName: "Cetirizine HCl", category: "Antihistamine", addedDate: "Jan 22, 2024" },
    { id: "9", name: "Salbutamol Inhaler", genericName: "Albuterol", category: "Respiratory", addedDate: "Jan 11, 2024" },
]

interface AddMedicineModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (medicine: Omit<Medicine, "id" | "addedDate">) => void
}

function AddMedicineModal({ isOpen, onClose, onAdd }: AddMedicineModalProps) {
    const [name, setName] = React.useState("")
    const [genericName, setGenericName] = React.useState("")
    const [category, setCategory] = React.useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name && genericName && category) {
            onAdd({ name, genericName, category })
            setName("")
            setGenericName("")
            setCategory("")
            onClose()
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-t-3xl md:rounded-2xl shadow-xl w-full md:max-w-md md:mx-4">
                {/* Handle bar for mobile */}
                <div className="md:hidden flex justify-center pt-3 pb-2">
                    <div className="w-12 h-1 rounded-full bg-gray-300" />
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="px-6 py-4 md:p-6 md:border-b md:border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">ADD NEW MEDICINE</h2>
                    </div>

                    {/* Form */}
                    <div className="px-6 pb-4 md:p-6 space-y-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-2">Medicine Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Insulin Apidra"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-[#E91E63]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-2">Generic Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Insulin Glulisine"
                                value={genericName}
                                onChange={(e) => setGenericName(e.target.value)}
                                className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-[#E91E63]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-2">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-[#E91E63] appearance-none"
                            >
                                <option value="">Select category</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 md:border-t md:border-gray-100 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3.5 rounded-full border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3.5 rounded-full bg-[#E91E63] text-white font-semibold hover:bg-[#D81B60] transition-colors"
                        >
                            Add Medicine
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export function MedicineCatalogContent() {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [medicines, setMedicines] = React.useState(MOCK_MEDICINES)
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)

    const filteredMedicines = medicines.filter(
        (m) =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.genericName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAddMedicine = (medicine: Omit<Medicine, "id" | "addedDate">) => {
        const newMedicine: Medicine = {
            ...medicine,
            id: `new-${Date.now()}`,
            addedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        }
        setMedicines((prev) => [newMedicine, ...prev])
    }

    const handleDeleteMedicine = (id: string) => {
        setMedicines((prev) => prev.filter((m) => m.id !== id))
    }

    return (
        <div className="flex-1 bg-gray-50 px-4 py-4 pt-20 pb-24 md:p-6 md:pt-6 md:pb-6 overflow-auto">
            {/* Header */}
            <h1 className="text-lg font-bold text-gray-900 tracking-wider mb-6">
                MEDICINE CATALOG
            </h1>

            {/* Search Bar */}
            <div className="relative mb-3 md:mb-0 md:flex md:gap-4 md:mb-6">
                <div className="relative flex-1 mb-3 md:mb-0">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search medicines..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-[#E91E63]"
                    />
                </div>
                {/* Add Button - Full width on mobile, inline on desktop */}
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full md:w-auto h-12 px-6 bg-[#E91E63] text-white font-semibold rounded-full md:rounded-xl hover:bg-[#D81B60] transition-colors flex items-center justify-center gap-2 shrink-0 mb-6 md:mb-0"
                >
                    <Plus className="h-5 w-5" />
                    Add New Medicine
                </button>
            </div>

            {/* Medicine List - Single column on mobile, 3 columns on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredMedicines.map((medicine) => (
                    <div
                        key={medicine.id}
                        className="bg-white rounded-xl border border-gray-100 p-4 md:p-5 relative"
                    >
                        <button
                            onClick={() => handleDeleteMedicine(medicine.id)}
                            className="absolute top-4 right-4 h-8 w-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1 pr-10">
                            {medicine.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-3">{medicine.genericName}</p>
                        <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full mb-3 md:mb-4">
                            {medicine.category}
                        </span>
                        <p className="text-xs text-gray-400">Added on {medicine.addedDate}</p>
                    </div>
                ))}
            </div>

            {/* Add Medicine Modal */}
            <AddMedicineModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddMedicine}
            />
        </div>
    )
}
