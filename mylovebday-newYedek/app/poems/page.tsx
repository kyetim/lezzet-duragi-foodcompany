'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Poem {
    id: string
    title: string
    content: string
    createdAt: string
    updatedAt: string
}

function getExcerpt(content: string) {
    return content.split('\n')[0] + (content.split('\n').length > 1 ? '...' : '')
}

export default function Poems() {
    const [poems, setPoems] = useState<Poem[]>([])
    const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [newPoem, setNewPoem] = useState({
        title: '',
        content: ''
    })

    const loadPoems = async () => {
        const res = await fetch('/api/poems')
        const data = await res.json()
        setPoems(data)
    }

    useEffect(() => {
        loadPoems()
    }, [])

    const handleAddPoem = async (e: React.FormEvent) => {
        e.preventDefault()
        await fetch('/api/poems', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: newPoem.title,
                content: newPoem.content
            })
        })
        setNewPoem({ title: '', content: '' })
        setShowAddForm(false)
        loadPoems()
    }

    const handleDeletePoem = async (id: string) => {
        await fetch(`/api/poems/${id}`, { method: 'DELETE' })
        loadPoems()
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-pink-50">
            <div className="container mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text mb-4">
                        Senin İçin Yazdığım Şiirler
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                        Kalbimin en derin duygularıyla yazdığım her satır
                    </p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300"
                    >
                        Yeni Şiir Ekle
                    </button>
                </motion.div>

                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={() => setShowAddForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-3xl font-bold text-pink-600 mb-6">Yeni Şiir Ekle</h2>
                            <form onSubmit={handleAddPoem}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Başlık
                                    </label>
                                    <input
                                        type="text"
                                        value={newPoem.title}
                                        onChange={(e) => setNewPoem({ ...newPoem, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                                        required
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Şiir
                                    </label>
                                    <textarea
                                        value={newPoem.content}
                                        onChange={(e) => setNewPoem({ ...newPoem, content: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 h-48"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
                                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                                    >
                                        Kaydet
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {poems.map((poem) => (
                        <motion.div
                            key={poem.id}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="transform transition-all duration-300"
                        >
                            <div
                                onClick={() => setSelectedPoem(poem)}
                                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-pink-100 cursor-pointer h-[280px] flex flex-col relative"
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeletePoem(poem.id)
                                    }}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-semibold text-pink-600 mb-2 line-clamp-1">{poem.title}</h2>
                                <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{getExcerpt(poem.content)}</p>
                                <p className="text-sm text-gray-500 mt-auto">{poem.createdAt ? new Date(poem.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {selectedPoem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={() => setSelectedPoem(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-3xl font-bold text-pink-600 mb-4">{selectedPoem.title}</h2>
                            <div className="prose prose-lg max-w-none">
                                {selectedPoem.content.split('\n').map((line, index) => (
                                    <p key={index} className="text-gray-700 mb-4">{line}</p>
                                ))}
                            </div>
                            <button
                                onClick={() => setSelectedPoem(null)}
                                className="mt-6 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                            >
                                Kapat
                            </button>
                        </motion.div>
                    </motion.div>
                )}

                <div className="mt-12 text-center">
                    <Link href="/" className="inline-block px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300">
                        Ana Sayfaya Dön
                    </Link>
                </div>
            </div>
        </div>
    )
} 