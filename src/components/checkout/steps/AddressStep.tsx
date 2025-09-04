import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Plus, CheckCircle, Edit, Home, Building, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { UserAddress } from '@/interfaces/user';

interface AddressStepProps {
    addresses: UserAddress[];
    selectedAddress: UserAddress | null;
    onAddressSelect: (address: UserAddress) => void;
    onAddNewAddress: () => void;
    onCanProceed: (canProceed: boolean) => void;
}

export function AddressStep({
    addresses,
    selectedAddress,
    onAddressSelect,
    onAddNewAddress,
    onCanProceed
}: AddressStepProps) {

    useEffect(() => {
        // İlk adres otomatik seçili ise proceed edilebilir
        if (selectedAddress) {
            onCanProceed(true);
        } else {
            onCanProceed(false);
        }
    }, [selectedAddress, onCanProceed]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Teslimat Adresi</h2>
                <p className="text-gray-600">Siparişinizin teslim edileceği adresi seçin</p>
            </div>

            <div className="space-y-4">
                <AnimatePresence>
                    {addresses.map((address, index) => (
                        <motion.div
                            key={address.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <Card
                                className={`cursor-pointer transition-all duration-200 border-2 ${selectedAddress?.id === address.id
                                    ? 'border-primary-500 bg-primary-50 shadow-md'
                                    : 'border-gray-200 hover:border-primary-300 hover:shadow-sm'
                                    }`}
                                onClick={() => onAddressSelect(address)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            {/* Header with icon and title */}
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${address.title.toLowerCase().includes('ev')
                                                        ? 'bg-blue-100 text-blue-600'
                                                        : 'bg-green-100 text-green-600'
                                                    }`}>
                                                    {address.title.toLowerCase().includes('ev') ? (
                                                        <Home className="w-5 h-5" />
                                                    ) : (
                                                        <Building className="w-5 h-5" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-gray-900 text-lg">{address.title}</h3>
                                                        {address.isDefault && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs"
                                                            >
                                                                <Star className="w-3 h-3" />
                                                                <span>Varsayılan</span>
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-500">{address.fullName}</p>
                                                </div>
                                                {selectedAddress?.id === address.id && (
                                                    <motion.div
                                                        initial={{ scale: 0, rotate: -180 }}
                                                        animate={{ scale: 1, rotate: 0 }}
                                                        transition={{ type: 'spring', stiffness: 300 }}
                                                        className="bg-primary-500 rounded-full p-1"
                                                    >
                                                        <CheckCircle className="w-5 h-5 text-white" />
                                                    </motion.div>
                                                )}
                                            </div>

                                            {/* Address details */}
                                            <div className="ml-13 space-y-2">
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                                    <p className="text-gray-600 text-sm leading-relaxed">
                                                        {address.fullAddress || `${address.address}, ${address.district}, ${address.city} ${address.postalCode}`}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">{address.phone}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <Clock className="w-3 h-3" />
                                                        <span>~25-35 dk</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // TODO: Edit address functionality
                                            }}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Add New Address Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: addresses.length * 0.1 + 0.2 }}
                >
                    <Card
                        className="border-2 border-dashed border-gray-300 hover:border-primary-400 cursor-pointer transition-all duration-300 group hover:shadow-md"
                        onClick={onAddNewAddress}
                    >
                        <CardContent className="p-8 text-center">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex flex-col items-center gap-4"
                            >
                                <motion.div
                                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-primary-100 group-hover:to-primary-200 flex items-center justify-center transition-all duration-300"
                                    whileHover={{ rotate: 5 }}
                                >
                                    <Plus className="w-8 h-8 text-gray-400 group-hover:text-primary-500 transition-colors" />
                                </motion.div>
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-700 group-hover:text-primary-600 transition-colors">
                                        Yeni Adres Ekle
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1 max-w-xs">
                                        Farklı bir adrese teslimat almak için yeni adres tanımlayın
                                    </p>
                                    <div className="mt-3 flex items-center justify-center gap-1 text-xs text-gray-400 group-hover:text-primary-500 transition-colors">
                                        <MapPin className="w-3 h-3" />
                                        <span>Hızlı ekleme</span>
                                    </div>
                                </div>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Selected Address Summary */}
            <AnimatePresence>
                {selectedAddress && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-green-50 border border-green-200 rounded-lg p-4"
                    >
                        <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">Seçili Adres: {selectedAddress.title}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
