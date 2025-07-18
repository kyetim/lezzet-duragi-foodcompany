import { NextResponse } from 'next/server'
import prisma from '../../../../../lib/prisma'
import { unlink } from 'fs/promises'
import { join } from 'path'

export async function DELETE(
    request: Request,
    { params }: { params: { id: string; photoId: string } }
) {
    try {
        const photo = await prisma.image.findUnique({
            where: { id: params.photoId },
        })

        if (!photo) {
            return NextResponse.json(
                { error: 'Fotoğraf bulunamadı' },
                { status: 404 }
            )
        }

        // Dosyayı sil
        try {
            const filename = photo.url.split('/').pop()
            if (filename) {
                const path = join(process.cwd(), 'public', photo.url)
                await unlink(path)
            }
        } catch (error) {
            console.error('Dosya silme hatası:', error)
            // Dosya silme hatası olsa bile devam et
        }

        // Veritabanından sil
        await prisma.image.delete({
            where: { id: params.photoId },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Fotoğraf silme hatası:', error)
        return NextResponse.json(
            { error: 'Fotoğraf silinirken bir hata oluştu' },
            { status: 500 }
        )
    }
} 