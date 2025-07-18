import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
    try {
        // Test veritabanı bağlantısı
        await prisma.$connect()

        // Test verisi oluştur
        const testEntry = await prisma.diaryEntry.create({
            data: {
                title: 'Test Başlık',
                content: 'Test İçerik'
            }
        })

        // Test verisini sil
        await prisma.diaryEntry.delete({
            where: {
                id: testEntry.id
            }
        })

        return NextResponse.json({ status: 'success', message: 'Veritabanı bağlantısı başarılı' })
    } catch (error: any) {
        console.error('Veritabanı test hatası:', error)
        return NextResponse.json(
            { status: 'error', message: 'Veritabanı bağlantısı başarısız', error: error?.message || 'Bilinmeyen hata' },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
} 