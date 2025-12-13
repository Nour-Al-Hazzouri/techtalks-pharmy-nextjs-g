"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { MOCK_PHARMACIES, Pharmacy } from "@/lib/mock-data"
import { renderToString } from 'react-dom/server'
import { Pill } from "lucide-react"

// Create custom icons using DivIcon and SVG
const createPharmacyIcon = (status: string) => {
    // Determine color based on status (optional, using brand pink for now)
    const color = status === "Open" ? "#E91E63" : "#6B7280"

    // Render the Lucide icon to a string
    const iconHtml = renderToString(
        <div className="relative flex flex-col items-center justify-center translate-y-[-50%]">
            <div className={`w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center border-2 ${status === "Open" ? 'border-[#E91E63]' : 'border-gray-500'}`}>
                <Pill className={`w-4 h-4 ${status === "Open" ? 'text-[#E91E63]' : 'text-gray-500'}`} />
            </div>
            {/* Tiny triangle for the pin tip */}
            <div className={`w-2 h-2 rotate-45 transform -mt-1 ${status === "Open" ? 'bg-[#E91E63]' : 'bg-gray-500'}`}></div>
        </div>
    )

    return new L.DivIcon({
        className: 'custom-pharmacy-icon',
        html: iconHtml,
        iconSize: [32, 40],
        iconAnchor: [16, 40], // Point of the icon which corresponds to marker's location
        popupAnchor: [0, -40] // Point from which the popup should open relative to the iconAnchor
    })
}

interface PharmacyMapProps {
    onSelect: (pharmacy: Pharmacy) => void
}

export default function PharmacyMap({ onSelect }: PharmacyMapProps) {
    // Ensure map only renders on client
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">Loading Map...</div>

    return (
        <MapContainer
            center={[33.8938, 35.5018]} // Beirut Center
            zoom={13}
            className="w-full h-full z-0"
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="bottomright" />

            {MOCK_PHARMACIES.map((pharmacy) => (
                <Marker
                    key={pharmacy.id}
                    position={pharmacy.coordinates}
                    icon={createPharmacyIcon(pharmacy.status)}
                    eventHandlers={{
                        click: () => {
                            onSelect(pharmacy)
                        }
                    }}
                >
                    <Popup>
                        <div className="font-semibold">{pharmacy.name}</div>
                        <div className="text-xs text-gray-500">{pharmacy.status}</div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}
