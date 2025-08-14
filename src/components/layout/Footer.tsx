import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo ve Açıklama */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-primary-red rounded-full flex items-center justify-center">
                                <span className="text-white font-poppins font-bold">L</span>
                            </div>
                            <h3 className="text-xl font-poppins font-bold">Lezzet Durağı</h3>
                        </div>
                        <p className="text-gray-300 mb-4 max-w-md">
                            Taze malzemeler ve geleneksel tariflerle hazırlanan lezzetli yemeklerimizi
                            sizlerle buluşturuyoruz. Döner, makarna, salata ve içecek çeşitlerimizle
                            damaklarınızda unutulmaz tatlar bırakıyoruz.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* İletişim Bilgileri */}
                    <div>
                        <h4 className="font-poppins font-semibold text-lg mb-4">İletişim</h4>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Phone className="w-4 h-4 text-primary-red" />
                                <span className="text-gray-300">+90 555 123 45 67</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="w-4 h-4 text-primary-red" />
                                <span className="text-gray-300">info@lezzetduragi.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MapPin className="w-4 h-4 text-primary-red" />
                                <span className="text-gray-300">Atatürk Cad. No:123, İstanbul</span>
                            </div>
                        </div>
                    </div>

                    {/* Çalışma Saatleri */}
                    <div>
                        <h4 className="font-poppins font-semibold text-lg mb-4">Çalışma Saatleri</h4>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                                <Clock className="w-4 h-4 text-primary-red" />
                                <div>
                                    <p className="text-gray-300">Pazartesi - Cuma</p>
                                    <p className="text-sm text-gray-400">09:00 - 22:00</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Clock className="w-4 h-4 text-primary-red" />
                                <div>
                                    <p className="text-gray-300">Hafta Sonu</p>
                                    <p className="text-sm text-gray-400">10:00 - 23:00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alt Bilgi */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        © 2024 Lezzet Durağı. Tüm hakları saklıdır.
                    </p>
                </div>
            </div>
        </footer>
    );
} 