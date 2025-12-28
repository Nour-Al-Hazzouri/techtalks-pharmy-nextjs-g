"use client"

import * as React from "react"
import { Search, Plus, Trash2, Loader2 } from "lucide-react"
import { getMedicines, createMedicine, deleteMedicine, Medicine } from "@/lib/api/admin"
import { CustomDialog } from "@/components/ui/custom-dialog"

const CATEGORIES = [
    "Pain Relief",
    "Antibiotic",
    "Cardiovascular",
    "Diabetes",
    "Gastrointestinal",
    "Antihistamine",
    "Respiratory",
]

interface AddMedicineModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (medicine: any) => Promise<void>
}

function AddMedicineModal({ isOpen, onClose, onAdd }: AddMedicineModalProps) {
    const [name, setName] = React.useState("")
    const [genericName, setGenericName] = React.useState("")
    const [category, setCategory] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (name && category) {
            setIsSubmitting(true)
            try {
                await onAdd({ name, generic_name: genericName, category, description })
                setName("")
                setGenericName("")
                setCategory("")
                setDescription("")
                onClose()
            } catch (error) {
                console.error("Failed to add medicine", error)
            } finally {
                setIsSubmitting(false)
            }
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
                            <label className="block text-xs text-gray-500 mb-2">Medicine Name *</label>
                            <input
                                type="text"
                                placeholder="e.g. Insulin Apidra"
                                value={name}
                                required
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
                            <label className="block text-xs text-gray-500 mb-2">Category *</label>
                            <select
                                value={category}
                                required
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-[#E91E63] appearance-none"
                            >
                                <option value="">Select category</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-2">Description</label>
                            <textarea
                                placeholder="Optional description..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-[#E91E63]"
                            />
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
                            disabled={isSubmitting}
                            className="flex-1 py-3.5 rounded-full bg-[#E91E63] text-white font-semibold hover:bg-[#D81B60] transition-colors disabled:opacity-50 flex justify-center items-center"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Add Medicine"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export function MedicineCatalogContent() {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [medicines, setMedicines] = React.useState<Medicine[]>([])
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(true)
    const [page, setPage] = React.useState(1)

    // Alert & Confirm State
    const [alertConfig, setAlertConfig] = React.useState<{ isOpen: boolean, title: string, description?: string, variant?: "default" | "destructive" }>({
        isOpen: false,
        title: "",
    })

    const [confirmConfig, setConfirmConfig] = React.useState<{ isOpen: boolean, title: string, onConfirm: () => void }>({
        isOpen: false,
        title: "",
        onConfirm: () => { },
    })

    // Debounce search
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchMedicines()
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [searchQuery, page])

    const fetchMedicines = async () => {
        setIsLoading(true)
        try {
            const response = await getMedicines(page, searchQuery)
            if (response.data && Array.isArray(response.data.data)) {
                setMedicines(response.data.data)
            }
        } catch (error) {
            console.error("Failed to fetch medicines", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddMedicine = async (medicineData: any) => {
        try {
            const response = await createMedicine(medicineData)
            if (response.status) {
                fetchMedicines() // Refresh list
                setAlertConfig({
                    isOpen: true,
                    title: "Success",
                    description: "Medicine added successfully.",
                })
            } else {
                setAlertConfig({
                    isOpen: true,
                    title: "Failed to Add",
                    description: response.message || "Failed to add medicine",
                    variant: "destructive"
                })
            }
        } catch (err: any) {
            console.error("Add failed", err)
            const msg = err?.data?.message || err.message || "Failed to add medicine. It may already exist."
            setAlertConfig({
                isOpen: true,
                title: "Error",
                description: msg,
                variant: "destructive"
            })
        }
    }

    const handleDeleteMedicine = (id: number) => {
        setConfirmConfig({
            isOpen: true,
            title: "Delete Medicine?",
            onConfirm: async () => {
                try {
                    await deleteMedicine(id)
                    setMedicines((prev) => prev.filter((m) => m.id !== id))
                    setAlertConfig({
                        isOpen: true,
                        title: "Deleted",
                        description: "Medicine removed successfully.",
                    })
                } catch (error) {
                    console.error("Failed to delete", error)
                    setAlertConfig({
                        isOpen: true,
                        title: "Error",
                        description: "Failed to delete medicine.",
                        variant: "destructive"
                    })
                }
            }
        })
    }

    return (
        <div className="flex-1 bg-gray-50 px-4 py-4 pt-20 pb-24 md:p-6 md:pt-6 md:pb-6 overflow-auto">
            <CustomDialog
                isOpen={alertConfig.isOpen}
                onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
                title={alertConfig.title}
                description={alertConfig.description}
                variant={alertConfig.variant}
            />

            <CustomDialog
                isOpen={confirmConfig.isOpen}
                onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
                title={confirmConfig.title}
                confirmLabel="Delete"
                variant="destructive"
                onConfirm={confirmConfig.onConfirm}
            />

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
                {/* Add Button */}
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full md:w-auto h-12 px-6 bg-[#E91E63] text-white font-semibold rounded-full md:rounded-xl hover:bg-[#D81B60] transition-colors flex items-center justify-center gap-2 shrink-0 mb-6 md:mb-0"
                >
                    <Plus className="h-5 w-5" />
                    Add New Medicine
                </button>
            </div>

            {/* Medicine List */}
            {isLoading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin h-8 w-8 text-[#E91E63]" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {medicines.map((medicine) => (
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
                            <p className="text-xs text-gray-500 mb-3">{medicine.generic_name || "N/A"}</p>
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full mb-3 md:mb-4">
                                {medicine.category || "General"}
                            </span>
                            <p className="text-xs text-gray-400">
                                Added on {medicine.created_at ? new Date(medicine.created_at).toLocaleDateString() : "N/A"}
                            </p>
                        </div>
                    ))}
                    {medicines.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            No medicines found.
                        </div>
                    )}
                </div>
            )}

            {/* Add Medicine Modal */}
            <AddMedicineModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddMedicine}
            />
        </div>
    )
}
