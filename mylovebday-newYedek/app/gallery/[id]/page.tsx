import { Suspense } from 'react'
import AlbumClient from './AlbumClient'

export default async function AlbumPage({ params }: { params: { id: string } }) {
    const albumId = await Promise.resolve(params.id)

    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">Yükleniyor...</div>
                </div>
            </div>
        }>
            <AlbumClient albumId={albumId} />
        </Suspense>
    )
} 