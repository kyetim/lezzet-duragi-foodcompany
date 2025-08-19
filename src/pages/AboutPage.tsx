import { motion } from 'framer-motion';
import {
    Award,
    Users,
    Clock,
    Heart,
    Star,
    ChefHat,
    Utensils,
    Leaf,
    Shield,
    Truck,
    Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { getRandomFoodImage, optimizeImageUrl } from '@/helpers/foodImages';

export function AboutPage() {
    // Gerçek yemek görselleri
    const heroImage = getRandomFoodImage('hero');
    const teamImage = getRandomFoodImage('about');
    const kitchenImage = getRandomFoodImage('special');

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut" as const
            }
        }
    };

    const stats = [
        { icon: Users, value: "1000+", label: "Mutlu Müşteri", color: "text-primary-600" },
        { icon: Clock, value: "5+", label: "Yıl Deneyim", color: "text-secondary-600" },
        { icon: Star, value: "4.8", label: "Ortalama Puan", color: "text-yellow-500" },
        { icon: Heart, value: "100%", label: "Müşteri Memnuniyeti", color: "text-red-500" }
    ];

    const values = [
        {
            icon: ChefHat,
            title: "Uzman Şefler",
            description: "Deneyimli şeflerimiz geleneksel tarifleri modern tekniklerle birleştiriyor.",
            color: "bg-primary-100 text-primary-600"
        },
        {
            icon: Leaf,
            title: "Taze Malzemeler",
            description: "Her gün taze ve kaliteli malzemelerle yemeklerimizi hazırlıyoruz.",
            color: "bg-green-100 text-green-600"
        },
        {
            icon: Shield,
            title: "Hijyen Standartları",
            description: "En yüksek hijyen standartlarında hizmet veriyoruz.",
            color: "bg-blue-100 text-blue-600"
        },
        {
            icon: Truck,
            title: "Hızlı Teslimat",
            description: "15 dakika içinde siparişlerinizi kapınıza getiriyoruz.",
            color: "bg-purple-100 text-purple-600"
        }
    ];

    const team = [
        {
            name: "Mehmet Şef",
            position: "Baş Şef",
            image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&h=200&fit=crop&crop=face",
            experience: "15+ yıl deneyim"
        },
        {
            name: "Ayşe Usta",
            position: "Makarna Ustası",
            image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop&crop=face",
            experience: "10+ yıl deneyim"
        },
        {
            name: "Ali Aşçı",
            position: "Döner Ustası",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
            experience: "12+ yıl deneyim"
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
                        alt="Lezzet Durağı Ekibi"
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
                            Hakkımızda
                        </motion.h1>
                        <motion.p
                            className="text-lg md:text-2xl text-white/90 leading-relaxed max-w-xl mx-auto"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Geleneksel lezzetleri modern mutfak teknikleriyle birleştirerek, size unutulmaz gastronomik deneyimler sunuyoruz.
                        </motion.p>
                    </motion.div>
                </div>
                <div className="absolute left-0 right-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-[#fffbe6] pointer-events-none" />
            </section>

            {/* Stats Section */}
            <section className="w-full px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 py-8 md:py-12 lg:py-20 bg-white">
                <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
                    <motion.div
                        className="grid grid-cols-2 lg:grid-cols-4 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className="text-center"
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className={`w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center`}>
                                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                </div>
                                <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16 bg-white">
                <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
                    <motion.div
                        className="flex flex-col lg:flex-row items-center gap-16"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        {/* Left Content */}
                        <motion.div
                            className="flex-1 max-w-2xl mx-auto space-y-6 text-center lg:text-left"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <motion.div
                                className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 rounded-full px-4 py-2 mb-2"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Heart className="w-4 h-4" />
                                <span className="text-sm font-medium">Hikayemiz</span>
                            </motion.div>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-primary-700 mb-4 leading-tight">Geleneksel Lezzetler, Modern Sunum</h2>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                2019 yılında İstanbul'da kurulan Lezzet Durağı, geleneksel Türk mutfağının en sevilen lezzetlerini modern sunum teknikleriyle birleştirerek, müşterilerimize unutulmaz gastronomik deneyimler sunmaya başladı.
                            </p>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Kurucumuz Mehmet Şef'in 20 yıllık mutfak deneyimi ve geleneksel tarifleri koruma tutkusu, Lezzet Durağı'nın bugünkü başarısının temelini oluşturuyor. Her yemeğimiz, titizlikle seçilmiş malzemeler ve uzman şeflerimizin özenli çalışmasıyla hazırlanıyor.
                            </p>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link to="/menu">
                                    <Button className="btn-primary">
                                        Menümüzü Keşfedin
                                    </Button>
                                </Link>
                            </motion.div>
                        </motion.div>
                        {/* Right Image */}
                        <motion.div
                            className="flex-1 flex justify-center"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <div className="w-full max-w-md h-80 rounded-3xl overflow-hidden shadow-2xl relative">
                                <img
                                    src={optimizeImageUrl(teamImage.url, 800, 600)}
                                    alt="Lezzet Durağı Mutfağı"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 bg-white">
                <div className="w-full">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="heading-2xl text-primary-700 mb-6">
                            Değerlerimiz
                        </h2>
                        <p className="text-body text-gray-600 max-w-2xl mx-auto">
                            Lezzet Durağı olarak, müşteri memnuniyetini en üst seviyede tutmak için
                            belirlediğimiz temel değerlerimiz.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300"
                                variants={itemVariants}
                                whileHover={{ scale: 1.05, y: -10 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className={`w-16 h-16 mx-auto mb-4 ${value.color.split(' ')[0]} rounded-full flex items-center justify-center`}>
                                    <value.icon className={`w-8 h-8 ${value.color.split(' ')[1]}`} />
                                </div>
                                <h3 className="heading-lg text-gray-800 mb-3">{value.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
                <div className="w-full">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="heading-2xl text-primary-700 mb-6">
                            Uzman Ekibimiz
                        </h2>
                        <p className="text-body text-gray-600 max-w-2xl mx-auto">
                            Deneyimli şeflerimiz ve mutfak ekibimiz, size en lezzetli yemekleri
                            hazırlamak için çalışıyor.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                className="text-center"
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden shadow-lg">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <h3 className="heading-lg text-gray-800 mb-2">{member.name}</h3>
                                <p className="text-primary-600 font-semibold mb-2">{member.position}</p>
                                <p className="text-gray-600 text-sm">{member.experience}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Kitchen Section */}
            <section className="py-16 bg-white">
                <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
                    <motion.div
                        className="flex flex-col lg:flex-row items-center gap-16"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        {/* Left Image */}
                        <motion.div
                            className="flex-1 flex justify-center"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="w-full max-w-md h-80 rounded-3xl overflow-hidden shadow-2xl relative">
                                <img
                                    src={optimizeImageUrl(kitchenImage.url, 800, 600)}
                                    alt="Mutfak"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                            </div>
                        </motion.div>
                        {/* Right Content */}
                        <motion.div
                            className="flex-1 max-w-2xl mx-auto space-y-6 text-center lg:text-left"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                        >
                            <motion.div
                                className="inline-flex items-center space-x-2 bg-secondary-100 text-secondary-700 rounded-full px-4 py-2 mb-2"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Zap className="w-4 h-4" />
                                <span className="text-sm font-medium">Mutfak Standartları</span>
                            </motion.div>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-primary-700 mb-4 leading-tight">Hijyen ve Kalite Garantisi</h2>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Mutfağımızda en yüksek hijyen standartları uygulanmaktadır. Tüm malzemelerimiz günlük olarak taze şekilde temin edilir ve uzman ekibimiz tarafından titizlikle hazırlanır.
                            </p>
                            <ul className="space-y-3 mt-6">
                                {["Günlük taze malzeme tedariki", "HACCP standartlarında hijyen", "Uzman şef kontrolü", "Kalite garantili üretim"].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-base text-gray-800 justify-center lg:justify-start">
                                        <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center"><span className="w-2 h-2 bg-green-500 rounded-full"></span></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
                <div className="w-full max-w-4xl mx-auto px-4 md:px-8">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                            Lezzetli Deneyimimizi Keşfedin
                        </h2>
                        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                            Geleneksel tariflerimizi ve modern sunum tekniklerimizi denemek için hemen sipariş verin veya bizi ziyaret edin.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link to="/menu">
                                    <Button size="lg" className="btn-secondary bg-white text-secondary-600 hover:bg-gray-100 px-8 py-4 text-lg font-bold">
                                        Menüyü Görüntüle
                                    </Button>
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link to="/contact">
                                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-bold">
                                        İletişime Geçin
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
