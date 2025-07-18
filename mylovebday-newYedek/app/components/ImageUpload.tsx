'use client'

import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { ImagePlus, Trash } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
    disabled?: boolean
    onChange: (value: string) => void
    onRemove: (value: string) => void
    value: string[]
}

export default function ImageUpload({
    disabled,
    onChange,
    onRemove,
    value
}: ImageUploadProps) {
    const [isMounted, setIsMounted] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Dosya tipi kontrolü
        if (!file.type.startsWith('image/')) {
            setError('Lütfen geçerli bir resim dosyası seçin')
            return
        }

        setIsUploading(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                throw new Error('Dosya yüklenemedi')
            }

            const data = await response.json()
            onChange(data.url)
        } catch (error) {
            console.error('Upload error:', error)
            setError('Dosya yüklenirken bir hata oluştu')
        } finally {
            setIsUploading(false)
        }
    }

    const handleClick = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = (e) => handleFileChange(e as any)
        input.click()
    }

    if (!isMounted) {
        return null
    }

    return (
        <div className="mb-4 flex items-center gap-4">
            <div className="flex items-center gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            <Button
                                type="button"
                                onClick={() => onRemove(url)}
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 rounded-full bg-red-500 hover:bg-red-600"
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Image"
                            src={url}
                        />
                    </div>
                ))}
            </div>
            <Button
                type="button"
                disabled={disabled || isUploading}
                variant="secondary"
                onClick={handleClick}
                className="h-[200px] w-[200px] border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
            >
                <div className="flex flex-col items-center justify-center gap-2">
                    <ImagePlus className="h-10 w-10 text-gray-400" />
                    <span className="text-sm text-gray-500">
                        {isUploading ? 'Yükleniyor...' : 'Fotoğraf Yükle'}
                    </span>
                </div>
            </Button>
            {error && (
                <div className="text-sm text-red-500 mt-2">
                    {error}
                </div>
            )}
        </div>
    )
} 