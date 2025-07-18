import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Tüm albümleri getir
export async function GET() {
    try {
        const albums = await prisma.album.findMany({
            include: { images: true },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(albums)
    } catch (error) {
        console.error('Error fetching albums:', error)
        return NextResponse.json(
            { error: 'Albümler getirilirken bir hata oluştu' },
            { status: 500 }
        )
    }
}

// Yeni albüm oluştur
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { title, description, category, coverImage } = body

        if (!title) {
            return NextResponse.json(
                { error: 'Albüm başlığı gereklidir' },
                { status: 400 }
            )
        }

        const album = await prisma.album.create({
            data: {
                title,
                description,
                category: category || 'GENEL',
                coverImage
            }
        })

        return NextResponse.json(album)
    } catch (error) {
        console.error('Error creating album:', error)
        return NextResponse.json(
            { error: 'Albüm oluşturulurken bir hata oluştu' },
            { status: 500 }
        )
    }
} 