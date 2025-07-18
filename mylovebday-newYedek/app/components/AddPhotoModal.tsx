'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog'
import { Button } from './ui/button'
import ImageUpload from './ImageUpload'
import { X } from 'lucide-react'

interface AddPhotoModalProps {
    isOpen: boolean
    onClose: () => void
    albumId: string
}

export default function AddPhotoModal({ isOpen, onClose, albumId }: AddPhotoModalProps) {
    const [photoUrl, setPhotoUrl] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    // Artık isUploading ve handleFileChange gerekmiyor

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            if (!photoUrl) {
                throw new Error('Lütfen bir fotoğraf seçin')
            }

            // Sadece url gönderiyoruz, yükleme ImageUpload ile yapıldı
            await fetch(`/api/albums/${albumId}/photos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ photoUrl }),
            })

            onClose()
            setPhotoUrl('')
        } catch (error) {
            console.error('Photo upload error:', error)
            setError(error instanceof Error ? error.message : 'Fotoğraf yüklenirken bir hata oluştu')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl shadow-xl">
                <DialogHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl font-bold text-gray-900">Fotoğraf Ekle</DialogTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="rounded-full hover:bg-gray-100"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </DialogHeader>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <ImageUpload
                            value={photoUrl ? [photoUrl] : []}
                            onChange={(url) => setPhotoUrl(url)}
                            onRemove={() => setPhotoUrl('')}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            İptal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Yükleniyor...
                                </div>
                            ) : (
                                'Fotoğraf Ekle'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
} 