'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const ReactConfetti = dynamic(() => import('react-confetti'), {
  ssr: false
})

export default function Home() {
  const [showCelebration, setShowCelebration] = useState(
    new Date() < new Date("2025-06-22")
  )
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0
  })

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    })

    const timer = setTimeout(() => {
      setShowCelebration(false)
    }, 5000) // 5 saniye sonra kutlamayı kaldır

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-purple-50">
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <ReactConfetti
              width={windowSize.width}
              height={windowSize.height}
              numberOfPieces={200}
              recycle={false}
            />
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-xl"
            >
              <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-red-500 text-transparent bg-clip-text mb-4">
                İyi ki Doğdun Ballı Bebkem
              </h2>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-2xl text-purple-600"
              >
                🎂 🎉 🎁
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text">Hoşgeldiniz </span>
            <span className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-transparent bg-clip-text text-5xl md:text-7xl font-extrabold">Gülsüm</span>
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text"> Hanımım</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Bizim hikayemiz, anılarımız ve planlarımız
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className="transform transition-all duration-300"
          >
            <Link href="/gallery" className="block">
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-purple-100">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-purple-600 mb-2">Fotoğraf Galerisi</h2>
                <p className="text-gray-600">Birlikte yaşadığımız anıların fotoğrafları</p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className="transform transition-all duration-300"
          >
            <Link href="/travel" className="block">
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-blue-100">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-blue-600 mb-2">Tatil Planları</h2>
                <p className="text-gray-600">Geçmiş ve gelecek tatil planlarımız</p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className="transform transition-all duration-300"
          >
            <Link href="/events" className="block">
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-green-100">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-green-600 mb-2">Etkinlikler</h2>
                <p className="text-gray-600">Şehrimizdeki konser ve tiyatro etkinlikleri</p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className="transform transition-all duration-300"
          >
            <Link href="/fitness" className="block">
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-red-100">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-red-600 mb-2">Spor & Kick Boks</h2>
                <p className="text-gray-600">Spor rutinleri ve kick boks antrenmanları</p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className="transform transition-all duration-300"
          >
            <Link href="/diary" className="block">
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-pink-100">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-pink-600 mb-2">Günlük</h2>
                <p className="text-gray-600">Duygu ve düşüncelerimizi paylaştığımız günlük</p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className="transform transition-all duration-300"
          >
            <Link href="/poems" className="block">
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-pink-100">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-pink-600 mb-2">Şiirlerim</h2>
                <p className="text-gray-600">Senin için yazdığım romantik şiirler</p>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Sadece ana sayfada görünen sabit Todolist butonu */}
      <div className="fixed bottom-0 left-0 w-full flex justify-center z-50 pointer-events-none">
        <div className="pointer-events-auto py-3">
          <Link
            href="/todolist"
            className="bg-gradient-to-r from-purple-500 to-pink-400 text-white px-8 py-3 rounded-full shadow-lg text-lg font-bold flex items-center gap-2 hover:scale-105 hover:from-purple-600 hover:to-pink-500 transition-all border-4 border-white"
            style={{ minWidth: 180, justifyContent: 'center' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m9 2a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v10z" /></svg>
            Todolist
          </Link>
        </div>
      </div>
    </div>
  )
}
