'use client'

import { TravelService } from '@/services/api'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const CreateTravelPlanForm = dynamic(() => import('@/components/CreateTravelPlanForm'), { ssr: false })

export default function NewTravelPlanPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <Link href="/travel">
                    <Button className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Tatil Planlarına Dön
                    </Button>
                </Link>
            </div>

            <h1 className="text-3xl font-bold mb-8">Yeni Tatil Planı</h1>

            <CreateTravelPlanForm />
        </div>
    )
} 