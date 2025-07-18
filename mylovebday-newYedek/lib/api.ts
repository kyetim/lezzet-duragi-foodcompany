import { Album, Photo } from './types'

// Albüm API fonksiyonları
export const getAlbum = async (id: string): Promise<Album> => {
    try {
        const response = await fetch(`/api/albums/${id}`)
        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Albüm yüklenirken bir hata oluştu')
        }
        return response.json()
    } catch (error) {
        console.error('getAlbum error:', error)
        throw error
    }
}

export const deleteAlbum = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`/api/albums/${id}`, {
            method: 'DELETE',
        })
        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Albüm silinirken bir hata oluştu')
        }
    } catch (error) {
        console.error('deleteAlbum error:', error)
        throw error
    }
}

// Fotoğraf API fonksiyonları
export const addPhoto = async (albumId: string, photo: { url: string; description?: string }): Promise<Photo> => {
    try {
        const response = await fetch(`/api/albums/${albumId}/photos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(photo),
        })
        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Fotoğraf eklenirken bir hata oluştu')
        }
        return response.json()
    } catch (error) {
        console.error('addPhoto error:', error)
        throw error
    }
}

export const deletePhoto = async (albumId: string, photoId: string): Promise<void> => {
    try {
        const response = await fetch(`/api/albums/${albumId}/photos/${photoId}`, {
            method: 'DELETE',
        })
        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Fotoğraf silinirken bir hata oluştu')
        }
    } catch (error) {
        console.error('deletePhoto error:', error)
        throw error
    }
} 