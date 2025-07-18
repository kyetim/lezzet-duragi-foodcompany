'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { Photo } from '../lib/types'

interface PhotoViewerProps {
    photos: Photo[]
    initialPhotoId: string
    onClose: () => void
    onDelete: (photoId: string) => void
}

export default function PhotoViewer({ photos, initialPhotoId, onClose, onDelete }: PhotoViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(() => {
        return photos.findIndex(photo => photo.id === initialPhotoId)
    })

    const currentPhoto = photos[currentIndex]

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                handlePrevious()
            } else if (e.key === 'ArrowRight') {
                handleNext()
            } else if (e.key === 'Escape') {
                onClose()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [currentIndex])

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
        }
    }

    const handleNext = () => {
        if (currentIndex < photos.length - 1) {
            setCurrentIndex(currentIndex + 1)
        }
    }

    const handleDelete = async () => {
        if (confirm('Bu fotoğrafı silmek istediğinizden emin misiniz?')) {
            try {
                await onDelete(currentPhoto.id)
                if (photos.length === 1) {
                    onClose()
                } else if (currentIndex === photos.length - 1) {
                    setCurrentIndex(currentIndex - 1)
                }
            } catch (error) {
                console.error('Fotoğraf silinirken hata oluştu:', error)
                alert('Fotoğraf silinirken bir hata oluştu')
            }
        }
    }

    if (!currentPhoto) {
        return null
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
                {/* Kapatma butonu */}
                <Button
                    variant="ghost"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:text-white hover:bg-white/10 z-50"
                >
                    <X className="h-6 w-6" />
                </Button>

                {/* Silme butonu */}
                <Button
                    variant="ghost"
                    onClick={handleDelete}
                    className="absolute top-4 right-16 text-white hover:text-white hover:bg-white/10 z-50"
                >
                    <Trash2 className="h-6 w-6" />
                </Button>

                {/* Önceki fotoğraf butonu */}
                {currentIndex > 0 && (
                    <Button
                        variant="ghost"
                        onClick={handlePrevious}
                        className="absolute left-4 text-white hover:text-white hover:bg-white/10 z-50"
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </Button>
                )}

                {/* Fotoğraf */}
                <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                        src={currentPhoto.url}
                        alt={currentPhoto.title || 'Fotoğraf'}
                        fill
                        className="object-contain"
                        sizes="100vw"
                        priority
                    />
                </div>

                {/* Sonraki fotoğraf butonu */}
                {currentIndex < photos.length - 1 && (
                    <Button
                        variant="ghost"
                        onClick={handleNext}
                        className="absolute right-4 text-white hover:text-white hover:bg-white/10 z-50"
                    >
                        <ChevronRight className="h-8 w-8" />
                    </Button>
                )}

                {/* Fotoğraf sayısı */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white z-50">
                    {currentIndex + 1} / {photos.length}
                </div>
            </div>
        </div>
    )
} 