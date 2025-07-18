import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
        return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);
    // Public URL
    const publicUrl = `/uploads/${fileName}`;
    return NextResponse.json({ url: publicUrl });
} 