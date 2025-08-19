import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Clock, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';
import { getFoodImagesByCategory, optimizeImageUrl } from '@/helpers/foodImages';
import { getFeaturedItems } from '@/helpers/menuData';
import { ProductCard } from '@/components/ui/ProductCard';

interface ProductSliderProps {
    title: string;
    subtitle?: string;
    autoPlay?: boolean;
    interval?: number;
}

export function ProductSlider({
    title,
    subtitle,
    autoPlay = true,
    interval = 5000
}: ProductSliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
    const dispatch = useDispatch();

    const featuredItems = getFeaturedItems();
    const slides = featuredItems.slice(0, 6); // İlk 6 ürünü göster

    const handleAddToCart = (menuItem: any) => {
        dispatch(addToCart({ menuItem, quantity: 1 }));
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying) return;

        const timer = setInterval(() => {
            nextSlide();
        }, interval);

        return () => clearInterval(timer);
    }, [isAutoPlaying, interval, currentSlide]);

    // Pause auto-play on hover
    const handleMouseEnter = () => setIsAutoPlaying(false);
    const handleMouseLeave = () => setIsAutoPlaying(autoPlay);

    return (
        <section className="w-full py-8 sm:py-12 md:py-20 bg-gradient-to-b from-yellow-50 via-white to-white">
            <div className="max-w-5xl mx-auto px-2 sm:px-4">
                {/* Header */}
                <motion.div
                    className="text-center mb-8 sm:mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-poppins text-primary-700 mb-4 leading-tight drop-shadow-sm">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                            {subtitle}
                        </p>
                    )}
                </motion.div>

                {/* Slider Container */}
                <div
                    className="relative w-full"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Slider */}
                    <div className="relative h-96 lg:h-[500px] overflow-hidden rounded-2xl shadow-2xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                className="absolute inset-0"
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            >
                                {slides[currentSlide] && (
                                    <div className="relative h-full">
                                        {/* Background Image */}
                                        <div className="absolute inset-0">
                                            <img
                                                src={optimizeImageUrl(
                                                    getFoodImagesByCategory(slides[currentSlide].category)[0]?.url ||
                                                    'https://images.unsplash.com/photo-1559847844-5315695dadae?w=1200&h=600&fit=crop',
                                                    1200,
                                                    600
                                                )}
                                                alt={slides[currentSlide].name}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
                                        </div>

                                        {/* Content */}
                                        <div className="relative h-full flex items-center">
                                            {/* Kart gösterimi */}
                                            <div className="flex justify-center items-center w-full h-full px-2 sm:px-4">
                                                <div className="w-full max-w-sm">
                                                    <ProductCard
                                                        item={slides[currentSlide]}
                                                        onAddToCart={handleAddToCart}
                                                        showDetailsButton={true}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Arrows */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                    ? 'bg-primary-600 w-8'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Slide Counter */}
                    <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs sm:text-sm">
                        {currentSlide + 1} / {slides.length}
                    </div>
                </div>

                {/* Auto-play Toggle */}
                <div className="flex justify-center mt-6 sm:mt-8">
                    <button
                        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isAutoPlaying
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {isAutoPlaying ? 'Otomatik Oynatma Açık' : 'Otomatik Oynatma Kapalı'}
                    </button>
                </div>
            </div>
        </section>
    );
}
