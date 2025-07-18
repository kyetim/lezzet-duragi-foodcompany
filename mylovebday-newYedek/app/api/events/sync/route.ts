import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { EventbriteEvent } from '@/app/services/eventbrite'

export async function POST(request: Request) {
    try {
        const { events } = await request.json() as { events: EventbriteEvent[] }

        const results = await Promise.all(
            events.map(async (event) => {
                const eventData = {
                    title: event.name.text,
                    description: event.description.text,
                    venue: event.venue.name,
                    city: event.venue.address.city,
                    address: event.venue.address.address_1,
                    startDate: new Date(event.start.local),
                    endDate: new Date(event.end.local),
                    imageUrl: event.logo?.url || '',
                    ticketUrl: event.url,
                    price: event.ticket_availability?.minimum_ticket_price?.major_value || '0',
                    category: 'CONCERT', // Varsayılan kategori
                    externalId: event.id,
                    externalSource: 'EVENTBRITE'
                }

                return prisma.event.upsert({
                    where: {
                        externalId_externalSource: {
                            externalId: event.id,
                            externalSource: 'EVENTBRITE'
                        }
                    },
                    update: eventData,
                    create: eventData
                })
            })
        )

        return NextResponse.json({
            message: 'Etkinlikler başarıyla senkronize edildi',
            count: results.length
        })
    } catch (error) {
        console.error('Sync Error:', error)
        return NextResponse.json(
            { error: 'Etkinlikler senkronize edilirken bir hata oluştu' },
            { status: 500 }
        )
    }
} 