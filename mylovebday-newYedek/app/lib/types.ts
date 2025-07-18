export interface Album {
    id: string
    title: string
    description?: string
    coverImage?: string
    category: string
    createdAt: string
    updatedAt: string
    images: Image[]
}

export interface Photo {
    id: string
    url: string
    title?: string
    description?: string
    albumId: string
    createdAt: string
    updatedAt: string
}

export interface Image {
    id: string
    url: string
    title?: string
    albumId: string
    createdAt: string
    updatedAt: string
}

export interface TravelPlan {
    id: string
    title: string
    description?: string
    startDate: Date
    endDate: Date
    location: string
    status: 'PLANNED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED' | 'DONE'
    budget?: number
    notes?: string
    latitude?: number
    longitude?: number
    createdAt: Date
    updatedAt: Date
} 