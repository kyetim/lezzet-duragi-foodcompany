'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

// Sağlık tavsiyeleri için örnek veri
const healthTips = [
    {
        id: 1,
        title: "Günlük Su Tüketimi",
        content: "Günde en az 2-2.5 litre su içmeyi unutmayın. Su, kaslarınızın daha iyi çalışmasını sağlar ve toksinlerin atılmasına yardımcı olur.",
        image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        title: "Protein Ağırlıklı Beslenme",
        content: "Antrenman sonrası protein alımı kas gelişimi için önemli. Her öğünde protein içeren besinler tüketmeye özen gösterin.",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        title: "Yeterli Uyku",
        content: "Günde 7-8 saat uyku kas gelişimi için kritik öneme sahip. Uyku sırasında kaslarınız kendini onarır ve güçlenir.",
        image: "https://images.unsplash.com/photo-1541480609188-74c2b77b8e12?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        title: "Isınma ve Soğuma",
        content: "Her antrenman öncesi 10-15 dakika ısınma, sonrası 5-10 dakika soğuma yapın. Bu, sakatlanma riskini azaltır.",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        title: "Doğru Nefes Tekniği",
        content: "Egzersiz sırasında doğru nefes almak performansınızı artırır. Yüksek ağırlık kaldırırken nefesinizi tutmayın.",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 6,
        title: "Esneklik Çalışmaları",
        content: "Haftada en az 2-3 kez esneklik çalışması yapın. Bu, hareket kabiliyetinizi artırır ve sakatlanmaları önler.",
        image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 7,
        title: "Besin Takibi",
        content: "Günlük kalori ve makro besin alımınızı takip edin. Bu, hedeflerinize ulaşmanızda size yardımcı olur.",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 8,
        title: "Dinlenme Günleri",
        content: "Kaslarınızın gelişmesi için dinlenme günlerine ihtiyacı var. Haftada en az 1-2 gün tam dinlenme yapın.",
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 9,
        title: "Vitamin ve Mineraller",
        content: "Düzenli olarak vitamin ve mineral takviyeleri alın. Özellikle D vitamini, magnezyum ve çinko önemli.",
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 10,
        title: "Hedef Belirleme",
        content: "Gerçekçi ve ölçülebilir hedefler belirleyin. Kısa ve uzun vadeli hedefleriniz olsun.",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 11,
        title: "Stres Yönetimi",
        content: "Yüksek stres seviyeleri kas gelişimini olumsuz etkiler. Meditasyon ve yoga gibi aktivitelerle stresi yönetin.",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 12,
        title: "Doğru Form",
        content: "Her egzersizde doğru formu koruyun. Yanlış form sakatlanmalara ve verimsiz antrenmanlara yol açar.",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80"
    }
]

