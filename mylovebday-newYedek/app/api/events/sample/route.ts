import { NextResponse } from 'next/server'

const sampleEvents = {
    'İstanbul': [
        {
            id: '1',
            title: 'Rock Festivali',
            description: 'Türkiye\'nin en büyük rock festivali',
            venue: 'KüçükÇiftlik Park',
            city: 'İstanbul',
            address: 'KüçükÇiftlik Park, Beyoğlu',
            startDate: '2024-07-15T19:00:00',
            endDate: '2024-07-15T23:00:00',
            imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
            ticketUrl: 'https://example.com/tickets',
            price: 450,
            category: 'CONCERT'
        },
        {
            id: '2',
            title: 'Tiyatro Gösterisi',
            description: 'Klasik tiyatro eseri',
            venue: 'İstanbul Devlet Tiyatrosu',
            city: 'İstanbul',
            address: 'Devlet Tiyatrosu, Kadıköy',
            startDate: '2024-06-20T20:00:00',
            endDate: '2024-06-20T22:30:00',
            imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf',
            ticketUrl: 'https://example.com/tickets',
            price: 200,
            category: 'THEATRE'
        }
    ],
    'Ankara': [
        {
            id: '3',
            title: 'Caz Konseri',
            description: 'Uluslararası caz sanatçıları',
            venue: 'Ankara Kültür Merkezi',
            city: 'Ankara',
            address: 'Kültür Merkezi, Çankaya',
            startDate: '2024-06-25T20:00:00',
            endDate: '2024-06-25T22:00:00',
            imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae',
            ticketUrl: 'https://example.com/tickets',
            price: 250,
            category: 'CONCERT'
        }
    ],
    'İzmir': [
        {
            id: '4',
            title: 'Sanat Sergisi',
            description: 'Modern sanat sergisi',
            venue: 'İzmir Sanat Merkezi',
            city: 'İzmir',
            address: 'Sanat Merkezi, Konak',
            startDate: '2024-06-01T10:00:00',
            endDate: '2024-06-30T18:00:00',
            imageUrl: 'https://images.unsplash.com/photo-1577720580479-7d839d829c73',
            category: 'EXHIBITION'
        }
    ],
    'Antalya': [
        {
            id: '5',
            title: 'Yaz Festivali',
            description: 'Antalya\'nın en büyük yaz festivali',
            venue: 'Konyaaltı Sahili',
            city: 'Antalya',
            address: 'Konyaaltı Sahili, Antalya',
            startDate: '2024-07-01T18:00:00',
            endDate: '2024-07-07T23:00:00',
            imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
            ticketUrl: 'https://example.com/tickets',
            price: 300,
            category: 'FESTIVAL'
        }
    ],
    'Eskişehir': [
        {
            id: '6',
            title: 'Stand-up Gösterisi',
            description: 'Türkiye\'nin en komik komedyenleri',
            venue: 'Eskişehir Kültür Merkezi',
            city: 'Eskişehir',
            address: 'Kültür Merkezi, Tepebaşı',
            startDate: '2024-06-15T20:00:00',
            endDate: '2024-06-15T22:00:00',
            imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4',
            ticketUrl: 'https://example.com/tickets',
            price: 150,
            category: 'COMEDY'
        }
    ],
    'Adana': [
        {
            id: '7',
            title: 'Film Festivali',
            description: 'Uluslararası film festivali',
            venue: 'Adana Kültür Merkezi',
            city: 'Adana',
            address: 'Kültür Merkezi, Seyhan',
            startDate: '2024-08-01T10:00:00',
            endDate: '2024-08-07T22:00:00',
            imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba',
            ticketUrl: 'https://example.com/tickets',
            price: 400,
            category: 'FESTIVAL'
        }
    ],
    'Mersin': [
        {
            id: '8',
            title: 'Müzik Festivali',
            description: 'Akdeniz\'in en büyük müzik festivali',
            venue: 'Mersin Marina',
            city: 'Mersin',
            address: 'Marina, Yenişehir',
            startDate: '2024-07-20T18:00:00',
            endDate: '2024-07-22T23:00:00',
            imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
            ticketUrl: 'https://example.com/tickets',
            price: 350,
            category: 'FESTIVAL'
        }
    ]
}

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

        const events = sampleEvents[city as keyof typeof sampleEvents] || []
        return NextResponse.json(events)
    } catch (error) {
        console.error('Sample Events API Error:', error)
        return NextResponse.json(
            { error: 'Etkinlikler yüklenirken bir hata oluştu' },
            { status: 500 }
        )
    }
} 