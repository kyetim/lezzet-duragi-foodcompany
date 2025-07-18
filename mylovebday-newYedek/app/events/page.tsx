'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { toast } from 'react-hot-toast'
import { eventService } from '@/services/api'
import { getRandomImage } from '@/services/images'
import Link from 'next/link'
import Image from 'next/image'

const cities = [
    { label: 'Mersin', value: 'Mersin' }
];

interface EventFormData {
    title: string;
    description: string;
    venue: string;
    city: string;
    address: string;
    startDate: string;
    endDate: string;
    imageUrl: string;
    ticketUrl: string;
    price: string;
    category: string;
}

const initialEventState: EventFormData = {
    title: '',
    description: '',
    venue: '',
    city: '',
    address: '',
    startDate: '',
    endDate: '',
    imageUrl: '',
    ticketUrl: '',
    price: '',
    category: ''
};

export default function EventsPage() {
    const router = useRouter()
    const [events, setEvents] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newEvent, setNewEvent] = useState<EventFormData>(initialEventState)
    const [selectedEvents, setSelectedEvents] = useState<string[]>([])

    useEffect(() => {
        loadEvents()
    }, [])

    const loadEvents = async () => {
        try {
            setIsLoading(true)
            const data = await eventService.getAllEvents()
            setEvents(data)
        } catch (error) {
            console.error('Error loading events:', error)
            toast.error('Etkinlikler yüklenirken bir hata oluştu')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            // Validate required fields
            if (!newEvent.title || !newEvent.description || !newEvent.venue || !newEvent.address || !newEvent.startDate || !newEvent.city || !newEvent.category) {
                toast.error('Lütfen tüm zorunlu alanları doldurun')
                return
            }

            // Set endDate to startDate if not provided
            if (!newEvent.endDate) {
                newEvent.endDate = newEvent.startDate
            }

            // Validate dates
            const startDate = new Date(newEvent.startDate)
            const endDate = new Date(newEvent.endDate)

            if (endDate < startDate) {
                toast.error('Bitiş tarihi başlangıç tarihinden sonra olmalıdır')
                return
            }

            console.log('Creating event with data:', newEvent)
            const createdEvent = await eventService.createEvent({
                ...newEvent,
                city: newEvent.city.charAt(0).toUpperCase() + newEvent.city.slice(1).toLowerCase()
            })
            console.log('Event created successfully:', createdEvent)

            toast.success('Etkinlik başarıyla oluşturuldu')
            setIsModalOpen(false)
            setNewEvent(initialEventState)
            loadEvents()
        } catch (error) {
            console.error('Error creating event:', error)
            toast.error(error instanceof Error ? error.message : 'Etkinlik oluşturulurken bir hata oluştu')
        }
    }

    const handleDeleteEvent = async (eventId: string) => {
        if (window.confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) {
            try {
                await eventService.deleteEvent(eventId)
                toast.success('Etkinlik başarıyla silindi')
                loadEvents()
            } catch (error) {
                console.error('Error deleting event:', error)
                toast.error('Etkinlik silinirken bir hata oluştu')
            }
        }
    }

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategory = e.target.value
        console.log('Selected category:', selectedCategory)

        const imageUrl = getRandomImage(selectedCategory)
        console.log('Generated image URL:', imageUrl)

        if (!imageUrl) {
            console.error('No image URL returned for category:', selectedCategory)
            return
        }

        setNewEvent(prev => ({
            ...prev,
            category: selectedCategory,
            imageUrl
        }))
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setNewEvent(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSelectEvent = (eventId: string) => {
        if (selectedEvents.includes(eventId)) {
            setSelectedEvents(selectedEvents.filter((id) => id !== eventId))
        } else {
            setSelectedEvents([...selectedEvents, eventId])
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                        <p className="mt-4 text-purple-600">Etkinlikler yükleniyor...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="font-medium">Ana Sayfa</span>
                        </button>
                        <h1 className="text-4xl font-bold text-purple-600">
                            Etkinlikler
                        </h1>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                    >
                        Yeni Etkinlik Ekle
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => {
                        const imageUrl = event.imageUrl || (() => {
                            const randomImage = getRandomImage(event.category)
                            if (!event.imageUrl && randomImage) {
                                event.imageUrl = randomImage
                            }
                            return randomImage
                        })()

                        return (
                            <div
                                key={event.id}
                                className={`bg-white rounded-xl shadow-lg overflow-hidden relative border-2 ${selectedEvents.includes(event.id) ? 'border-purple-500' : 'border-transparent'}`}
                            >
                                <div className="absolute top-3 left-3 z-20">
                                    <input
                                        type="checkbox"
                                        checked={selectedEvents.includes(event.id)}
                                        onChange={() => handleSelectEvent(event.id)}
                                        className="w-5 h-5 accent-purple-500"
                                    />
                                </div>
                                <div className="relative w-full h-48">
                                    {imageUrl ? (
                                        <Image
                                            src={imageUrl}
                                            alt={event.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement
                                                console.error('Image load error:', e)
                                                const fallbackImage = getRandomImage(event.category)
                                                if (fallbackImage) {
                                                    event.imageUrl = fallbackImage
                                                    target.src = fallbackImage
                                                }
                                            }}
                                            unoptimized={!event.imageUrl}
                                            priority
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-400">Görsel yok</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-purple-600 mb-2">{event.title}</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                                    <div className="flex items-center text-gray-500 mb-4">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{format(new Date(event.startDate), 'd MMMM yyyy, HH:mm', { locale: tr })}</span>
                                    </div>
                                    <div className="flex items-center text-gray-500 mb-4">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>{event.venue}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <Link
                                            href={`/events/${event.id}`}
                                            className="text-purple-600 hover:text-purple-800 font-medium"
                                        >
                                            Detaylar
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteEvent(event.id)}
                                            className="text-red-600 hover:text-red-800 font-medium"
                                        >
                                            Sil
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Create Event Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold text-purple-600 mb-6">Yeni Etkinlik Oluştur</h2>
                            <form onSubmit={handleCreateEvent} className="space-y-4">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Etkinlik Türü
                                    </label>
                                    <select
                                        name="category"
                                        value={newEvent.category}
                                        onChange={handleCategoryChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Seçiniz</option>
                                        <option value="CONCERT">Konser</option>
                                        <option value="THEATRE">Tiyatro</option>
                                        <option value="EXHIBITION">Sergi</option>
                                        <option value="FESTIVAL">Festival</option>
                                        <option value="COMEDY">Stand-up</option>
                                        <option value="SPORTS">Spor</option>
                                    </select>
                                </div>

                                {/* Seçilen Görsel Önizleme */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Etkinlik Görseli
                                    </label>
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300">
                                        {newEvent.imageUrl ? (
                                            <Image
                                                src={newEvent.imageUrl}
                                                alt="Etkinlik görseli"
                                                fill
                                                className="object-cover"
                                                onError={(e) => {
                                                    console.error('Image load error:', e)
                                                    const target = e.target as HTMLImageElement
                                                    const fallbackImage = getRandomImage(newEvent.category)
                                                    console.log('Loading fallback image:', fallbackImage)
                                                    target.src = fallbackImage
                                                }}
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-400">Görsel yok</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Başlık
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={newEvent.title}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Açıklama
                                    </label>
                                    <textarea
                                        name="description"
                                        value={newEvent.description}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mekan
                                    </label>
                                    <input
                                        type="text"
                                        name="venue"
                                        value={newEvent.venue}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Şehir
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={newEvent.city}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Adres
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={newEvent.address}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Başlangıç Tarihi
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="startDate"
                                        value={newEvent.startDate}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Bitiş Tarihi
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="endDate"
                                        value={newEvent.endDate}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Bilet Fiyatı
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={newEvent.price}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Bilet Linki
                                    </label>
                                    <input
                                        type="url"
                                        name="ticketUrl"
                                        value={newEvent.ticketUrl}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                                    >
                                        Oluştur
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
} 