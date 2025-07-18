'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import ImageUpload from './ImageUpload'
import { useRouter } from 'next/navigation'
import { albumService } from '@/services/api'
import { PlusCircle, X } from 'lucide-react'

interface CreateAlbumModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function CreateAlbumModal({ isOpen, onClose, onSuccess }: CreateAlbumModalProps) {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [coverImage, setCoverImage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            if (!title.trim()) {
                throw new Error('Albüm adı boş olamaz')
            }

            const album = await albumService.createAlbum({
                title: title.trim(),
                description: description.trim(),
                coverImage: coverImage || undefined
            })

            router.refresh()
            onClose()
            setTitle('')
            setDescription('')
            setCoverImage('')
            onSuccess()
        } catch (error) {
            console.error('Album creation error:', error)
            setError(error instanceof Error ? error.message : 'Albüm oluşturulurken bir hata oluştu')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="sm:max-w-[500px] bg-white rounded-2xl shadow-xl"
                aria-describedby="album-modal-description"
            >
                <DialogHeader className="space-y-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl font-bold text-gray-900">Yeni Albüm Oluştur</DialogTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="rounded-full hover:bg-gray-100"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    <p id="album-modal-description" className="text-sm text-gray-500">
                        Özel anılarınızı saklayabileceğiniz yeni bir albüm oluşturun
                    </p>
                </DialogHeader>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                            Albüm Adı
                        </Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Örn: Doğum Günü Albümü"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                            Açıklama
                        </Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Albümünüz hakkında kısa bir açıklama yazın"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[100px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            Kapak Fotoğrafı
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <ImageUpload
                                value={coverImage ? [coverImage] : []}
                                onChange={(url) => setCoverImage(url)}
                                onRemove={() => setCoverImage('')}
                                disabled={isLoading}
                            />
                        </div>
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
                            disabled={isLoading}
                            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Oluşturuluyor...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <PlusCircle className="w-5 h-5 mr-2" />
                                    Albüm Oluştur
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
} 