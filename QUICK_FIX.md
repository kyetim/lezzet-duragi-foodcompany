# Hızlı Çözüm Adımları - Ödeme Sorunu

## 🚨 Acil Yapılacaklar (5 Dakika)

### 1. Vercel Environment Variables Kontrol
1. [Vercel Dashboard](https://vercel.com) → Projeniz → Settings → Environment Variables
2. Şu değişkenlerin olduğunu kontrol edin:
   - `STRIPE_SECRET_KEY` (Production ve Preview için)
   - `VITE_STRIPE_PUBLISHABLE_KEY` (Production ve Preview için)
3. Eksikse ekleyin ve **yeni deployment yapın**

### 2. Browser Console Debug
1. Sitenizi açın: https://your-vercel-url.com
2. F12 basıp Developer Tools açın
3. Checkout sayfasına gidin
4. Console tab'ında şu mesajları arayın:
   - `VITE_STRIPE_PUBLISHABLE_KEY bulunamadı` → Environment variable eksik
   - `🔴 No user found, redirecting to auth` → Auth problemi
   - `🔴 Cart is empty, redirecting to menu` → Cart boş

### 3. Network Tab Kontrolü
1. Developer Tools → Network tab
2. Ödeme butonuna tıklayın
3. `/api/create-payment-intent` isteği yapılıyor mu?
4. Response'u kontrol edin:
   - 500 Error → Environment variable eksik
   - 404 Error → API endpoint çalışmıyor

## 🔧 Hızlı Geçici Çözüm

Kartlı ödeme çalışmıyorsa, geçici olarak sadece nakit ödeme aktif edin:

1. `src/pages/CheckoutPage.tsx` dosyasını açın
2. Satır 38'de `const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');` olarak değiştirin
3. Commit & push yapın

## 📞 Hızlı Test

Test kartı ile deneme:
- Kart: `4242 4242 4242 4242`
- CVV: `123`
- Tarih: İlerideki herhangi bir tarih

## 🚀 En Hızlı Fix

Environment variables sorunu ise:

```bash
# Vercel CLI ile
vercel env add STRIPE_SECRET_KEY
# Değer: sk_test_51... (test) veya sk_live_... (production)

vercel env add VITE_STRIPE_PUBLISHABLE_KEY  
# Değer: pk_test_... (test) veya pk_live_... (production)

# Sonra redeploy
vercel --prod
```

## ✅ Başarı Kontrolü

Ödeme çalıştığında şu mesajları göreceksiniz:
- `🟢 Payment process starting for amount: X`
- `🟢 Payment intent created:`
- `🟢 Payment confirmed:`
- `Ödeme Başarılı! 💳` toast mesajı