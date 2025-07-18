'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { albumService } from '../../services/api'
import { Album, Photo } from '../../lib/types'
import { Button } from '../../components/ui/button'
import { ArrowLeft, Plus, Trash2, AlertTriangle, Edit2, Save, X, Home } from 'lucide-react'
import PhotoViewer from '../../components/PhotoViewer'

interface AlbumClientProps {
    albumId: string
}

export default function AlbumClient({ albumId }: AlbumClientProps) {
    const router = useRouter()
    const [album, setAlbum] = useState<Album | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editedTitle, setEditedTitle] = useState('')
    const [editedDescription, setEditedDescription] = useState('')

    useEffect(() => {
        loadAlbum()
    }, [albumId])

    useEffect(() => {
        if (album) {
            setEditedTitle(album.title)
            setEditedDescription(album.description || '')
        }
    }, [album])

    const loadAlbum = async () => {
        try {
            const data = await albumService.getAlbum(albumId)
            setAlbum(data)
        } catch (err) {
            setError('Albüm yüklenirken bir hata oluştu')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Bu albümü silmek istediğinizden emin misiniz?')) return

        try {
            await albumService.deleteAlbum(albumId)
            router.push('/gallery')
        } catch (err) {
            setError('Albüm silinirken bir hata oluştu')
            console.error(err)
        }
    }

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploading(true)
        try {
            const formData = new FormData()
            for (let i = 0; i < files.length; i++) {
                formData.append('photos', files[i])
            }

            await albumService.uploadPhotos(albumId, formData)
            await loadAlbum()
        } catch (err) {
            setError('Fotoğraflar yüklenirken bir hata oluştu')
            console.error(err)
        } finally {
            setUploading(false)
        }
    }

    const handlePhotoDelete = async (photoId: string) => {
        try {
            await albumService.deletePhoto(albumId, photoId)
            await loadAlbum()
        } catch (err) {
            setError('Fotoğraf silinirken bir hata oluştu')
            console.error(err)
        }
    }

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleCancel = () => {
        setIsEditing(false)
        if (album) {
            setEditedTitle(album.title)
            setEditedDescription(album.description || '')
        }
    }

    const handleSave = async () => {
        try {
            await albumService.updateAlbum(albumId, {
                title: editedTitle,
                description: editedDescription,
            })
            await loadAlbum()
            setIsEditing(false)
        } catch (err) {
            setError('Albüm güncellenirken bir hata oluştu')
            console.error(err)
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

    if (!album) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center text-red-600">Albüm bulunamadı</div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Geri
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => router.push('/')}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                        >
                            <Home className="h-4 w-4" />
                            Ana Sayfa
                        </Button>
                    </div>
                    <div className="flex items-center gap-4">
                        {!isEditing ? (
                            <Button
                                variant="outline"
                                onClick={handleEdit}
                                className="flex items-center gap-2"
                            >
                                <Edit2 className="h-4 w-4" />
                                Düzenle
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="flex items-center gap-2"
                                >
                                    <X className="h-4 w-4" />
                                    İptal
                                </Button>
                                <Button
                                    variant="default"
                                    onClick={handleSave}
                                    className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
                                >
                                    <Save className="h-4 w-4" />
                                    Kaydet
                                </Button>
                            </div>
                        )}
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="flex items-center gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            Albümü Sil
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    {isEditing ? (
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                className="w-full text-3xl font-bold text-gray-900 bg-transparent border-b border-gray-300 focus:border-pink-500 focus:outline-none"
                                placeholder="Albüm başlığı"
                            />
                            <textarea
                                value={editedDescription}
                                onChange={(e) => setEditedDescription(e.target.value)}
                                className="w-full text-gray-600 bg-transparent border-b border-gray-300 focus:border-pink-500 focus:outline-none resize-none"
                                placeholder="Albüm açıklaması"
                                rows={3}
                            />
                        </div>
                    ) : (
                        <>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{album.title}</h1>
                            {album.description && (
                                <p className="text-gray-600 mb-4">{album.description}</p>
                            )}
                        </>
                    )}
                    <p className="text-sm text-gray-500">
                        {album.images.length} fotoğraf • {new Date(album.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 mb-6">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                <div className="mb-8">
                    <label className="block">
                        <span className="sr-only">Fotoğraf seç</span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePhotoUpload}
                            className="hidden"
                            id="photo-upload"
                        />
                        <Button
                            asChild
                            disabled={uploading}
                            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
                        >
                            <label htmlFor="photo-upload" className="cursor-pointer flex items-center justify-center gap-2">
                                <Plus className="h-5 w-5" />
                                {uploading ? 'Yükleniyor...' : 'Fotoğraf Ekle'}
                            </label>
                        </Button>
                    </label>
                </div>

                {album.images.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                        Bu albümde henüz fotoğraf yok
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {album.images.map((photo) => (
                            <div
                                key={photo.id}
                                className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                                onClick={() => setSelectedPhoto(photo)}
                            >
                                <Image
                                    src={photo.url}
                                    alt={photo.title || 'Fotoğraf'}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity" />
                            </div>
                        ))}
                    </div>
                )}

                {selectedPhoto && (
                    <PhotoViewer
                        photos={album.images}
                        initialPhotoId={selectedPhoto.id}
                        onClose={() => setSelectedPhoto(null)}
                        onDelete={handlePhotoDelete}
                    />
                )}
            </div>
        </div>
    )
} 