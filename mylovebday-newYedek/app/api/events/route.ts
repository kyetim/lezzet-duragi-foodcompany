import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const city = searchParams.get('city')

        console.log('Fetching events with city filter:', city)

        const events = await prisma.event.findMany({
            where: city ? { city } : undefined,
            orderBy: {
                startDate: 'asc'
            }
        })

        console.log(`Found ${events.length} events`)
        return NextResponse.json(events)
    } catch (error) {
        console.error('Error fetching events:', error)
        return NextResponse.json(
            {
                message: 'Etkinlikler yüklenirken bir hata oluştu',
                error: error instanceof Error ? error.message : 'Bilinmeyen hata'
            },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()
        console.log('Received event data:', data)

        // Validate required fields
        const requiredFields = ['title', 'description', 'venue', 'city', 'address', 'startDate', 'endDate', 'category']
        const missingFields = requiredFields.filter(field => !data[field])

        if (missingFields.length > 0) {
            console.log('Missing required fields:', missingFields)
            return NextResponse.json(
                { message: `Eksik alanlar: ${missingFields.join(', ')}` },
                { status: 400 }
            )
        }

        // Validate dates
        if (new Date(data.startDate) > new Date(data.endDate)) {
            console.log('Invalid dates:', { startDate: data.startDate, endDate: data.endDate })
            return NextResponse.json(
                { message: 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır' },
                { status: 400 }
            )
        }

        // Prepare data for database
        const eventData = {
            title: data.title,
            description: data.description,
            venue: data.venue,
            city: data.city,
            address: data.address,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            imageUrl: data.imageUrl || null,
            ticketUrl: data.ticketUrl || null,
            price: data.price ? parseFloat(data.price) : null,
            category: data.category
        }

        console.log('Creating event with prepared data:', eventData)

        const event = await prisma.event.create({
            data: eventData
        })

        console.log('Event created successfully:', event)
        return NextResponse.json(event)
    } catch (error) {
        console.error('Error creating event:', error)
        // Check if it's a Prisma error
        if (error instanceof Error) {
            if (error.message.includes('Unique constraint')) {
                return NextResponse.json(
                    { message: 'Bu etkinlik zaten mevcut' },
                    { status: 400 }
                )
            }
            if (error.message.includes('Invalid value')) {
                return NextResponse.json(
                    { message: 'Geçersiz veri formatı' },
                    { status: 400 }
                )
            }
        }
        return NextResponse.json(
            {
                message: 'Etkinlik oluşturulurken bir hata oluştu',
                error: error instanceof Error ? error.message : 'Bilinmeyen hata'
            },
            { status: 500 }
        )
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { error: 'Etkinlik ID\'si gerekli' },
                { status: 400 }
            )
        }

        await prisma.event.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting event:', error)
        return NextResponse.json(
            { error: 'Etkinlik silinirken bir hata oluştu' },
            { status: 500 }
        )
    }
} 