'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

interface LocationMapProps {
    onLocationSelect: (lat: number, lng: number) => void
    searchAddress?: string
}

function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
    const [position, setPosition] = useState<[number, number] | null>(null)
    const map = useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng])
            onLocationSelect(e.latlng.lat, e.latlng.lng)
        },
    })

    return position === null ? null : (
        <Marker position={position} />
    )
}

function SearchLocation({ searchAddress }: { searchAddress?: string }) {
    const map = useMap()

    useEffect(() => {
        if (!searchAddress) return

        const searchLocation = async () => {
            try {
                const response = await fetch(
                    `/api/location?q=${encodeURIComponent(searchAddress)}`
                )
                const data = await response.json()

                if (data && data.length > 0) {
                    const { lat, lon } = data[0]
                    map.setView([parseFloat(lat), parseFloat(lon)], 13)
                }
            } catch (error) {
                console.error('Error searching location:', error)
            }
        }

        searchLocation()
    }, [searchAddress, map])

    return null
}

export default function LocationMap({ onLocationSelect, searchAddress }: LocationMapProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Harita yükleniyor...</p>
            </div>
        )
    }

    return (
        <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200">
            <MapContainer
                center={[41.0082, 28.9784]} // Istanbul coordinates
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker onLocationSelect={onLocationSelect} />
                <SearchLocation searchAddress={searchAddress} />
            </MapContainer>
        </div>
    )
} 