'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TravelService } from '@/services/api'
import { Button } from '@/components/ui/button'
import LocationMap from './LocationMap'

export default function CreateTravelPlanForm() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
    const [locationInput, setLocationInput] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError('')

        try {
            const formData = new FormData(e.currentTarget)
            const data = {
                title: formData.get('title') as string,
                location: formData.get('location') as string,
                startDate: new Date(formData.get('startDate') as string),
                endDate: new Date(formData.get('endDate') as string),
                description: formData.get('description') as string,
                budget: Number(formData.get('budget')),
                notes: formData.get('notes') as string,
                latitude: selectedLocation?.lat,
                longitude: selectedLocation?.lng,
                status: 'PLANNED'
            }

            await TravelService.createPlan(data)
            router.push('/travel')
            router.refresh()
        } catch (err) {
            setError('Tatil planı oluşturulurken bir hata oluştu')
            console.error('Error creating travel plan:', err)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleLocationSelect = (lat: number, lng: number) => {
        setSelectedLocation({ lat, lng })
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-lg text-center text-lg">
                    {error}
                </div>
            )}

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
                            Başlık
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            className="w-full h-12 px-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Tatil planınızın başlığını girin"
                        />
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-lg font-medium text-gray-700 mb-2">
                            Konum
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            required
                            value={locationInput}
                            onChange={(e) => setLocationInput(e.target.value)}
                            className="w-full h-12 px-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Gideceğiniz yeri girin"
                        />
                        <div className="mt-4">
                            <p className="text-sm text-gray-600 mb-2">Haritadan konum seçin veya adres yazın:</p>
                            <LocationMap
                                onLocationSelect={handleLocationSelect}
                                searchAddress={locationInput}
                            />
                            {selectedLocation && (
                                <p className="mt-2 text-sm text-gray-600">
                                    Seçilen konum: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="startDate" className="block text-lg font-medium text-gray-700 mb-2">
                                Başlangıç Tarihi
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                required
                                className="w-full h-12 px-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="endDate" className="block text-lg font-medium text-gray-700 mb-2">
                                Bitiş Tarihi
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                required
                                className="w-full h-12 px-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">
                            Açıklama
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            placeholder="Tatil planınız hakkında detaylı bilgi verin"
                        />
                    </div>

                    <div>
                        <label htmlFor="budget" className="block text-lg font-medium text-gray-700 mb-2">
                            Bütçe (TL)
                        </label>
                        <input
                            type="number"
                            id="budget"
                            name="budget"
                            min="0"
                            className="w-full h-12 px-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Planladığınız bütçeyi girin"
                        />
                    </div>

                    <div>
                        <label htmlFor="notes" className="block text-lg font-medium text-gray-700 mb-2">
                            Notlar
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows={4}
                            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            placeholder="Eklemek istediğiniz notları yazın"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 px-8 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                >
                    {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
            </div>
        </form>
    )
} 