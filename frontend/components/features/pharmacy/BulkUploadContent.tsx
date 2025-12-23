"use client"

import * as React from "react"
import { Download, FileText, Upload, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type UploadStatus = "idle" | "uploading" | "success" | "failed"

type ParsedRow = {
    name: string
    available: boolean
    quantity: number
}

function isCsvFile(file: File) {
    const nameOk = file.name.toLowerCase().endsWith(".csv")
    const typeOk =
        file.type === "text/csv" ||
        file.type === "application/vnd.ms-excel" ||
        file.type === ""

    return nameOk && typeOk
}

function parseBoolean(value: string) {
    const v = value.trim().toLowerCase()
    if (v === "true" || v === "1" || v === "yes") return true
    if (v === "false" || v === "0" || v === "no") return false
    return null
}

function safeSplitCsvLine(line: string) {
    const result: string[] = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
        const ch = line[i]
        if (ch === '"') {
            const next = line[i + 1]
            if (inQuotes && next === '"') {
                current += '"'
                i++
                continue
            }
            inQuotes = !inQuotes
            continue
        }

        if (ch === "," && !inQuotes) {
            result.push(current)
            current = ""
            continue
        }

        current += ch
    }

    result.push(current)
    return result.map((v) => v.trim())
}

function parseCsv(text: string): ParsedRow[] {
    const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)

    if (lines.length < 2) {
        throw new Error("CSV must include a header row and at least one data row.")
    }

    const header = safeSplitCsvLine(lines[0]).map((h) => h.toLowerCase())

    const nameIndex = header.indexOf("name")
    const availableIndex = header.indexOf("available")
    const quantityIndex = header.indexOf("quantity")

    if (nameIndex === -1 || availableIndex === -1 || quantityIndex === -1) {
        throw new Error("CSV header must include: name, available, quantity")
    }

    const rows: ParsedRow[] = []

    for (let i = 1; i < lines.length; i++) {
        const cols = safeSplitCsvLine(lines[i])

        const name = (cols[nameIndex] ?? "").trim()
        if (!name) {
            throw new Error(`Row ${i + 1}: name is required`) 
        }

        const availableRaw = (cols[availableIndex] ?? "").trim()
        const parsedAvailable = parseBoolean(availableRaw)
        if (parsedAvailable === null) {
            throw new Error(`Row ${i + 1}: available must be true/false (or 1/0, yes/no)`) 
        }

        const quantityRaw = (cols[quantityIndex] ?? "").trim()
        const qty = Number(quantityRaw)
        if (!Number.isFinite(qty) || qty < 0) {
            throw new Error(`Row ${i + 1}: quantity must be a non-negative number`) 
        }

        rows.push({
            name,
            available: parsedAvailable,
            quantity: Math.floor(qty),
        })
    }

    if (rows.length === 0) {
        throw new Error("CSV must include at least one data row.")
    }

    return rows
}

