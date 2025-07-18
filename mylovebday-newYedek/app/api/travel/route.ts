import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
    try {
        const plans = await prisma.travelPlan.findMany({
            orderBy: {
                startDate: 'desc'
            }
        })
        return NextResponse.json(plans)
    } catch (error) {
        console.error('Error fetching travel plans:', error)
        return NextResponse.json(
            { error: 'Tatil planları getirilemedi' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()

        // Format dates to ISO string
        const formattedData = {
            ...data,
            startDate: new Date(data.startDate).toISOString(),
            endDate: new Date(data.endDate).toISOString()
        }

        const plan = await prisma.travelPlan.create({
            data: formattedData
        })
        return NextResponse.json(plan)
    } catch (error) {
        console.error('Error creating travel plan:', error)
        return NextResponse.json(
            { error: 'Tatil planı oluşturulamadı' },
            { status: 500 }
        )
    }
}

export async function PATCH(request: Request) {
    try {
        const data = await request.json()
        const { id, status } = data

        const plan = await prisma.travelPlan.update({
            where: { id },
            data: { status }
        })
        return NextResponse.json(plan)
    } catch (error) {
        console.error('Error updating travel plan:', error)
        return NextResponse.json(
            { error: 'Tatil planı güncellenemedi' },
            { status: 500 }
        )
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) {
            return NextResponse.json({ error: 'Plan ID gerekli' }, { status: 400 })
        }
        await prisma.travelPlan.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting travel plan:', error)
        return NextResponse.json({ error: 'Tatil planı silinemedi' }, { status: 500 })
    }
} 