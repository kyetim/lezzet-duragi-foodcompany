import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    if (!q) {
        return NextResponse.json({ error: 'Sorgu parametresi eksik' }, { status: 400 });
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`;
    const res = await fetch(url, {
        headers: {
            'User-Agent': 'mylovebday-app', // Nominatim için zorunlu!
            'Accept-Language': 'tr'
        }
    });
    const data = await res.json();
    return NextResponse.json(data);
} 