export function BulkUploadContent() {
    const [file, setFile] = React.useState<File | null>(null)
    const [status, setStatus] = React.useState<UploadStatus>("idle")
    const [progress, setProgress] = React.useState(0)
    const [error, setError] = React.useState<string | null>(null)
    const [stats, setStats] = React.useState<{ total: number } | null>(null)

    const inputRef = React.useRef<HTMLInputElement>(null)

    const reset = React.useCallback(() => {
        setFile(null)
        setStatus("idle")
        setProgress(0)
        setError(null)
        setStats(null)
        if (inputRef.current) inputRef.current.value = ""
    }, [])

    const handleFile = React.useCallback(
        (next: File | null) => {
            setError(null)
            setStats(null)

            if (!next) {
                setFile(null)
                return
            }

            if (!isCsvFile(next)) {
                setFile(null)
                setError("Only CSV files are allowed.")
                return
            }

            setFile(next)
        },
        []
    )

    const downloadTemplate = () => {
        const template = [
            "name,available,quantity",
            "Paracetamol 500mg,true,25",
            "Ibuprofen,false,0",
        ].join("\n")

        const blob = new Blob([template], { type: "text/csv;charset=utf-8" })
        const url = URL.createObjectURL(blob)

        const a = document.createElement("a")
        a.href = url
        a.download = "pharmy_inventory_template.csv"
        document.body.appendChild(a)
        a.click()
        a.remove()

        URL.revokeObjectURL(url)
    }

    const startUpload = async () => {
        if (!file) return

        setStatus("uploading")
        setProgress(0)
        setError(null)
        setStats(null)

        try {
            const text = await file.text()
            const parsed = parseCsv(text)

            setStats({ total: parsed.length })

            const startedAt = Date.now()
            const durationMs = 2400

            const timer = window.setInterval(() => {
                const elapsed = Date.now() - startedAt
                const pct = Math.min(100, Math.round((elapsed / durationMs) * 100))
                setProgress(pct)

                if (pct >= 100) {
                    window.clearInterval(timer)
                    setStatus("success")
                }
            }, 80)
        } catch (e) {
            setProgress(0)
            setStatus("failed")
            setError(e instanceof Error ? e.message : "Upload failed.")
        }
    }

    const canUpload = status !== "uploading" && file !== null

    return (
        <div className="flex-1 bg-gray-50 px-4 py-4 pt-20 pb-24 md:p-6 md:pt-6 md:pb-6 overflow-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">CSV Bulk Upload</h1>
                <p className="text-gray-500">Upload inventory data from your system</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-gray-100 rounded-xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">
                                Download Template
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                                    <Download className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-800">CSV template</div>
                                    <div className="text-xs text-gray-500">
                                        Use this template to format your inventory data correctly.
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={downloadTemplate}
                                className="w-full sm:w-auto"
                            >
                                <Download className="h-4 w-4" />
                                Download CSV Template
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-gray-100 rounded-xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-700">
                                Upload File
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div
                                className={cn(
                                    "relative rounded-xl border-2 border-dashed p-10 text-center transition-colors",
                                    "border-gray-200 bg-white",
                                    status === "uploading" && "opacity-70",
                                    file && "border-[#E91E63]/40"
                                )}
                                onDragOver={(e) => {
                                    e.preventDefault()
                                    if (status === "uploading") return
                                }}
                                onDrop={(e) => {
                                    e.preventDefault()
                                    if (status === "uploading") return
                                    const dropped = e.dataTransfer.files?.[0] ?? null
                                    handleFile(dropped)
                                }}
                            >
                                <input
                                    ref={inputRef}
                                    type="file"
                                    accept={".csv,text/csv"}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    disabled={status === "uploading"}
                                    onChange={(e) => {
                                        const next = e.target.files?.[0] ?? null
                                        handleFile(next)
                                    }}
                                />

                                <div className="mx-auto h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center">
                                    <Upload className="h-6 w-6 text-gray-500" />
                                </div>
                                <div className="mt-4 text-sm font-medium text-gray-800">
                                    Click to upload or drag and drop
                                </div>
                                <div className="mt-1 text-xs text-gray-500">CSV files only</div>
                            </div>

                            {file && (
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-gray-500" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {file.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {(file.size / 1024).toFixed(1)} KB
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={reset}
                                        disabled={status === "uploading"}
                                        className="w-full sm:w-auto"
                                    >
                                        <XCircle className="h-4 w-4" />
                                        Remove
                                    </Button>
                                </div>
                            )}

                            {status === "uploading" && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>Uploading...</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                        <div
                                            className="h-full bg-[#E91E63] transition-all"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {status === "success" && (
                                <div className="rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-800">
                                    Upload completed successfully
                                    {stats ? ` (${stats.total} row${stats.total === 1 ? "" : "s"}).` : "."}
                                </div>
                            )}

                            {status === "failed" && (
                                <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-800">
                                    Upload failed{error ? `: ${error}` : "."}
                                </div>
                            )}

                            {status !== "failed" && error && (
                                <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-800">
                                    {error}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={reset}
                                    disabled={status === "uploading" && progress > 0}
                                    className="w-full sm:w-auto"
                                >
                                    Reset
                                </Button>
                                <Button
                                    type="button"
                                    onClick={startUpload}
                                    disabled={!canUpload}
                                    className="w-full sm:w-auto"
                                >
                                    Upload CSV
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-gray-100 rounded-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold text-gray-700">
                            Instructions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ol className="space-y-3 text-sm text-gray-600 list-decimal list-inside">
                            <li>Download the CSV template to ensure correct formatting</li>
                            <li>Fill your medicine data including name, availability, and stock quantity</li>
                            <li>Upload the file (CSV only)</li>
                            <li>You’ll see progress and a success/failed message at the end</li>
                        </ol>

                        <div className="mt-6 rounded-xl border border-gray-100 bg-white p-4">
                            <div className="text-xs font-semibold text-gray-700">
                                Required Columns
                            </div>
                            <div className="mt-2 text-xs text-gray-600">
                                <div>
                                    <span className="font-medium">name</span>
                                </div>
                                <div>
                                    <span className="font-medium">available</span> (true/false)
                                </div>
                                <div>
                                    <span className="font-medium">quantity</span> (number)
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
