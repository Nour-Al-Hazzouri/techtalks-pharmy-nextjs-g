"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Pharmacy } from "@/lib/mock-data"
import { renderToString } from 'react-dom/server'
import { Pill, Navigation } from "lucide-react"

// Create custom icons using DivIcon and SVG
const createPharmacyIcon = (isCheapest?: boolean) => {
    const color = isCheapest ? "#10B981" : "#E91E63" // Green for cheapest, Brand pink for others

    // Render the Lucide icon to a string
    const iconHtml = renderToString(
        <div className="relative flex flex-col items-center justify-center">
            <div className={`w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center border-2`} style={{ borderColor: color }}>
                <Pill className={`w-4 h-4`} style={{ color: color }} />
            </div>
            {/* Tiny triangle for the pin tip */}
            <div className={`w-2 h-2 rotate-45 transform -mt-1`} style={{ backgroundColor: color }}></div>
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

const createUserIcon = () => {
    const color = "#3B82F6" // Blue

    const iconHtml = renderToString(
        <div className="relative flex flex-col items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-blue-500 shadow-md flex items-center justify-center border-2 border-white">
                <Navigation className="w-4 h-4 text-white fill-white" />
            </div>
            <div className="w-2 h-2 rotate-45 transform -mt-1 bg-blue-500 border-r border-b border-white"></div>
        </div>
    )

    return new L.DivIcon({
        className: 'user-location-icon',
        html: iconHtml,
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -40]
    })
}

interface PharmacyMapProps {
    pharmacies: Pharmacy[]
    onSelect: (pharmacy: Pharmacy) => void
    center?: [number, number]
    userLocation?: [number, number] | null
    onMapClick?: (coords: [number, number]) => void
}

function RecenterMap({ center }: { center?: [number, number] }) {
    const map = useMap()

    useEffect(() => {
        if (!center) return
        // Zoom to level 16 when focusing on a specific location (pharmacy)
        map.setView(center, 16, { animate: true })
    }, [center, map])

    return null
}

function MapEvents({ onClick }: { onClick?: (coords: [number, number]) => void }) {
    useMapEvents({
        click(e) {
            if (onClick) onClick([e.latlng.lat, e.latlng.lng])
        },
    })
    return null
}

export default function PharmacyMap({ pharmacies, onSelect, center, userLocation, onMapClick }: PharmacyMapProps) {
    // Ensure map only renders on client
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">Loading Map...</div>

    return (
        <MapContainer
            center={center ?? [33.8938, 35.5018]} // Beirut Center
            zoom={13}
            className="w-full h-full z-0"
            zoomControl={false}
        >
            <RecenterMap center={center} />
            <MapEvents onClick={onMapClick} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="bottomright" />

            {userLocation && (
                <Marker
                    position={userLocation}
                    icon={createUserIcon()}
                >
                    <Popup>Your Location</Popup>
                </Marker>
            )}

            {pharmacies.map((pharmacy) => (
                <Marker
                    key={pharmacy.id}
                    position={pharmacy.coordinates}
                    icon={createPharmacyIcon(pharmacy.isCheapest)}
                    eventHandlers={{
                        click: () => {
                            onSelect(pharmacy)
                        }
                    }}
                >
                    <Popup>
                        <div className="font-semibold">{pharmacy.name}</div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}
