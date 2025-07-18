import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { imageUrl } = await request.json()

        const image = await prisma.image.create({
            data: {
                url: imageUrl,
                albumId: params.id
            }
        })

        return NextResponse.json(image)
    } catch (error) {
        console.error('Error adding image:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
} 