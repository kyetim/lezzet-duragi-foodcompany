import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function DELETE(
    request: Request,
    { params }: { params: { id: string; imageId: string } }
) {
    try {
        await prisma.image.delete({
            where: {
                id: params.imageId,
                albumId: params.id,
            },
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error('Error deleting image:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
} 