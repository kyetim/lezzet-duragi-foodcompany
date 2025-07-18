import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { status } = await request.json()

        const userEvent = await prisma.userEvent.update({
            where: {
                id: params.id
            },
            data: {
                status
            },
            include: {
                event: true
            }
        })

        return NextResponse.json(userEvent)
    } catch (error) {
        console.error('Error updating user event:', error)
        return NextResponse.json(
            { error: 'Etkinlik durumu güncellenirken bir hata oluştu' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.userEvent.delete({
            where: {
                id: params.id
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting user event:', error)
        return NextResponse.json(
            { error: 'Etkinlik kaldırılırken bir hata oluştu' },
            { status: 500 }
        )
    }
} 