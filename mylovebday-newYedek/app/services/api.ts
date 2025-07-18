import { Album, TravelPlan, Image } from '../lib/types'

class AlbumService {
    private baseUrl = '/api'

    async getAllAlbums(): Promise<Album[]> {
        const response = await fetch(`${this.baseUrl}/albums`)
        if (!response.ok) {
            throw new Error('Albümler getirilemedi')
        }
        return response.json()
    }

    async getAlbum(id: string): Promise<Album & { images: Image[] }> {
        const response = await fetch(`${this.baseUrl}/albums/${id}`)
        if (!response.ok) {
            throw new Error('Albüm bulunamadı')
        }
        return response.json()
    }

    async createAlbum(data: { title: string; description?: string; category: string }) {
        const response = await fetch('/api/albums', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            throw new Error('Albüm oluşturulamadı')
        }

        return response.json()
    }

    async deleteAlbum(id: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/albums/${id}`, {
            method: 'DELETE',
        })
        if (!response.ok) {
            throw new Error('Albüm silinemedi')
        }
    }

    async addPhotoToAlbum(albumId: string, photoUrl: string): Promise<Album> {
        const response = await fetch(`${this.baseUrl}/albums/${albumId}/photos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ photoUrl }),
        })

        if (!response.ok) {
            throw new Error('Fotoğraf albüme eklenemedi')
        }

        return response.json()
    }

    async removePhotoFromAlbum(albumId: string, photoId: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/albums/${albumId}/photos/${photoId}`, {
            method: 'DELETE',
        })

        if (!response.ok) {
            throw new Error('Fotoğraf albümden silinemedi')
        }
    }

    async addImageToAlbum(albumId: string, imageUrl: string): Promise<Image> {
        const response = await fetch(`${this.baseUrl}/albums/${albumId}/images`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageUrl }),
        })
        if (!response.ok) {
            throw new Error('Resim eklenemedi')
        }
        return response.json()
    }

    async deleteImage(albumId: string, imageId: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/albums/${albumId}/images/${imageId}`, {
            method: 'DELETE',
        })
        if (!response.ok) {
            throw new Error('Resim silinemedi')
        }
    }

    async uploadPhotos(albumId: string, formData: FormData) {
        const response = await fetch(`/api/albums/${albumId}/photos`, {
            method: 'POST',
            body: formData,
        })

        if (!response.ok) {
            throw new Error('Fotoğraflar yüklenemedi')
        }

        return response.json()
    }

    async deletePhoto(albumId: string, photoId: string) {
        const response = await fetch(`/api/albums/${albumId}/photos/${photoId}`, {
            method: 'DELETE',
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Fotoğraf silinemedi')
        }

        return response.json()
    }

    async updateAlbum(id: string, data: { title?: string; description?: string }) {
        const response = await fetch(`${this.baseUrl}/albums/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Albüm güncellenemedi')
        }

        return response.json()
    }
}

export const albumService = new AlbumService()

// Fotoğraf işlemleri
export const photoService = {
    // Albüme fotoğraf ekle
    async addPhoto(data: { url: string; description?: string; albumId: string }) {
        const response = await fetch('/api/photos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        if (!response.ok) throw new Error('Fotoğraf eklenemedi')
        return response.json()
    },

    // Albümdeki fotoğrafları getir
    async getAlbumPhotos(albumId: string) {
        const response = await fetch(`/api/photos?albumId=${albumId}`)
        if (!response.ok) throw new Error('Fotoğraflar getirilemedi')
        return response.json()
    },
}

export const TravelService = {
    async getAllPlans(): Promise<TravelPlan[]> {
        const response = await fetch('/api/travel');
        if (!response.ok) {
            throw new Error('Tatil planları getirilemedi');
        }
        return response.json();
    },

    async createPlan(data: Omit<TravelPlan, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<TravelPlan> {
        const response = await fetch('/api/travel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Tatil planı oluşturulamadı');
        }
        return response.json();
    },

    async updatePlanStatus(id: string, status: TravelPlan['status']): Promise<TravelPlan> {
        const response = await fetch('/api/travel', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, status }),
        });
        if (!response.ok) {
            throw new Error('Tatil planı güncellenemedi');
        }
        return response.json();
    },

    async deletePlan(id: string) {
        const response = await fetch(`/api/travel?id=${id}`, { method: 'DELETE' })
        if (!response.ok) {
            throw new Error('Tatil planı silinemedi')
        }
        return response.json()
    }
};

export const eventService = {
    async getAllEvents(city?: string) {
        try {
            console.log('Fetching events with city:', city)
            const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
            const response = await fetch(`${baseUrl}/api/events${city ? `?city=${encodeURIComponent(city)}` : ''}`)
            const data = await response.json()

            if (!response.ok) {
                console.error('Error response:', data)
                throw new Error(data.message || 'Etkinlikler yüklenirken bir hata oluştu')
            }

            console.log('Events data received:', data)
            return data
        } catch (error) {
            console.error('Error in getAllEvents:', error)
            throw error
        }
    },

    getEventById: async (id: string) => {
        try {
            console.log('Fetching event with ID:', id)
            const baseUrl = typeof window === 'undefined' ? 'http://localhost:3000' : window.location.origin
            const response = await fetch(`${baseUrl}/api/events/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await response.json()

            if (!response.ok) {
                console.error('Error response:', data)
                throw new Error(data.message || 'Etkinlik detayları yüklenirken bir hata oluştu')
            }

            console.log('Event data received:', data)
            return data
        } catch (error) {
            console.error('Error in getEventById:', error)
            throw error
        }
    },

    async getUserEvents() {
        const response = await fetch('/api/events/user')
        if (!response.ok) {
            throw new Error('Kullanıcı etkinlikleri yüklenirken bir hata oluştu')
        }
        return response.json()
    },

    async addUserEvent(eventId: string) {
        const response = await fetch('/api/events/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ eventId }),
        })
        if (!response.ok) {
            throw new Error('Etkinlik eklenirken bir hata oluştu')
        }
        return response.json()
    },

    async updateUserEventStatus(userEventId: string, status: string) {
        const response = await fetch(`/api/events/user/${userEventId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        })
        if (!response.ok) {
            throw new Error('Etkinlik durumu güncellenirken bir hata oluştu')
        }
        return response.json()
    },

    async removeUserEvent(userEventId: string) {
        const response = await fetch(`/api/events/user/${userEventId}`, {
            method: 'DELETE',
        })
        if (!response.ok) {
            throw new Error('Etkinlik kaldırılırken bir hata oluştu')
        }
        return response.json()
    },

    createEvent: async (eventData: any) => {
        try {
            console.log('Sending event data:', eventData)

            // Validate price format
            if (eventData.price) {
                eventData.price = eventData.price.toString().replace(',', '.')
            }

            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData),
            })

            const data = await response.json()
            console.log('Response from server:', data)

            if (!response.ok) {
                const errorMessage = data.message || data.error || 'Etkinlik oluşturulurken bir hata oluştu'
                console.error('Server error:', errorMessage)
                throw new Error(errorMessage)
            }

            return data
        } catch (error) {
            console.error('Error in createEvent:', error)
            throw error
        }
    },

    async deleteEvent(eventId: string) {
        try {
            console.log('Deleting event with ID:', eventId)
            const baseUrl = typeof window === 'undefined' ? 'http://localhost:3000' : window.location.origin
            const response = await fetch(`${baseUrl}/api/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            const data = await response.json()

            if (!response.ok) {
                console.error('Error response:', data)
                throw new Error(data.message || 'Etkinlik silinirken bir hata oluştu')
            }

            console.log('Event deleted successfully:', data)
            return data
        } catch (error) {
            console.error('Error in deleteEvent:', error)
            throw error
        }
    }
} 