// Kickboxing teknikleri için örnek veri
const kickboxingTips = [
    {
        id: 1,
        title: "Temel Duruş (Stance)",
        content: "Ayaklar omuz genişliğinde, ön ayak hafif dışa dönük, arka ayak 45 derece açılı. Dizler hafif bükük, ağırlık merkezi ortada. Eller yüz hizasında, dirsekler vücuda yakın.",
        author: "Mike Tyson",
        category: "Temel Teknikler",
        difficulty: "Başlangıç",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        title: "Jab (Direkt)",
        content: "Ön el ile hızlı ve keskin vuruş. Omuz ve kalça rotasyonu ile güçlendirilir. Vuruş sonrası hızlı geri çekilme önemli.",
        author: "Muhammad Ali",
        category: "Yumruk Teknikleri",
        difficulty: "Başlangıç",
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        title: "Cross (Sağ Direkt)",
        content: "Arka el ile güçlü vuruş. Tüm vücut rotasyonu ile desteklenir. Hedefi gözden kaçırmadan, omuz ve kalça rotasyonu ile güçlendirilir.",
        author: "Anderson Silva",
        category: "Yumruk Teknikleri",
        difficulty: "Orta",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        title: "Hook (Kanca)",
        content: "Yandan gelen güçlü yumruk. Dirsek 90 derece açılı, omuz rotasyonu ile desteklenir. Hedefi gözden kaçırmadan, vücut rotasyonu ile güçlendirilir.",
        author: "Joe Frazier",
        category: "Yumruk Teknikleri",
        difficulty: "Orta",
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        title: "Uppercut (Aparkat)",
        content: "Aşağıdan yukarıya gelen güçlü yumruk. Dizlerden güç alınır, vücut yukarı doğru itilir. Hedefi gözden kaçırmadan, tüm vücut ile desteklenir.",
        author: "Mike Tyson",
        category: "Yumruk Teknikleri",
        difficulty: "İleri",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 6,
        title: "Front Kick (Ön Tekme)",
        content: "Diz yukarı çekilir, ayak tabanı hedefe doğru itilir. Denge için karşı kol ileri uzatılır. Tekme sonrası hızlı geri çekilme önemli.",
        author: "Anderson Silva",
        category: "Tekme Teknikleri",
        difficulty: "Başlangıç",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 7,
        title: "Roundhouse Kick (Yan Tekme)",
        content: "Kalça rotasyonu ile desteklenen yandan gelen tekme. Diz yukarı çekilir, ayak tabanı hedefe doğru döndürülür. Denge için karşı kol ileri uzatılır.",
        author: "Buakaw Banchamek",
        category: "Tekme Teknikleri",
        difficulty: "Orta",
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 8,
        title: "Knee Strike (Diz Vuruşu)",
        content: "Diz yukarı çekilir, kalça ileri itilir. Hedefi gözden kaçırmadan, tüm vücut ile desteklenir. Yakın mesafe savaşta etkili.",
        author: "Buakaw Banchamek",
        category: "Diz Teknikleri",
        difficulty: "Orta",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 9,
        title: "Elbow Strike (Dirsek Vuruşu)",
        content: "Dirsek ile yapılan keskin vuruşlar. Yakın mesafe savaşta etkili. Omuz rotasyonu ile desteklenir, hedefi gözden kaçırmadan uygulanır.",
        author: "Buakaw Banchamek",
        category: "Dirsek Teknikleri",
        difficulty: "İleri",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 10,
        title: "Defense (Savunma)",
        content: "Yüksek ve alçak gard pozisyonları. Bloklar, kaçışlar ve kontrataklar. Her zaman hareket halinde ol, savunma pozisyonunu koru.",
        author: "Floyd Mayweather",
        category: "Savunma Teknikleri",
        difficulty: "Orta",
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80"
    }
]

// Antrenman kayıtları için tip tanımı
interface WorkoutRecord {
    id: string
    date: string
    workoutType: string // Antrenman tipi (Kardiyo, Güç, HIIT, vb.)
    duration: number // Dakika cinsinden süre
    exercises: {
        name: string
        sets: number
        reps: number
        weight: number
        restTime: number // Setler arası dinlenme süresi (saniye)
        rpe: number // Rate of Perceived Exertion (1-10 arası)
        notes: string
    }[]
    cardioDetails?: {
        type: string // Koşu, Bisiklet, Yüzme vb.
        distance: number // Metre cinsinden mesafe
        avgHeartRate: number
        maxHeartRate: number
        caloriesBurned: number
    }
    nutrition: {
        preWorkout: string
        postWorkout: string
        waterIntake: number // Litre cinsinden
    }
    recovery: {
        sleepHours: number
        soreness: number // 1-10 arası
        fatigue: number // 1-10 arası
    }
    notes: string
}

