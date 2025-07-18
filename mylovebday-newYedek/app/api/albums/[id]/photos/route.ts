import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const formData = await request.formData()
        const files = formData.getAll('photos')

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: 'Fotoğraf yüklenmedi' },
                { status: 400 }
            )
        }

        const album = await prisma.album.findUnique({
            where: { id: params.id },
        })

        if (!album) {
            return NextResponse.json(
                { error: 'Albüm bulunamadı' },
                { status: 404 }
            )
        }

        const uploadedPhotos = await Promise.all(
            files.map(async (file: any) => {
                const bytes = await file.arrayBuffer()
                const buffer = Buffer.from(bytes)

                // Dosya adını oluştur
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
                const filename = `${uniqueSuffix}-${file.name}`
                const path = join(process.cwd(), 'public/uploads', filename)

                // Dosyayı kaydet
                await writeFile(path, buffer)

                // Veritabanına kaydet
                return prisma.image.create({
                    data: {
                        url: `/uploads/${filename}`,
                        albumId: params.id,
                    },
                })
            })
        )

        return NextResponse.json(uploadedPhotos)
    } catch (error) {
        console.error('Fotoğraf yükleme hatası:', error)
        return NextResponse.json(
            { error: 'Fotoğraflar yüklenirken bir hata oluştu' },
            { status: 500 }
        )
    }
} 