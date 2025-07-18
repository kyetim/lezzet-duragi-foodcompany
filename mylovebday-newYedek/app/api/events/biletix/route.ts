import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

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

        // Biletix şehir URL'lerini eşleştir
        const cityUrls: { [key: string]: string } = {
            'İstanbul': 'istanbul',
            'Ankara': 'ankara',
            'İzmir': 'izmir',
            'Antalya': 'antalya',
            'Eskişehir': 'eskisehir',
            'Adana': 'adana',
            'Mersin': 'mersin'
        }

        const cityUrl = cityUrls[city]
        if (!cityUrl) {
            return NextResponse.json(
                { error: 'Geçersiz şehir' },
                { status: 400 }
            )
        }

        // Biletix'ten etkinlikleri çek
        const response = await fetch(`https://www.biletix.com/etkinlikler/${cityUrl}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        })

        if (!response.ok) {
            throw new Error('Biletix yanıt vermedi')
        }

        const html = await response.text()
        const $ = cheerio.load(html)
        const events: any[] = []

        // Etkinlik kartlarını seç ve işle
        $('.event-card').each((i, element) => {
            const title = $(element).find('.event-title').text().trim()
            const date = $(element).find('.event-date').text().trim()
            const venue = $(element).find('.event-venue').text().trim()
            const imageUrl = $(element).find('img').attr('src') || ''
            const ticketUrl = $(element).find('a').attr('href') || ''

            if (title && date && venue) {
                events.push({
                    id: `biletix-${i}`,
                    title,
                    description: `${venue} - ${date}`,
                    venue,
                    city,
                    address: venue,
                    startDate: date, // Tarih formatını dönüştürmek gerekebilir
                    endDate: date, // Tarih formatını dönüştürmek gerekebilir
                    imageUrl,
                    ticketUrl: ticketUrl.startsWith('http') ? ticketUrl : `https://www.biletix.com${ticketUrl}`,
                    category: 'CONCERT' // Varsayılan kategori
                })
            }
        })

        return NextResponse.json(events)
    } catch (error) {
        console.error('Biletix Scraping Error:', error)
        return NextResponse.json(
            { error: 'Etkinlikler yüklenirken bir hata oluştu' },
            { status: 500 }
        )
    }
} 