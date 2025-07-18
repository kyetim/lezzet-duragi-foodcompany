'use client'

import { useEffect, useState } from 'react'
import { TravelService } from '@/services/api'
import { Button } from '@/components/ui/button'
import { Plus, Check, X, Calendar, Home } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { TravelPlan } from '@/lib/types'

export default function TravelPage() {
    const [plans, setPlans] = useState<TravelPlan[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchPlans = async () => {
        try {
            const data = await TravelService.getAllPlans()
            setPlans(data)
        } catch (err) {
            setError('Tatil planları yüklenirken bir hata oluştu')
            console.error('Error fetching plans:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPlans()
    }, [])

    const handleStatusUpdate = async (id: string, newStatus: TravelPlan['status']) => {
        try {
            await TravelService.updatePlanStatus(id, newStatus)
            fetchPlans() // Refresh the list
        } catch (err) {
            setError('Durum güncellenirken bir hata oluştu')
            console.error('Error updating status:', err)
        }
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm('Bu tatil planını silmek istediğinize emin misiniz?')) return;
        try {
            await TravelService.deletePlan(id);
            fetchPlans();
        } catch (err) {
            setError('Tatil planı silinirken bir hata oluştu');
            console.error('Error deleting plan:', err);
        }
    };

    const getStatusColor = (status: TravelPlan['status']) => {
        switch (status) {
            case 'PLANNED':
                return 'bg-blue-100 text-blue-800'
            case 'ONGOING':
                return 'bg-yellow-100 text-yellow-800'
            case 'COMPLETED':
                return 'bg-green-100 text-green-800'
            case 'CANCELLED':
                return 'bg-red-100 text-red-800'
            case 'DONE':
                return 'bg-purple-100 text-purple-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusText = (status: TravelPlan['status']) => {
        switch (status) {
            case 'PLANNED':
                return 'Planlandı'
            case 'ONGOING':
                return 'Devam Ediyor'
            case 'COMPLETED':
                return 'Tamamlandı'
            case 'CANCELLED':
                return 'İptal Edildi'
            case 'DONE':
                return 'Tatil Yapıldı'
            default:
                return status
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">Yükleniyor...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-red-500 text-center">{error}</div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                            <Home className="w-5 h-5 mr-2" />
                            Ana Sayfa
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">Tatil Planları</h1>
                </div>
                <Link href="/travel/new">
                    <Button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <Plus className="w-5 h-5 mr-2" />
                        Yeni Plan
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div key={plan.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-semibold">{plan.title}</h2>
                                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(plan.status)}`}>
                                    {getStatusText(plan.status)}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center text-gray-600">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    <span>
                                        {format(new Date(plan.startDate), 'd MMMM yyyy', { locale: tr })} - {format(new Date(plan.endDate), 'd MMMM yyyy', { locale: tr })}
                                    </span>
                                </div>

                                <p className="text-gray-600">{plan.location}</p>

                                {plan.description && (
                                    <p className="text-gray-600">{plan.description}</p>
                                )}

                                {plan.budget && (
                                    <p className="text-gray-600">
                                        Bütçe: {plan.budget.toLocaleString('tr-TR')} TL
                                    </p>
                                )}
                            </div>

                            <div className="mt-6 flex flex-wrap gap-2">
                                {plan.status === 'PLANNED' && (
                                    <>
                                        <Button
                                            onClick={() => handleStatusUpdate(plan.id, 'ONGOING')}
                                            className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                                        >
                                            Başlat
                                        </Button>
                                        <Button
                                            onClick={() => handleStatusUpdate(plan.id, 'CANCELLED')}
                                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                        >
                                            İptal Et
                                        </Button>
                                    </>
                                )}

                                {plan.status === 'ONGOING' && (
                                    <>
                                        <Button
                                            onClick={() => handleStatusUpdate(plan.id, 'COMPLETED')}
                                            className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                                        >
                                            <Check className="w-4 h-4 mr-1" />
                                            Tamamla
                                        </Button>
                                        <Button
                                            onClick={() => handleStatusUpdate(plan.id, 'CANCELLED')}
                                            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                        >
                                            <X className="w-4 h-4 mr-1" />
                                            İptal Et
                                        </Button>
                                    </>
                                )}

                                {(plan.status === 'COMPLETED' || plan.status === 'CANCELLED') && (
                                    <>
                                        <Button
                                            onClick={() => handleStatusUpdate(plan.id, 'PLANNED')}
                                            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                                        >
                                            Yeniden Planla
                                        </Button>
                                        <Button
                                            onClick={() => handleStatusUpdate(plan.id, 'DONE')}
                                            className="bg-purple-500 text-white px-3 py-1 rounded-md hover:bg-purple-600"
                                        >
                                            Tatil Yapıldı
                                        </Button>
                                    </>
                                )}

                                {plan.status === 'DONE' && (
                                    <Button
                                        onClick={() => handleStatusUpdate(plan.id, 'PLANNED')}
                                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                                    >
                                        Yeniden Planla
                                    </Button>
                                )}

                                <Button
                                    onClick={() => handleDelete(plan.id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                                >
                                    Sil
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
} 