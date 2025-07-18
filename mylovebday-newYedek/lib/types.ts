export interface Photo {
    id: string
    url: string
    albumId: string
    createdAt: string
    updatedAt: string
}

export interface Album {
    id: string
    title: string
    description: string
    coverImage: string | null
    photoCount: number
    photos: Photo[]
    createdAt: string
    updatedAt: string
} 