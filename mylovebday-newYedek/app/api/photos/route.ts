import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Albüme fotoğraf ekle
export async function POST(request: Request) {
    try {
        const data = await request.json()
        const photo = await prisma.photo.create({
            data: {
                url: data.url,
                description: data.description,
                albumId: data.albumId,
            },
        })
        return NextResponse.json(photo)
    } catch (error) {
        return NextResponse.json({ error: 'Fotoğraf eklenirken bir hata oluştu' }, { status: 500 })
    }
}

// Albümdeki fotoğrafları getir
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const albumId = searchParams.get('albumId')

        if (!albumId) {
            return NextResponse.json({ error: 'Album ID gerekli' }, { status: 400 })
        }

        const photos = await prisma.photo.findMany({
            where: {
                albumId: albumId,
            },
        })
        return NextResponse.json(photos)
    } catch (error) {
        return NextResponse.json({ error: 'Fotoğraflar getirilirken bir hata oluştu' }, { status: 500 })
    }
} 