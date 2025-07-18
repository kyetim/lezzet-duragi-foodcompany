'use client'

import DiaryClient from './DiaryClient'

export default function DiaryPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
            <div className="max-w-7xl mx-auto p-8">
                <DiaryClient />
            </div>
        </div>
    )
} 