"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface AlertConfig {
    isOpen: boolean
    title: string
    description?: string
    variant?: "default" | "destructive"
    confirmLabel?: string
    onConfirm?: () => void
}

export interface CustomDialogProps extends AlertConfig {
    onClose: () => void
}

export function CustomDialog({
    isOpen,
    onClose,
    title,
    description,
    variant = "default",
    confirmLabel = "OK",
    onConfirm
}: CustomDialogProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h3 className={cn("font-semibold text-lg", variant === "destructive" ? "text-red-600" : "text-gray-900")}>
                        {title}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {description && (
                    <div className="p-4 text-gray-600 text-sm">
                        {description}
                    </div>
                )}

                <div className="p-4 bg-gray-50 flex justify-end gap-2">
                    {onConfirm && (
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    )}
                    <Button
                        variant={variant === "destructive" ? "destructive" : "default"}
                        onClick={() => {
                            if (onConfirm) onConfirm()
                            onClose()
                        }}
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    )
}
