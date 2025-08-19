import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white w-full border-t border-gray-800 mt-12">
            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                {/* Logo ve Açıklama */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <img src="/logo.png" alt="Lezzet Durağı Logo" className="h-10 w-auto object-contain" />
                        <span className="text-xl font-poppins font-bold">Lezzet Durağı</span>
                    </div>
                    <p className="text-gray-300 mb-4 text-sm">
                        Taze malzemeler ve geleneksel tariflerle hazırlanan lezzetli yemeklerimizi sizlerle buluşturuyoruz. Döner, makarna, salata ve içecek çeşitlerimizle damaklarınızda unutulmaz tatlar bırakıyoruz.
                    </p>
                    <div className="flex gap-4 mt-2">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                    </div>
                </div>
                {/* Sayfa Linkleri */}
                <div>
                    <h4 className="font-poppins font-semibold text-lg mb-4">Sayfalar</h4>
                    <nav className="flex flex-col gap-2 text-gray-300 text-sm">
                        <Link to="/" className="hover:text-primary-400 transition-colors">Ana Sayfa</Link>
                        <Link to="/menu" className="hover:text-primary-400 transition-colors">Menü</Link>
                        <Link to="/about" className="hover:text-primary-400 transition-colors">Hakkımızda</Link>
                        <Link to="/contact" className="hover:text-primary-400 transition-colors">İletişim</Link>
                    </nav>
                </div>
                {/* İletişim Bilgileri */}
                <div>
                    <h4 className="font-poppins font-semibold text-lg mb-4">İletişim</h4>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-primary-400" />
                            <span className="text-gray-300">+90 555 123 45 67</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-primary-400" />
                            <span className="text-gray-300">info@lezzetduragi.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-primary-400" />
                            <span className="text-gray-300">Üniversite Caddesi, Yenişehir/MERSİN</span>
                        </div>
                    </div>
                </div>
                {/* Çalışma Saatleri */}
                <div>
                    <h4 className="font-poppins font-semibold text-lg mb-4">Çalışma Saatleri</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-primary-400" />
                            <div>
                                <p className="text-gray-300">Pazartesi - Cuma</p>
                                <p className="text-xs text-gray-400">09:00 - 22:00</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-primary-400" />
                            <div>
                                <p className="text-gray-300">Hafta Sonu</p>
                                <p className="text-xs text-gray-400">10:00 - 23:00</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-800 py-6 text-center text-gray-400 text-xs">
                © 2024 Lezzet Durağı. Tüm hakları saklıdır.
            </div>
        </footer>
    );
} 