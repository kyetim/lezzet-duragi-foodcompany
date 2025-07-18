import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

// Günlük yazılarını getir
export async function GET() {
    try {
        const entries = await prisma.diaryEntry.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        })
        return NextResponse.json(entries)
    } catch (error) {
        console.error('Günlük getirme hatası:', error)
        return NextResponse.json(
            { error: 'Günlük yazıları getirilirken bir hata oluştu' },
            { status: 500 }
        )
    }
}

// Yeni günlük yazısı ekle
export async function POST(request: Request) {
    try {
        const data = await request.json()
        const entry = await prisma.diaryEntry.create({
            data: {
                title: data.title,
                content: data.content,
            },
        })
        return NextResponse.json(entry)
    } catch (error) {
        console.error('Günlük ekleme hatası:', error)
        return NextResponse.json(
            { error: 'Günlük yazısı eklenirken bir hata oluştu' },
            { status: 500 }
        )
    }
}

// Günlük yazısını güncelle
export async function PUT(request: Request) {
    try {
        const data = await request.json()
        const entry = await prisma.diaryEntry.update({
            where: {
                id: data.id,
            },
            data: {
                title: data.title,
                content: data.content,
            },
        })
        return NextResponse.json(entry)
    } catch (error) {
        console.error('Günlük güncelleme hatası:', error)
        return NextResponse.json(
            { error: 'Günlük yazısı güncellenirken bir hata oluştu' },
            { status: 500 }
        )
    }
} 