import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        // TODO: Replace with actual user authentication
        const userId = '1' // Temporary hardcoded user ID

        const userEvents = await prisma.userEvent.findMany({
            where: {
                userId
            },
            include: {
                event: true
            },
            orderBy: {
                event: {
                    startDate: 'asc'
                }
            }
        })

        return NextResponse.json(userEvents)
    } catch (error) {
        console.error('Error fetching user events:', error)
        return NextResponse.json(
            { error: 'Kullanıcı etkinlikleri yüklenirken bir hata oluştu' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const { eventId } = await request.json()
        // TODO: Replace with actual user authentication
        const userId = '1' // Temporary hardcoded user ID

        const userEvent = await prisma.userEvent.create({
            data: {
                eventId,
                userId,
                status: 'PLANNED'
            },
            include: {
                event: true
            }
        })

        return NextResponse.json(userEvent)
    } catch (error) {
        console.error('Error adding user event:', error)
        return NextResponse.json(
            { error: 'Etkinlik eklenirken bir hata oluştu' },
            { status: 500 }
        )
    }
} 