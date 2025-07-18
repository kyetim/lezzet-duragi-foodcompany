import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Photo } from '../../../lib/types'

// Albüm sil
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.album.delete({
            where: {
                id: params.id,
            },
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error('Error deleting album:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const album = await prisma.album.findUnique({
            where: {
                id: params.id,
            },
            include: {
                images: true,
            },
        })

        if (!album) {
            return new NextResponse('Album not found', { status: 404 })
        }

        return NextResponse.json(album)
    } catch (error) {
        console.error('Error fetching album:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const data = await request.json()
        const { title, description } = data

        const updatedAlbum = await prisma.album.update({
            where: {
                id: params.id,
            },
            data: {
                ...(title && { title }),
                ...(description && { description }),
            },
        })

        return NextResponse.json(updatedAlbum)
    } catch (error) {
        console.error('Error updating album:', error)
        return NextResponse.json(
            { error: 'Albüm güncellenirken bir hata oluştu' },
            { status: 500 }
        )
    }
} 