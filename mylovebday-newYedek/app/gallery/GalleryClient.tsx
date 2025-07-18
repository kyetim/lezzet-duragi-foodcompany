'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { albumService } from '../services/api'
import { Album } from '../lib/types'
import { Button } from '../components/ui/button'
import { Plus, Home } from 'lucide-react'
import CreateAlbumModal from '../components/CreateAlbumModal'

export default function GalleryClient() {
    const router = useRouter()
    const [albums, setAlbums] = useState<Album[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    useEffect(() => {
        loadAlbums()
    }, [])

    const loadAlbums = async () => {
        try {
            const data = await albumService.getAllAlbums()
            setAlbums(data)
        } catch (err) {
            setError('Albümler yüklenirken bir hata oluştu')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">Yükleniyor...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <Home className="h-4 w-4" />
                        Ana Sayfa
                    </Button>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Yeni Albüm
                    </Button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {albums.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">Henüz albüm oluşturulmamış</p>
                        <Button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            İlk Albümü Oluştur
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {albums.map((album) => (
                            <div
                                key={album.id}
                                onClick={() => router.push(`/gallery/${album.id}`)}
                                className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                            >
                                <div className="aspect-square relative">
                                    <Image
                                        src={album.coverImage || '/placeholder.jpg'}
                                        alt={album.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-1">{album.title}</h3>
                                    {album.description && (
                                        <p className="text-sm text-gray-500 line-clamp-2">{album.description}</p>
                                    )}
                                    <p className="text-xs text-gray-400 mt-2">
                                        {album.images.length} fotoğraf • {new Date(album.createdAt).toLocaleDateString('tr-TR')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <CreateAlbumModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={() => {
                        setIsCreateModalOpen(false)
                        loadAlbums()
                    }}
                />
            </div>
        </div>
    )
} 