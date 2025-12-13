"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { MOCK_PHARMACIES, Pharmacy } from "@/lib/mock-data"

// Fix for default Leaflet icon not found
const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png"
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png"
const shadowUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png"

// Create custom icons based on status
const createCustomIcon = (color: string) => {
    return new L.Icon({
        iconUrl: iconUrl,
        iconRetinaUrl: iconRetinaUrl,
        shadowUrl: shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    })
}

const defaultIcon = createCustomIcon("blue")

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
                    icon={defaultIcon}
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
