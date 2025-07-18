'use client'

import { useState, useEffect, Fragment } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../components/ui/button'
import { Home, Plus, Heart } from 'lucide-react'
import Link from 'next/link'

interface DiaryEntry {
    id: string
    title: string
    content: string
    createdAt: string
}

export default function DiaryClient() {
    const router = useRouter()
    const [entries, setEntries] = useState<DiaryEntry[]>([])
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [currentEntryId, setCurrentEntryId] = useState<string | null>(null)
    const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null)

    useEffect(() => {
        loadEntries()
    }, [])

    const loadEntries = async () => {
        try {
            const response = await fetch('/api/diary')
            if (!response.ok) throw new Error('Günlük yüklenemedi')
            const data = await response.json()
            setEntries(data)
        } catch (error) {
            console.error('Günlük yükleme hatası:', error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/diary', {
                method: isEditing ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: currentEntryId,
                    title,
                    content,
                }),
            })

            if (!response.ok) throw new Error('Günlük kaydedilemedi')
            await loadEntries()
            resetForm()
        } catch (error) {
            console.error('Günlük kaydetme hatası:', error)
        }
    }

    const handleEdit = (entry: DiaryEntry) => {
        setTitle(entry.title)
        setContent(entry.content)
        setCurrentEntryId(entry.id)
        setIsEditing(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Bu günlük yazısını silmek istediğinizden emin misiniz?')) return

        try {
            const response = await fetch(`/api/diary/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) throw new Error('Günlük silinemedi')
            await loadEntries()
        } catch (error) {
            console.error('Günlük silme hatası:', error)
        }
    }

    const resetForm = () => {
        setTitle('')
        setContent('')
        setIsEditing(false)
        setCurrentEntryId(null)
    }

    const getPreview = (content: string) => {
        const lines = content.split('\n')
        return lines.slice(0, 2).join('\n') + (lines.length > 2 ? '...' : '')
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <Link href="/">
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                        <Home className="h-4 w-4" />
                        Ana Sayfa
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Heart className="h-8 w-8 text-pink-500" />
                    Günlüğüm
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Başlık..."
                    className="w-full text-xl font-semibold text-gray-900 bg-transparent border-b border-gray-300 focus:border-pink-500 focus:outline-none"
                    required
                />
                <div className="relative">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Bugün neler yaşadın?"
                        className="w-full h-64 p-4 text-gray-700 bg-transparent border border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none resize-none"
                        required
                    />
                    <div className="absolute inset-0 pointer-events-none opacity-5">
                        <div className="grid grid-cols-4 gap-4 h-full">
                            {[...Array(16)].map((_, i) => (
                                <Heart key={i} className="w-8 h-8 text-purple-500" />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-4">
                    {isEditing && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={resetForm}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            İptal
                        </Button>
                    )}
                    <Button
                        type="submit"
                        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
                    >
                        {isEditing ? 'Güncelle' : 'Kaydet'}
                    </Button>
                </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {entries.map((entry) => (
                    <div
                        key={entry.id}
                        className="bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 rounded-2xl shadow-lg border border-pink-100 hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
                        onClick={() => setSelectedEntry(entry)}
                    >
                        <div className="p-6 flex flex-col h-full">
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-xl font-bold text-pink-700 break-words max-w-[70%]">{entry.title}</h3>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={e => { e.stopPropagation(); handleEdit(entry) }}
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        Düzenle
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={e => { e.stopPropagation(); handleDelete(entry.id) }}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        Sil
                                    </Button>
                                </div>
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap mb-4 flex-1">{getPreview(entry.content)}</p>
                            <p className="text-xs text-gray-400 mt-auto">
                                {entry.createdAt ? new Date(entry.createdAt).toLocaleString('tr-TR') : ''}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {selectedEntry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                            onClick={() => setSelectedEntry(null)}
                            aria-label="Kapat"
                        >
                            ×
                        </button>
                        <h2 className="text-2xl font-bold text-pink-700 mb-2">{selectedEntry.title}</h2>
                        <p className="text-xs text-gray-400 mb-4">{selectedEntry.createdAt ? new Date(selectedEntry.createdAt).toLocaleString('tr-TR') : ''}</p>
                        <div className="whitespace-pre-wrap text-gray-800 text-lg">{selectedEntry.content}</div>
                    </div>
                </div>
            )}
        </div>
    )
} 