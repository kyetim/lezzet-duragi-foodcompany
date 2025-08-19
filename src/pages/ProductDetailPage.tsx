import { useParams, Link } from 'react-router-dom';
import { menuData, getMenuByCategory } from '@/helpers/menuData';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { ProductCard } from '@/components/ui/ProductCard';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice';

export function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const product = menuData.find((item) => item.id === id);
    const dispatch = useDispatch();

    // Yorum ve puan state'i
    const [comments, setComments] = useState([
        {
            name: 'Ahmet Y.',
            rating: 5,
            text: 'Gerçekten çok lezzetli ve hızlı geldi! Tavsiye ederim.',
            helpful: 2,
            date: '2024-06-01'
        },
        {
            name: 'Zeynep K.',
            rating: 4,
            text: 'Fiyat/performans olarak çok iyi. Sıcak geldi.',
            helpful: 1,
            date: '2024-06-02'
        }
    ]);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [userName, setUserName] = useState('');
    const [userComment, setUserComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Ürün bulunamadı</h2>
                    <Link to="/menu">
                        <Button className="btn-primary">Menüye Dön</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Ortalama puan
    const avgRating = comments.length > 0 ? (comments.reduce((acc, c) => acc + c.rating, 0) / comments.length).toFixed(1) : '-';

    // Önerilen ürünler (aynı kategoriden, kendisi hariç, max 3)
    const recommended = getMenuByCategory(product.category).filter((item) => item.id !== product.id).slice(0, 3);

    // Yorum gönderme
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userName.trim() || !userComment.trim() || userRating === 0) return;
        setSubmitting(true);
        setTimeout(() => {
            setComments([
                {
                    name: userName,
                    rating: userRating,
                    text: userComment,
                    helpful: 0,
                    date: new Date().toISOString().slice(0, 10)
                },
                ...comments
            ]);
            setUserName('');
            setUserComment('');
            setUserRating(0);
            setSubmitting(false);
        }, 800);
    };

    // Faydalı oyu (dummy)
    const handleHelpful = (idx: number) => {
        setComments((prev) => prev.map((c, i) => i === idx ? { ...c, helpful: c.helpful + 1 } : c));
    };

    return (
        <div className="min-h-screen w-full bg-food-cream pt-24 pb-16 px-2 sm:px-4 md:px-8">
            <div className="w-full flex justify-center mb-12 px-0 sm:px-2 md:px-0">
                <div className="w-full max-w-xl">
                    <ProductCard item={product} onAddToCart={() => dispatch(addToCart(product))} showDetailsButton={false} className="shadow-2xl border border-gray-100" />
                </div>
            </div>
            {/* Ortalama Puan ve Yorum Ekleme */}
            <div className="w-full max-w-3xl mx-auto mb-12 border border-gray-100 bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 overflow-x-auto">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6">
                    <span className="text-2xl font-bold text-primary-700">{avgRating}</span>
                    <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`w-6 h-6 ${star <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                    </div>
                    <span className="text-gray-500 text-sm">({comments.length} oy)</span>
                </div>
                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
                        <span className="font-semibold">Puanınız:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                type="button"
                                key={star}
                                onClick={() => setUserRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="focus:outline-none"
                            >
                                <Star className={`w-7 h-7 ${star <= (hoverRating || userRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 mb-4 w-full">
                        <input
                            type="text"
                            placeholder="Adınız"
                            value={userName}
                            onChange={e => setUserName(e.target.value)}
                            className="input flex-1 min-w-0"
                            required
                        />
                        <textarea
                            placeholder="Yorumunuz"
                            value={userComment}
                            onChange={e => setUserComment(e.target.value)}
                            className="input flex-1 resize-none min-w-0"
                            rows={2}
                            required
                        />
                    </div>
                    <Button type="submit" className="btn-primary w-full sm:w-auto" disabled={submitting || userRating === 0}>
                        {submitting ? 'Gönderiliyor...' : 'Yorumu Gönder'}
                    </Button>
                </form>
                {/* Yorumlar */}
                <div>
                    <h3 className="font-semibold text-lg mb-4">Yorumlar</h3>
                    {comments.length === 0 && <p className="text-gray-500">Henüz yorum yapılmamış.</p>}
                    <div className="space-y-6">
                        {comments.map((c, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 shadow-sm border border-gray-100 overflow-x-auto">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-primary-700">{c.name}</span>
                                        <span className="text-xs text-gray-400">{c.date}</span>
                                    </div>
                                    <div className="flex items-center mb-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className={`w-5 h-5 ${star <= c.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 break-words">{c.text}</p>
                                    <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5">Sadece bu ürünü alanlar yorum yapabilir</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 min-w-[80px]">
                                    <button type="button" onClick={() => handleHelpful(idx)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600">
                                        <ThumbsUp className="w-4 h-4" /> Faydalı ({c.helpful})
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Önerilen Ürünler */}
            {recommended.length > 0 && (
                <div className="w-full max-w-6xl mx-auto px-0 sm:px-2 md:px-0">
                    <h2 className="text-xl font-bold text-primary-700 mb-6">Önerilen Ürünler</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                        {recommended.map((item) => (
                            <ProductCard key={item.id} item={item} showDetailsButton={true} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
