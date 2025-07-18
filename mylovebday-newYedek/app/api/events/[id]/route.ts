import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log('Fetching event with ID:', params.id)

        const event = await prisma.event.findUnique({
            where: {
                id: params.id
            }
        })

        if (!event) {
            console.log('Event not found:', params.id)
            return NextResponse.json(
                { message: 'Etkinlik bulunamadı' },
                { status: 404 }
            )
        }

        console.log('Event found:', event)
        return NextResponse.json(event)
    } catch (error) {
        console.error('Error fetching event:', error)
        return NextResponse.json(
            {
                message: 'Etkinlik detayları yüklenirken bir hata oluştu',
                error: error instanceof Error ? error.message : 'Bilinmeyen hata'
            },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log('Deleting event with ID:', params.id)

        const event = await prisma.event.findUnique({
            where: {
                id: params.id
            }
        })

        if (!event) {
            console.log('Event not found:', params.id)
            return NextResponse.json(
                { message: 'Etkinlik bulunamadı' },
                { status: 404 }
            )
        }

        await prisma.event.delete({
            where: {
                id: params.id
            }
        })

        console.log('Event deleted successfully:', params.id)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting event:', error)
        return NextResponse.json(
            {
                message: 'Etkinlik silinirken bir hata oluştu',
                error: error instanceof Error ? error.message : 'Bilinmeyen hata'
            },
            { status: 500 }
        )
    }
} 