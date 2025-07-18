import { NextResponse } from 'next/server'

const TICKETMASTER_API_KEY = process.env.NEXT_PUBLIC_TICKETMASTER_API_KEY
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const city = searchParams.get('city')

        if (!city) {
            return NextResponse.json(
                { error: 'Şehir parametresi gerekli' },
                { status: 400 }
            )
        }

        const response = await fetch(
            `${BASE_URL}/events.json?` +
            new URLSearchParams({
                apikey: TICKETMASTER_API_KEY || '',
                city: city,
                locale: 'tr',
                sort: 'date,asc',
                size: '20'
            })
        )

        if (!response.ok) {
            throw new Error('Ticketmaster API yanıt vermedi')
        }

        const data = await response.json()
        return NextResponse.json(data._embedded?.events || [])
    } catch (error) {
        console.error('Ticketmaster API Error:', error)
        return NextResponse.json(
            { error: 'Etkinlikler yüklenirken bir hata oluştu' },
            { status: 500 }
        )
    }
} 