export default function FitnessPage() {
    const [currentTip, setCurrentTip] = useState(0)
    const [currentKickboxingTip, setCurrentKickboxingTip] = useState(0)
    const [workoutRecords, setWorkoutRecords] = useState<WorkoutRecord[]>([])
    const [newWorkout, setNewWorkout] = useState<Omit<WorkoutRecord, 'id'>>({
        date: new Date().toISOString().split('T')[0],
        workoutType: '',
        duration: 0,
        exercises: [{
            name: '',
            sets: 0,
            reps: 0,
            weight: 0,
            restTime: 0,
            rpe: 0,
            notes: ''
        }],
        cardioDetails: {
            type: '',
            distance: 0,
            avgHeartRate: 0,
            maxHeartRate: 0,
            caloriesBurned: 0
        },
        nutrition: {
            preWorkout: '',
            postWorkout: '',
            waterIntake: 0
        },
        recovery: {
            sleepHours: 0,
            soreness: 0,
            fatigue: 0
        },
        notes: ''
    })

    // localStorage'dan verileri yükle
    useEffect(() => {
        const savedRecords = localStorage.getItem('workoutRecords')
        if (savedRecords) {
            try {
                const parsedRecords = JSON.parse(savedRecords)
                // Eski kayıtları yeni formata dönüştür
                const migratedRecords = parsedRecords.map((record: any) => {
                    if (!record.exercises) {
                        return {
                            ...record,
                            workoutType: record.workoutType || 'strength',
                            duration: record.duration || 0,
                            exercises: [{
                                name: record.exercise || '',
                                sets: record.sets || 0,
                                reps: record.reps || 0,
                                weight: record.weight || 0,
                                restTime: 0,
                                rpe: 0,
                                notes: ''
                            }],
                            cardioDetails: record.cardioDetails || {
                                type: '',
                                distance: 0,
                                avgHeartRate: 0,
                                maxHeartRate: 0,
                                caloriesBurned: 0
                            },
                            nutrition: record.nutrition || {
                                preWorkout: '',
                                postWorkout: '',
                                waterIntake: 0
                            },
                            recovery: record.recovery || {
                                sleepHours: 0,
                                soreness: 0,
                                fatigue: 0
                            }
                        }
                    }
                    return record
                })
                setWorkoutRecords(migratedRecords)
            } catch (error) {
                console.error('Error loading workout records:', error)
                setWorkoutRecords([])
            }
        }
    }, [])

    // Sağlık tavsiyeleri için otomatik geçiş
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTip((prev) => (prev + 1) % healthTips.length)
        }, 8000) // 8 saniyede bir geçiş yap
        return () => clearInterval(timer)
    }, [])

    const handleWorkoutSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newRecord: WorkoutRecord = {
            ...newWorkout,
            id: Date.now().toString()
        }
        const updatedRecords = [...workoutRecords, newRecord]
        setWorkoutRecords(updatedRecords)
        // localStorage'a kaydet
        localStorage.setItem('workoutRecords', JSON.stringify(updatedRecords))
        setNewWorkout({
            date: new Date().toISOString().split('T')[0],
            workoutType: '',
            duration: 0,
            exercises: [{
                name: '',
                sets: 0,
                reps: 0,
                weight: 0,
                restTime: 0,
                rpe: 0,
                notes: ''
            }],
            cardioDetails: {
                type: '',
                distance: 0,
                avgHeartRate: 0,
                maxHeartRate: 0,
                caloriesBurned: 0
            },
            nutrition: {
                preWorkout: '',
                postWorkout: '',
                waterIntake: 0
            },
            recovery: {
                sleepHours: 0,
                soreness: 0,
                fatigue: 0
            },
            notes: ''
        })
        toast.success('Antrenman kaydedildi!')
    }

    // Antrenman kaydını silme fonksiyonu
    const handleDeleteWorkout = (id: string) => {
        const updatedRecords = workoutRecords.filter(record => record.id !== id)
        setWorkoutRecords(updatedRecords)
        localStorage.setItem('workoutRecords', JSON.stringify(updatedRecords))
        toast.success('Antrenman silindi!')
    }

    // Egzersiz ekleme fonksiyonu
    const addExercise = () => {
        setNewWorkout(prev => ({
            ...prev,
            exercises: [...prev.exercises, {
                name: '',
                sets: 0,
                reps: 0,
                weight: 0,
                restTime: 0,
                rpe: 0,
                notes: ''
            }]
        }))
    }

    // Egzersiz silme fonksiyonu
    const removeExercise = (index: number) => {
        setNewWorkout(prev => ({
            ...prev,
            exercises: prev.exercises.filter((_, i) => i !== index)
        }))
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
            {/* Ana Sayfa Butonu */}
            <div className="fixed top-6 left-6 z-50">
                <Link href="/" className="flex items-center gap-2 bg-white/80 hover:bg-purple-100 text-purple-700 font-semibold px-4 py-2 rounded-full shadow transition-colors border border-purple-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Ana Sayfa
                </Link>
            </div>
            {/* Header Section with Health Tips Slider */}
            <div className="relative h-[400px] overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentTip}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${healthTips[currentTip].image})` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 flex items-center justify-center">
                                <div className="text-center text-white p-8 max-w-2xl">
                                    <motion.h2
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-4xl font-bold mb-4"
                                    >
                                        {healthTips[currentTip].title}
                                    </motion.h2>
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-xl"
                                    >
                                        {healthTips[currentTip].content}
                                    </motion.p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
                {/* Slider Navigation Dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {healthTips.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentTip(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentTip === index ? 'bg-white w-4' : 'bg-white/50'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Kickboxing Tips Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-purple-900 mb-6">Kickboxing Teknikleri</h2>

                    {/* Kategori Filtreleme */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        <button
                            onClick={() => setCurrentKickboxingTip(0)}
                            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors whitespace-nowrap"
                        >
                            Tümü
                        </button>
                        {Array.from(new Set(kickboxingTips.map(tip => tip.category))).map((category, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentKickboxingTip(index + 1)}
                                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors whitespace-nowrap"
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {kickboxingTips.map((tip, index) => (
                            <motion.div
                                key={tip.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={tip.image}
                                            alt={tip.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-xl font-semibold text-purple-900">{tip.title}</h3>
                                            <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                                                {tip.difficulty}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-2">{tip.content}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-purple-500">- {tip.author}</span>
                                            <span className="text-sm text-purple-700 bg-purple-100 px-2 py-1 rounded-full">
                                                {tip.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Workout Tracker Section */}
                <div className="bg-gray-50 rounded-2xl shadow-xl p-8 border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-purple-900">Antrenman Takibi</h2>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="text-purple-600 hover:text-purple-700 flex items-center gap-2"
                        >
                            <span>Yukarı Çık</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                    {/* Quick Navigation */}
                    <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                        <button
                            onClick={() => document.getElementById('workout-form')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors whitespace-nowrap"
                        >
                            Yeni Antrenman Ekle
                        </button>
                        <button
                            onClick={() => document.getElementById('workout-history')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors whitespace-nowrap"
                        >
                            Antrenman Geçmişi
                        </button>
                    </div>

                    {/* Antrenman Kayıt Formu */}
                    <div id="workout-form" className="mb-10">
                        <h3 className="text-2xl font-bold text-purple-800 mb-6 tracking-tight">Yeni Antrenman Ekle</h3>
                        <form onSubmit={handleWorkoutSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tarih</label>
                                    <input
                                        type="date"
                                        value={newWorkout.date}
                                        onChange={(e) => setNewWorkout({ ...newWorkout, date: e.target.value })}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Antrenman Tipi</label>
                                    <select
                                        value={newWorkout.workoutType}
                                        onChange={(e) => setNewWorkout({ ...newWorkout, workoutType: e.target.value })}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                                    >
                                        <option value="">Seçiniz</option>
                                        <option value="strength">Güç Antrenmanı</option>
                                        <option value="cardio">Kardiyo</option>
                                        <option value="hiit">HIIT</option>
                                        <option value="flexibility">Esneklik</option>
                                        <option value="kickboxing">Kickboxing</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Toplam Süre (dakika)</label>
                                <input
                                    type="number"
                                    value={isNaN(newWorkout.duration) ? '' : newWorkout.duration}
                                    onChange={(e) => setNewWorkout({ ...newWorkout, duration: parseInt(e.target.value) })}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white shadow focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                                />
                            </div>

                            {/* Egzersizler */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-lg font-medium text-gray-900">Egzersizler</h4>
                                    <button
                                        type="button"
                                        onClick={addExercise}
                                        className="text-purple-600 hover:text-purple-700"
                                    >
                                        + Egzersiz Ekle
                                    </button>
                                </div>

                                {newWorkout.exercises.map((exercise, index) => (
                                    <div key={index} className="p-5 border border-purple-100 bg-white/80 rounded-xl shadow space-y-4">
                                        <div className="flex justify-between">
                                            <h5 className="font-medium">Egzersiz {index + 1}</h5>
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeExercise(index)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    Sil
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Egzersiz Adı</label>
                                                <input
                                                    type="text"
                                                    value={exercise.name}
                                                    onChange={(e) => {
                                                        const newExercises = [...newWorkout.exercises]
                                                        newExercises[index].name = e.target.value
                                                        setNewWorkout({ ...newWorkout, exercises: newExercises })
                                                    }}
                                                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 shadow focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Set</label>
                                                    <input
                                                        type="number"
                                                        value={isNaN(exercise.sets) ? '' : exercise.sets}
                                                        onChange={(e) => {
                                                            const newExercises = [...newWorkout.exercises]
                                                            newExercises[index].sets = parseInt(e.target.value)
                                                            setNewWorkout({ ...newWorkout, exercises: newExercises })
                                                        }}
                                                        className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 shadow focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Tekrar</label>
                                                    <input
                                                        type="number"
                                                        value={isNaN(exercise.reps) ? '' : exercise.reps}
                                                        onChange={(e) => {
                                                            const newExercises = [...newWorkout.exercises]
                                                            newExercises[index].reps = parseInt(e.target.value)
                                                            setNewWorkout({ ...newWorkout, exercises: newExercises })
                                                        }}
                                                        className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 shadow focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Ağırlık (kg)</label>
                                                    <input
                                                        type="number"
                                                        value={isNaN(exercise.weight) ? '' : exercise.weight}
                                                        onChange={(e) => {
                                                            const newExercises = [...newWorkout.exercises]
                                                            newExercises[index].weight = parseInt(e.target.value)
                                                            setNewWorkout({ ...newWorkout, exercises: newExercises })
                                                        }}
                                                        className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 shadow focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Dinlenme (sn)</label>
                                                    <input
                                                        type="number"
                                                        value={isNaN(exercise.restTime) ? '' : exercise.restTime}
                                                        onChange={(e) => {
                                                            const newExercises = [...newWorkout.exercises]
                                                            newExercises[index].restTime = parseInt(e.target.value)
                                                            setNewWorkout({ ...newWorkout, exercises: newExercises })
                                                        }}
                                                        className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 shadow focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">RPE (1-10)</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="10"
                                                        value={isNaN(exercise.rpe) ? '' : exercise.rpe}
                                                        onChange={(e) => {
                                                            const newExercises = [...newWorkout.exercises]
                                                            newExercises[index].rpe = parseInt(e.target.value)
                                                            setNewWorkout({ ...newWorkout, exercises: newExercises })
                                                        }}
                                                        className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 shadow focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Notlar</label>
                                                <textarea
                                                    value={exercise.notes}
                                                    onChange={(e) => {
                                                        const newExercises = [...newWorkout.exercises]
                                                        newExercises[index].notes = e.target.value
                                                        setNewWorkout({ ...newWorkout, exercises: newExercises })
                                                    }}
                                                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 shadow focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                                                    rows={2}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Beslenme ve Toparlanma */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-lg font-medium text-gray-900">Beslenme</h4>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Antrenman Öncesi</label>
                                        <textarea
                                            value={newWorkout.nutrition.preWorkout}
                                            onChange={(e) => setNewWorkout({
                                                ...newWorkout,
                                                nutrition: { ...newWorkout.nutrition, preWorkout: e.target.value }
                                            })}
                                            className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 shadow focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                                            rows={2}
                                            placeholder="Antrenman öncesi yedikleriniz..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Antrenman Sonrası</label>
                                        <textarea
                                            value={newWorkout.nutrition.postWorkout}
                                            onChange={(e) => setNewWorkout({
                                                ...newWorkout,
                                                nutrition: { ...newWorkout.nutrition, postWorkout: e.target.value }
                                            })}
                                            className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 shadow focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                                            rows={2}
                                            placeholder="Antrenman sonrası yedikleriniz..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Su Tüketimi (litre)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={isNaN(newWorkout.nutrition.waterIntake) ? '' : newWorkout.nutrition.waterIntake}
                                            onChange={(e) => setNewWorkout({
                                                ...newWorkout,
                                                nutrition: { ...newWorkout.nutrition, waterIntake: parseFloat(e.target.value) }
                                            })}
                                            className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 shadow focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-lg font-medium text-gray-900">Toparlanma</h4>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Uyku Süresi (saat)</label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            value={isNaN(newWorkout.recovery.sleepHours) ? '' : newWorkout.recovery.sleepHours}
                                            onChange={(e) => setNewWorkout({
                                                ...newWorkout,
                                                recovery: { ...newWorkout.recovery, sleepHours: parseFloat(e.target.value) }
                                            })}
                                            className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 shadow focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Kas Ağrısı (1-10)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={isNaN(newWorkout.recovery.soreness) ? '' : newWorkout.recovery.soreness}
                                            onChange={(e) => setNewWorkout({
                                                ...newWorkout,
                                                recovery: { ...newWorkout.recovery, soreness: parseInt(e.target.value) }
                                            })}
                                            className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 shadow focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Yorgunluk (1-10)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={isNaN(newWorkout.recovery.fatigue) ? '' : newWorkout.recovery.fatigue}
                                            onChange={(e) => setNewWorkout({
                                                ...newWorkout,
                                                recovery: { ...newWorkout.recovery, fatigue: parseInt(e.target.value) }
                                            })}
                                            className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 shadow focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Genel Notlar</label>
                                <textarea
                                    value={newWorkout.notes}
                                    onChange={(e) => setNewWorkout({ ...newWorkout, notes: e.target.value })}
                                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 shadow focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
                                    rows={3}
                                    placeholder="Antrenman hakkında genel notlar..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 via-fuchsia-500 to-blue-400 text-white text-lg font-bold shadow-lg hover:from-purple-600 hover:to-blue-500 transition-all"
                            >
                                Kaydet
                            </button>
                        </form>
                    </div>

                    {/* Antrenman Kayıtları Listesi */}
                    <div id="workout-history">
                        <h3 className="text-xl font-semibold text-purple-900 mb-4">Antrenman Geçmişi</h3>
                        <div className="space-y-4">
                            {workoutRecords.map((record) => (
                                <motion.div
                                    key={record.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium text-purple-900">{record.workoutType}</h4>
                                            <p className="text-sm text-gray-600">{record.date}</p>
                                            <p className="text-sm text-gray-600">{record.duration} dakika</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">
                                                {record.exercises?.length || 0} egzersiz
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                RPE: {record.exercises?.length ?
                                                    (record.exercises.reduce((acc, ex) => acc + (ex.rpe || 0), 0) / record.exercises.length).toFixed(1) :
                                                    '0'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <h5 className="font-medium text-gray-700">Egzersizler:</h5>
                                        <ul className="mt-1 space-y-1">
                                            {record.exercises?.map((exercise, index) => (
                                                <li key={index} className="text-sm text-gray-600">
                                                    {exercise.name}: {exercise.sets}x{exercise.reps} @ {exercise.weight}kg
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {record.notes && (
                                        <p className="mt-2 text-sm text-gray-600">{record.notes}</p>
                                    )}
                                    <button
                                        onClick={() => handleDeleteWorkout(record.id)}
                                        className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
                                    >
                                        Sil
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 