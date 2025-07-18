import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const poems = await prisma.poem.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(poems)
}

export async function POST(request: Request) {
    const data = await request.json()
    const poem = await prisma.poem.create({
        data: {
            title: data.title,
            content: data.content,
        },
    })
    return NextResponse.json(poem)
} 