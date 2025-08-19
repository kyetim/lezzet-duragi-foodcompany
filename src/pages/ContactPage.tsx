import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Send,
    Instagram,
    Facebook,
    Twitter,
    Youtube,
    Navigation,
    CheckCircle,
    AlertCircle,
    Zap,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getRandomFoodImage, optimizeImageUrl } from '@/helpers/foodImages';

export function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Gerçek yemek görselleri
    const heroImage = getRandomFoodImage('hero');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: typeof formData) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitStatus('success');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });

            // Reset status after 3 seconds
            setTimeout(() => setSubmitStatus('idle'), 3000);
        }, 2000);
    };

    const contactInfo = [
        {
            icon: MapPin,
            title: "Adres",
            content: "Örnek Mahallesi, Lezzet Caddesi No: 123",
            subtitle: "Kadıköy, İstanbul, Türkiye",
            color: "bg-primary-100 text-primary-600"
        },
        {
            icon: Phone,
            title: "Telefon",
            content: "+90 212 123 45 67",
            subtitle: "Pazartesi - Pazar: 09:00 - 23:00",
            color: "bg-green-100 text-green-600"
        },
        {
            icon: Mail,
            title: "E-posta",
            content: "info@lezzetduragi.com",
            subtitle: "Sipariş: siparis@lezzetduragi.com",
            color: "bg-blue-100 text-blue-600"
        },
        {
            icon: Clock,
            title: "Çalışma Saatleri",
            content: "Her gün açık",
            subtitle: "09:00 - 23:00",
            color: "bg-purple-100 text-purple-600"
        }
    ];

    const socialMedia = [
        { icon: Instagram, name: "Instagram", url: "#", color: "bg-gradient-to-r from-purple-500 to-pink-500" },
        { icon: Facebook, name: "Facebook", url: "#", color: "bg-blue-600" },
        { icon: Twitter, name: "Twitter", url: "#", color: "bg-sky-500" },
        { icon: Youtube, name: "YouTube", url: "#", color: "bg-red-600" }
    ];

    const faqItems = [
        {
            question: "Teslimat süresi ne kadar?",
            answer: "Siparişleriniz 15-30 dakika içinde kapınıza teslim edilir."
        },
        {
            question: "Minimum sipariş tutarı var mı?",
            answer: "Evet, minimum sipariş tutarımız 50 TL'dir."
        },
        {
            question: "Hangi bölgelere teslimat yapıyorsunuz?",
            answer: "Kadıköy ve çevre ilçelere teslimat hizmeti veriyoruz."
        },
        {
            question: "Özel siparişler alıyor musunuz?",
            answer: "Evet, özel etkinlikler için özel menüler hazırlayabiliriz."
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-80 lg:h-[28rem] pt-32 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src={optimizeImageUrl(heroImage.url, 1200, 600)}
                        alt="İletişim"
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent"></div>
                </div>
                {/* Content */}
                <div className="w-full px-4 relative z-10 h-full flex flex-col items-center justify-center text-center">
                    <motion.div
                        className="text-white max-w-2xl"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.h1
                            className="text-5xl md:text-7xl font-extrabold font-poppins mb-6 drop-shadow-lg tracking-tight"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            İletişim
                        </motion.h1>
                        <motion.p
                            className="text-lg md:text-2xl text-white/90 leading-relaxed max-w-xl mx-auto"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Sorularınız, önerileriniz veya siparişleriniz için bizimle iletişime geçin. Size en kısa sürede dönüş yapacağız.
                        </motion.p>
                    </motion.div>
                </div>
                <div className="absolute left-0 right-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[#fffbe6] pointer-events-none" />
            </section>

            {/* Contact Info Section */}
            <section className="w-full bg-white">
                <div className="w-full px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 py-8 md:py-12 lg:py-20">
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        {contactInfo.map((info, index) => (
                            <motion.div
                                key={index}
                                className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05, y: -5 }}
                            >
                                <div className={`w-16 h-16 mx-auto mb-4 ${info.color.split(' ')[0]} rounded-full flex items-center justify-center`}>
                                    <info.icon className={`w-8 h-8 ${info.color.split(' ')[1]}`} />
                                </div>
                                <h3 className="heading-lg text-gray-800 mb-2">{info.title}</h3>
                                <p className="text-primary-600 font-semibold mb-1">{info.content}</p>
                                <p className="text-gray-600 text-sm">{info.subtitle}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Map and Form Section */}
            <section className="w-full bg-food-cream">
                <div className="w-full px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 py-8 md:py-12 lg:py-20">
                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        {/* Map */}
                        <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="heading-2xl text-primary-700">Konumumuz</h2>
                            <p className="text-gray-600">
                                Lezzet Durağı'na kolayca ulaşabilirsiniz. Kadıköy merkezde,
                                toplu taşıma araçlarına yakın konumdayız.
                            </p>

                            {/* Interactive Map Placeholder */}
                            <div className="w-full h-80 bg-gray-200 rounded-2xl overflow-hidden shadow-lg relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                                    <div className="text-center">
                                        <Navigation className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Harita</h3>
                                        <p className="text-gray-600">Örnek Mahallesi, Lezzet Caddesi No: 123</p>
                                        <p className="text-gray-600">Kadıköy, İstanbul</p>
                                    </div>
                                </div>

                                {/* Map Pin */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shadow-lg">
                                        <MapPin className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Directions */}
                            <div className="space-y-4">
                                <h3 className="heading-lg text-gray-800">Nasıl Ulaşırım?</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <p>🚇 Metro: Kadıköy Metro İstasyonu (5 dk yürüme)</p>
                                    <p>🚌 Otobüs: 15, 16, 17 numaralı hatlar</p>
                                    <p>🚗 Araç: Ücretsiz otopark mevcuttur</p>
                                    <p>🚶 Yürüme: Kadıköy merkezden 10 dk</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="heading-2xl text-primary-700">Mesaj Gönderin</h2>
                            <p className="text-gray-600">
                                Sorularınız, önerileriniz veya özel siparişleriniz için
                                aşağıdaki formu doldurabilirsiniz.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Ad Soyad *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="Adınız ve soyadınız"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            E-posta *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="ornek@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                            Telefon
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="+90 5XX XXX XX XX"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                            Konu *
                                        </label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        >
                                            <option value="">Konu seçiniz</option>
                                            <option value="siparis">Sipariş</option>
                                            <option value="oneri">Öneri/Şikayet</option>
                                            <option value="isbirligi">İş Birliği</option>
                                            <option value="diger">Diğer</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Mesajınız *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows={5}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                        placeholder="Mesajınızı buraya yazın..."
                                    ></textarea>
                                </div>

                                {/* Submit Status */}
                                {submitStatus === 'success' && (
                                    <motion.div
                                        className="flex items-center space-x-2 p-4 bg-green-100 text-green-700 rounded-lg"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        <span>Mesajınız başarıyla gönderildi!</span>
                                    </motion.div>
                                )}

                                {submitStatus === 'error' && (
                                    <motion.div
                                        className="flex items-center space-x-2 p-4 bg-red-100 text-red-700 rounded-lg"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        <AlertCircle className="w-5 h-5" />
                                        <span>Bir hata oluştu. Lütfen tekrar deneyin.</span>
                                    </motion.div>
                                )}

                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full btn-primary"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center space-x-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Gönderiliyor...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                <Send className="w-4 h-4" />
                                                <span>Mesaj Gönder</span>
                                            </div>
                                        )}
                                    </Button>
                                </motion.div>
                            </form>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Social Media Section */}
            <section className="w-full bg-white">
                <div className="w-full px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 py-8 md:py-12 lg:py-20">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="heading-2xl text-primary-700 mb-6">
                            Sosyal Medyada Takip Edin
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            En güncel menülerimizi, kampanyalarımızı ve lezzetli yemek fotoğraflarımızı
                            sosyal medya hesaplarımızdan takip edebilirsiniz.
                        </p>
                    </motion.div>

                    <motion.div
                        className="flex justify-center space-x-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        {socialMedia.map((social, index) => (
                            <motion.a
                                key={index}
                                href={social.url}
                                className={`w-16 h-16 ${social.color} rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <social.icon className="w-8 h-8" />
                            </motion.a>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="w-full bg-gradient-to-br from-primary-50 to-secondary-50">
                <div className="w-full px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 py-8 md:py-12 lg:py-20">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="heading-2xl text-primary-700 mb-6">
                            Sık Sorulan Sorular
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Müşterilerimizin en çok sorduğu soruları ve cevaplarını burada bulabilirsiniz.
                        </p>
                    </motion.div>

                    <motion.div
                        className="max-w-4xl mx-auto space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        {faqItems.map((faq, index) => (
                            <motion.div
                                key={index}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <h3 className="heading-lg text-gray-800 mb-3">{faq.question}</h3>
                                <p className="text-gray-600">{faq.answer}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full bg-gradient-to-br from-primary-600 to-primary-800">
                <div className="w-full px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 py-8 md:py-12 lg:py-20">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="heading-2xl text-white mb-6">
                            Hemen Sipariş Verin
                        </h2>
                        <p className="text-body-lg text-white/80 mb-8 max-w-2xl mx-auto">
                            Lezzetli yemeklerimizi denemek için hemen sipariş verin veya
                            bizi ziyaret edin. Size en iyi hizmeti sunmaya hazırız.
                        </p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button size="lg" className="btn-secondary text-lg px-8 py-4">
                                <Zap className="mr-2 w-5 h-5" />
                                SİPARİŞ VER
                                <ArrowRight className="ml-2 w-6 h-6" />
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
