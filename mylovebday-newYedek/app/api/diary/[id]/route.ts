import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.diaryEntry.delete({
            where: {
                id: params.id,
            },
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Günlük silme hatası:', error)
        return NextResponse.json(
            { error: 'Günlük yazısı silinirken bir hata oluştu' },
            { status: 500 }
        )
    }
} 