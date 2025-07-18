import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { getRandomImage } from '@/services/images'
import Image from 'next/image'
import Link from 'next/link'

interface PageProps {
    params: {
        id: string
    }
}

export default async function EventDetailPage({ params }: PageProps) {
    const event = await prisma.event.findUnique({
        where: {
            id: params.id
        }
    })

    if (!event) {
        notFound()
    }

    const imageUrl = event.imageUrl || getRandomImage(event.category)

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/events"
                        className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Etkinliklere Dön
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="relative w-full h-96">
                        {imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt={event.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">Görsel yok</span>
                            </div>
                        )}
                    </div>
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-purple-600 mb-4">{event.title}</h1>
                        <p className="text-gray-600 mb-6">{event.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700 mb-2">Tarih ve Saat</h2>
                                <p className="text-gray-600">
                                    {format(new Date(event.startDate), 'd MMMM yyyy, HH:mm', { locale: tr })}
                                </p>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700 mb-2">Mekan</h2>
                                <p className="text-gray-600">{event.venue}</p>
                                <p className="text-gray-500">{event.address}</p>
                            </div>
                        </div>
                        {event.ticketUrl && (
                            <a
                                href={event.ticketUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Bilet Al
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
} 